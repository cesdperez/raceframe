import type { GPXData, PosterData, Theme, RouteColor, Unit } from '../types/index.js';
import { formatTime, formatDistance, formatPace, formatDate, metersToKm, metersToMiles } from '../utils/format.js';
import { calculatePace } from '../utils/geo.js';

function createDefaultPosterData(): PosterData {
	return {
		gpxData: null,
		runnerName: '',
		raceName: '',
		finishTime: '',
		date: null,
		distance: 0,
		unit: 'km',
		bibNumber: '',
		city: '',
		qrCodeUrl: '',
		theme: 'light',
		routeColor: 'orange'
	};
}

class PosterStore {
	data = $state<PosterData>(createDefaultPosterData());

	get hasGpxData(): boolean {
		return this.data.gpxData !== null;
	}

	get formattedDistance(): string {
		return formatDistance(this.data.gpxData?.totalDistance ?? 0, this.data.unit);
	}

	get formattedPace(): string {
		const gpx = this.data.gpxData;
		if (!gpx?.totalDistance || !gpx?.elapsedTime) return "--'--\"";
		const paceSecondsPerKm = calculatePace(gpx.totalDistance, gpx.elapsedTime);
		if (paceSecondsPerKm === null) return "--'--\"";
		return formatPace(paceSecondsPerKm, this.data.unit);
	}

	get paceLabel(): string {
		return this.data.unit === 'km' ? '/KM' : '/MI';
	}

	get formattedDate(): string {
		return this.data.date ? formatDate(this.data.date) : '';
	}

	loadFromGPX(gpxData: GPXData): void {
		this.data.gpxData = gpxData;
		this.data.raceName = gpxData.name ?? '';
		this.data.date = gpxData.startTime;
		this.data.finishTime = gpxData.elapsedTime ? formatTime(gpxData.elapsedTime) : '';
		this.data.distance = metersToKm(gpxData.totalDistance);
		this.data.unit = 'km';
	}

	setTheme(theme: Theme): void {
		this.data.theme = theme;
	}

	setRouteColor(color: RouteColor): void {
		this.data.routeColor = color;
	}

	setUnit(unit: Unit): void {
		if (this.data.unit !== unit && this.data.gpxData) {
			const distanceMeters = this.data.gpxData.totalDistance;
			this.data.distance =
				unit === 'km' ? metersToKm(distanceMeters) : metersToMiles(distanceMeters);
		}
		this.data.unit = unit;
	}

	reset(): void {
		this.data = createDefaultPosterData();
	}
}

export const posterStore = new PosterStore();
