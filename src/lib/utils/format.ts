import type { Unit } from '../types/index.js';

const METERS_PER_KM = 1000;
const METERS_PER_MILE = 1609.344;

export function metersToKm(meters: number): number {
	return meters / METERS_PER_KM;
}

export function metersToMiles(meters: number): number {
	return meters / METERS_PER_MILE;
}

export function formatTime(totalSeconds: number): string {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.floor(totalSeconds % 60);

	const paddedMinutes = String(minutes).padStart(2, '0');
	const paddedSeconds = String(seconds).padStart(2, '0');

	return `${hours}:${paddedMinutes}'${paddedSeconds}"`;
}

export function formatDistance(meters: number, unit: Unit): string {
	const value = unit === 'km' ? metersToKm(meters) : metersToMiles(meters);
	return value.toFixed(1);
}

export function formatPace(secondsPerKm: number, unit: Unit): string {
	const paceSeconds = unit === 'km' ? secondsPerKm : secondsPerKm * (METERS_PER_MILE / METERS_PER_KM);

	const minutes = Math.floor(paceSeconds / 60);
	const seconds = Math.round(paceSeconds % 60);

	return `${minutes}'${String(seconds).padStart(2, '0')}"`;
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}
