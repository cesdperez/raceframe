// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseGPX } from './gpx.js';

const sampleGpx = readFileSync(
	join(import.meta.dirname, '../test-fixtures/sample.gpx'),
	'utf-8'
);

const valenciaMarathonGpx = readFileSync(
	join(import.meta.dirname, '../test-fixtures/valencia_marathon.gpx'),
	'utf-8'
);

describe('parseGPX', () => {
	it('extracts coordinates from GPX file', () => {
		const data = parseGPX(sampleGpx);
		expect(data.coordinates).toHaveLength(5);
		// GeoJSON order: [lng, lat]
		expect(data.coordinates[0]).toEqual([0, 0]);
		expect(data.coordinates[1]).toEqual([0.008993, 0]);
	});

	it('extracts activity name from GPX metadata', () => {
		const data = parseGPX(sampleGpx);
		expect(data.name).toBe('Morning Run');
	});

	it('extracts start and end times', () => {
		const data = parseGPX(sampleGpx);
		expect(data.startTime).toEqual(new Date('2025-01-01T09:00:00Z'));
		expect(data.endTime).toEqual(new Date('2025-01-01T10:00:00Z'));
	});

	it('calculates elapsed time in seconds', () => {
		const data = parseGPX(sampleGpx);
		expect(data.elapsedTime).toBe(3600); // 1 hour
	});

	it('calculates total distance', () => {
		const data = parseGPX(sampleGpx);
		// Rectangular route of ~4km
		expect(data.totalDistance).toBeCloseTo(4000, -2);
	});

	it('calculates elevation gain', () => {
		const data = parseGPX(sampleGpx);
		// 10 -> 15 (+5) -> 20 (+5) -> 15 -> 10 = 10m gain
		expect(data.elevationGain).toBe(10);
	});

	it('handles GPX without timestamps gracefully', () => {
		const gpxWithoutTime = `<?xml version="1.0"?>
<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
  <trk><trkseg>
    <trkpt lat="0" lon="0"></trkpt>
    <trkpt lat="1" lon="1"></trkpt>
  </trkseg></trk>
</gpx>`;
		const data = parseGPX(gpxWithoutTime);
		expect(data.startTime).toBeNull();
		expect(data.endTime).toBeNull();
		expect(data.elapsedTime).toBeNull();
	});

	it('handles GPX without name gracefully', () => {
		const gpxWithoutName = `<?xml version="1.0"?>
<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
  <trk><trkseg>
    <trkpt lat="0" lon="0"></trkpt>
    <trkpt lat="1" lon="1"></trkpt>
  </trkseg></trk>
</gpx>`;
		const data = parseGPX(gpxWithoutName);
		expect(data.name).toBeNull();
	});

	it('handles multiple track segments', () => {
		const multiSegmentGpx = `<?xml version="1.0"?>
<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <trkseg>
      <trkpt lat="0" lon="0"></trkpt>
      <trkpt lat="1" lon="1"></trkpt>
    </trkseg>
    <trkseg>
      <trkpt lat="2" lon="2"></trkpt>
      <trkpt lat="3" lon="3"></trkpt>
    </trkseg>
  </trk>
</gpx>`;
		const data = parseGPX(multiSegmentGpx);
		expect(data.coordinates).toHaveLength(4);
	});

	it('throws on malformed XML', () => {
		expect(() => parseGPX('not valid xml')).toThrow();
	});

	it('throws on empty GPX (no tracks)', () => {
		const emptyGpx = `<?xml version="1.0"?>
<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
</gpx>`;
		expect(() => parseGPX(emptyGpx)).toThrow();
	});
});

describe('parseGPX integration - Valencia Marathon', () => {
	const data = parseGPX(valenciaMarathonGpx);

	it('parses distance within 1% of Garmin (42.63 km)', () => {
		const distanceKm = data.totalDistance / 1000;
		const garminDistance = 42.63;
		const tolerance = garminDistance * 0.01; // 1% tolerance
		expect(Math.abs(distanceKm - garminDistance)).toBeLessThan(tolerance);
	});

	it('parses elapsed time correctly (3:34:48)', () => {
		const expectedSeconds = 3 * 3600 + 34 * 60 + 48; // 12888
		expect(data.elapsedTime).toBe(expectedSeconds);
	});

	it('calculates average pace close to Garmin (5:02/km)', () => {
		const paceSecondsPerKm = data.elapsedTime! / (data.totalDistance / 1000);
		const garminPace = 5 * 60 + 2; // 302 sec/km
		expect(Math.abs(paceSecondsPerKm - garminPace)).toBeLessThan(3); // within 3 seconds
	});

	it('calculates elevation gain from raw GPS data', () => {
		// Raw GPS elevation gain is higher than Garmin's barometric/smoothed value (105m)
		// because GPS altitude data is noisy. We verify we get a reasonable positive value.
		expect(data.elevationGain).toBeGreaterThan(100);
		expect(data.elevationGain).toBeLessThan(600);
	});

	it('extracts activity name', () => {
		expect(data.name).toBe('Valencia Running');
	});

	it('has start and end times', () => {
		expect(data.startTime).toBeInstanceOf(Date);
		expect(data.endTime).toBeInstanceOf(Date);
	});

	it('has coordinates for the full route', () => {
		expect(data.coordinates.length).toBeGreaterThan(1000);
	});
});
