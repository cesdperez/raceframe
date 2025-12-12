import { describe, it, expect, beforeEach } from 'vitest';
import { posterStore } from './poster.svelte.js';
import type { GPXData } from '../types/index.js';

const mockGpxData: GPXData = {
	coordinates: [
		[-0.3773, 39.4699],
		[-0.3774, 39.47]
	],
	totalDistance: 42195,
	startTime: new Date('2024-12-01T09:00:00Z'),
	endTime: new Date('2024-12-01T12:45:22Z'),
	elapsedTime: 13522,
	elevationGain: 125,
	name: 'Valencia Marathon'
};

describe('PosterStore', () => {
	beforeEach(() => {
		posterStore.reset();
	});

	describe('initial state', () => {
		it('has default values', () => {
			expect(posterStore.data.gpxData).toBeNull();
			expect(posterStore.data.runnerName).toBe('');
			expect(posterStore.data.raceName).toBe('');
			expect(posterStore.data.theme).toBe('light');
			expect(posterStore.data.routeColor).toBe('orange');
			expect(posterStore.data.unit).toBe('km');
		});

		it('hasGpxData returns false when no GPX is loaded', () => {
			expect(posterStore.hasGpxData).toBe(false);
		});
	});

	describe('loadFromGPX', () => {
		it('populates fields from GPX data', () => {
			posterStore.loadFromGPX(mockGpxData);

			expect(posterStore.data.gpxData).toStrictEqual(mockGpxData);
			expect(posterStore.data.raceName).toBe('Valencia Marathon');
			expect(posterStore.data.date).toEqual(mockGpxData.startTime);
			expect(posterStore.data.finishTime).toBe("3:45'22\"");
			expect(posterStore.data.distance).toBeCloseTo(42.195, 2);
		});

		it('hasGpxData returns true after loading GPX', () => {
			posterStore.loadFromGPX(mockGpxData);
			expect(posterStore.hasGpxData).toBe(true);
		});

		it('handles GPX without name gracefully', () => {
			const gpxWithoutName: GPXData = { ...mockGpxData, name: null };
			posterStore.loadFromGPX(gpxWithoutName);
			expect(posterStore.data.raceName).toBe('');
		});

		it('handles GPX without timestamps gracefully', () => {
			const gpxWithoutTime: GPXData = {
				...mockGpxData,
				startTime: null,
				endTime: null,
				elapsedTime: null
			};
			posterStore.loadFromGPX(gpxWithoutTime);
			expect(posterStore.data.date).toBeNull();
			expect(posterStore.data.finishTime).toBe('');
		});
	});

	describe('setTheme', () => {
		it('updates theme', () => {
			posterStore.setTheme('dark');
			expect(posterStore.data.theme).toBe('dark');

			posterStore.setTheme('midnight');
			expect(posterStore.data.theme).toBe('midnight');

			posterStore.setTheme('forest');
			expect(posterStore.data.theme).toBe('forest');
		});
	});

	describe('setRouteColor', () => {
		it('updates route color', () => {
			posterStore.setRouteColor('cyan');
			expect(posterStore.data.routeColor).toBe('cyan');

			posterStore.setRouteColor('pink');
			expect(posterStore.data.routeColor).toBe('pink');
		});
	});

	describe('setUnit', () => {
		it('converts distance when switching from km to miles', () => {
			posterStore.loadFromGPX(mockGpxData);
			posterStore.setUnit('miles');

			expect(posterStore.data.unit).toBe('miles');
			expect(posterStore.data.distance).toBeCloseTo(26.22, 1);
		});

		it('converts distance when switching from miles to km', () => {
			posterStore.loadFromGPX(mockGpxData);
			posterStore.setUnit('miles');
			posterStore.setUnit('km');

			expect(posterStore.data.unit).toBe('km');
			expect(posterStore.data.distance).toBeCloseTo(42.195, 2);
		});

		it('does not convert if unit is the same', () => {
			posterStore.loadFromGPX(mockGpxData);
			const originalDistance = posterStore.data.distance;
			posterStore.setUnit('km');

			expect(posterStore.data.distance).toBe(originalDistance);
		});

		it('does not convert if no GPX data is loaded', () => {
			posterStore.setUnit('miles');
			expect(posterStore.data.unit).toBe('miles');
			expect(posterStore.data.distance).toBe(0);
		});
	});

	describe('reset', () => {
		it('clears all data to defaults', () => {
			posterStore.loadFromGPX(mockGpxData);
			posterStore.data.runnerName = 'John Doe';
			posterStore.setTheme('dark');
			posterStore.setRouteColor('cyan');

			posterStore.reset();

			expect(posterStore.data.gpxData).toBeNull();
			expect(posterStore.data.runnerName).toBe('');
			expect(posterStore.data.raceName).toBe('');
			expect(posterStore.data.theme).toBe('light');
			expect(posterStore.data.routeColor).toBe('orange');
			expect(posterStore.hasGpxData).toBe(false);
		});
	});
});
