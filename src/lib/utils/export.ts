import { domToPng } from 'modern-screenshot';
import { posterStore } from '$lib/stores/poster.svelte';

export type ExportScale = 2 | 4;
export type ExportFormat = 'png' | 'pdf';

export function sanitizeForFilename(input: string): string {
	return input
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[<>:"/\\|?*]/g, '');
}

export function generateFilename(raceName: string, date: Date | null, scale: ExportScale): string {
	const sanitizedName = sanitizeForFilename(raceName) || 'poster';

	const parts = [sanitizedName];

	if (date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		parts.push(`${year}-${month}-${day}`);
	}

	parts.push(`${scale}x`);

	return `${parts.join('_')}.png`;
}

export interface ExportOptions {
	scale: ExportScale;
	raceName: string;
	date: Date | null;
}

export interface ClonedPoster {
	clone: HTMLElement;
	container: HTMLElement;
	cleanup: () => void;
}

function copyCanvasContent(source: Element, clone: HTMLElement): void {
	const sourceCanvases = source.querySelectorAll('canvas');
	const cloneCanvases = clone.querySelectorAll('canvas');

	sourceCanvases.forEach((sourceCanvas, index) => {
		const cloneCanvas = cloneCanvases[index] as HTMLCanvasElement;
		if (cloneCanvas && sourceCanvas.width > 0 && sourceCanvas.height > 0) {
			cloneCanvas.width = sourceCanvas.width;
			cloneCanvas.height = sourceCanvas.height;
			const ctx = cloneCanvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(sourceCanvas, 0, 0);
			}
		}
	});
}

export function clonePosterElement(): ClonedPoster {
	const element = document.querySelector('[data-poster-export]');
	if (!element) {
		throw new Error('Poster element not found');
	}

	const width = posterStore.posterWidth;
	const height = posterStore.posterHeight;

	const clone = element.cloneNode(true) as HTMLElement;
	copyCanvasContent(element, clone);
	const container = document.createElement('div');

	container.style.cssText = `
		position: fixed;
		left: -99999px;
		top: 0;
		width: ${width}px;
		height: ${height}px;
		overflow: visible;
		pointer-events: none;
	`;

	// Apply effective colors (uses custom colors if set, otherwise theme defaults)
	clone.style.setProperty('--color-bg', posterStore.effectiveBgColor);
	clone.style.setProperty('--color-text', posterStore.effectiveTextColor);
	clone.style.setProperty('--color-route', posterStore.effectiveRouteColor);

	// Hide medal zone placeholder in export (remove visual indicators but keep size)
	const medalZone = clone.querySelector('[data-medal-zone]') as HTMLElement | null;
	if (medalZone) {
		medalZone.style.border = 'none';
		medalZone.style.opacity = '0';
	}

	container.appendChild(clone);
	document.body.appendChild(container);

	return {
		clone,
		container,
		cleanup: () => document.body.removeChild(container)
	};
}

export async function renderPosterToPng(scale: ExportScale): Promise<string> {
	const { clone, cleanup } = clonePosterElement();
	const width = posterStore.posterWidth;
	const height = posterStore.posterHeight;

	try {
		return await domToPng(clone, {
			scale,
			quality: 1,
			width,
			height,
			fetch: {
				requestInit: {
					mode: 'cors'
				}
			}
		});
	} finally {
		cleanup();
	}
}

export async function exportPoster(options: ExportOptions): Promise<void> {
	const { scale, raceName, date } = options;

	const dataUrl = await renderPosterToPng(scale);

	const link = document.createElement('a');
	link.download = generateFilename(raceName, date, scale);
	link.href = dataUrl;
	link.click();
}
