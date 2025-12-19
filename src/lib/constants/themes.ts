import type { Theme, RouteColor, MapStyle, MapFilter } from '$lib/types';

export interface ThemeConfig {
	value: Theme;
	label: string;
	bg: string;
	text: string;
}

export interface RouteColorConfig {
	value: RouteColor;
	label: string;
	color: string;
}

export const THEMES: ThemeConfig[] = [
	{ value: 'light', label: 'Light', bg: '#ffffff', text: '#1a1a1a' },
	{ value: 'dark', label: 'Dark', bg: '#18181b', text: '#fafafa' },
	{ value: 'navy', label: 'Navy', bg: '#0f172a', text: '#f8fafc' }
];

export const ROUTE_COLORS: Record<RouteColor, string> = {
	orange: '#fc5200',
	blue: '#3b82f6',
	cyan: '#00ced1',
	yellow: '#ffd700',
	pink: '#ff69b4'
};

export const ROUTE_COLOR_OPTIONS: RouteColorConfig[] = [
	{ value: 'orange', label: 'Orange', color: ROUTE_COLORS.orange },
	{ value: 'blue', label: 'Blue', color: ROUTE_COLORS.blue },
	{ value: 'cyan', label: 'Cyan', color: ROUTE_COLORS.cyan },
	{ value: 'yellow', label: 'Yellow', color: ROUTE_COLORS.yellow },
	{ value: 'pink', label: 'Pink', color: ROUTE_COLORS.pink }
];

export const START_MARKER_COLOR = '#22c55e';

export interface MapStyleConfig {
	value: MapStyle;
	label: string;
	description: string;
	tileUrl: string;
	attribution: string;
	brightness: 'light' | 'dark';
}

export const MAP_STYLES: MapStyleConfig[] = [
	{
		value: 'positron',
		label: 'Light Clean',
		description: 'Minimal light map with labels',
		tileUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
		brightness: 'light'
	},
	{
		value: 'dark-matter',
		label: 'Dark Clean',
		description: 'Minimal dark map with labels',
		tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
		brightness: 'dark'
	},
	{
		value: 'stamen-watercolor',
		label: 'Watercolor',
		description: 'Artistic hand-painted style',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
		attribution:
			'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		brightness: 'light'
	},
	{
		value: 'stamen-toner',
		label: 'Toner',
		description: 'High-contrast black & white',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png',
		attribution:
			'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		brightness: 'light'
	},
	{
		value: 'esri-satellite',
		label: 'Satellite',
		description: 'Aerial imagery from ESRI',
		tileUrl:
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		attribution:
			'&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
		brightness: 'dark'
	}
];

export function getMapStyleConfig(style: MapStyle): MapStyleConfig {
	return MAP_STYLES.find((s) => s.value === style) ?? MAP_STYLES[0];
}

export interface MapFilterConfig {
	value: MapFilter;
	label: string;
	description: string;
	css: string;
}

export const MAP_FILTERS: MapFilterConfig[] = [
	{
		value: 'none',
		label: 'None',
		description: 'Original colors',
		css: 'none'
	},
	{
		value: 'grayscale',
		label: 'Grayscale',
		description: 'Black & white',
		css: 'grayscale(100%)'
	},
	{
		value: 'sepia',
		label: 'Sepia',
		description: 'Warm vintage tone',
		css: 'sepia(80%) saturate(80%)'
	},
	{
		value: 'navy',
		label: 'Navy',
		description: 'Deep blue tint',
		css: 'grayscale(100%) sepia(30%) hue-rotate(180deg) saturate(150%) brightness(90%)'
	},
	{
		value: 'teal',
		label: 'Teal',
		description: 'Teal/forest tint',
		css: 'grayscale(100%) sepia(40%) hue-rotate(120deg) saturate(120%) brightness(95%)'
	}
];

export function getMapFilterConfig(filter: MapFilter): MapFilterConfig {
	return MAP_FILTERS.find((f) => f.value === filter) ?? MAP_FILTERS[0];
}
