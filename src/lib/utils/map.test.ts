import { describe, it, expect } from 'vitest';
import {
	TILE_URLS,
	THEME_TO_TILES,
	ROUTE_COLORS,
	START_MARKER_COLOR,
	toLatLng,
	toLatLngArray
} from './map.js';

describe('toLatLng', () => {
	it('converts [lng, lat] to [lat, lng]', () => {
		const geoJson: [number, number] = [-0.1276, 51.5074];
		const leaflet = toLatLng(geoJson);
		expect(leaflet).toEqual([51.5074, -0.1276]);
	});

	it('handles zero coordinates', () => {
		const result = toLatLng([0, 0]);
		expect(result).toEqual([0, 0]);
	});

	it('handles negative coordinates', () => {
		const result = toLatLng([-122.4194, 37.7749]);
		expect(result).toEqual([37.7749, -122.4194]);
	});
});

describe('toLatLngArray', () => {
	it('converts array of coordinates', () => {
		const geoJson: [number, number][] = [
			[-0.1276, 51.5074],
			[2.3522, 48.8566]
		];
		const leaflet = toLatLngArray(geoJson);
		expect(leaflet).toEqual([
			[51.5074, -0.1276],
			[48.8566, 2.3522]
		]);
	});

	it('returns empty array for empty input', () => {
		expect(toLatLngArray([])).toEqual([]);
	});

	it('handles single coordinate', () => {
		const result = toLatLngArray([[10, 20]]);
		expect(result).toEqual([[20, 10]]);
	});
});

describe('THEME_TO_TILES', () => {
	it('maps light theme to light tiles', () => {
		expect(THEME_TO_TILES.light).toBe('light');
	});

	it('maps dark theme to dark tiles', () => {
		expect(THEME_TO_TILES.dark).toBe('dark');
	});

	it('maps navy theme to dark tiles', () => {
		expect(THEME_TO_TILES.navy).toBe('dark');
	});
});

describe('TILE_URLS', () => {
	it('has valid light tile URL', () => {
		expect(TILE_URLS.light).toContain('cartocdn.com');
		expect(TILE_URLS.light).toContain('light_all');
	});

	it('has valid dark tile URL', () => {
		expect(TILE_URLS.dark).toContain('cartocdn.com');
		expect(TILE_URLS.dark).toContain('dark_all');
	});
});

describe('ROUTE_COLORS', () => {
	it('has all defined route colors', () => {
		expect(ROUTE_COLORS.orange).toBe('#fc5200');
		expect(ROUTE_COLORS.blue).toBe('#3b82f6');
		expect(ROUTE_COLORS.cyan).toBe('#00ced1');
		expect(ROUTE_COLORS.yellow).toBe('#ffd700');
		expect(ROUTE_COLORS.pink).toBe('#ff69b4');
	});
});

describe('START_MARKER_COLOR', () => {
	it('is a green color', () => {
		expect(START_MARKER_COLOR).toBe('#22c55e');
	});
});
