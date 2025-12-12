import { gpx } from '@tmcw/togeojson';
import type { GPXData } from '../types/index.js';
import { calculateDistance, calculateElapsedTime } from './geo.js';

export function parseGPX(gpxString: string): GPXData {
	const parser = new DOMParser();
	const doc = parser.parseFromString(gpxString, 'text/xml');

	const parseError = doc.querySelector('parsererror');
	if (parseError) {
		throw new Error('Invalid GPX: malformed XML');
	}

	const geoJson = gpx(doc);

	if (!geoJson.features || geoJson.features.length === 0) {
		throw new Error('Invalid GPX: no tracks found');
	}

	const coordinates = extractCoordinates(geoJson);
	const { start: startTime, end: endTime } = extractTimes(geoJson);
	const name = extractName(geoJson);
	const elevationGain = calculateElevationGain(geoJson);

	return {
		coordinates,
		totalDistance: calculateDistance(coordinates),
		startTime,
		endTime,
		elapsedTime: calculateElapsedTime(startTime, endTime),
		elevationGain,
		name
	};
}

function extractCoordinates(geoJson: GeoJSON.FeatureCollection): [number, number][] {
	const coords: [number, number][] = [];

	for (const feature of geoJson.features) {
		if (feature.geometry.type === 'LineString') {
			for (const coord of feature.geometry.coordinates) {
				coords.push([coord[0], coord[1]]);
			}
		} else if (feature.geometry.type === 'MultiLineString') {
			for (const line of feature.geometry.coordinates) {
				for (const coord of line) {
					coords.push([coord[0], coord[1]]);
				}
			}
		}
	}

	return coords;
}

function extractTimes(geoJson: GeoJSON.FeatureCollection): { start: Date | null; end: Date | null } {
	let start: Date | null = null;
	let end: Date | null = null;

	for (const feature of geoJson.features) {
		const props = feature.properties;
		if (props?.coordinateProperties?.times) {
			const times = props.coordinateProperties.times as string[];
			if (times.length > 0) {
				const firstTime = new Date(times[0]);
				const lastTime = new Date(times[times.length - 1]);

				if (!start || firstTime < start) start = firstTime;
				if (!end || lastTime > end) end = lastTime;
			}
		}
	}

	return { start, end };
}

function extractName(geoJson: GeoJSON.FeatureCollection): string | null {
	for (const feature of geoJson.features) {
		if (feature.properties?.name) {
			return feature.properties.name;
		}
	}
	return null;
}

function calculateElevationGain(geoJson: GeoJSON.FeatureCollection): number | null {
	let totalGain = 0;
	let hasElevation = false;

	for (const feature of geoJson.features) {
		if (feature.geometry.type === 'LineString') {
			const coords = feature.geometry.coordinates;
			for (let i = 1; i < coords.length; i++) {
				const prevEle = coords[i - 1][2];
				const currEle = coords[i][2];
				if (prevEle !== undefined && currEle !== undefined) {
					hasElevation = true;
					const diff = currEle - prevEle;
					if (diff > 0) totalGain += diff;
				}
			}
		} else if (feature.geometry.type === 'MultiLineString') {
			for (const line of feature.geometry.coordinates) {
				for (let i = 1; i < line.length; i++) {
					const prevEle = line[i - 1][2];
					const currEle = line[i][2];
					if (prevEle !== undefined && currEle !== undefined) {
						hasElevation = true;
						const diff = currEle - prevEle;
						if (diff > 0) totalGain += diff;
					}
				}
			}
		}
	}

	return hasElevation ? totalGain : null;
}
