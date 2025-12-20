import type { ActivityType, GPXData, PosterData, RouteColor, Unit, AspectRatio, QrDotStyle, Layout, MapStyle, MapFilter, DesignPreset } from '../types/index.js';
import { formatTime, formatPace, formatSpeed, formatDate, metersToKm, metersToMiles, kmToMeters, milesToMeters, parseTime } from '../utils/format.js';
import { calculatePace } from '../utils/geo.js';
import { THEMES, ROUTE_COLORS, DESIGN_PRESETS } from '../constants/themes.js';
import { getDimensions, getAspectRatiosForLayout, LAYOUTS } from '../constants/poster.js';
import { DEMO_GPX_DATA, DEMO_ATHLETE_NAME, isCartoMapStyle } from '../constants/demo.js';

function createDefaultPosterData(): PosterData {
	return {
		gpxData: null,
		activityType: 'running',
		athleteName: '',
		eventName: '',
		finishTime: '',
		date: null,
		distance: 0,
		unit: 'km',
		bibNumber: '',
		layout: 'classic',
		theme: 'light',
		mapStyle: 'positron',
		mapFilter: 'none',
		routeColor: 'orange',
		customBgColor: null,
		customTextColor: null,
		customRouteColor: null,
		aspectRatio: '2:3',
		qrCodeUrl: null,
		qrDotStyle: 'rounded',
		qrGradientEnabled: false
	};
}

class PosterStore {
	data = $state<PosterData>(createDefaultPosterData());
	isDemo = $state<boolean>(false);

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

	get formattedSpeed(): string {
		const elapsedSeconds = parseTime(this.data.finishTime);
		if (elapsedSeconds === null || elapsedSeconds === 0 || this.data.distance <= 0) return '--.-';

		const distanceMeters =
			this.data.unit === 'km'
				? kmToMeters(this.data.distance)
				: milesToMeters(this.data.distance);

		const metersPerSecond = distanceMeters / elapsedSeconds;
		return formatSpeed(metersPerSecond, this.data.unit);
	}

	get speedLabel(): string {
		return this.data.unit === 'km' ? 'KM/H' : 'MPH';
	}

	get formattedDate(): string {
		return this.data.date ? formatDate(this.data.date) : '';
	}

	loadFromGPX(gpxData: GPXData): void {
		this.data.gpxData = gpxData;
		this.data.activityType = gpxData.activityType;
		this.data.eventName = gpxData.name ?? '';
		this.data.date = gpxData.startTime;
		this.data.finishTime = gpxData.elapsedTime ? formatTime(gpxData.elapsedTime) : '';
		this.data.distance = metersToKm(gpxData.totalDistance);
		this.data.unit = 'km';
		this.isDemo = false;
	}

	loadDemoData(): void {
		this.loadFromGPX(DEMO_GPX_DATA);
		this.data.athleteName = DEMO_ATHLETE_NAME;
		this.data.mapStyle = 'positron';
		this.isDemo = true;
	}

	setMapStyle(style: MapStyle): void {
		if (this.isDemo && !isCartoMapStyle(style)) {
			return;
		}
		this.data.mapStyle = style;
	}

	setMapFilter(filter: MapFilter): void {
		this.data.mapFilter = filter;
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

	private get currentThemeConfig() {
		return THEMES.find((t) => t.value === this.data.theme);
	}

	get effectiveBgColor(): string {
		if (this.data.customBgColor) return this.data.customBgColor;
		return this.currentThemeConfig?.bg ?? '#ffffff';
	}

	get effectiveTextColor(): string {
		if (this.data.customTextColor) return this.data.customTextColor;
		return this.currentThemeConfig?.text ?? '#1a1a1a';
	}

	get effectiveRouteColor(): string {
		if (this.data.customRouteColor) return this.data.customRouteColor;
		return ROUTE_COLORS[this.data.routeColor];
	}

	get paceOrSpeed(): string {
		return this.data.activityType === 'cycling' ? this.formattedSpeed : this.formattedPace;
	}

	get paceOrSpeedLabel(): string {
		return this.data.activityType === 'cycling' ? this.speedLabel : this.paceLabel;
	}

	setUnit(unit: Unit): void {
		if (this.data.unit !== unit) {
			const currentDistance = this.data.distance;
			this.data.distance =
				unit === 'km' ? metersToKm(milesToMeters(currentDistance)) : metersToMiles(kmToMeters(currentDistance));
		}
		this.data.unit = unit;
	}

	setActivityType(activityType: ActivityType): void {
		this.data.activityType = activityType;
	}

	setAthleteName(name: string): void {
		this.data.athleteName = name;
	}

	setEventName(name: string): void {
		this.data.eventName = name;
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

	setLayout(layout: Layout): void {
		this.data.layout = layout;
		const validRatios = getAspectRatiosForLayout(layout);
		const currentRatioValid = validRatios.some((r) => r.value === this.data.aspectRatio);
		if (!currentRatioValid) {
			this.data.aspectRatio = validRatios[0].value;
		}
	}

	get isLandscape(): boolean {
		const layoutConfig = LAYOUTS.find((l) => l.value === this.data.layout);
		return layoutConfig?.orientation === 'landscape';
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

	applyDesignPreset(presetValue: DesignPreset): void {
		const preset = DESIGN_PRESETS.find((p) => p.value === presetValue);
		if (!preset) return;

		if (this.isDemo && !isCartoMapStyle(preset.mapStyle)) {
			return;
		}

		this.data.mapStyle = preset.mapStyle;
		this.data.mapFilter = preset.mapFilter;
		this.data.customBgColor = preset.bgColor;
		this.data.customTextColor = preset.textColor;
		this.data.routeColor = preset.routeColor;
		this.data.customRouteColor = null;
	}

	isPresetAllowedInDemo(presetValue: DesignPreset): boolean {
		const preset = DESIGN_PRESETS.find((p) => p.value === presetValue);
		if (!preset) return false;
		return isCartoMapStyle(preset.mapStyle);
	}

	isMapStyleAllowedInDemo(style: MapStyle): boolean {
		return isCartoMapStyle(style);
	}

	get activePreset(): DesignPreset | null {
		for (const preset of DESIGN_PRESETS) {
			const bgMatches =
				this.data.customBgColor === preset.bgColor ||
				(this.data.customBgColor === null && preset.bgColor === this.currentThemeConfig?.bg);
			const textMatches =
				this.data.customTextColor === preset.textColor ||
				(this.data.customTextColor === null && preset.textColor === this.currentThemeConfig?.text);

			const matches =
				this.data.mapStyle === preset.mapStyle &&
				this.data.mapFilter === preset.mapFilter &&
				bgMatches &&
				textMatches &&
				this.data.routeColor === preset.routeColor &&
				this.data.customRouteColor === null;

			if (matches) return preset.value;
		}
		return null;
	}

	get posterWidth(): number {
		return getDimensions(this.data.aspectRatio).width;
	}

	get posterHeight(): number {
		return getDimensions(this.data.aspectRatio).height;
	}

	reset(): void {
		this.data = createDefaultPosterData();
		this.isDemo = false;
	}
}

export const posterStore = new PosterStore();
