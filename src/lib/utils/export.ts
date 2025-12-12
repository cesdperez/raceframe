import { domToPng } from 'modern-screenshot';

export type ExportScale = 2 | 4;

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

const POSTER_WIDTH = 1600;
const POSTER_HEIGHT = 2240;

export async function exportPoster(options: ExportOptions): Promise<void> {
	const { scale, raceName, date } = options;

	const element = document.querySelector('[data-poster-export]');
	if (!element) {
		throw new Error('Poster element not found');
	}

	// Clone the poster to an off-screen container to avoid viewport clipping
	const clone = element.cloneNode(true) as HTMLElement;
	const container = document.createElement('div');

	container.style.cssText = `
		position: fixed;
		left: -99999px;
		top: 0;
		width: ${POSTER_WIDTH}px;
		height: ${POSTER_HEIGHT}px;
		overflow: visible;
		pointer-events: none;
	`;

	// Copy computed styles from original poster to ensure theme colors work
	const computedStyle = window.getComputedStyle(element);
	clone.style.setProperty('--color-bg', computedStyle.getPropertyValue('--color-bg'));
	clone.style.setProperty('--color-text', computedStyle.getPropertyValue('--color-text'));
	clone.style.setProperty('--color-route', computedStyle.getPropertyValue('--color-route'));

	container.appendChild(clone);
	document.body.appendChild(container);

	try {
		const dataUrl = await domToPng(clone, {
			scale,
			quality: 1,
			width: POSTER_WIDTH,
			height: POSTER_HEIGHT,
			fetch: {
				requestInit: {
					mode: 'cors'
				}
			}
		});

		const link = document.createElement('a');
		link.download = generateFilename(raceName, date, scale);
		link.href = dataUrl;
		link.click();
	} finally {
		document.body.removeChild(container);
	}
}
