import type { AspectRatio, Layout } from '../types/index.js';
import type { ExportScale } from '../utils/export.js';

export const POSTER_WIDTH = 1600;
export const POSTER_HEIGHT = 2400;

export interface LayoutConfig {
	value: Layout;
	label: string;
	orientation: 'portrait' | 'landscape';
	tooltip: string;
}

export const LAYOUTS: LayoutConfig[] = [
	{
		value: 'classic',
		label: 'Classic',
		orientation: 'portrait',
		tooltip: 'Vertical poster for traditional framing or digital display.'
	},
	{
		value: 'medal-right',
		label: 'Medal Right',
		orientation: 'landscape',
		tooltip: 'Two-column layout with space to display your finisher medal.'
	}
];

// Classic layout spacing constants (in pixels)
// These are the fixed heights of elements below the map
// Heights include font-size × line-height (~1.3 for body text) plus margins
const CLASSIC_BOTTOM_CONTENT = {
	divider: 3,
	dividerMargin: 50,
	athleteInfoHeight: 58, // 44px font × ~1.3 line-height
	athleteInfoMargin: 50,
	statsValueHeight: 73, // 56px font × ~1.3 line-height
	statsLabelHeight: 24, // 18px font × ~1.3 line-height
	statsLabelMargin: 12,
	qrCodeSize: 120,
	qrCodeMargin: 40,
	safetyBuffer: 20 // extra buffer for rendering differences
} as const;

// Fixed heights for header area
const CLASSIC_TOP_CONTENT = {
	paddingTop: 80,
	paddingBottom: 80,
	// Race name: 72px × 1.1 line-height + 16px margin = ~95px
	// Race date: 32px × ~1.3 = ~42px
	// Header margin: 50px
	// Total: ~187px + buffer
	headerHeight: 195,
	mapMarginBottom: 50
} as const;

export interface ClassicLayoutMetrics {
	mapHeight: number;
	bottomContentHeight: number;
}

export function calculateClassicLayout(
	posterHeight: number,
	hasQrCode: boolean
): ClassicLayoutMetrics {
	const {
		divider,
		dividerMargin,
		athleteInfoHeight,
		athleteInfoMargin,
		statsValueHeight,
		statsLabelHeight,
		statsLabelMargin,
		qrCodeSize,
		qrCodeMargin,
		safetyBuffer
	} = CLASSIC_BOTTOM_CONTENT;

	const { paddingTop, paddingBottom, headerHeight, mapMarginBottom } = CLASSIC_TOP_CONTENT;

	// Calculate the fixed height of content below the map
	const statsHeight = statsValueHeight + statsLabelHeight + statsLabelMargin;
	const bottomContentHeight =
		divider +
		dividerMargin +
		athleteInfoHeight +
		athleteInfoMargin +
		statsHeight +
		safetyBuffer +
		(hasQrCode ? qrCodeSize + qrCodeMargin : 0);

	// Total fixed content (everything except the map itself)
	const fixedContent =
		paddingTop + paddingBottom + headerHeight + mapMarginBottom + bottomContentHeight;

	// Map gets the remaining space
	const availableForMap = posterHeight - fixedContent;

	// Ensure minimum height
	const mapHeight = Math.max(availableForMap, 200);

	return {
		mapHeight,
		bottomContentHeight
	};
}

export interface AspectRatioConfig {
	value: AspectRatio;
	ratio: string;
	label: string;
	width: number;
	height: number;
	tooltip: string;
}

export const PORTRAIT_ASPECT_RATIOS: AspectRatioConfig[] = [
	{
		value: '2:3',
		ratio: '2:3',
		label: 'Photo Print',
		width: 1600,
		height: 2400,
		tooltip: 'Most common photo format. Fits standard photo frames.'
	},
	{
		value: '4:5',
		ratio: '4:5',
		label: 'Frame Standard',
		width: 1600,
		height: 2000,
		tooltip: 'Popular for portrait photos and framed wall art.'
	},
	{
		value: '5:7',
		ratio: '5:7',
		label: 'Portrait Frame',
		width: 1400,
		height: 2000,
		tooltip: 'Classic portrait size. Frames widely available.'
	},
	{
		value: 'iso-a',
		ratio: '1:√2',
		label: 'A4 / A3 / A2',
		width: 1414,
		height: 2000,
		tooltip: 'ISO standard paper sizes. Perfect for home printing.'
	}
];

export const LANDSCAPE_ASPECT_RATIOS: AspectRatioConfig[] = [
	{
		value: '3:2',
		ratio: '3:2',
		label: 'Photo Print',
		width: 2400,
		height: 1600,
		tooltip: 'Most common photo format. Fits standard photo frames.'
	},
	{
		value: '5:4',
		ratio: '5:4',
		label: 'Frame Standard',
		width: 2000,
		height: 1600,
		tooltip: 'Popular for landscape photos and framed wall art.'
	},
	{
		value: '7:5',
		ratio: '7:5',
		label: 'Landscape Frame',
		width: 2000,
		height: 1400,
		tooltip: 'Classic landscape size. Frames widely available.'
	},
	{
		value: 'iso-a-landscape',
		ratio: '√2:1',
		label: 'A4 / A3 / A2',
		width: 2000,
		height: 1414,
		tooltip: 'ISO standard paper sizes. Perfect for home printing.'
	}
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

export interface ExportScaleConfig {
	value: ExportScale;
	label: string;
	printGuidance: string;
}

export const EXPORT_SCALES: ExportScaleConfig[] = [
	{
		value: 1,
		label: 'Standard',
		printGuidance: 'prints ≤18cm'
	},
	{
		value: 2,
		label: 'Large',
		printGuidance: 'prints ≤45cm'
	},
	{
		value: 4,
		label: 'Extra Large',
		printGuidance: 'prints >45cm'
	}
];
