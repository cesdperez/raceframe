import { domToPng } from 'modern-screenshot';
import { posterStore } from '$lib/stores/poster.svelte';
import { exportReadyStore } from '$lib/stores/export-ready.svelte';
import { waitForFonts, getEmbeddedFontCss } from './fonts.js';
import { renderExportMap } from './export-map.js';

export type ExportScale = 1 | 2 | 4;

export type ExportProgressCallback = (message: string) => void;

export function sanitizeForFilename(input: string): string {
	return input
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[<>:"/\\|?*]/g, '');
}

export function generateFilename(eventName: string, date: Date | null, scale: ExportScale): string {
	const sanitizedName = sanitizeForFilename(eventName) || 'poster';

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
	eventName: string;
	date: Date | null;
}

export interface ClonedPoster {
	clone: HTMLElement;
	container: HTMLElement;
	cleanup: () => void;
}

export interface ClonePosterOptions {
	scale: ExportScale;
}

export function clonePosterElement(options: ClonePosterOptions): ClonedPoster {
	const { scale } = options;
	const element = document.querySelector('[data-poster-export]');
	if (!element) {
		throw new Error('Poster element not found');
	}

	const baseWidth = posterStore.posterWidth;
	const baseHeight = posterStore.posterHeight;
	const exportWidth = baseWidth * scale;
	const exportHeight = baseHeight * scale;

	const clone = element.cloneNode(true) as HTMLElement;
	const container = document.createElement('div');

	container.style.cssText = `
		position: fixed;
		left: -99999px;
		top: 0;
		width: ${exportWidth}px;
		height: ${exportHeight}px;
		overflow: hidden;
		pointer-events: none;
	`;

	clone.style.width = `${baseWidth}px`;
	clone.style.height = `${baseHeight}px`;
	clone.style.transform = `scale(${scale})`;
	clone.style.transformOrigin = 'top left';

	clone.style.setProperty('--color-bg', posterStore.effectiveBgColor);
	clone.style.setProperty('--color-text', posterStore.effectiveTextColor);
	clone.style.setProperty('--color-route', posterStore.effectiveRouteColor);

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

export async function renderPosterToPng(
	scale: ExportScale,
	onProgress?: ExportProgressCallback
): Promise<string> {
	onProgress?.('Loading fonts...');
	const [, fontCss] = await Promise.all([waitForFonts(), getEmbeddedFontCss()]);

	onProgress?.('Waiting for resources...');
	await exportReadyStore.waitUntilReady(5000);
	await new Promise((resolve) => requestAnimationFrame(resolve));

	onProgress?.('Preparing export canvas...');
	const { clone, cleanup } = clonePosterElement({ scale });

	const exportWidth = posterStore.posterWidth * scale;
	const exportHeight = posterStore.posterHeight * scale;

	await new Promise((resolve) => requestAnimationFrame(resolve));
	await new Promise((resolve) => setTimeout(resolve, 50));

	let mapCleanup: (() => void) | null = null;

	try {
		mapCleanup = (
			await renderExportMap({
				container: clone,
				scale,
				onProgress
			})
		).cleanup;

		onProgress?.('Rendering final image...');

		return await domToPng(clone, {
			scale: 1,
			quality: 1,
			width: exportWidth,
			height: exportHeight,
			font: fontCss ? { cssText: fontCss } : undefined,
			fetch: {
				requestInit: {
					mode: 'cors'
				}
			}
		});
	} finally {
		mapCleanup?.();
		cleanup();
	}
}

export async function exportPoster(
	options: ExportOptions,
	onProgress?: ExportProgressCallback
): Promise<void> {
	const { scale, eventName, date } = options;

	const dataUrl = await renderPosterToPng(scale, onProgress);

	onProgress?.('Starting download...');
	const link = document.createElement('a');
	link.download = generateFilename(eventName, date, scale);
	link.href = dataUrl;
	link.click();
}
