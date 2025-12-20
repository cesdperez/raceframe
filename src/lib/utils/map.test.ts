import { describe, it, expect } from 'vitest';
import { toLatLng, toLatLngArray, getTileUrlForStyle, getAttributionForStyle } from './map.js';

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

describe('getTileUrlForStyle', () => {
	it('returns correct URL for positron', () => {
		const url = getTileUrlForStyle('positron');
		expect(url).toContain('basemaps.cartocdn.com');
		expect(url).toContain('light_all');
	});

	it('returns correct URL for dark-matter', () => {
		const url = getTileUrlForStyle('dark-matter');
		expect(url).toContain('dark_all');
	});

	it('returns correct URL for stamen-watercolor', () => {
		const url = getTileUrlForStyle('stamen-watercolor');
		expect(url).toContain('stamen_watercolor');
	});

	it('returns correct URL for stamen-toner', () => {
		const url = getTileUrlForStyle('stamen-toner');
		expect(url).toContain('stamen_toner');
	});

	it('returns correct URL for alidade-satellite', () => {
		const url = getTileUrlForStyle('alidade-satellite');
		expect(url).toContain('alidade_satellite');
	});
});

describe('getAttributionForStyle', () => {
	it('returns CARTO attribution for CartoDB styles', () => {
		const attr = getAttributionForStyle('positron');
		expect(attr).toContain('CARTO');
		expect(attr).toContain('OpenStreetMap');
	});

	it('returns Stadia/Stamen attribution for Stamen styles', () => {
		const attr = getAttributionForStyle('stamen-watercolor');
		expect(attr).toContain('Stadia Maps');
		expect(attr).toContain('Stamen Design');
	});

	it('returns Stadia attribution for satellite style', () => {
		const attr = getAttributionForStyle('alidade-satellite');
		expect(attr).toContain('Stadia Maps');
		expect(attr).toContain('CNES');
	});
});

