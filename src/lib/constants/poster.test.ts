import { describe, it, expect } from 'vitest';
import {
	calculateClassicLayout,
	getDimensions,
	getAspectRatiosForLayout
} from './poster';

describe('calculateClassicLayout', () => {
	const POSTER_2_3_HEIGHT = 2400;
	const POSTER_4_5_HEIGHT = 2000;

	// Fixed layout values matching CLASSIC_TOP_CONTENT and CSS
	const PADDING = 160; // 80 top + 80 bottom
	const HEADER_HEIGHT = 177;
	const MAP_MARGIN = 50;

	describe('without QR code', () => {
		it('total content height should not exceed available space', () => {
			const metrics = calculateClassicLayout(POSTER_2_3_HEIGHT, false);

			const totalHeight =
				PADDING + HEADER_HEIGHT + metrics.mapHeight + MAP_MARGIN + metrics.bottomContentHeight;

			expect(totalHeight).toBeLessThanOrEqual(POSTER_2_3_HEIGHT);
		});

		it('map height should fill available space efficiently', () => {
			const metrics = calculateClassicLayout(POSTER_2_3_HEIGHT, false);

			// Map should use at least 65% of poster height for 2:3 ratio (which has more vertical space)
			const minReasonableMapHeight = Math.round(POSTER_2_3_HEIGHT * 0.65);
			expect(metrics.mapHeight).toBeGreaterThanOrEqual(minReasonableMapHeight);
		});

		it('calculates layout for 2:3 ratio', () => {
			const metrics = calculateClassicLayout(POSTER_2_3_HEIGHT, false);

			expect(metrics.mapHeight).toBeGreaterThan(0);
			expect(metrics.bottomContentHeight).toBeGreaterThan(0);
		});

		it('calculates layout for 4:5 ratio', () => {
			const metrics = calculateClassicLayout(POSTER_4_5_HEIGHT, false);

			expect(metrics.mapHeight).toBeGreaterThan(0);
			// 4:5 should still have reasonable map height (at least 60%)
			expect(metrics.mapHeight).toBeGreaterThanOrEqual(Math.round(POSTER_4_5_HEIGHT * 0.60));
		});

		it('gives more map height for taller posters', () => {
			const metrics2_3 = calculateClassicLayout(POSTER_2_3_HEIGHT, false);
			const metrics4_5 = calculateClassicLayout(POSTER_4_5_HEIGHT, false);

			expect(metrics2_3.mapHeight).toBeGreaterThan(metrics4_5.mapHeight);
		});
	});

	describe('with QR code', () => {
		it('increases bottom content height when QR code is present', () => {
			const withQr = calculateClassicLayout(POSTER_2_3_HEIGHT, true);
			const withoutQr = calculateClassicLayout(POSTER_2_3_HEIGHT, false);

			expect(withQr.bottomContentHeight).toBeGreaterThan(withoutQr.bottomContentHeight);
		});

		it('reduces map height when QR code is present', () => {
			const withQr = calculateClassicLayout(POSTER_2_3_HEIGHT, true);
			const withoutQr = calculateClassicLayout(POSTER_2_3_HEIGHT, false);

			expect(withQr.mapHeight).toBeLessThan(withoutQr.mapHeight);
		});
	});

	describe('edge cases', () => {
		it('enforces minimum map height', () => {
			const metrics = calculateClassicLayout(500, false);
			expect(metrics.mapHeight).toBeGreaterThanOrEqual(200);
		});
	});
});

describe('getDimensions', () => {
	it('returns correct dimensions for 2:3', () => {
		const dims = getDimensions('2:3');
		expect(dims).toEqual({ width: 1600, height: 2400 });
	});

	it('returns correct dimensions for 4:5', () => {
		const dims = getDimensions('4:5');
		expect(dims).toEqual({ width: 1600, height: 2000 });
	});

	it('returns correct dimensions for 5:7', () => {
		const dims = getDimensions('5:7');
		expect(dims).toEqual({ width: 1400, height: 2000 });
	});

	it('returns correct dimensions for iso-a', () => {
		const dims = getDimensions('iso-a');
		expect(dims).toEqual({ width: 1414, height: 2000 });
	});

	it('returns correct dimensions for 3:2', () => {
		const dims = getDimensions('3:2');
		expect(dims).toEqual({ width: 2400, height: 1600 });
	});

	it('returns correct dimensions for 5:4', () => {
		const dims = getDimensions('5:4');
		expect(dims).toEqual({ width: 2000, height: 1600 });
	});

	it('returns correct dimensions for 7:5', () => {
		const dims = getDimensions('7:5');
		expect(dims).toEqual({ width: 2000, height: 1400 });
	});

	it('returns correct dimensions for iso-a-landscape', () => {
		const dims = getDimensions('iso-a-landscape');
		expect(dims).toEqual({ width: 2000, height: 1414 });
	});
});

describe('getAspectRatiosForLayout', () => {
	it('returns portrait ratios for classic layout', () => {
		const ratios = getAspectRatiosForLayout('classic');
		expect(ratios.map((r) => r.value)).toEqual(['2:3', '4:5', '5:7', 'iso-a']);
	});

	it('returns landscape ratios for medal-right layout', () => {
		const ratios = getAspectRatiosForLayout('medal-right');
		expect(ratios.map((r) => r.value)).toEqual(['3:2', '5:4', '7:5', 'iso-a-landscape']);
	});

	it('includes tooltip for each aspect ratio', () => {
		const portraitRatios = getAspectRatiosForLayout('classic');
		const landscapeRatios = getAspectRatiosForLayout('medal-right');

		for (const ratio of [...portraitRatios, ...landscapeRatios]) {
			expect(ratio.tooltip).toBeDefined();
			expect(ratio.tooltip.length).toBeGreaterThan(0);
		}
	});

	it('includes user-friendly labels for each aspect ratio', () => {
		const ratios = getAspectRatiosForLayout('classic');

		expect(ratios.find((r) => r.value === '2:3')?.label).toBe('Photo Print');
		expect(ratios.find((r) => r.value === '4:5')?.label).toBe('Frame Standard');
		expect(ratios.find((r) => r.value === '5:7')?.label).toBe('Portrait Frame');
		expect(ratios.find((r) => r.value === 'iso-a')?.label).toBe('A4 / A3 / A2');
	});
});
