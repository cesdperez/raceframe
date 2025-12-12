import type { Theme, RouteColor } from '$lib/types';

export const TILE_URLS = {
	light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
	dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
} as const;

export const TILE_ATTRIBUTION =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const THEME_TO_TILES: Record<Theme, keyof typeof TILE_URLS> = {
	light: 'light',
	dark: 'dark',
	midnight: 'dark',
	forest: 'dark'
};

export const ROUTE_COLORS: Record<RouteColor, string> = {
	orange: '#fc5200',
	yellow: '#ffd700',
	cyan: '#00ced1',
	pink: '#ff69b4',
	green: '#32cd32',
	white: '#ffffff'
};

export const START_MARKER_COLOR = '#22c55e';

export function toLatLng(coord: [number, number]): [number, number] {
	return [coord[1], coord[0]];
}

export function toLatLngArray(coords: [number, number][]): [number, number][] {
	return coords.map(toLatLng);
}
