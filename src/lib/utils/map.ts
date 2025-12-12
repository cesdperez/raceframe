export {
	TILE_URLS,
	TILE_ATTRIBUTION,
	THEME_TO_TILES,
	ROUTE_COLORS,
	START_MARKER_COLOR
} from '$lib/constants/themes';

export function toLatLng(coord: [number, number]): [number, number] {
	return [coord[1], coord[0]];
}

export function toLatLngArray(coords: [number, number][]): [number, number][] {
	return coords.map(toLatLng);
}
