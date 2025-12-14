import type { AspectRatio, Layout } from '../types/index.js';

export const POSTER_WIDTH = 1600;
export const POSTER_HEIGHT = 2400;

export interface LayoutConfig {
	value: Layout;
	label: string;
	orientation: 'portrait' | 'landscape';
}

export const LAYOUTS: LayoutConfig[] = [
	{ value: 'classic', label: 'Classic', orientation: 'portrait' },
	{ value: 'medal-right', label: 'Medal Right', orientation: 'landscape' }
];

export interface AspectRatioConfig {
	value: AspectRatio;
	label: string;
	width: number;
	height: number;
	printSize: string;
}

export const PORTRAIT_ASPECT_RATIOS: AspectRatioConfig[] = [
	{ value: '2:3', label: '2:3', width: 1600, height: 2400, printSize: '4×6", 8×12"' },
	{ value: '4:5', label: '4:5', width: 1600, height: 2000, printSize: '8×10", 16×20"' }
];

export const LANDSCAPE_ASPECT_RATIOS: AspectRatioConfig[] = [
	{ value: '3:2', label: '3:2', width: 2400, height: 1600, printSize: '6×4", 12×8"' },
	{ value: '5:4', label: '5:4', width: 2000, height: 1600, printSize: '10×8", 20×16"' }
];

export const ASPECT_RATIOS: AspectRatioConfig[] = [
	...PORTRAIT_ASPECT_RATIOS,
	...LANDSCAPE_ASPECT_RATIOS
];

export function getDimensions(ratio: AspectRatio): { width: number; height: number } {
	const config = ASPECT_RATIOS.find((r) => r.value === ratio);
	return config ? { width: config.width, height: config.height } : { width: POSTER_WIDTH, height: POSTER_HEIGHT };
}

export function getAspectRatiosForLayout(layout: Layout): AspectRatioConfig[] {
	const layoutConfig = LAYOUTS.find((l) => l.value === layout);
	return layoutConfig?.orientation === 'landscape'
		? LANDSCAPE_ASPECT_RATIOS
		: PORTRAIT_ASPECT_RATIOS;
}
