import type { MapStyle } from '$lib/types';
import { getMapStyleConfig } from '$lib/constants/themes';

export {
	ROUTE_COLORS,
	START_MARKER_COLOR
} from '$lib/constants/themes';

export function getTileUrlForStyle(style: MapStyle): string {
	return getMapStyleConfig(style).tileUrl;
}

export function getAttributionForStyle(style: MapStyle): string {
	return getMapStyleConfig(style).attribution;
}

export function toLatLng(coord: [number, number]): [number, number] {
	return [coord[1], coord[0]];
}

export function toLatLngArray(coords: [number, number][]): [number, number][] {
	return coords.map(toLatLng);
}
