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
	{ value: 'dark', label: 'Dark', bg: '#1a1a2e', text: '#ffffff' },
	{ value: 'midnight', label: 'Midnight', bg: '#0f0f1a', text: '#e0e0e0' },
	{ value: 'forest', label: 'Forest', bg: '#1a2e1a', text: '#e8f5e8' }
];

export const ROUTE_COLORS: Record<RouteColor, string> = {
	orange: '#fc5200',
	yellow: '#ffd700',
	cyan: '#00ced1',
	pink: '#ff69b4',
	green: '#32cd32',
	white: '#ffffff'
};

export const ROUTE_COLOR_OPTIONS: RouteColorConfig[] = [
	{ value: 'orange', label: 'Orange', color: ROUTE_COLORS.orange },
	{ value: 'yellow', label: 'Yellow', color: ROUTE_COLORS.yellow },
	{ value: 'cyan', label: 'Cyan', color: ROUTE_COLORS.cyan },
	{ value: 'pink', label: 'Pink', color: ROUTE_COLORS.pink },
	{ value: 'green', label: 'Green', color: ROUTE_COLORS.green },
	{ value: 'white', label: 'White', color: ROUTE_COLORS.white }
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
	midnight: 'dark',
	forest: 'dark'
};
