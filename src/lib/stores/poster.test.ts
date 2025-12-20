import { describe, it, expect, beforeEach } from 'vitest';
import { posterStore } from './poster.svelte.js';
import type { GPXData } from '../types/index.js';
import { DEMO_GPX_DATA, DEMO_RUNNER_NAME } from '../constants/demo.js';

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

		it('clears demo mode when loading real GPX', () => {
			posterStore.loadDemoData();
			expect(posterStore.isDemo).toBe(true);

			posterStore.loadFromGPX(mockGpxData);
			expect(posterStore.isDemo).toBe(false);
		});
	});

	describe('setMapStyle', () => {
		it('has default map style of positron', () => {
			expect(posterStore.data.mapStyle).toBe('positron');
		});

		it('updates map style', () => {
			posterStore.setMapStyle('dark-matter');
			expect(posterStore.data.mapStyle).toBe('dark-matter');

			posterStore.setMapStyle('stamen-watercolor');
			expect(posterStore.data.mapStyle).toBe('stamen-watercolor');

			posterStore.setMapStyle('alidade-satellite');
			expect(posterStore.data.mapStyle).toBe('alidade-satellite');
		});

		it('reset clears map style to default', () => {
			posterStore.setMapStyle('alidade-satellite');
			posterStore.reset();
			expect(posterStore.data.mapStyle).toBe('positron');
		});
	});

	describe('setMapFilter', () => {
		it('has default map filter of none', () => {
			expect(posterStore.data.mapFilter).toBe('none');
		});

		it('updates map filter', () => {
			posterStore.setMapFilter('grayscale');
			expect(posterStore.data.mapFilter).toBe('grayscale');

			posterStore.setMapFilter('sepia');
			expect(posterStore.data.mapFilter).toBe('sepia');

			posterStore.setMapFilter('navy');
			expect(posterStore.data.mapFilter).toBe('navy');
		});

		it('reset clears map filter to default', () => {
			posterStore.setMapFilter('grayscale');
			posterStore.reset();
			expect(posterStore.data.mapFilter).toBe('none');
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

	describe('posterWidth and posterHeight', () => {
		it('returns correct dimensions for portrait 2:3', () => {
			posterStore.setAspectRatio('2:3');
			expect(posterStore.posterWidth).toBe(1600);
			expect(posterStore.posterHeight).toBe(2400);
		});

		it('returns correct dimensions for portrait 4:5', () => {
			posterStore.setAspectRatio('4:5');
			expect(posterStore.posterWidth).toBe(1600);
			expect(posterStore.posterHeight).toBe(2000);
		});

		it('returns correct dimensions for portrait 5:7', () => {
			posterStore.setAspectRatio('5:7');
			expect(posterStore.posterWidth).toBe(1400);
			expect(posterStore.posterHeight).toBe(2000);
		});

		it('returns correct dimensions for portrait iso-a', () => {
			posterStore.setAspectRatio('iso-a');
			expect(posterStore.posterWidth).toBe(1414);
			expect(posterStore.posterHeight).toBe(2000);
		});

		it('returns correct dimensions for landscape 3:2', () => {
			posterStore.setLayout('medal-right');
			expect(posterStore.posterWidth).toBe(2400);
			expect(posterStore.posterHeight).toBe(1600);
		});

		it('returns correct dimensions for landscape 5:4', () => {
			posterStore.setLayout('medal-right');
			posterStore.setAspectRatio('5:4');
			expect(posterStore.posterWidth).toBe(2000);
			expect(posterStore.posterHeight).toBe(1600);
		});

		it('returns correct dimensions for landscape 7:5', () => {
			posterStore.setLayout('medal-right');
			posterStore.setAspectRatio('7:5');
			expect(posterStore.posterWidth).toBe(2000);
			expect(posterStore.posterHeight).toBe(1400);
		});

		it('returns correct dimensions for landscape iso-a-landscape', () => {
			posterStore.setLayout('medal-right');
			posterStore.setAspectRatio('iso-a-landscape');
			expect(posterStore.posterWidth).toBe(2000);
			expect(posterStore.posterHeight).toBe(1414);
		});
	});

	describe('Demo Mode', () => {
		it('loadDemoData sets isDemo to true', () => {
			posterStore.loadDemoData();
			expect(posterStore.isDemo).toBe(true);
		});

		it('loadDemoData populates with demo GPX data', () => {
			posterStore.loadDemoData();
			expect(posterStore.data.gpxData).toStrictEqual(DEMO_GPX_DATA);
			expect(posterStore.data.raceName).toBe('Valencia Marathon');
			expect(posterStore.data.runnerName).toBe(DEMO_RUNNER_NAME);
		});

		it('loadDemoData sets map style to positron (CARTO)', () => {
			posterStore.loadDemoData();
			expect(posterStore.data.mapStyle).toBe('positron');
		});

		it('setMapStyle blocks non-CARTO styles in demo mode', () => {
			posterStore.loadDemoData();
			posterStore.setMapStyle('stamen-watercolor');
			expect(posterStore.data.mapStyle).toBe('positron');

			posterStore.setMapStyle('alidade-satellite');
			expect(posterStore.data.mapStyle).toBe('positron');
		});

		it('setMapStyle allows CARTO styles in demo mode', () => {
			posterStore.loadDemoData();
			posterStore.setMapStyle('dark-matter');
			expect(posterStore.data.mapStyle).toBe('dark-matter');

			posterStore.setMapStyle('positron');
			expect(posterStore.data.mapStyle).toBe('positron');
		});

		it('setMapStyle allows all styles when not in demo mode', () => {
			posterStore.loadFromGPX(mockGpxData);
			posterStore.setMapStyle('stamen-watercolor');
			expect(posterStore.data.mapStyle).toBe('stamen-watercolor');
		});

		it('applyDesignPreset blocks non-CARTO presets in demo mode', () => {
			posterStore.loadDemoData();
			const originalMapStyle = posterStore.data.mapStyle;

			posterStore.applyDesignPreset('noir');
			expect(posterStore.data.mapStyle).toBe(originalMapStyle);

			posterStore.applyDesignPreset('watercolor');
			expect(posterStore.data.mapStyle).toBe(originalMapStyle);
		});

		it('applyDesignPreset allows CARTO-based presets in demo mode', () => {
			posterStore.loadDemoData();
			posterStore.applyDesignPreset('paper');
			expect(posterStore.data.mapStyle).toBe('positron');
			expect(posterStore.activePreset).toBe('paper');
		});

		it('isPresetAllowedInDemo returns correct values', () => {
			expect(posterStore.isPresetAllowedInDemo('paper')).toBe(true);
			expect(posterStore.isPresetAllowedInDemo('noir')).toBe(false);
			expect(posterStore.isPresetAllowedInDemo('watercolor')).toBe(false);
			expect(posterStore.isPresetAllowedInDemo('orbital')).toBe(false);
		});

		it('isMapStyleAllowedInDemo returns correct values', () => {
			expect(posterStore.isMapStyleAllowedInDemo('positron')).toBe(true);
			expect(posterStore.isMapStyleAllowedInDemo('dark-matter')).toBe(true);
			expect(posterStore.isMapStyleAllowedInDemo('stamen-watercolor')).toBe(false);
			expect(posterStore.isMapStyleAllowedInDemo('alidade-satellite')).toBe(false);
		});

		it('reset clears demo mode', () => {
			posterStore.loadDemoData();
			expect(posterStore.isDemo).toBe(true);

			posterStore.reset();
			expect(posterStore.isDemo).toBe(false);
		});
	});
});
