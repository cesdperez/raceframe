import { describe, it, expect } from 'vitest';
import { generateFilename, sanitizeForFilename } from './export.js';

describe('sanitizeForFilename', () => {
	it('replaces spaces with hyphens', () => {
		expect(sanitizeForFilename('Berlin Marathon')).toBe('Berlin-Marathon');
	});

	it('removes special characters', () => {
		expect(sanitizeForFilename('Race/Name:With*Special?Chars')).toBe('RaceNameWithSpecialChars');
	});

	it('handles multiple spaces', () => {
		expect(sanitizeForFilename('My   Race   Name')).toBe('My-Race-Name');
	});

	it('trims whitespace', () => {
		expect(sanitizeForFilename('  Race Name  ')).toBe('Race-Name');
	});

	it('handles empty string', () => {
		expect(sanitizeForFilename('')).toBe('');
	});

	it('preserves numbers', () => {
		expect(sanitizeForFilename('Marathon 2025')).toBe('Marathon-2025');
	});

	it('preserves accented characters', () => {
		expect(sanitizeForFilename('Zürich Marathon')).toBe('Zürich-Marathon');
	});
});

describe('generateFilename', () => {
	it('generates filename with event name and date', () => {
		const date = new Date('2025-12-01');
		expect(generateFilename('Berlin Marathon', date, 2)).toBe('Berlin-Marathon_2025-12-01_2x.png');
	});

	it('generates filename with 4x scale', () => {
		const date = new Date('2025-01-15');
		expect(generateFilename('My Race', date, 4)).toBe('My-Race_2025-01-15_4x.png');
	});

	it('generates filename with 1x scale', () => {
		const date = new Date('2025-03-10');
		expect(generateFilename('My Race', date, 1)).toBe('My-Race_2025-03-10_1x.png');
	});

	it('handles null date', () => {
		const filename = generateFilename('Race Name', null, 2);
		expect(filename).toBe('Race-Name_2x.png');
	});

	it('sanitizes event name in filename', () => {
		const date = new Date('2025-06-20');
		expect(generateFilename('Race/With:Special*Chars', date, 2)).toBe(
			'RaceWithSpecialChars_2025-06-20_2x.png'
		);
	});

	it('pads single digit month and day', () => {
		const date = new Date('2025-01-05');
		expect(generateFilename('Race', date, 2)).toBe('Race_2025-01-05_2x.png');
	});

	it('uses "poster" as fallback for empty event name', () => {
		const date = new Date('2025-12-01');
		expect(generateFilename('', date, 2)).toBe('poster_2025-12-01_2x.png');
	});
});
