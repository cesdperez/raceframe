<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Map, TileLayer, Polyline, CircleMarker } from 'leaflet';
	import { posterStore } from '$lib/stores/poster.svelte';
	import { exportReadyStore } from '$lib/stores/export-ready.svelte';
	import {
		getTileUrlForStyle,
		getAttributionForStyle,
		START_MARKER_COLOR,
		toLatLngArray
	} from '$lib/utils/map';
	import { getMapFilterConfig } from '$lib/constants/themes';
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
		return getTileUrlForStyle(posterStore.data.mapStyle);
	}

	function getTileAttribution(): string {
		return getAttributionForStyle(posterStore.data.mapStyle);
	}

	function getRouteColor(): string {
		return posterStore.effectiveRouteColor;
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
			attribution: getTileAttribution(),
			maxZoom: 19
		}).addTo(map);

		tileLayer.on('load', () => {
			loading = false;
			exportReadyStore.setMapReady(true);
			updateMapFilter();
		});

		tileLayer.on('loading', () => {
			loading = true;
			exportReadyStore.setMapReady(false);
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

	function updateMapFilter() {
		if (!tileLayer) return;

		const filterConfig = getMapFilterConfig(posterStore.data.mapFilter);
		const container = tileLayer.getContainer();
		if (container) {
			container.style.filter = filterConfig.css === 'none' ? '' : filterConfig.css;
		}
	}

	let resizeObserver: ResizeObserver | null = null;
	let lastWidth = 0;
	let lastHeight = 0;
	let resizeDebounceTimer: ReturnType<typeof setTimeout> | null = null;

	function invalidateMapSize(refitBounds = true) {
		if (!map || !routePolyline) return;

		map.invalidateSize();

		if (refitBounds) {
			const bounds = routePolyline.getBounds();
			if (bounds.isValid()) {
				map.fitBounds(bounds, { padding: [20, 20] });
			}
		}
	}

	function handleResize(entries: ResizeObserverEntry[]) {
		const entry = entries[0];
		if (!entry) return;

		const { width, height } = entry.contentRect;
		const widthDiff = Math.abs(width - lastWidth);
		const heightDiff = Math.abs(height - lastHeight);

		// Only react to significant size changes (> 5px)
		if (widthDiff < 5 && heightDiff < 5) return;

		lastWidth = width;
		lastHeight = height;

		// Debounce to avoid rapid recalculations
		if (resizeDebounceTimer) {
			clearTimeout(resizeDebounceTimer);
		}
		resizeDebounceTimer = setTimeout(() => {
			invalidateMapSize(true);
		}, 100);
	}

	onMount(async () => {
		L = await import('leaflet');
		initializeMap();

		resizeObserver = new ResizeObserver(handleResize);

		if (mapContainer) {
			const rect = mapContainer.getBoundingClientRect();
			lastWidth = rect.width;
			lastHeight = rect.height;
			resizeObserver.observe(mapContainer);
		}
	});

	onDestroy(() => {
		if (resizeDebounceTimer) {
			clearTimeout(resizeDebounceTimer);
		}
		resizeObserver?.disconnect();
		resizeObserver = null;
		map?.remove();
		map = null;
		tileLayer = null;
		routePolyline = null;
		startMarker = null;
		finishMarker = null;
	});

	$effect(() => {
		const _ = posterStore.data.mapStyle;
		updateTileLayer();
	});

	$effect(() => {
		const _ = posterStore.data.mapFilter;
		updateMapFilter();
	});

	$effect(() => {
		const _ = posterStore.data.routeColor;
		const __ = posterStore.data.customRouteColor;
		updateRouteStyle();
	});

	$effect(() => {
		const _ = posterStore.data.gpxData;
		if (map) {
			renderRoute();
		}
	});

	$effect(() => {
		const _ = posterStore.data.aspectRatio;
		setTimeout(() => {
			invalidateMapSize();
		}, 50);
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
