import type { AspectRatio } from '../types/index.js';

export const POSTER_WIDTH = 1600;
export const POSTER_HEIGHT = 2240;

export const BLEED_MM = 3;
export const CROP_MARK_LENGTH_MM = 5;
export const CROP_MARK_OFFSET_MM = 2;
export const MM_PER_INCH = 25.4;

export interface AspectRatioConfig {
	value: AspectRatio;
	label: string;
	width: number;
	height: number;
	printSize: string;
}

export const ASPECT_RATIOS: AspectRatioConfig[] = [
	{ value: 'default', label: 'Default', width: 1600, height: 2240, printSize: '13.5 × 19 cm' },
	{ value: 'a4', label: 'A4', width: 2480, height: 3508, printSize: '21 × 29.7 cm' },
	{ value: 'square', label: 'Square', width: 1600, height: 1600, printSize: '13.5 × 13.5 cm' }
];

export function getDimensions(ratio: AspectRatio): { width: number; height: number } {
	const config = ASPECT_RATIOS.find((r) => r.value === ratio);
	return config ? { width: config.width, height: config.height } : { width: POSTER_WIDTH, height: POSTER_HEIGHT };
}
