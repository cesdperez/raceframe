<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Map, TileLayer, Polyline, CircleMarker } from 'leaflet';
	import { posterStore } from '$lib/stores/poster.svelte';
	import {
		TILE_URLS,
		TILE_ATTRIBUTION,
		THEME_TO_TILES,
		ROUTE_COLORS,
		START_MARKER_COLOR,
		toLatLngArray
	} from '$lib/utils/map';
	import LoadingSpinner from './LoadingSpinner.svelte';

	let mapContainer: HTMLDivElement;
	let map: Map | null = null;
	let tileLayer: TileLayer | null = null;
	let routePolyline: Polyline | null = null;
	let startMarker: CircleMarker | null = null;
	let finishMarker: CircleMarker | null = null;
	let L: typeof import('leaflet') | null = null;

	let loading = $state(true);

	function getTileUrl(): string {
		const tileType = THEME_TO_TILES[posterStore.data.theme];
		return TILE_URLS[tileType];
	}

	function getRouteColor(): string {
		return ROUTE_COLORS[posterStore.data.routeColor];
	}

	function initializeMap() {
		if (!L || !mapContainer) return;

		map = L.map(mapContainer, {
			zoomControl: false,
			dragging: false,
			touchZoom: false,
			scrollWheelZoom: false,
			doubleClickZoom: false,
			boxZoom: false,
			keyboard: false,
			attributionControl: false
		});

		tileLayer = L.tileLayer(getTileUrl(), {
			attribution: TILE_ATTRIBUTION,
			maxZoom: 19
		}).addTo(map);

		tileLayer.on('load', () => {
			loading = false;
		});

		tileLayer.on('loading', () => {
			loading = true;
		});

		renderRoute();
	}

	function renderRoute() {
		if (!L || !map) return;

		const coords = posterStore.data.gpxData?.coordinates;
		if (!coords || coords.length === 0) return;

		const latLngCoords = toLatLngArray(coords);

		if (routePolyline) {
			routePolyline.remove();
		}
		routePolyline = L.polyline(latLngCoords, {
			color: getRouteColor(),
			weight: 4,
			opacity: 1
		}).addTo(map);

		if (startMarker) {
			startMarker.remove();
		}
		startMarker = L.circleMarker(latLngCoords[0], {
			radius: 8,
			fillColor: START_MARKER_COLOR,
			fillOpacity: 1,
			color: '#ffffff',
			weight: 2
		}).addTo(map);

		if (finishMarker) {
			finishMarker.remove();
		}
		finishMarker = L.circleMarker(latLngCoords[latLngCoords.length - 1], {
			radius: 8,
			fillColor: getRouteColor(),
			fillOpacity: 1,
			color: '#ffffff',
			weight: 2
		}).addTo(map);

		const bounds = routePolyline.getBounds();
		map.fitBounds(bounds, { padding: [20, 20] });
	}

	function updateTileLayer() {
		if (!L || !map || !tileLayer) return;

		const newUrl = getTileUrl();
		tileLayer.setUrl(newUrl);
	}

	function updateRouteStyle() {
		if (!routePolyline || !finishMarker) return;

		const color = getRouteColor();
		routePolyline.setStyle({ color });
		finishMarker.setStyle({ fillColor: color });
	}

	onMount(async () => {
		L = await import('leaflet');
		initializeMap();
	});

	onDestroy(() => {
		map?.remove();
		map = null;
		tileLayer = null;
		routePolyline = null;
		startMarker = null;
		finishMarker = null;
	});

	$effect(() => {
		const _ = posterStore.data.theme;
		updateTileLayer();
	});

	$effect(() => {
		const _ = posterStore.data.routeColor;
		updateRouteStyle();
	});

	$effect(() => {
		const _ = posterStore.data.gpxData;
		if (map) {
			renderRoute();
		}
	});
</script>

<div class="poster-map" bind:this={mapContainer}>
	{#if loading}
		<div class="loading-overlay">
			<div class="loading-content">
				<LoadingSpinner size="md" class="text-[var(--color-text)] opacity-60" />
				<span class="loading-text">Loading map tiles...</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.poster-map {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.loading-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(128, 128, 128, 0.1);
		z-index: 1000;
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.loading-text {
		font-family: var(--font-body);
		color: var(--color-text);
		font-size: 0.75rem;
		opacity: 0.6;
	}
</style>
