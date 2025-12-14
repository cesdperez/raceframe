import { describe, it, expect, beforeEach } from 'vitest';
import { generatePdfFilename } from './pdf-export.js';
import { posterStore } from '../stores/poster.svelte.js';

describe('generatePdfFilename', () => {
	it('generates filename with race name and date', () => {
		const date = new Date('2025-12-01');
		expect(generatePdfFilename('Berlin Marathon', date, 2)).toBe('Berlin-Marathon_2025-12-01_2x.pdf');
	});

	it('generates filename with 4x scale', () => {
		const date = new Date('2025-01-15');
		expect(generatePdfFilename('My Race', date, 4)).toBe('My-Race_2025-01-15_4x.pdf');
	});

	it('handles null date', () => {
		const filename = generatePdfFilename('Race Name', null, 2);
		expect(filename).toBe('Race-Name_2x.pdf');
	});

	it('uses "poster" as fallback for empty race name', () => {
		const date = new Date('2025-12-01');
		expect(generatePdfFilename('', date, 2)).toBe('poster_2025-12-01_2x.pdf');
	});
});

describe('PDF export dimensions', () => {
	beforeEach(() => {
		posterStore.reset();
	});

	describe('portrait layouts', () => {
		it('uses portrait dimensions for classic layout with 2:3 ratio', () => {
			posterStore.setLayout('classic');
			posterStore.setAspectRatio('2:3');

			expect(posterStore.posterWidth).toBe(1600);
			expect(posterStore.posterHeight).toBe(2400);
			expect(posterStore.isLandscape).toBe(false);
		});

		it('uses portrait dimensions for classic layout with 4:5 ratio', () => {
			posterStore.setLayout('classic');
			posterStore.setAspectRatio('4:5');

			expect(posterStore.posterWidth).toBe(1600);
			expect(posterStore.posterHeight).toBe(2000);
			expect(posterStore.isLandscape).toBe(false);
		});
	});

	describe('landscape layouts', () => {
		it('uses landscape dimensions for medal-right layout with 3:2 ratio', () => {
			posterStore.setLayout('medal-right');

			expect(posterStore.posterWidth).toBe(2400);
			expect(posterStore.posterHeight).toBe(1600);
			expect(posterStore.isLandscape).toBe(true);
		});

		it('uses landscape dimensions for medal-right layout with 5:4 ratio', () => {
			posterStore.setLayout('medal-right');
			posterStore.setAspectRatio('5:4');

			expect(posterStore.posterWidth).toBe(2000);
			expect(posterStore.posterHeight).toBe(1600);
			expect(posterStore.isLandscape).toBe(true);
		});
	});

	describe('layout switching', () => {
		it('switches to landscape dimensions when changing to medal-right', () => {
			posterStore.setLayout('classic');
			expect(posterStore.posterWidth).toBeLessThan(posterStore.posterHeight);

			posterStore.setLayout('medal-right');
			expect(posterStore.posterWidth).toBeGreaterThan(posterStore.posterHeight);
		});

		it('switches to portrait dimensions when changing back to classic', () => {
			posterStore.setLayout('medal-right');
			expect(posterStore.posterWidth).toBeGreaterThan(posterStore.posterHeight);

			posterStore.setLayout('classic');
			expect(posterStore.posterWidth).toBeLessThan(posterStore.posterHeight);
		});
	});
});
