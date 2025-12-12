import type { UploadError } from '../types/index.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateGpxFile(file: File): UploadError | null {
	if (file.size === 0) {
		return {
			message: 'The file appears to be empty',
			type: 'empty-file'
		};
	}

	if (!file.name.toLowerCase().endsWith('.gpx')) {
		return {
			message: 'Please upload a GPX file (.gpx)',
			type: 'invalid-file-type'
		};
	}

	if (file.size > MAX_FILE_SIZE) {
		return {
			message: 'File too large (max 10MB)',
			type: 'file-too-large'
		};
	}

	return null;
}
