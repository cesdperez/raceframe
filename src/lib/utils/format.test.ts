import { describe, it, expect } from 'vitest';
import {
	formatTime,
	formatDistance,
	formatPace,
	formatDate,
	metersToKm,
	metersToMiles
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

describe('metersToKm', () => {
	it('converts meters to kilometers', () => {
		expect(metersToKm(42195)).toBeCloseTo(42.195);
	});

	it('handles zero', () => {
		expect(metersToKm(0)).toBe(0);
	});
});

describe('metersToMiles', () => {
	it('converts meters to miles', () => {
		expect(metersToMiles(42195)).toBeCloseTo(26.219, 2);
	});

	it('handles zero', () => {
		expect(metersToMiles(0)).toBe(0);
	});
});

describe('formatDistance', () => {
	it('formats distance in km with one decimal', () => {
		expect(formatDistance(42195, 'km')).toBe('42.2');
	});

	it('formats distance in miles with one decimal', () => {
		expect(formatDistance(42195, 'miles')).toBe('26.2');
	});

	it('handles small distances', () => {
		expect(formatDistance(500, 'km')).toBe('0.5');
	});

	it('handles zero', () => {
		expect(formatDistance(0, 'km')).toBe('0.0');
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
