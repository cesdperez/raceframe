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

<div class="flex h-full flex-col overflow-y-auto p-3 md:p-4">
	<!-- DATA SECTION -->
	<div class="mb-8">
		<h2 class="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Data</h2>
		
		<section class="mb-6 space-y-4">
			<h3 class="text-sm font-semibold text-gray-700">Race Details</h3>
			<div class="space-y-3">
				<div>
					<label for="raceName" class="mb-1 block text-xs font-medium text-gray-500">Race Name</label>
					<input
						type="text"
						id="raceName"
						value={posterStore.data.raceName}
						oninput={(e) => posterStore.setRaceName((e.target as HTMLInputElement).value)}
						placeholder="e.g. Berlin Marathon"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="date" class="mb-1 block text-xs font-medium text-gray-500">Date</label>
					<input
						type="date"
						id="date"
						value={formatDateForInput(posterStore.data.date)}
						onchange={handleDateChange}
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>
		</section>

		<section class="mb-6 space-y-4">
			<h3 class="text-sm font-semibold text-gray-700">Runner Info</h3>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="runnerName" class="mb-1 block text-xs font-medium text-gray-500">Name</label>
					<input
						type="text"
						id="runnerName"
						value={posterStore.data.runnerName}
						oninput={(e) => posterStore.setRunnerName((e.target as HTMLInputElement).value)}
						placeholder="John Doe"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="bibNumber" class="mb-1 block text-xs font-medium text-gray-500">Bib</label>
					<input
						type="text"
						id="bibNumber"
						value={posterStore.data.bibNumber}
						oninput={(e) => posterStore.setBibNumber((e.target as HTMLInputElement).value)}
						placeholder="12345"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>
		</section>

		<section class="mb-6 space-y-4">
			<h3 class="text-sm font-semibold text-gray-700">Performance</h3>
			<div class="space-y-3">
				<div>
					<label for="finishTime" class="mb-1 block text-xs font-medium text-gray-500">Finish Time</label>
					<input
						type="text"
						id="finishTime"
						value={posterStore.data.finishTime}
						oninput={(e) => posterStore.setFinishTime((e.target as HTMLInputElement).value)}
						placeholder="e.g. 3:45'22&quot;"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="distance" class="mb-1 block text-xs font-medium text-gray-500">Distance</label>
					<div class="flex gap-2">
						<input
							type="number"
							id="distance"
							value={posterStore.data.distance}
							oninput={handleDistanceChange}
							step="0.1"
							min="0"
							class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						/>
						<div class="flex rounded-md border border-gray-300" role="group">
							<button
								type="button"
								onclick={() => posterStore.setUnit('km')}
								class="px-3 py-2 text-xs font-bold transition-colors {posterStore.data.unit === 'km'
									? 'bg-blue-600 text-white'
									: 'bg-white text-gray-700 hover:bg-gray-50'} rounded-l-md"
							>
								KM
							</button>
							<button
								type="button"
								onclick={() => posterStore.setUnit('miles')}
								class="px-3 py-2 text-xs font-bold transition-colors {posterStore.data.unit === 'miles'
									? 'bg-blue-600 text-white'
									: 'bg-white text-gray-700 hover:bg-gray-50'} rounded-r-md border-l border-gray-300"
							>
								MI
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="space-y-4">
			<h3 class="text-sm font-semibold text-gray-700">QR Code</h3>
			<div class="space-y-3">
				<div>
					<label for="qrCodeUrl" class="mb-1 block text-xs font-medium text-gray-500">Activity URL</label>
					<input
						type="url"
						id="qrCodeUrl"
						value={qrCodeInputValue}
						oninput={handleQrCodeUrlChange}
						placeholder="Strava link..."
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
				<div class="flex items-center justify-between gap-4">
					<div class="flex-1">
						<label for="qrDotStyle" class="mb-1 block text-xs font-medium text-gray-500">Style</label>
						<select
							id="qrDotStyle"
							value={posterStore.data.qrDotStyle}
							onchange={(e) => posterStore.setQrDotStyle((e.target as HTMLSelectElement).value as any)}
							class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
						>
							<option value="rounded">Rounded</option>
							<option value="dots">Dots</option>
							<option value="classy">Classy</option>
							<option value="square">Square</option>
						</select>
					</div>
					<div class="pt-5">
						<label class="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-600">
							<input
								type="checkbox"
								checked={posterStore.data.qrGradientEnabled}
								onchange={(e) => posterStore.setQrGradientEnabled((e.target as HTMLInputElement).checked)}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							Gradient
						</label>
					</div>
				</div>
			</div>
		</section>
	</div>

	<!-- DESIGN SECTION -->
	<div class="mb-8">
		<h2 class="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Design</h2>
		
		<div class="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
			{#each DESIGN_PRESETS as preset}
				<button
					type="button"
					onclick={() => selectPreset(preset.value)}
					class="group relative flex flex-col items-center gap-2 rounded-lg border-2 p-2 transition-all {posterStore.activePreset === preset.value ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}"
				>
					<div class="relative h-12 w-full overflow-hidden rounded-md border border-gray-200">
						{#if preset.previewImage}
							<img src={preset.previewImage} alt={preset.label} class="h-full w-full object-cover" />
						{:else}
							<!-- Fallback if image fails to load or is not provided -->
							<div class="h-full w-full" style="background-color: {preset.bgColor}">
								<div class="absolute inset-0 flex items-center justify-center opacity-20">
									<svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1L9 3L3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1l5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>
								</div>
								<div class="absolute bottom-2 left-2 right-2 h-0.5 rounded-full" style="background-color: {ROUTE_COLORS[preset.routeColor]}"></div>
							</div>
						{/if}
					</div>
					<span class="text-[10px] font-bold uppercase tracking-tight {posterStore.activePreset === preset.value ? 'text-blue-700' : 'text-gray-600'}">{preset.label}</span>
					{#if posterStore.activePreset === preset.value}
						<div class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
							✓
						</div>
					{/if}
				</button>
			{/each}
		</div>

		<details class="group overflow-hidden rounded-lg border border-gray-200 bg-white" bind:open={customizeOpen}>
			<summary class="flex cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100">
				<span>Customize Style</span>
				<svg class="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</summary>
			
			<div class="space-y-6 p-4">
				<!-- Map Style -->
				<div>
					<span class="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">Map Style</span>
					<div class="relative">
						<button 
							type="button"
							id="map-style-select"
							onclick={() => mapStyleOpen = !mapStyleOpen}
							class="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
						>
							<div class="flex items-center gap-3">
								<div class="h-6 w-6 rounded bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-100">
									{#if MAP_STYLES.find(s => s.value === posterStore.data.mapStyle)?.previewImage}
										<img src={MAP_STYLES.find(s => s.value === posterStore.data.mapStyle)?.previewImage} alt="" class="h-full w-full object-cover" />
									{:else if MAP_STYLES.find(s => s.value === posterStore.data.mapStyle)?.brightness === 'dark'}
										<div class="h-full w-full bg-gray-800"></div>
									{:else}
										<div class="h-full w-full bg-gray-100"></div>
									{/if}
								</div>
								<span>{MAP_STYLES.find(s => s.value === posterStore.data.mapStyle)?.label}</span>
							</div>
							<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4 4 4-4" />
							</svg>
						</button>
						
						{#if mapStyleOpen}
							<div class="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
								{#each MAP_STYLES as style}
									<button
										type="button"
										onclick={() => { posterStore.setMapStyle(style.value); mapStyleOpen = false; }}
										class="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 {posterStore.data.mapStyle === style.value ? 'bg-blue-50 text-blue-700' : ''}"
									>
										<div class="h-8 w-8 flex-shrink-0 rounded bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-100">
											{#if style.previewImage}
												<img src={style.previewImage} alt="" class="h-full w-full object-cover" />
											{:else if style.brightness === 'dark'}
												<div class="h-full w-full bg-gray-800"></div>
											{:else}
												<div class="h-full w-full bg-gray-100"></div>
											{/if}
										</div>
										<div class="text-left">
											<div class="font-medium">{style.label}</div>
											<div class="text-[10px] text-gray-400">{style.description}</div>
										</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- Map Filter -->
				<div>
					<span class="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">Map Filter</span>
					<div class="relative">
						<button 
							type="button"
							id="map-filter-select"
							onclick={() => mapFilterOpen = !mapFilterOpen}
							class="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
						>
							<div class="flex items-center gap-3">
								<div class="h-6 w-6 overflow-hidden rounded bg-gray-200 border border-gray-100">
									{#if MAP_FILTERS.find(f => f.value === posterStore.data.mapFilter)?.previewImage}
										<img src={MAP_FILTERS.find(f => f.value === posterStore.data.mapFilter)?.previewImage} alt="" class="h-full w-full object-cover" />
									{:else}
										<div class="h-full w-full bg-gray-400" style="filter: {MAP_FILTERS.find(f => f.value === posterStore.data.mapFilter)?.css}"></div>
									{/if}
								</div>
								<span>{MAP_FILTERS.find(f => f.value === posterStore.data.mapFilter)?.label}</span>
							</div>
							<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4 4 4-4" />
							</svg>
						</button>
						
						{#if mapFilterOpen}
							<div class="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
								{#each MAP_FILTERS as filter}
									<button
										type="button"
										onclick={() => { posterStore.setMapFilter(filter.value); mapFilterOpen = false; }}
										class="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 {posterStore.data.mapFilter === filter.value ? 'bg-blue-50 text-blue-700' : ''}"
									>
										<div class="h-8 w-8 flex-shrink-0 overflow-hidden rounded bg-gray-400 border border-gray-300">
											{#if filter.previewImage}
												<img src={filter.previewImage} alt="" class="h-full w-full object-cover" />
											{:else}
												<div class="h-full w-full bg-gray-400" style="filter: {filter.css}"></div>
											{/if}
										</div>
										<div class="text-left">
											<div class="font-medium">{filter.label}</div>
											<div class="text-[10px] text-gray-400">{filter.description}</div>
										</div>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- Colors -->
				<div class="space-y-4 pt-2">
					<div>
						<span class="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">Background</span>
						<div class="flex flex-wrap items-center gap-3">
							<div class="flex gap-2">
								{#each BACKGROUND_PRESETS as preset}
									<button
										type="button"
										onclick={() => posterStore.setCustomBgColor(preset.color)}
										class="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 {posterStore.data.customBgColor === preset.color ? 'border-blue-600 scale-110 shadow-sm' : 'border-gray-200'}"
										style="background-color: {preset.color}"
										title={preset.label}
									></button>
								{/each}
							</div>
							<div class="h-6 w-px bg-gray-200"></div>
							<div class="flex items-center gap-2">
								<label for="customBgColor" class="sr-only">Custom Background Color</label>
								<input
									type="color"
									id="customBgColor"
									value={posterStore.effectiveBgColor}
									oninput={(e) => posterStore.setCustomBgColor((e.target as HTMLInputElement).value)}
									class="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
								/>
								<span class="text-[10px] font-mono text-gray-400 uppercase">{posterStore.effectiveBgColor}</span>
							</div>
						</div>
					</div>

					<div>
						<span class="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">Text Color</span>
						<div class="flex items-center gap-3">
							<label for="customTextColor" class="sr-only">Custom Text Color</label>
							<input
								type="color"
								id="customTextColor"
								value={posterStore.effectiveTextColor}
								oninput={(e) => posterStore.setCustomTextColor((e.target as HTMLInputElement).value)}
								class="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
							/>
							<span class="text-[10px] font-mono text-gray-400 uppercase">{posterStore.effectiveTextColor}</span>
							{#if posterStore.data.customTextColor}
								<button
									type="button"
									onclick={() => posterStore.setCustomTextColor(null)}
									class="text-[10px] font-bold text-blue-600 hover:underline"
								>
									RESET
								</button>
							{/if}
						</div>
					</div>

					<div>
						<span class="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">Route Color</span>
						<div class="mb-3 flex flex-wrap gap-2">
							{#each ROUTE_COLOR_OPTIONS as color}
								<button
									type="button"
									onclick={() => {
										posterStore.setRouteColor(color.value);
										posterStore.setCustomRouteColor(null);
									}}
									class="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 {posterStore.data.routeColor === color.value && !posterStore.data.customRouteColor ? 'border-blue-600 scale-110 shadow-sm' : 'border-gray-200'}"
									style="background-color: {color.color}"
									title={color.label}
								></button>
							{/each}
						</div>
						<div class="flex items-center gap-2">
							<label for="customRouteColor" class="sr-only">Custom Route Color</label>
							<input
								type="color"
								id="customRouteColor"
								value={posterStore.effectiveRouteColor}
								oninput={(e) => posterStore.setCustomRouteColor((e.target as HTMLInputElement).value)}
								class="h-6 w-8 cursor-pointer rounded border border-gray-300 p-0.5"
							/>
							<span class="text-[10px] font-mono text-gray-400 uppercase">{posterStore.effectiveRouteColor}</span>
							{#if posterStore.data.customRouteColor}
								<button
									type="button"
									onclick={() => posterStore.setCustomRouteColor(null)}
									class="text-[10px] font-bold text-blue-600 hover:underline"
								>
									RESET
								</button>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</details>
	</div>

	<!-- SIZE SECTION -->
	<div class="mb-8">
		<h2 class="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Size & Ratio</h2>
		
		<section class="mb-6 space-y-4">
			<h3 class="text-sm font-semibold text-gray-700">Layout</h3>
			<div class="grid grid-cols-2 gap-2">
				{#each LAYOUTS as layout}
					<button
						type="button"
						onclick={() => posterStore.setLayout(layout.value)}
						class="flex flex-col items-center gap-1 rounded-md border-2 p-2 transition-colors {posterStore.data.layout === layout.value
							? 'border-blue-600 bg-white shadow-sm'
							: 'border-gray-200 hover:border-gray-300'}"
					>
						<span class="text-xs font-bold text-gray-700">{layout.label}</span>
						<span class="text-[10px] uppercase text-gray-400">{layout.orientation}</span>
					</button>
				{/each}
			</div>
		</section>

		<section class="space-y-4">
			<h3 class="text-sm font-semibold text-gray-700">Aspect Ratio</h3>
			<div class="grid grid-cols-2 gap-2">
				{#each currentAspectRatios as ratio}
					<button
						type="button"
						onclick={() => posterStore.setAspectRatio(ratio.value)}
						class="flex flex-col items-center gap-1 rounded-md border-2 p-2 transition-colors {posterStore.data.aspectRatio === ratio.value
							? 'border-blue-600 bg-white shadow-sm'
							: 'border-gray-200 hover:border-gray-300'}"
					>
						<span class="text-xs font-bold text-gray-700">{ratio.label}</span>
						<span class="text-[10px] text-gray-400">{ratio.printSize}</span>
					</button>
				{/each}
			</div>
		</section>
	</div>

	<!-- EXPORT CTA -->
	<section class="mt-auto border-t border-gray-100 bg-white py-4">
		<ExportButton raceName={posterStore.data.raceName} date={posterStore.data.date} />
	</section>
</div>
