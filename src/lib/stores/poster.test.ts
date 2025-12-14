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

	describe('setDistance', () => {
		it('updates formattedDistance when distance is changed manually', () => {
			posterStore.setDistance(21.1);
			expect(posterStore.formattedDistance).toBe('21.1');
		});

		it('manual distance is reflected in formattedDistance after GPX load', () => {
			posterStore.loadFromGPX(mockGpxData);
			expect(posterStore.formattedDistance).toBe('42.2');

			posterStore.setDistance(50.0);
			expect(posterStore.formattedDistance).toBe('50.0');
		});
	});

	describe('formattedPace', () => {
		it('updates when finish time is changed', () => {
			posterStore.loadFromGPX(mockGpxData);
			const originalPace = posterStore.formattedPace;

			posterStore.setFinishTime("4:00'00\"");
			expect(posterStore.formattedPace).not.toBe(originalPace);
		});

		it('updates when distance is changed', () => {
			posterStore.loadFromGPX(mockGpxData);
			const originalPace = posterStore.formattedPace;

			posterStore.setDistance(21.1);
			expect(posterStore.formattedPace).not.toBe(originalPace);
		});

		it('calculates correct pace from editable values', () => {
			posterStore.setDistance(10);
			posterStore.setFinishTime("1:00'00\"");
			expect(posterStore.formattedPace).toBe("6'00\"");
		});

		it('returns placeholder when time is invalid', () => {
			posterStore.setDistance(10);
			posterStore.setFinishTime('invalid');
			expect(posterStore.formattedPace).toBe("--'--\"");
		});

		it('returns placeholder when distance is zero', () => {
			posterStore.setFinishTime("1:00'00\"");
			posterStore.setDistance(0);
			expect(posterStore.formattedPace).toBe("--'--\"");
		});
	});

	describe('reset', () => {
		it('clears all data to defaults', () => {
			posterStore.loadFromGPX(mockGpxData);
			posterStore.setRunnerName('John Doe');
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

	describe('QR code styling', () => {
		it('has default values for styling', () => {
			expect(posterStore.data.qrDotStyle).toBe('rounded');
			expect(posterStore.data.qrGradientEnabled).toBe(false);
		});

		it('setQrDotStyle updates dot style', () => {
			posterStore.setQrDotStyle('dots');
			expect(posterStore.data.qrDotStyle).toBe('dots');

			posterStore.setQrDotStyle('classy');
			expect(posterStore.data.qrDotStyle).toBe('classy');
		});

		it('setQrGradientEnabled toggles gradient', () => {
			posterStore.setQrGradientEnabled(true);
			expect(posterStore.data.qrGradientEnabled).toBe(true);

			posterStore.setQrGradientEnabled(false);
			expect(posterStore.data.qrGradientEnabled).toBe(false);
		});

		it('reset clears styling to defaults', () => {
			posterStore.setQrDotStyle('classy');
			posterStore.setQrGradientEnabled(true);

			posterStore.reset();

			expect(posterStore.data.qrDotStyle).toBe('rounded');
			expect(posterStore.data.qrGradientEnabled).toBe(false);
		});
	});
});
