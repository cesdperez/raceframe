import type { GPXData, PosterData, Theme, RouteColor, Unit, AspectRatio, QrDotStyle } from '../types/index.js';
import { formatTime, formatPace, formatDate, metersToKm, metersToMiles, kmToMeters, milesToMeters, parseTime } from '../utils/format.js';
import { calculatePace } from '../utils/geo.js';
import { THEMES, ROUTE_COLORS } from '../constants/themes.js';
import { getDimensions } from '../constants/poster.js';

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
		theme: 'light',
		routeColor: 'orange',
		customBgColor: null,
		customTextColor: null,
		customRouteColor: null,
		aspectRatio: 'default',
		qrCodeUrl: null,
		qrDotStyle: 'rounded',
		qrGradientEnabled: false
	};
}

class PosterStore {
	data = $state<PosterData>(createDefaultPosterData());

	get hasGpxData(): boolean {
		return this.data.gpxData !== null;
	}

	get formattedDistance(): string {
		return this.data.distance.toFixed(1);
	}

	get formattedPace(): string {
		const elapsedSeconds = parseTime(this.data.finishTime);
		if (elapsedSeconds === null || this.data.distance <= 0) return "--'--\"";

		const distanceMeters =
			this.data.unit === 'km'
				? kmToMeters(this.data.distance)
				: milesToMeters(this.data.distance);

		const paceSecondsPerKm = calculatePace(distanceMeters, elapsedSeconds);
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

	setCustomBgColor(color: string | null): void {
		this.data.customBgColor = color;
	}

	setCustomTextColor(color: string | null): void {
		this.data.customTextColor = color;
	}

	setCustomRouteColor(color: string | null): void {
		this.data.customRouteColor = color;
	}

	get effectiveBgColor(): string {
		if (this.data.customBgColor) return this.data.customBgColor;
		const themeConfig = THEMES.find((t) => t.value === this.data.theme);
		return themeConfig?.bg ?? '#ffffff';
	}

	get effectiveTextColor(): string {
		if (this.data.customTextColor) return this.data.customTextColor;
		const themeConfig = THEMES.find((t) => t.value === this.data.theme);
		return themeConfig?.text ?? '#1a1a1a';
	}

	get effectiveRouteColor(): string {
		if (this.data.customRouteColor) return this.data.customRouteColor;
		return ROUTE_COLORS[this.data.routeColor];
	}

	setUnit(unit: Unit): void {
		if (this.data.unit !== unit && this.data.gpxData) {
			const distanceMeters = this.data.gpxData.totalDistance;
			this.data.distance =
				unit === 'km' ? metersToKm(distanceMeters) : metersToMiles(distanceMeters);
		}
		this.data.unit = unit;
	}

	setRunnerName(name: string): void {
		this.data.runnerName = name;
	}

	setRaceName(name: string): void {
		this.data.raceName = name;
	}

	setBibNumber(bib: string): void {
		this.data.bibNumber = bib;
	}

	setFinishTime(time: string): void {
		this.data.finishTime = time;
	}

	setDate(date: Date | null): void {
		this.data.date = date;
	}

	setDistance(distance: number): void {
		this.data.distance = distance;
	}

	setAspectRatio(ratio: AspectRatio): void {
		this.data.aspectRatio = ratio;
	}

	setQrCodeUrl(url: string | null): void {
		this.data.qrCodeUrl = url;
	}

	setQrDotStyle(style: QrDotStyle): void {
		this.data.qrDotStyle = style;
	}

	setQrGradientEnabled(enabled: boolean): void {
		this.data.qrGradientEnabled = enabled;
	}

	get posterWidth(): number {
		return getDimensions(this.data.aspectRatio).width;
	}

	get posterHeight(): number {
		return getDimensions(this.data.aspectRatio).height;
	}

	reset(): void {
		this.data = createDefaultPosterData();
	}
}

export const posterStore = new PosterStore();
