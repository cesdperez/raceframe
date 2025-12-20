import type { Unit } from '../types/index.js';

const METERS_PER_KM = 1000;
const METERS_PER_MILE = 1609.344;

export function metersToKm(meters: number): number {
	return meters / METERS_PER_KM;
}

export function metersToMiles(meters: number): number {
	return meters / METERS_PER_MILE;
}

export function kmToMeters(km: number): number {
	return km * METERS_PER_KM;
}

export function milesToMeters(miles: number): number {
	return miles * METERS_PER_MILE;
}

export function formatTime(totalSeconds: number): string {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.floor(totalSeconds % 60);

	const paddedMinutes = String(minutes).padStart(2, '0');
	const paddedSeconds = String(seconds).padStart(2, '0');

	return `${hours}:${paddedMinutes}'${paddedSeconds}"`;
}

export function parseTime(timeStr: string): number | null {
	const match = timeStr.match(/^(\d+):(\d{2})'(\d{2})"$/);
	if (!match) return null;

	const hours = parseInt(match[1], 10);
	const minutes = parseInt(match[2], 10);
	const seconds = parseInt(match[3], 10);

	if (minutes >= 60 || seconds >= 60) return null;

	return hours * 3600 + minutes * 60 + seconds;
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

export function formatSpeed(metersPerSecond: number, unit: Unit): string {
	const kmPerHour = metersPerSecond * 3.6;
	const speed = unit === 'km' ? kmPerHour : kmPerHour / 1.609344;
	return speed.toFixed(1);
}
