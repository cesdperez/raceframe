<script lang="ts">
	import { onDestroy } from 'svelte';
	import { posterStore } from '../stores/poster.svelte.js';
	import Dropdown from './Dropdown.svelte';
	import {
		MAP_STYLES,
		MAP_FILTERS,
		DESIGN_PRESETS,
		BW_COLOR_PRESETS,
		ROUTE_COLORS
	} from '$lib/constants/themes';
	import type { ActivityType, RouteColor, QrDotStyle, MapStyle, MapFilter } from '$lib/types';

	const ACTIVITY_TYPES = [
		{ value: 'running', label: 'Running' },
		{ value: 'cycling', label: 'Cycling' }
	] as const;

	const ROUTE_COLOR_PRESETS: { value: RouteColor; label: string; color: string }[] = [
		{ value: 'orange', label: 'Orange', color: ROUTE_COLORS.orange },
		{ value: 'blue', label: 'Blue', color: ROUTE_COLORS.blue },
		{ value: 'yellow', label: 'Yellow', color: ROUTE_COLORS.yellow },
		{ value: 'cyan', label: 'Cyan', color: ROUTE_COLORS.cyan },
		{ value: 'pink', label: 'Pink', color: ROUTE_COLORS.pink },
		{ value: 'red', label: 'Red', color: ROUTE_COLORS.red },
		{ value: 'black', label: 'Black', color: ROUTE_COLORS.black },
		{ value: 'white', label: 'White', color: ROUTE_COLORS.white }
	];
	import { LAYOUTS, getAspectRatiosForLayout } from '$lib/constants/poster';
	import ExportButton from './ExportButton.svelte';
	import Tooltip from './Tooltip.svelte';

	const currentAspectRatios = $derived(getAspectRatiosForLayout(posterStore.data.layout));

	const availableMapStyles = $derived(
		posterStore.isDemo
			? MAP_STYLES.filter((s) => posterStore.isMapStyleAllowedInDemo(s.value))
			: MAP_STYLES
	);

	let qrCodeInputValue = $state(posterStore.data.qrCodeUrl ?? '');
	let qrDebounceTimer: ReturnType<typeof setTimeout> | null = null;

	const QR_STYLES = [
		{ value: 'rounded', label: 'Rounded' },
		{ value: 'dots', label: 'Dots' },
		{ value: 'classy', label: 'Classy' },
		{ value: 'classy-rounded', label: 'Classy Rounded' },
		{ value: 'square', label: 'Square' },
		{ value: 'extra-rounded', label: 'Extra Rounded' }
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
	}
</script>

