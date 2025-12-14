import type { Theme, RouteColor } from '$lib/types';

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
