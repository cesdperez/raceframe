import { describe, it, expect } from 'vitest';
import {
	formatTime,
	parseTime,
	formatPace,
	formatSpeed,
	formatDate,
	metersToKm,
	metersToMiles,
	kmToMeters,
	milesToMeters
} from './format.js';

describe('formatTime', () => {
	it('formats seconds as HH:MM\'SS"', () => {
		expect(formatTime(13522)).toBe('3:45\'22"');
	});

	it('handles single digit minutes and seconds with padding', () => {
		expect(formatTime(3661)).toBe('1:01\'01"');
	});

	it('handles zero', () => {
		expect(formatTime(0)).toBe('0:00\'00"');
	});

	it('handles times under an hour', () => {
		expect(formatTime(1830)).toBe('0:30\'30"');
	});

	it('handles times over 10 hours', () => {
		expect(formatTime(36000)).toBe('10:00\'00"');
	});
});

describe('parseTime', () => {
	it('parses formatted time string to seconds', () => {
		expect(parseTime('3:45\'22"')).toBe(13522);
	});

	it('parses zero time', () => {
		expect(parseTime('0:00\'00"')).toBe(0);
	});

	it('parses time under an hour', () => {
		expect(parseTime('0:30\'30"')).toBe(1830);
	});

	it('parses time over 10 hours', () => {
		expect(parseTime('10:00\'00"')).toBe(36000);
	});

	it('returns null for invalid format', () => {
		expect(parseTime('invalid')).toBeNull();
		expect(parseTime('3:45:22')).toBeNull();
		expect(parseTime('')).toBeNull();
	});

	it('returns null for invalid minutes/seconds', () => {
		expect(parseTime('1:60\'00"')).toBeNull();
		expect(parseTime('1:00\'60"')).toBeNull();
	});
});

describe('metersToKm', () => {
	it('converts meters to kilometers', () => {
		expect(metersToKm(42195)).toBeCloseTo(42.195);
	});
});

describe('metersToMiles', () => {
	it('converts meters to miles', () => {
		expect(metersToMiles(42195)).toBeCloseTo(26.219, 2);
	});
});

describe('kmToMeters', () => {
	it('converts kilometers to meters', () => {
		expect(kmToMeters(42.195)).toBeCloseTo(42195);
	});
});

describe('milesToMeters', () => {
	it('converts miles to meters', () => {
		expect(milesToMeters(26.219)).toBeCloseTo(42195, -1);
	});
});

describe('formatPace', () => {
	it('formats pace in min/km', () => {
		expect(formatPace(320, 'km')).toBe("5'20\"");
	});

	it('formats pace in min/mile', () => {
		expect(formatPace(320, 'miles')).toBe("8'35\"");
	});

	it('handles single digit seconds', () => {
		expect(formatPace(301, 'km')).toBe("5'01\"");
	});

	it('handles pace under 1 minute', () => {
		expect(formatPace(45, 'km')).toBe("0'45\"");
	});
});

describe('formatDate', () => {
	it('formats date as "D Month YYYY"', () => {
		const date = new Date('2025-12-01');
		expect(formatDate(date)).toBe('1 December 2025');
	});

	it('formats date with double digit day', () => {
		const date = new Date('2025-11-25');
		expect(formatDate(date)).toBe('25 November 2025');
	});
});

describe('formatSpeed', () => {
	it('formats speed in km/h', () => {
		expect(formatSpeed(7.5, 'km')).toBe('27.0');
	});

	it('formats speed in mph', () => {
		expect(formatSpeed(7.5, 'miles')).toBe('16.8');
	});

	it('handles typical cycling speed', () => {
		expect(formatSpeed(8.33, 'km')).toBe('30.0');
	});

	it('handles zero speed', () => {
		expect(formatSpeed(0, 'km')).toBe('0.0');
	});
});
