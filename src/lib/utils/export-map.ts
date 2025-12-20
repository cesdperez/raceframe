import type { Map, TileLayer, Polyline, CircleMarker } from 'leaflet';
import type { ExportScale } from './export.js';
import { posterStore } from '$lib/stores/poster.svelte.js';
import { getTileUrlForStyle, getAttributionForStyle, START_MARKER_COLOR, toLatLngArray } from './map.js';
import { getMapFilterConfig } from '$lib/constants/themes.js';

export interface ExportMapOptions {
	container: HTMLElement;
	scale: ExportScale;
	onProgress?: (message: string) => void;
}

export interface ExportMapResult {
	cleanup: () => void;
}

const TILE_LOAD_TIMEOUT = 15000;

export async function renderExportMap(options: ExportMapOptions): Promise<ExportMapResult> {
	const { container, scale, onProgress } = options;

	onProgress?.('Loading map library...');
	const L = await import('leaflet');

	const mapContainer = container.querySelector('.poster-map') as HTMLElement;
	if (!mapContainer) {
		throw new Error('Map container not found in export element');
	}

	const baseMapWidth = mapContainer.offsetWidth;
	const baseMapHeight = mapContainer.offsetHeight;

	if (baseMapWidth === 0 || baseMapHeight === 0) {
		throw new Error(
			`Map container has zero dimensions: ${baseMapWidth}x${baseMapHeight}. ` +
			`Ensure the container is visible and has explicit dimensions before export.`
		);
	}

	const mapWidth = baseMapWidth * scale;
	const mapHeight = baseMapHeight * scale;

	mapContainer.innerHTML = '';
	mapContainer.style.width = `${mapWidth}px`;
	mapContainer.style.height = `${mapHeight}px`;
	mapContainer.style.transform = `scale(${1 / scale})`;
	mapContainer.style.transformOrigin = 'top left';

	const map = L.map(mapContainer, {
		zoomControl: false,
		dragging: false,
		touchZoom: false,
		scrollWheelZoom: false,
		doubleClickZoom: false,
		boxZoom: false,
		keyboard: false,
		attributionControl: false
	});

	onProgress?.('Loading map tiles...');

	const tileLayer = L.tileLayer(getTileUrlForStyle(posterStore.data.mapStyle), {
		attribution: getAttributionForStyle(posterStore.data.mapStyle),
		maxZoom: 19
	}).addTo(map);

	const routeElements = renderRouteOnMap(L, map, scale);

	await waitForTiles(tileLayer);

	const filterConfig = getMapFilterConfig(posterStore.data.mapFilter);
	const tileContainer = tileLayer.getContainer();
	if (tileContainer && filterConfig.css !== 'none') {
		tileContainer.style.filter = filterConfig.css;
	}

	onProgress?.('Finalizing map...');
	await new Promise((resolve) => requestAnimationFrame(resolve));
	await new Promise((resolve) => setTimeout(resolve, 200));

	return {
		cleanup: () => {
			routeElements.forEach((el) => el.remove());
			map.remove();
		}
	};
}

function waitForTiles(tileLayer: TileLayer): Promise<void> {
	return new Promise((resolve) => {
		let resolved = false;

		const timeout = setTimeout(() => {
			if (!resolved) {
				resolved = true;
				resolve();
			}
		}, TILE_LOAD_TIMEOUT);

		const onLoad = () => {
			if (!resolved) {
				resolved = true;
				clearTimeout(timeout);
				tileLayer.off('load', onLoad);
				tileLayer.off('tileerror', onError);
				resolve();
			}
		};

		const onError = () => {
			// Continue even if some tiles fail
		};

		tileLayer.on('load', onLoad);
		tileLayer.on('tileerror', onError);

		// Check if already loaded
		// @ts-expect-error - accessing internal Leaflet property
		if (tileLayer._loading === false) {
			onLoad();
		}
	});
}

function renderRouteOnMap(
	L: typeof import('leaflet'),
	map: Map,
	scale: ExportScale
): (Polyline | CircleMarker)[] {
	const elements: (Polyline | CircleMarker)[] = [];
	const coords = posterStore.data.gpxData?.coordinates;
	if (!coords || coords.length === 0) return elements;

	const latLngCoords = toLatLngArray(coords);

	const routeWeight = 6 * scale;
	const markerRadius = 8 * scale;
	const markerWeight = 2 * scale;
	const padding = 20 * scale;

	const routePolyline = L.polyline(latLngCoords, {
		color: posterStore.effectiveRouteColor,
		weight: routeWeight,
		opacity: 1
	}).addTo(map);
	elements.push(routePolyline);

	const startMarker = L.circleMarker(latLngCoords[0], {
		radius: markerRadius,
		fillColor: START_MARKER_COLOR,
		fillOpacity: 1,
		color: '#ffffff',
		weight: markerWeight
	}).addTo(map);
	elements.push(startMarker);

	const finishMarker = L.circleMarker(latLngCoords[latLngCoords.length - 1], {
		radius: markerRadius,
		fillColor: posterStore.effectiveRouteColor,
		fillOpacity: 1,
		color: '#ffffff',
		weight: markerWeight
	}).addTo(map);
	elements.push(finishMarker);

	const bounds = routePolyline.getBounds();
	map.fitBounds(bounds, { padding: [padding, padding] });

	return elements;
}