<div class="flex h-full flex-col overflow-y-auto p-2 md:p-3">
	{#if posterStore.isDemo}
		<div class="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3" role="status">
			<p class="text-sm font-medium text-amber-800">Demo Mode</p>
			<p class="mt-1 text-xs text-amber-700">
				Some map styles and export are disabled. Upload a GPX file to unlock all features.
			</p>
		</div>
	{/if}

	<!-- DATA SECTION -->
	<div class="mb-5">
		<h2 class="mb-3 text-sm font-bold text-text-primary">Data</h2>

		<section class="mb-4">
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Event Details</h3>
			<div class="space-y-2">
				<div>
					<label for="activityType" class="mb-0.5 block text-xs text-text-secondary">Activity Type</label>
					<Dropdown
						id="activityType"
						options={ACTIVITY_TYPES}
						value={posterStore.data.activityType}
						onchange={(v) => posterStore.setActivityType(v as ActivityType)}
					/>
				</div>
				<div>
					<label for="eventName" class="mb-0.5 block text-xs text-text-secondary">Event Name</label>
					<input
						type="text"
						id="eventName"
						value={posterStore.data.eventName}
						oninput={(e) => posterStore.setEventName((e.target as HTMLInputElement).value)}
						placeholder="e.g. Berlin Marathon"
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
					/>
				</div>
				<div>
					<label for="date" class="mb-0.5 block text-xs text-text-secondary">Date</label>
					<input
						type="date"
						id="date"
						value={formatDateForInput(posterStore.data.date)}
						onchange={handleDateChange}
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
					/>
				</div>
			</div>
		</section>

		<section class="mb-4">
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Athlete Info</h3>
			<div class="grid grid-cols-2 gap-2">
				<div>
					<label for="athleteName" class="mb-0.5 block text-xs text-text-secondary">Name</label>
					<input
						type="text"
						id="athleteName"
						value={posterStore.data.athleteName}
						oninput={(e) => posterStore.setAthleteName((e.target as HTMLInputElement).value)}
						placeholder="John Doe"
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
					/>
				</div>
				<div>
					<label for="bibNumber" class="mb-0.5 block text-xs text-text-secondary">Bib</label>
					<input
						type="text"
						id="bibNumber"
						value={posterStore.data.bibNumber}
						oninput={(e) => posterStore.setBibNumber((e.target as HTMLInputElement).value)}
						placeholder="12345"
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
					/>
				</div>
			</div>
		</section>

		<section class="mb-4">
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Performance</h3>
			<div class="space-y-2">
				<div>
					<label for="finishTime" class="mb-0.5 block text-xs text-text-secondary">Finish Time</label>
					<input
						type="text"
						id="finishTime"
						value={posterStore.data.finishTime}
						oninput={(e) => posterStore.setFinishTime((e.target as HTMLInputElement).value)}
						placeholder="e.g. 3:45'22&quot;"
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
					/>
				</div>
				<div>
					<label for="distance" class="mb-0.5 block text-xs text-text-secondary">Distance</label>
					<div class="flex gap-2">
						<input
							type="number"
							id="distance"
							value={posterStore.data.distance}
							oninput={handleDistanceChange}
							step="0.1"
							min="0"
							class="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
						/>
						<div class="flex rounded border border-gray-300">
							<button
								type="button"
								onclick={() => posterStore.setUnit('km')}
								class="px-2.5 py-1.5 text-xs font-bold transition-colors {posterStore.data.unit === 'km'
									? 'bg-brand-primary text-white'
									: 'bg-white text-text-secondary hover:bg-gray-50'} rounded-l"
								aria-pressed={posterStore.data.unit === 'km'}
							>
								KM
							</button>
							<button
								type="button"
								onclick={() => posterStore.setUnit('miles')}
								class="px-2.5 py-1.5 text-xs font-bold transition-colors {posterStore.data.unit === 'miles'
									? 'bg-brand-primary text-white'
									: 'bg-white text-text-secondary hover:bg-gray-50'} rounded-r border-l border-gray-300"
								aria-pressed={posterStore.data.unit === 'miles'}
							>
								MI
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section>
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">QR Code</h3>
			<div class="space-y-2">
				<div>
					<label for="qrCodeUrl" class="mb-0.5 block text-xs text-text-secondary">Activity URL</label>
					<input
						type="url"
						id="qrCodeUrl"
						value={qrCodeInputValue}
						oninput={handleQrCodeUrlChange}
						placeholder="Strava link..."
						class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
					/>
				</div>
				<div class="flex items-center gap-3">
					<div class="flex-1">
						<label for="qr-style-select" class="mb-0.5 block text-xs text-text-secondary">Style</label>
						<Dropdown
							id="qr-style-select"
							options={QR_STYLES}
							value={posterStore.data.qrDotStyle}
							onchange={(v) => posterStore.setQrDotStyle(v as QrDotStyle)}
						/>
					</div>
					<div class="pt-4">
						<label class="flex cursor-pointer items-center gap-1.5 text-xs text-text-secondary">
							<input
								type="checkbox"
								checked={posterStore.data.qrGradientEnabled}
								onchange={(e) => posterStore.setQrGradientEnabled((e.target as HTMLInputElement).checked)}
								class="h-3.5 w-3.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
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
		<h2 class="mb-3 text-sm font-bold text-text-primary">Design</h2>

		<section class="mb-3">
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Presets</h3>
			<div class="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Design Presets">
				{#each DESIGN_PRESETS as preset}
					{@const isDisabled = posterStore.isDemo && !posterStore.isPresetAllowedInDemo(preset.value)}
					<button
						type="button"
						onclick={() => selectPreset(preset.value)}
						disabled={isDisabled}
						class="group relative flex flex-col items-center gap-1 rounded border-2 p-1.5 transition-all {posterStore.activePreset === preset.value ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-200 bg-white hover:border-gray-300'} {isDisabled ? 'cursor-not-allowed opacity-50' : ''}"
						role="radio"
						aria-checked={posterStore.activePreset === preset.value}
						aria-label={preset.label}
						title={isDisabled ? 'Upload a GPX file to use this preset' : preset.label}
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
						<span class="text-xs font-semibold uppercase {posterStore.activePreset === preset.value ? 'text-brand-primary' : 'text-text-secondary'}">{preset.label}</span>
						{#if posterStore.activePreset === preset.value}
							<div class="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-primary text-[8px] text-white">✓</div>
						{/if}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Advanced</h3>
			<div class="space-y-3">
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label for="map-style-select" class="mb-0.5 block text-xs text-text-secondary">
							Map Style
							{#if posterStore.isDemo}
								<span class="text-amber-600">(limited)</span>
							{/if}
						</label>
						<Dropdown
							id="map-style-select"
							options={availableMapStyles}
							value={posterStore.data.mapStyle}
							onchange={(v) => posterStore.setMapStyle(v as MapStyle)}
						/>
					</div>
					<div>
						<label for="map-filter-select" class="mb-0.5 block text-xs text-text-secondary">Map Filter</label>
						<Dropdown
							id="map-filter-select"
							options={MAP_FILTERS}
							value={posterStore.data.mapFilter}
							onchange={(v) => posterStore.setMapFilter(v as MapFilter)}
						/>
					</div>
				</div>

				<div>
					<span class="mb-1.5 block text-xs text-text-secondary">Background</span>
					<div class="flex flex-wrap items-center gap-1.5">
						{#each BW_COLOR_PRESETS as bgPreset}
							<button
								type="button"
								onclick={() => posterStore.setCustomBgColor(bgPreset.color)}
								class="h-6 w-6 min-h-[44px] min-w-[44px] rounded-full border-2 transition-transform hover:scale-110 {posterStore.data.customBgColor === bgPreset.color ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-gray-300'}"
								style="background-color: {bgPreset.color}"
								title={bgPreset.label}
								aria-label="Select {bgPreset.label} background color"
							></button>
						{/each}
						<label class="color-picker-wrapper" title="Custom background color">
							<input
								type="color"
								value={posterStore.effectiveBgColor}
								oninput={(e) => posterStore.setCustomBgColor((e.target as HTMLInputElement).value)}
								aria-label="Choose custom background color"
							/>
						</label>
					</div>
				</div>

				<div>
					<span class="mb-1.5 block text-xs text-text-secondary">Text Color</span>
					<div class="flex flex-wrap items-center gap-1.5">
						{#each BW_COLOR_PRESETS as preset}
							<button
								type="button"
								onclick={() => posterStore.setCustomTextColor(preset.color)}
								class="h-6 w-6 min-h-[44px] min-w-[44px] rounded-full border-2 transition-transform hover:scale-110 {posterStore.data.customTextColor === preset.color ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-gray-300'}"
								style="background-color: {preset.color}"
								title={preset.label}
								aria-label="Select {preset.label} text color"
							></button>
						{/each}
						<label class="color-picker-wrapper" title="Custom text color">
							<input
								type="color"
								value={posterStore.effectiveTextColor}
								oninput={(e) => posterStore.setCustomTextColor((e.target as HTMLInputElement).value)}
								aria-label="Choose custom text color"
							/>
						</label>
					</div>
				</div>

				<div>
					<span class="mb-1.5 block text-xs text-text-secondary">Route Color</span>
					<div class="flex flex-wrap items-center gap-1.5">
						{#each ROUTE_COLOR_PRESETS as color}
							<button
								type="button"
								onclick={() => { posterStore.setRouteColor(color.value); posterStore.setCustomRouteColor(null); }}
								class="h-6 w-6 min-h-[44px] min-w-[44px] rounded-full border-2 transition-transform hover:scale-110 {posterStore.data.routeColor === color.value && !posterStore.data.customRouteColor ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-gray-300'}"
								style="background-color: {color.color}"
								title={color.label}
								aria-label="Select {color.label} route color"
							></button>
						{/each}
						<label class="color-picker-wrapper" title="Custom route color">
							<input
								type="color"
								value={posterStore.effectiveRouteColor}
								oninput={(e) => posterStore.setCustomRouteColor((e.target as HTMLInputElement).value)}
								aria-label="Choose custom route color"
							/>
						</label>
					</div>
				</div>
			</div>
		</section>
	</div>

	<!-- SIZE SECTION -->
	<div class="mb-5">
		<h2 class="mb-3 text-sm font-bold text-text-primary">Size & Ratio</h2>

		<section class="mb-3">
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Layout</h3>
			<div class="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Layout">
				{#each LAYOUTS as layout}
					<Tooltip text={layout.tooltip}>
						<button
							type="button"
							onclick={() => posterStore.setLayout(layout.value)}
							class="flex w-full flex-col items-center gap-0.5 rounded border-2 p-1.5 transition-colors {posterStore.data.layout === layout.value
								? 'border-brand-primary bg-brand-primary/10'
								: 'border-gray-200 hover:border-gray-300'}"
							role="radio"
							aria-checked={posterStore.data.layout === layout.value}
						>
							<span class="text-xs font-semibold text-text-secondary">{layout.label}</span>
							<span class="text-[10px] text-text-muted">{layout.orientation}</span>
						</button>
					</Tooltip>
				{/each}
			</div>
		</section>

		<section>
			<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Aspect Ratio</h3>
			<div class="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Aspect Ratio">
				{#each currentAspectRatios as ratio}
					<Tooltip text={ratio.tooltip}>
						<button
							type="button"
							onclick={() => posterStore.setAspectRatio(ratio.value)}
							class="flex w-full flex-col items-center gap-0.5 rounded border-2 p-1.5 transition-colors {posterStore.data.aspectRatio === ratio.value
								? 'border-brand-primary bg-brand-primary/10'
								: 'border-gray-200 hover:border-gray-300'}"
							role="radio"
							aria-checked={posterStore.data.aspectRatio === ratio.value}
						>
							<span class="text-xs font-semibold text-text-secondary">{ratio.ratio}</span>
							<span class="text-[10px] text-text-muted">{ratio.label}</span>
						</button>
					</Tooltip>
				{/each}
			</div>
		</section>
	</div>

	<!-- EXPORT CTA -->
	<section class="mt-auto border-t border-border-default bg-white pt-3">
		<ExportButton 
			eventName={posterStore.data.eventName} 
			date={posterStore.data.date}
			disabled={posterStore.isDemo}
			disabledReason="Upload a GPX file to enable export"
		/>
	</section>
</div>

<style>
	.color-picker-wrapper {
		position: relative;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 9999px;
		background: conic-gradient(
			from 0deg,
			#ff0000,
			#ffff00,
			#00ff00,
			#00ffff,
			#0000ff,
			#ff00ff,
			#ff0000
		);
		cursor: pointer;
		transition: transform 0.1s;
		border: 2px solid var(--border-default);
	}

	.color-picker-wrapper:hover {
		transform: scale(1.1);
	}

	.color-picker-wrapper input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}
</style>
