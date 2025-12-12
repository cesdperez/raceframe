import { describe, it, expect } from 'vitest';
import {
	haversineDistance,
	calculateDistance,
	calculateElapsedTime,
	calculatePace
} from './geo.js';

describe('haversineDistance', () => {
	it('calculates distance between two points in meters', () => {
		// London to Paris is approximately 343 km
		const london: [number, number] = [-0.1276, 51.5074]; // [lng, lat]
		const paris: [number, number] = [2.3522, 48.8566];
		const distance = haversineDistance(london, paris);
		expect(distance).toBeCloseTo(343_500, -4); // within 10km accuracy
	});

	it('returns 0 for same point', () => {
		const point: [number, number] = [-0.1276, 51.5074];
		expect(haversineDistance(point, point)).toBe(0);
	});

	it('handles equator points', () => {
		// 1 degree longitude at equator is approximately 111.32 km
		const p1: [number, number] = [0, 0];
		const p2: [number, number] = [1, 0];
		const distance = haversineDistance(p1, p2);
		expect(distance).toBeCloseTo(111_320, -3);
	});
});

describe('calculateDistance', () => {
	it('calculates total distance for a path', () => {
		// A simple rectangular route: 1km east, 1km north, 1km west, 1km south
		// Starting at equator for simpler math
		const coords: [number, number][] = [
			[0, 0],
			[0.008993, 0], // ~1km east at equator
			[0.008993, 0.008993], // ~1km north
			[0, 0.008993], // ~1km west
			[0, 0] // ~1km south (back to start)
		];
		const distance = calculateDistance(coords);
		// Should be approximately 4km
		expect(distance).toBeCloseTo(4000, -2); // within 100m
	});

	it('returns 0 for empty array', () => {
		expect(calculateDistance([])).toBe(0);
	});

	it('returns 0 for single point', () => {
		expect(calculateDistance([[0, 0]])).toBe(0);
	});

	it('handles a real marathon-length path', () => {
		// Approximate straight line marathon (42.195 km)
		// At equator, 42.195 km ≈ 0.379° longitude
		const start: [number, number] = [0, 0];
		const finish: [number, number] = [0.379, 0];
		const distance = calculateDistance([start, finish]);
		expect(distance).toBeCloseTo(42_195, -3); // within 1km
	});
});

describe('calculateElapsedTime', () => {
	it('calculates elapsed time in seconds', () => {
		const start = new Date('2025-01-01T09:00:00Z');
		const end = new Date('2025-01-01T12:45:22Z');
		expect(calculateElapsedTime(start, end)).toBe(13522);
	});

	it('returns null if start is null', () => {
		expect(calculateElapsedTime(null, new Date())).toBeNull();
	});

	it('returns null if end is null', () => {
		expect(calculateElapsedTime(new Date(), null)).toBeNull();
	});

	it('returns null if both are null', () => {
		expect(calculateElapsedTime(null, null)).toBeNull();
	});

	it('handles same time (0 seconds)', () => {
		const time = new Date('2025-01-01T09:00:00Z');
		expect(calculateElapsedTime(time, time)).toBe(0);
	});
});

describe('calculatePace', () => {
	it('calculates pace in seconds per km', () => {
		// 42.195 km in 3:45:22 (13522 seconds)
		// Pace = 13522 / 42.195 ≈ 320.5 sec/km
		const pace = calculatePace(42195, 13522);
		expect(pace).toBeCloseTo(320.5, 0);
	});

	it('returns null if distance is 0', () => {
		expect(calculatePace(0, 1000)).toBeNull();
	});

	it('returns null if time is null', () => {
		expect(calculatePace(42195, null)).toBeNull();
	});

	it('returns 0 if time is 0', () => {
		expect(calculatePace(42195, 0)).toBe(0);
	});
});
