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
	name: 'Valencia Marathon',
	activityType: 'running'
};

const mockCyclingGpxData: GPXData = {
	coordinates: [
		[-0.3773, 39.4699],
		[-0.3774, 39.47]
	],
	totalDistance: 50000,
	startTime: new Date('2024-12-01T09:00:00Z'),
	endTime: new Date('2024-12-01T11:00:00Z'),
	elapsedTime: 7200,
	elevationGain: 200,
	name: 'Eindhoven Cycling',
	activityType: 'cycling'
};

describe('PosterStore', () => {
	beforeEach(() => {
		posterStore.reset();
	});

	describe('initial state', () => {
		it('has default values', () => {
			expect(posterStore.data.gpxData).toBeNull();
			expect(posterStore.data.athleteName).toBe('');
			expect(posterStore.data.eventName).toBe('');
			expect(posterStore.data.activityType).toBe('running');
			expect(posterStore.data.theme).toBe('light');
			expect(posterStore.data.routeColor).toBe('orange');
			expect(posterStore.data.unit).toBe('km');
			expect(posterStore.data.layout).toBe('classic');
			expect(posterStore.data.aspectRatio).toBe('2:3');
			expect(posterStore.isDemo).toBe(false);
		});

		it('hasGpxData returns false when no GPX is loaded', () => {
			expect(posterStore.hasGpxData).toBe(false);
		});

		it('isLandscape returns false for classic layout', () => {
			expect(posterStore.isLandscape).toBe(false);
		});
	});

	describe('loadFromGPX', () => {
		it('populates fields from GPX data', () => {
			posterStore.loadFromGPX(mockGpxData);

			expect(posterStore.data.gpxData).toStrictEqual(mockGpxData);
			expect(posterStore.data.eventName).toBe('Valencia Marathon');
			expect(posterStore.data.activityType).toBe('running');
			expect(posterStore.data.date).toEqual(mockGpxData.startTime);
			expect(posterStore.data.finishTime).toBe("3:45'22\"");
			expect(posterStore.data.distance).toBeCloseTo(42.195, 2);
		});

		it('sets activity type from GPX data', () => {
			posterStore.loadFromGPX(mockCyclingGpxData);
			expect(posterStore.data.activityType).toBe('cycling');
		});

		it('hasGpxData returns true after loading GPX', () => {
			posterStore.loadFromGPX(mockGpxData);
			expect(posterStore.hasGpxData).toBe(true);
		});

		it('handles GPX without name gracefully', () => {
			const gpxWithoutName: GPXData = { ...mockGpxData, name: null };
			posterStore.loadFromGPX(gpxWithoutName);
			expect(posterStore.data.eventName).toBe('');
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

		it('clears demo mode when loading real GPX', () => {
			posterStore.loadDemoData();
			expect(posterStore.isDemo).toBe(true);

			posterStore.loadFromGPX(mockGpxData);
			expect(posterStore.isDemo).toBe(false);
		});
	});

	describe('styling setters', () => {
		it('updates map style, filter, and route color', () => {
			posterStore.setMapStyle('dark-matter');
			expect(posterStore.data.mapStyle).toBe('dark-matter');

			posterStore.setMapFilter('grayscale');
			expect(posterStore.data.mapFilter).toBe('grayscale');

			posterStore.setRouteColor('cyan');
			expect(posterStore.data.routeColor).toBe('cyan');
		});

		it('reset restores styling defaults', () => {
			posterStore.setMapStyle('alidade-satellite');
			posterStore.setMapFilter('sepia');
			posterStore.setRouteColor('pink');

			posterStore.reset();

			expect(posterStore.data.mapStyle).toBe('positron');
			expect(posterStore.data.mapFilter).toBe('none');
			expect(posterStore.data.routeColor).toBe('orange');
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

	describe('formattedSpeed', () => {
		it('calculates correct speed for cycling', () => {
			posterStore.loadFromGPX(mockCyclingGpxData);
			// 50km in 2 hours = 25 km/h
			expect(posterStore.formattedSpeed).toBe('25.0');
		});

		it('returns placeholder when time is zero', () => {
			posterStore.setDistance(50);
			posterStore.setFinishTime("0:00'00\"");
			expect(posterStore.formattedSpeed).toBe('--.-');
		});

		it('returns placeholder when time is invalid', () => {
			posterStore.setDistance(50);
			posterStore.setFinishTime('invalid');
			expect(posterStore.formattedSpeed).toBe('--.-');
		});

		it('converts to mph when unit is miles', () => {
			posterStore.loadFromGPX(mockCyclingGpxData);
			posterStore.setUnit('miles');
			// 25 km/h ≈ 15.5 mph
			expect(parseFloat(posterStore.formattedSpeed)).toBeCloseTo(15.5, 0);
		});
	});

	describe('speedLabel', () => {
		it('returns KM/H for km unit', () => {
			expect(posterStore.speedLabel).toBe('KM/H');
		});

		it('returns MPH for miles unit', () => {
			posterStore.setUnit('miles');
			expect(posterStore.speedLabel).toBe('MPH');
		});
	});

	describe('setActivityType', () => {
		it('updates activity type', () => {
			posterStore.setActivityType('cycling');
			expect(posterStore.data.activityType).toBe('cycling');

			posterStore.setActivityType('running');
			expect(posterStore.data.activityType).toBe('running');
		});
	});

	describe('reset', () => {
		it('clears all data to defaults', () => {
			posterStore.loadFromGPX(mockGpxData);
			posterStore.setAthleteName('John Doe');
			posterStore.setRouteColor('cyan');

			posterStore.reset();

			expect(posterStore.data.gpxData).toBeNull();
			expect(posterStore.data.athleteName).toBe('');
			expect(posterStore.data.eventName).toBe('');
			expect(posterStore.data.activityType).toBe('running');
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

	describe('setLayout', () => {
		it('updates layout to medal-right', () => {
			posterStore.setLayout('medal-right');
			expect(posterStore.data.layout).toBe('medal-right');
		});

		it('isLandscape returns true for medal-right layout', () => {
			posterStore.setLayout('medal-right');
			expect(posterStore.isLandscape).toBe(true);
		});

		it('auto-switches aspect ratio when changing to landscape layout', () => {
			expect(posterStore.data.aspectRatio).toBe('2:3');
			posterStore.setLayout('medal-right');
			expect(posterStore.data.aspectRatio).toBe('3:2');
		});

		it('auto-switches aspect ratio when changing back to portrait layout', () => {
			posterStore.setLayout('medal-right');
			expect(posterStore.data.aspectRatio).toBe('3:2');
			posterStore.setLayout('classic');
			expect(posterStore.data.aspectRatio).toBe('2:3');
		});

		it('preserves aspect ratio if valid for new layout orientation', () => {
			posterStore.setLayout('medal-right');
			posterStore.setAspectRatio('5:4');
			expect(posterStore.data.aspectRatio).toBe('5:4');
			posterStore.setLayout('medal-right');
			expect(posterStore.data.aspectRatio).toBe('5:4');
		});

		it('reset clears layout to default', () => {
			posterStore.setLayout('medal-right');
			posterStore.reset();
			expect(posterStore.data.layout).toBe('classic');
			expect(posterStore.data.aspectRatio).toBe('2:3');
		});
	});

	describe('Design Presets', () => {
		it('applies a preset correctly', () => {
			posterStore.applyDesignPreset('noir');
			expect(posterStore.data.mapStyle).toBe('stamen-toner-dark');
			expect(posterStore.data.mapFilter).toBe('none');
			expect(posterStore.data.customBgColor).toBe('#000000');
			expect(posterStore.data.customTextColor).toBe('#ffffff');
			expect(posterStore.data.routeColor).toBe('orange');
			expect(posterStore.data.customRouteColor).toBeNull();
		});

		it('activePreset identifies the current preset', () => {
			posterStore.applyDesignPreset('paper');
			expect(posterStore.activePreset).toBe('paper');

			posterStore.applyDesignPreset('orbital');
			expect(posterStore.activePreset).toBe('orbital');
		});

		it('activePreset returns null if values are modified', () => {
			posterStore.applyDesignPreset('paper');
			posterStore.setCustomBgColor('#ff0000');
			expect(posterStore.activePreset).toBeNull();
		});

		it('activePreset returns null if custom route color is set', () => {
			posterStore.applyDesignPreset('paper');
			posterStore.setCustomRouteColor('#ff0000');
			expect(posterStore.activePreset).toBeNull();
		});
	});

	describe('Demo Mode', () => {
		it('isPresetAllowedInDemo returns correct values', () => {
			expect(posterStore.isPresetAllowedInDemo('paper')).toBe(true);
			expect(posterStore.isPresetAllowedInDemo('noir')).toBe(false);
			expect(posterStore.isPresetAllowedInDemo('terrain')).toBe(false);
			expect(posterStore.isPresetAllowedInDemo('orbital')).toBe(false);
		});

		it('isMapStyleAllowedInDemo returns correct values', () => {
			expect(posterStore.isMapStyleAllowedInDemo('positron')).toBe(true);
			expect(posterStore.isMapStyleAllowedInDemo('dark-matter')).toBe(true);
			expect(posterStore.isMapStyleAllowedInDemo('stamen-terrain')).toBe(false);
			expect(posterStore.isMapStyleAllowedInDemo('alidade-satellite')).toBe(false);
		});
	});
});
