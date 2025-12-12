const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number): number {
	return degrees * (Math.PI / 180);
}

export function haversineDistance(p1: [number, number], p2: [number, number]): number {
	const [lng1, lat1] = p1;
	const [lng2, lat2] = p2;

	const dLat = toRadians(lat2 - lat1);
	const dLng = toRadians(lng2 - lng1);

	const lat1Rad = toRadians(lat1);
	const lat2Rad = toRadians(lat2);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return EARTH_RADIUS_METERS * c;
}

export function calculateDistance(coords: [number, number][]): number {
	if (coords.length < 2) {
		return 0;
	}

	let totalDistance = 0;
	for (let i = 1; i < coords.length; i++) {
		totalDistance += haversineDistance(coords[i - 1], coords[i]);
	}

	return totalDistance;
}

export function calculateElapsedTime(start: Date | null, end: Date | null): number | null {
	if (start === null || end === null) {
		return null;
	}

	return Math.floor((end.getTime() - start.getTime()) / 1000);
}

export function calculatePace(distanceMeters: number, elapsedSeconds: number | null): number | null {
	if (elapsedSeconds === null) {
		return null;
	}

	if (distanceMeters === 0) {
		return null;
	}

	const distanceKm = distanceMeters / 1000;
	return elapsedSeconds / distanceKm;
}
