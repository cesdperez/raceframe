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

	it('returns correct URL for positron-nolabels', () => {
		const url = getTileUrlForStyle('positron-nolabels');
		expect(url).toContain('light_nolabels');
	});

	it('returns correct URL for dark-matter', () => {
		const url = getTileUrlForStyle('dark-matter');
		expect(url).toContain('dark_all');
	});

	it('returns correct URL for dark-matter-nolabels', () => {
		const url = getTileUrlForStyle('dark-matter-nolabels');
		expect(url).toContain('dark_nolabels');
	});

	it('returns correct URL for voyager', () => {
		const url = getTileUrlForStyle('voyager');
		expect(url).toContain('voyager');
	});

	it('returns correct URL for opentopomap', () => {
		const url = getTileUrlForStyle('opentopomap');
		expect(url).toContain('opentopomap.org');
	});

	it('returns correct URL for osm', () => {
		const url = getTileUrlForStyle('osm');
		expect(url).toContain('tile.openstreetmap.org');
	});
});

describe('getAttributionForStyle', () => {
	it('returns CARTO attribution for CartoDB styles', () => {
		const attr = getAttributionForStyle('positron');
		expect(attr).toContain('CARTO');
		expect(attr).toContain('OpenStreetMap');
	});

	it('returns OpenTopoMap attribution for topo style', () => {
		const attr = getAttributionForStyle('opentopomap');
		expect(attr).toContain('OpenTopoMap');
	});

	it('returns OSM attribution for osm style', () => {
		const attr = getAttributionForStyle('osm');
		expect(attr).toContain('OpenStreetMap');
	});
});

