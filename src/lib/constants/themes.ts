import type { Theme, RouteColor, MapStyle } from '$lib/types';

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
		value: 'positron-nolabels',
		label: 'Light Minimal',
		description: 'Ultra-clean light map, no labels',
		tileUrl: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
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
		value: 'dark-matter-nolabels',
		label: 'Dark Minimal',
		description: 'Ultra-clean dark map, no labels',
		tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
		brightness: 'dark'
	},
	{
		value: 'voyager',
		label: 'Voyager',
		description: 'Colorful, detailed map',
		tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
		brightness: 'light'
	},
	{
		value: 'opentopomap',
		label: 'Topographic',
		description: 'Terrain with elevation contours',
		tileUrl: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
		attribution:
			'&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
		brightness: 'light'
	},
	{
		value: 'osm',
		label: 'OSM Standard',
		description: 'Classic OpenStreetMap style',
		tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		brightness: 'light'
	}
];

export function getMapStyleConfig(style: MapStyle): MapStyleConfig {
	return MAP_STYLES.find((s) => s.value === style) ?? MAP_STYLES[0];
}

export type TileType = 'light' | 'dark';

export const TILE_URLS: Record<TileType, string> = {
	light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
	dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
};

export const TILE_ATTRIBUTION =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const THEME_TO_TILES: Record<Theme, TileType> = {
	light: 'light',
	dark: 'dark',
	navy: 'dark'
};
