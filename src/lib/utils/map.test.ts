import { describe, it, expect } from 'vitest';
import { toLatLng, toLatLngArray } from './map.js';

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

