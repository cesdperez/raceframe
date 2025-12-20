export type ActivityType = 'running' | 'cycling';

export interface GPXData {
	coordinates: [number, number][]; // [lng, lat][] - GeoJSON order
	totalDistance: number; // meters
	startTime: Date | null;
	endTime: Date | null;
	elapsedTime: number | null; // seconds
	elevationGain: number | null; // meters
	name: string | null; // activity name from GPX
	activityType: ActivityType;
}

export type Theme = 'light' | 'dark' | 'navy';
export type RouteColor = 'orange' | 'blue' | 'cyan' | 'yellow' | 'pink' | 'black' | 'white' | 'red';
export type DesignPreset = 'paper' | 'noir' | 'blueprint' | 'orbital' | 'terrain';
export type MapStyle =
	| 'positron'
	| 'dark-matter'
	| 'alidade-smooth'
	| 'alidade-smooth-dark'
	| 'alidade-satellite'
	| 'outdoors'
	| 'stamen-toner'
	| 'stamen-toner-lite'
	| 'stamen-toner-dark'
	| 'stamen-terrain'
	| 'osm-bright';

export type MapFilter = 'none' | 'grayscale' | 'sepia' | 'navy' | 'teal';
export type Unit = 'km' | 'miles';
export type Layout = 'classic' | 'medal-right';
export type AspectRatio = '2:3' | '4:5' | '5:7' | 'iso-a' | '3:2' | '5:4' | '7:5' | 'iso-a-landscape';
export type QrDotStyle = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';

export interface PosterData {
	gpxData: GPXData | null;
	activityType: ActivityType;
	athleteName: string;
	eventName: string;
	finishTime: string; // formatted HH:MM'SS"
	date: Date | null;
	distance: number; // in user's selected unit
	unit: Unit;
	bibNumber: string;
	layout: Layout;
	theme: Theme;
	mapStyle: MapStyle;
	mapFilter: MapFilter;
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
