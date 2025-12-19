import type { Theme, RouteColor, MapStyle, MapFilter, DesignPreset } from '$lib/types';

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

export interface DesignPresetConfig {
	value: DesignPreset;
	label: string;
	mapStyle: MapStyle;
	mapFilter: MapFilter;
	bgColor: string;
	textColor: string;
	routeColor: RouteColor;
	previewImage?: string;
}

export const THEMES: ThemeConfig[] = [
	{ value: 'light', label: 'Light', bg: '#ffffff', text: '#1a1a1a' },
	{ value: 'dark', label: 'Dark', bg: '#18181b', text: '#fafafa' },
	{ value: 'navy', label: 'Navy', bg: '#0f172a', text: '#f8fafc' }
];

export const BACKGROUND_PRESETS = [
	{ value: 'white', label: 'White', color: '#ffffff' },
	{ value: 'black', label: 'Black', color: '#000000' }
];

export const ROUTE_COLORS: Record<RouteColor, string> = {
	orange: '#fc5200',
	blue: '#3b82f6',
	cyan: '#00ced1',
	yellow: '#ffd700',
	pink: '#ff69b4',
	black: '#000000',
	white: '#ffffff',
	red: '#ef4444'
};

export const ROUTE_COLOR_OPTIONS: RouteColorConfig[] = [
	{ value: 'black', label: 'Black', color: ROUTE_COLORS.black },
	{ value: 'white', label: 'White', color: ROUTE_COLORS.white },
	{ value: 'red', label: 'Red', color: ROUTE_COLORS.red },
	{ value: 'orange', label: 'Orange', color: ROUTE_COLORS.orange },
	{ value: 'blue', label: 'Blue', color: ROUTE_COLORS.blue },
	{ value: 'cyan', label: 'Cyan', color: ROUTE_COLORS.cyan },
	{ value: 'yellow', label: 'Yellow', color: ROUTE_COLORS.yellow },
	{ value: 'pink', label: 'Pink', color: ROUTE_COLORS.pink }
];

export const DESIGN_PRESETS: DesignPresetConfig[] = [
	{
		value: 'clean-light',
		label: 'Clean Light',
		mapStyle: 'positron',
		mapFilter: 'none',
		bgColor: '#ffffff',
		textColor: '#1a1a1a',
		routeColor: 'orange',
		previewImage: '/map-previews/preset-clean-light.png'
	},
	{
		value: 'dark-mode',
		label: 'Dark Mode',
		mapStyle: 'dark-matter',
		mapFilter: 'none',
		bgColor: '#18181b',
		textColor: '#fafafa',
		routeColor: 'orange',
		previewImage: '/map-previews/preset-dark-mode.png'
	},
	{
		value: 'minimal',
		label: 'Minimal',
		mapStyle: 'stamen-toner',
		mapFilter: 'navy',
		bgColor: '#ffffff',
		textColor: '#1a1a1a',
		routeColor: 'orange',
		previewImage: '/map-previews/preset-minimal.png'
	},
	{
		value: 'satellite',
		label: 'Satellite',
		mapStyle: 'esri-satellite',
		mapFilter: 'none',
		bgColor: '#163a2e',
		textColor: '#ffffff',
		routeColor: 'yellow',
		previewImage: '/map-previews/preset-satellite.png'
	},
	{
		value: 'vintage',
		label: 'Vintage',
		mapStyle: 'stamen-watercolor',
		mapFilter: 'sepia',
		bgColor: '#f5f5dc',
		textColor: '#3d2914',
		routeColor: 'orange',
		previewImage: '/map-previews/preset-vintage.png'
	}
];

export const START_MARKER_COLOR = '#22c55e';

export interface MapStyleConfig {
	value: MapStyle;
	label: string;
	description: string;
	tileUrl: string;
	attribution: string;
	brightness: 'light' | 'dark';
	previewImage?: string;
}

export const MAP_STYLES: MapStyleConfig[] = [
	{
		value: 'positron',
		label: 'Light Clean',
		description: 'Minimal light map with labels',
		tileUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
		brightness: 'light',
		previewImage: '/map-previews/style-positron.png'
	},
	{
		value: 'dark-matter',
		label: 'Dark Clean',
		description: 'Minimal dark map with labels',
		tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
		brightness: 'dark',
		previewImage: '/map-previews/style-dark-matter.png'
	},
	{
		value: 'stamen-watercolor',
		label: 'Watercolor',
		description: 'Artistic hand-painted style',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
		attribution:
			'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		brightness: 'light',
		previewImage: '/map-previews/style-watercolor.png'
	},
	{
		value: 'stamen-toner',
		label: 'Toner',
		description: 'High-contrast black & white',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png',
		attribution:
			'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		brightness: 'light',
		previewImage: '/map-previews/style-toner.png'
	},
	{
		value: 'esri-satellite',
		label: 'Satellite',
		description: 'Aerial imagery from ESRI',
		tileUrl:
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		attribution:
			'&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
		brightness: 'dark',
		previewImage: '/map-previews/style-satellite.png'
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
	previewImage?: string;
}

export const MAP_FILTERS: MapFilterConfig[] = [
	{
		value: 'none',
		label: 'None',
		description: 'Original colors',
		css: 'none',
		previewImage: '/map-previews/filter-none.png'
	},
	{
		value: 'grayscale',
		label: 'Grayscale',
		description: 'Black & white',
		css: 'grayscale(100%)',
		previewImage: '/map-previews/filter-grayscale.png'
	},
	{
		value: 'sepia',
		label: 'Sepia',
		description: 'Warm vintage tone',
		css: 'sepia(80%) saturate(80%)',
		previewImage: '/map-previews/filter-sepia.png'
	},
	{
		value: 'navy',
		label: 'Navy',
		description: 'Deep blue tint',
		css: 'grayscale(100%) sepia(30%) hue-rotate(180deg) saturate(150%) brightness(90%)',
		previewImage: '/map-previews/filter-navy.png'
	},
	{
		value: 'teal',
		label: 'Teal',
		description: 'Teal/forest tint',
		css: 'grayscale(100%) sepia(40%) hue-rotate(120deg) saturate(120%) brightness(95%)',
		previewImage: '/map-previews/filter-teal.png'
	}
];

export function getMapFilterConfig(filter: MapFilter): MapFilterConfig {
	return MAP_FILTERS.find((f) => f.value === filter) ?? MAP_FILTERS[0];
}
