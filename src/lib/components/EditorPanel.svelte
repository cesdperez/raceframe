<script lang="ts">
	import { onDestroy } from 'svelte';
	import { posterStore } from '../stores/poster.svelte.js';
	import {
		ROUTE_COLOR_OPTIONS,
		MAP_STYLES,
		MAP_FILTERS,
		DESIGN_PRESETS,
		BACKGROUND_PRESETS,
		ROUTE_COLORS
	} from '$lib/constants/themes';
	import { LAYOUTS, getAspectRatiosForLayout } from '$lib/constants/poster';
	import ExportButton from './ExportButton.svelte';

	const currentAspectRatios = $derived(getAspectRatiosForLayout(posterStore.data.layout));

	let qrCodeInputValue = $state(posterStore.data.qrCodeUrl ?? '');
	let qrDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	let customizeOpen = $state(false);

	// Dropdown states
	let mapStyleOpen = $state(false);
	let mapFilterOpen = $state(false);
	let qrStyleOpen = $state(false);

	const QR_STYLES = [
		{ value: 'rounded', label: 'Rounded' },
		{ value: 'dots', label: 'Dots' },
		{ value: 'classy', label: 'Classy' },
		{ value: 'square', label: 'Square' }
	] as const;

	onDestroy(() => {
		if (qrDebounceTimer) {
			clearTimeout(qrDebounceTimer);
		}
	});

	function handleQrCodeUrlChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		qrCodeInputValue = value;

		if (qrDebounceTimer) {
			clearTimeout(qrDebounceTimer);
		}

		qrDebounceTimer = setTimeout(() => {
			posterStore.setQrCodeUrl(value || null);
		}, 500);
	}

	function handleDateChange(e: Event) {
		const input = e.target as HTMLInputElement;
		posterStore.setDate(input.value ? new Date(input.value) : null);
	}

	function formatDateForInput(date: Date | null): string {
		if (!date) return '';
		return date.toISOString().split('T')[0];
	}

	function handleDistanceChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = parseFloat(input.value);
		if (!isNaN(value) && value >= 0) {
			posterStore.setDistance(value);
		}
	}

	function selectPreset(presetValue: import('$lib/types').DesignPreset) {
		posterStore.applyDesignPreset(presetValue);
		customizeOpen = false;
	}
</script>

