import type { Theme, RouteColor, MapStyle, MapFilter, DesignPreset } from '$lib/types';

export interface ThemeConfig {
	value: Theme;
	label: string;
	bg: string;
	text: string;
}

export interface DesignPresetConfig {
	value: DesignPreset;
	label: string;
	mapStyle: MapStyle;
	mapFilter: MapFilter;
	bgColor: string;
	textColor: string;
	routeColor: RouteColor;
}

export const THEMES: ThemeConfig[] = [
	{ value: 'light', label: 'Light', bg: '#ffffff', text: '#1a1a1a' },
	{ value: 'dark', label: 'Dark', bg: '#18181b', text: '#fafafa' },
	{ value: 'navy', label: 'Navy', bg: '#0f172a', text: '#f8fafc' }
];

export const BW_COLOR_PRESETS = [
	{ label: 'White', color: '#ffffff' },
	{ label: 'Black', color: '#000000' }
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

export const DESIGN_PRESETS: DesignPresetConfig[] = [
	{
		value: 'paper',
		label: 'Paper',
		mapStyle: 'positron',
		mapFilter: 'none',
		bgColor: '#ffffff',
		textColor: '#1a1a1a',
		routeColor: 'orange'
	},
	{
		value: 'noir',
		label: 'Noir',
		mapStyle: 'stamen-toner-dark',
		mapFilter: 'none',
		bgColor: '#000000',
		textColor: '#ffffff',
		routeColor: 'orange'
	},
	{
		value: 'blueprint',
		label: 'Blueprint',
		mapStyle: 'stamen-toner',
		mapFilter: 'navy',
		bgColor: '#ffffff',
		textColor: '#1a1a1a',
		routeColor: 'orange'
	},
	{
		value: 'orbital',
		label: 'Orbital',
		mapStyle: 'alidade-satellite',
		mapFilter: 'none',
		bgColor: '#06242f',
		textColor: '#ffffff',
		routeColor: 'yellow'
	},
	{
		value: 'terrain',
		label: 'Terrain',
		mapStyle: 'stamen-terrain',
		mapFilter: 'none',
		bgColor: '#dbdebc',
		textColor: '#000000',
		routeColor: 'black'
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
}

const STADIA_ATTRIBUTION =
	'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const STADIA_STAMEN_ATTRIBUTION =
	'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const CARTO_ATTRIBUTION =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const MAP_STYLES: MapStyleConfig[] = [
	// CARTO styles (fallback)
	{
		value: 'positron',
		label: 'Positron',
		description: 'CARTO light map',
		tileUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
		attribution: CARTO_ATTRIBUTION,
		brightness: 'light'
	},
	{
		value: 'dark-matter',
		label: 'Dark Matter',
		description: 'CARTO dark map',
		tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
		attribution: CARTO_ATTRIBUTION,
		brightness: 'dark'
	},
	// Stadia Alidade styles
	{
		value: 'alidade-smooth',
		label: 'Alidade Smooth',
		description: 'Minimal light map for overlays',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}@2x.png',
		attribution: STADIA_ATTRIBUTION,
		brightness: 'light'
	},
	{
		value: 'alidade-smooth-dark',
		label: 'Alidade Smooth Dark',
		description: 'Minimal dark map for overlays',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}@2x.png',
		attribution: STADIA_ATTRIBUTION,
		brightness: 'dark'
	},
	{
		value: 'alidade-satellite',
		label: 'Alidade Satellite',
		description: 'Satellite imagery with labels',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}@2x.jpg',
		attribution:
			'&copy; CNES, Distribution Airbus DS, &copy; Airbus DS, &copy; PlanetObserver (Contains Copernicus Data) | ' +
			STADIA_ATTRIBUTION,
		brightness: 'dark'
	},
	// Stadia Outdoors
	{
		value: 'outdoors',
		label: 'Outdoors',
		description: 'Trails, parks, natural features',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}@2x.png',
		attribution: STADIA_ATTRIBUTION,
		brightness: 'light'
	},
	// Stadia x Stamen styles
	{
		value: 'stamen-toner',
		label: 'Stamen Toner',
		description: 'High-contrast B&W',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}@2x.png',
		attribution: STADIA_STAMEN_ATTRIBUTION,
		brightness: 'light'
	},
	{
		value: 'stamen-toner-lite',
		label: 'Stamen Toner Lite',
		description: 'Lighter B&W variant',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}@2x.png',
		attribution: STADIA_STAMEN_ATTRIBUTION,
		brightness: 'light'
	},
	{
		value: 'stamen-toner-dark',
		label: 'Stamen Toner Dark',
		description: 'Inverted B&W variant',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}@2x.png',
		attribution: STADIA_STAMEN_ATTRIBUTION,
		brightness: 'dark'
	},
	{
		value: 'stamen-terrain',
		label: 'Stamen Terrain',
		description: 'Hill shading & vegetation',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}@2x.png',
		attribution: STADIA_STAMEN_ATTRIBUTION,
		brightness: 'light'
	},
	// Classic OSM style
	{
		value: 'osm-bright',
		label: 'OSM Bright',
		description: 'Classic OSM with POIs',
		tileUrl: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}@2x.png',
		attribution: STADIA_ATTRIBUTION,
		brightness: 'light'
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
