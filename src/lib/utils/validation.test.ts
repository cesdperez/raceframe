// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { validateGpxFile } from './validation.js';

function createMockFile(name: string, size: number = 1000): File {
	const file = new File(['x'], name, { type: 'application/gpx+xml' });
	Object.defineProperty(file, 'size', { value: size });
	return file;
}

describe('validateGpxFile', () => {
	it('accepts .gpx files', () => {
		const file = createMockFile('race.gpx');
		expect(validateGpxFile(file)).toBeNull();
	});

	it('accepts .GPX files (case insensitive)', () => {
		const file = createMockFile('race.GPX');
		expect(validateGpxFile(file)).toBeNull();
	});

	it('accepts .Gpx files (mixed case)', () => {
		const file = createMockFile('race.Gpx');
		expect(validateGpxFile(file)).toBeNull();
	});

	it('rejects .txt files', () => {
		const file = createMockFile('race.txt');
		const error = validateGpxFile(file);
		expect(error).not.toBeNull();
		expect(error?.type).toBe('invalid-file-type');
		expect(error?.message).toContain('GPX');
	});

	it('rejects .xml files', () => {
		const file = createMockFile('race.xml');
		const error = validateGpxFile(file);
		expect(error).not.toBeNull();
		expect(error?.type).toBe('invalid-file-type');
	});

	it('rejects files without extension', () => {
		const file = createMockFile('race');
		const error = validateGpxFile(file);
		expect(error).not.toBeNull();
		expect(error?.type).toBe('invalid-file-type');
	});

	it('rejects files over 10MB', () => {
		const tenMB = 10 * 1024 * 1024;
		const file = createMockFile('race.gpx', tenMB + 1);
		const error = validateGpxFile(file);
		expect(error).not.toBeNull();
		expect(error?.type).toBe('file-too-large');
		expect(error?.message).toContain('10MB');
	});

	it('accepts files exactly 10MB', () => {
		const tenMB = 10 * 1024 * 1024;
		const file = createMockFile('race.gpx', tenMB);
		expect(validateGpxFile(file)).toBeNull();
	});

	it('rejects empty files', () => {
		const file = createMockFile('race.gpx', 0);
		const error = validateGpxFile(file);
		expect(error).not.toBeNull();
		expect(error?.type).toBe('empty-file');
	});
});
