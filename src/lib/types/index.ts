export interface GPXData {
	coordinates: [number, number][]; // [lng, lat][] - GeoJSON order
	totalDistance: number; // meters
	startTime: Date | null;
	endTime: Date | null;
	elapsedTime: number | null; // seconds
	elevationGain: number | null; // meters
	name: string | null; // activity name from GPX
}

export type Theme = 'light' | 'dark' | 'navy';
export type RouteColor = 'orange' | 'blue' | 'cyan' | 'yellow' | 'pink';
export type Unit = 'km' | 'miles';
export type AspectRatio = 'default' | 'a4' | 'square';
export type QrDotStyle = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';

export interface PosterData {
	gpxData: GPXData | null;
	runnerName: string;
	raceName: string;
	finishTime: string; // formatted HH:MM'SS"
	date: Date | null;
	distance: number; // in user's selected unit
	unit: Unit;
	bibNumber: string;
	theme: Theme;
	routeColor: RouteColor;
	customBgColor: string | null;
	customTextColor: string | null;
	customRouteColor: string | null;
	aspectRatio: AspectRatio;
	qrCodeUrl: string | null;
	qrDotStyle: QrDotStyle;
	qrGradientEnabled: boolean;
}

export type AppView = 'landing' | 'editor';

export interface UploadError {
	message: string;
	type: 'invalid-file-type' | 'file-too-large' | 'parse-error' | 'empty-file';
}