<div class="flex h-full flex-col overflow-y-auto p-2 md:p-3">
	<!-- DATA SECTION -->
	<div class="mb-5">
		<h2 class="mb-3 text-sm font-bold text-gray-800">Data</h2>

		<section class="mb-4">
			<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Race Details</h3>
			<div class="space-y-2">
				<div>
					<label for="raceName" class="mb-0.5 block text-xs text-gray-500">Race Name</label>
					<input
						type="text"
						id="raceName"
						value={posterStore.data.raceName}
						oninput={(e) => posterStore.setRaceName((e.target as HTMLInputElement).value)}
						placeholder="e.g. Berlin Marathon"
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="date" class="mb-0.5 block text-xs text-gray-500">Date</label>
					<input
						type="date"
						id="date"
						value={formatDateForInput(posterStore.data.date)}
						onchange={handleDateChange}
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>
		</section>

		<section class="mb-4">
			<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Runner Info</h3>
			<div class="grid grid-cols-2 gap-2">
				<div>
					<label for="runnerName" class="mb-0.5 block text-xs text-gray-500">Name</label>
					<input
						type="text"
						id="runnerName"
						value={posterStore.data.runnerName}
						oninput={(e) => posterStore.setRunnerName((e.target as HTMLInputElement).value)}
						placeholder="John Doe"
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="bibNumber" class="mb-0.5 block text-xs text-gray-500">Bib</label>
					<input
						type="text"
						id="bibNumber"
						value={posterStore.data.bibNumber}
						oninput={(e) => posterStore.setBibNumber((e.target as HTMLInputElement).value)}
						placeholder="12345"
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>
		</section>

		<section class="mb-4">
			<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Performance</h3>
			<div class="space-y-2">
				<div>
					<label for="finishTime" class="mb-0.5 block text-xs text-gray-500">Finish Time</label>
					<input
						type="text"
						id="finishTime"
						value={posterStore.data.finishTime}
						oninput={(e) => posterStore.setFinishTime((e.target as HTMLInputElement).value)}
						placeholder="e.g. 3:45'22&quot;"
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="distance" class="mb-0.5 block text-xs text-gray-500">Distance</label>
					<div class="flex gap-2">
						<input
							type="number"
							id="distance"
							value={posterStore.data.distance}
							oninput={handleDistanceChange}
							step="0.1"
							min="0"
							class="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						/>
						<div class="flex rounded border border-gray-300" role="group">
							<button
								type="button"
								onclick={() => posterStore.setUnit('km')}
								class="px-2.5 py-1.5 text-xs font-bold transition-colors {posterStore.data.unit === 'km'
									? 'bg-blue-600 text-white'
									: 'bg-white text-gray-700 hover:bg-gray-50'} rounded-l"
							>
								KM
							</button>
							<button
								type="button"
								onclick={() => posterStore.setUnit('miles')}
								class="px-2.5 py-1.5 text-xs font-bold transition-colors {posterStore.data.unit === 'miles'
									? 'bg-blue-600 text-white'
									: 'bg-white text-gray-700 hover:bg-gray-50'} rounded-r border-l border-gray-300"
							>
								MI
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section>
			<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">QR Code</h3>
			<div class="space-y-2">
				<div>
					<label for="qrCodeUrl" class="mb-0.5 block text-xs text-gray-500">Activity URL</label>
					<input
						type="url"
						id="qrCodeUrl"
						value={qrCodeInputValue}
						oninput={handleQrCodeUrlChange}
						placeholder="Strava link..."
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div class="flex items-center gap-3">
					<div class="flex-1">
						<label for="qrDotStyle" class="mb-0.5 block text-xs text-gray-500">Style</label>
						<div class="relative">
							<button
								type="button"
								id="qr-style-select"
								onclick={() => qrStyleOpen = !qrStyleOpen}
								class="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
							>
								<span>{QR_STYLES.find(s => s.value === posterStore.data.qrDotStyle)?.label ?? 'Rounded'}</span>
								<svg class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4 4 4-4" />
								</svg>
							</button>
							{#if qrStyleOpen}
								<div class="absolute z-50 mt-1 w-full rounded border border-gray-200 bg-white py-1 shadow-lg">
									{#each QR_STYLES as style}
										<button
											type="button"
											onclick={() => { posterStore.setQrDotStyle(style.value); qrStyleOpen = false; }}
											class="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 {posterStore.data.qrDotStyle === style.value ? 'bg-blue-50 text-blue-700' : ''}"
										>
											<span class="font-medium">{style.label}</span>
										</button>
									{/each}
								</div>
							{/if}
						</div>
					</div>
					<div class="pt-4">
						<label class="flex cursor-pointer items-center gap-1.5 text-xs text-gray-600">
							<input
								type="checkbox"
								checked={posterStore.data.qrGradientEnabled}
								onchange={(e) => posterStore.setQrGradientEnabled((e.target as HTMLInputElement).checked)}
								class="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							Gradient
						</label>
					</div>
				</div>
			</div>
		</section>
	</div>

	<!-- DESIGN SECTION -->
	<div class="mb-5">
		<h2 class="mb-3 text-sm font-bold text-gray-800">Design</h2>

		<section class="mb-3">
			<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Presets</h3>
			<div class="grid grid-cols-3 gap-1.5">
				{#each DESIGN_PRESETS as preset}
					<button
						type="button"
						onclick={() => selectPreset(preset.value)}
						class="group relative flex flex-col items-center gap-1 rounded border-2 p-1.5 transition-all {posterStore.activePreset === preset.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}"
					>
						<div class="relative h-10 w-full overflow-hidden rounded" style="background-color: {preset.bgColor}">
							<svg class="absolute inset-0 h-full w-full p-1.5" viewBox="0 0 40 40">
								<rect x="3" y="3" width="34" height="20" rx="2" fill="{preset.mapStyle.includes('dark') ? '#374151' : '#e5e7eb'}" opacity="0.6" />
								<path d="M8 16 Q15 10 20 14 T32 12" stroke="{ROUTE_COLORS[preset.routeColor]}" stroke-width="2" fill="none" stroke-linecap="round"/>
								<rect x="3" y="26" width="18" height="2" rx="1" fill="{preset.textColor}" opacity="0.8" />
								<rect x="3" y="30" width="12" height="1.5" rx="0.75" fill="{preset.textColor}" opacity="0.4" />
								<rect x="3" y="34" width="8" height="1.5" rx="0.75" fill="{preset.textColor}" opacity="0.4" />
							</svg>
						</div>
						<span class="text-[9px] font-semibold uppercase {posterStore.activePreset === preset.value ? 'text-blue-700' : 'text-gray-500'}">{preset.label}</span>
						{#if posterStore.activePreset === preset.value}
							<div class="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-[8px] text-white">✓</div>
						{/if}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<button
				type="button"
				onclick={() => customizeOpen = !customizeOpen}
				class="mb-2 flex w-full items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-600"
			>
				<svg class="h-3 w-3 transition-transform {customizeOpen ? 'rotate-90' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
				<span>Customize</span>
			</button>

			{#if customizeOpen}
			<div class="space-y-2 pl-4">
				<div class="grid grid-cols-2 gap-2">
					<div>
						<span class="mb-0.5 block text-xs text-gray-500">Map Style</span>
						<div class="relative">
							<button
								type="button"
								id="map-style-select"
								onclick={() => mapStyleOpen = !mapStyleOpen}
								class="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
							>
								<span class="truncate text-xs">{MAP_STYLES.find(s => s.value === posterStore.data.mapStyle)?.label}</span>
								<svg class="h-3 w-3 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4 4 4-4" />
								</svg>
							</button>
							{#if mapStyleOpen}
								<div class="absolute z-50 mt-1 w-full rounded border border-gray-200 bg-white py-1 shadow-lg">
									{#each MAP_STYLES as style}
										<button
											type="button"
											onclick={() => { posterStore.setMapStyle(style.value); mapStyleOpen = false; }}
											class="flex w-full items-center px-2 py-1.5 text-xs hover:bg-gray-50 {posterStore.data.mapStyle === style.value ? 'bg-blue-50 text-blue-700' : ''}"
										>
											{style.label}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					</div>
					<div>
						<span class="mb-0.5 block text-xs text-gray-500">Map Filter</span>
						<div class="relative">
							<button
								type="button"
								id="map-filter-select"
								onclick={() => mapFilterOpen = !mapFilterOpen}
								class="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
							>
								<span class="truncate text-xs">{MAP_FILTERS.find(f => f.value === posterStore.data.mapFilter)?.label}</span>
								<svg class="h-3 w-3 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4 4 4-4" />
								</svg>
							</button>
							{#if mapFilterOpen}
								<div class="absolute z-50 mt-1 w-full rounded border border-gray-200 bg-white py-1 shadow-lg">
									{#each MAP_FILTERS as filter}
										<button
											type="button"
											onclick={() => { posterStore.setMapFilter(filter.value); mapFilterOpen = false; }}
											class="flex w-full items-center px-2 py-1.5 text-xs hover:bg-gray-50 {posterStore.data.mapFilter === filter.value ? 'bg-blue-50 text-blue-700' : ''}"
										>
											{filter.label}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>

				<div>
					<span class="mb-0.5 block text-xs text-gray-500">Background</span>
					<div class="flex flex-wrap items-center gap-1.5">
						{#each BACKGROUND_PRESETS as bgPreset}
							<button
								type="button"
								onclick={() => posterStore.setCustomBgColor(bgPreset.color)}
								class="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 {posterStore.data.customBgColor === bgPreset.color ? 'border-blue-600 scale-110' : 'border-gray-300'}"
								style="background-color: {bgPreset.color}"
								title={bgPreset.label}
							></button>
						{/each}
						<input
							type="color"
							id="customBgColor"
							value={posterStore.effectiveBgColor}
							oninput={(e) => posterStore.setCustomBgColor((e.target as HTMLInputElement).value)}
							class="h-5 w-6 cursor-pointer rounded border border-gray-300"
						/>
						<span class="text-[9px] font-mono text-gray-400 uppercase">{posterStore.effectiveBgColor}</span>
					</div>
				</div>

				<div>
					<span class="mb-0.5 block text-xs text-gray-500">Text</span>
					<div class="flex items-center gap-1.5">
						<input
							type="color"
							id="customTextColor"
							value={posterStore.effectiveTextColor}
							oninput={(e) => posterStore.setCustomTextColor((e.target as HTMLInputElement).value)}
							class="h-5 w-6 cursor-pointer rounded border border-gray-300"
						/>
						<span class="text-[9px] font-mono text-gray-400 uppercase">{posterStore.effectiveTextColor}</span>
						{#if posterStore.data.customTextColor}
							<button type="button" onclick={() => posterStore.setCustomTextColor(null)} class="text-[9px] text-blue-600 hover:underline">Reset</button>
						{/if}
					</div>
				</div>

				<div>
					<span class="mb-0.5 block text-xs text-gray-500">Route</span>
					<div class="flex flex-wrap items-center gap-1">
						{#each ROUTE_COLOR_OPTIONS as color}
							<button
								type="button"
								onclick={() => { posterStore.setRouteColor(color.value); posterStore.setCustomRouteColor(null); }}
								class="h-4 w-4 rounded-full border-2 transition-transform hover:scale-110 {posterStore.data.routeColor === color.value && !posterStore.data.customRouteColor ? 'border-blue-600 scale-110' : 'border-gray-300'}"
								style="background-color: {color.color}"
								title={color.label}
							></button>
						{/each}
						<input
							type="color"
							id="customRouteColor"
							value={posterStore.effectiveRouteColor}
							oninput={(e) => posterStore.setCustomRouteColor((e.target as HTMLInputElement).value)}
							class="h-4 w-5 cursor-pointer rounded border border-gray-300"
						/>
						{#if posterStore.data.customRouteColor}
							<button type="button" onclick={() => posterStore.setCustomRouteColor(null)} class="text-[9px] text-blue-600 hover:underline">Reset</button>
						{/if}
					</div>
				</div>
			</div>
			{/if}
		</section>
	</div>

	<!-- SIZE SECTION -->
	<div class="mb-5">
		<h2 class="mb-3 text-sm font-bold text-gray-800">Size & Ratio</h2>

		<section class="mb-3">
			<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Layout</h3>
			<div class="grid grid-cols-2 gap-1.5">
				{#each LAYOUTS as layout}
					<button
						type="button"
						onclick={() => posterStore.setLayout(layout.value)}
						class="flex flex-col items-center gap-0.5 rounded border-2 p-1.5 transition-colors {posterStore.data.layout === layout.value
							? 'border-blue-600 bg-blue-50'
							: 'border-gray-200 hover:border-gray-300'}"
					>
						<span class="text-xs font-semibold text-gray-700">{layout.label}</span>
						<span class="text-[10px] text-gray-400">{layout.orientation}</span>
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Aspect Ratio</h3>
			<div class="grid grid-cols-2 gap-1.5">
				{#each currentAspectRatios as ratio}
					<button
						type="button"
						onclick={() => posterStore.setAspectRatio(ratio.value)}
						class="flex flex-col items-center gap-0.5 rounded border-2 p-1.5 transition-colors {posterStore.data.aspectRatio === ratio.value
							? 'border-blue-600 bg-blue-50'
							: 'border-gray-200 hover:border-gray-300'}"
					>
						<span class="text-xs font-semibold text-gray-700">{ratio.label}</span>
						<span class="text-[10px] text-gray-400">{ratio.printSize}</span>
					</button>
				{/each}
			</div>
		</section>
	</div>

	<!-- EXPORT CTA -->
	<section class="mt-auto border-t border-gray-100 bg-white pt-3">
		<ExportButton raceName={posterStore.data.raceName} date={posterStore.data.date} />
	</section>
</div>
