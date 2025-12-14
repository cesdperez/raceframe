<script lang="ts">
	import { posterStore } from '../stores/poster.svelte.js';
	import { THEMES, ROUTE_COLOR_OPTIONS } from '$lib/constants/themes';
	import { LAYOUTS, getAspectRatiosForLayout } from '$lib/constants/poster';
	import ExportButton from './ExportButton.svelte';

	const currentAspectRatios = $derived(getAspectRatiosForLayout(posterStore.data.layout));

	let qrCodeInputValue = $state(posterStore.data.qrCodeUrl ?? '');
	let qrDebounceTimer: ReturnType<typeof setTimeout> | null = null;

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

</script>

<div class="flex h-full flex-col overflow-y-auto p-3 md:p-4">
	<section class="mb-6">
		<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Race Details</h3>
		<div class="space-y-3">
			<div>
				<label for="raceName" class="mb-1 block text-sm font-medium text-gray-700">Race Name</label>
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
				<label for="date" class="mb-1 block text-sm font-medium text-gray-700">Date</label>
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

	<section class="mb-6">
		<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Runner Info</h3>
		<div class="space-y-3">
			<div>
				<label for="runnerName" class="mb-1 block text-sm font-medium text-gray-700">Your Name</label>
				<input
					type="text"
					id="runnerName"
					value={posterStore.data.runnerName}
					oninput={(e) => posterStore.setRunnerName((e.target as HTMLInputElement).value)}
					placeholder="e.g. John Doe"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="bibNumber" class="mb-1 block text-sm font-medium text-gray-700">Bib Number</label>
				<input
					type="text"
					id="bibNumber"
					value={posterStore.data.bibNumber}
					oninput={(e) => posterStore.setBibNumber((e.target as HTMLInputElement).value)}
					placeholder="e.g. 12345"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		</div>
	</section>

	<section class="mb-6">
		<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Performance</h3>
		<div class="space-y-3">
			<div>
				<label for="finishTime" class="mb-1 block text-sm font-medium text-gray-700">Finish Time</label>
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
				<label for="distance" class="mb-1 block text-sm font-medium text-gray-700">Distance</label>
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
					<div class="flex rounded-md border border-gray-300" role="group" aria-label="Distance unit">
						<button
							type="button"
							onclick={() => posterStore.setUnit('km')}
							aria-pressed={posterStore.data.unit === 'km'}
							class="px-3 py-2 text-sm font-medium transition-colors {posterStore.data.unit === 'km'
								? 'bg-blue-500 text-white'
								: 'bg-white text-gray-700 hover:bg-gray-50'} rounded-l-md"
						>
							km
						</button>
						<button
							type="button"
							onclick={() => posterStore.setUnit('miles')}
							aria-pressed={posterStore.data.unit === 'miles'}
							class="px-3 py-2 text-sm font-medium transition-colors {posterStore.data.unit === 'miles'
								? 'bg-blue-500 text-white'
								: 'bg-white text-gray-700 hover:bg-gray-50'} rounded-r-md border-l border-gray-300"
						>
							mi
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="mb-6">
		<h3 id="theme-label" class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Theme</h3>
		<div class="grid grid-cols-2 gap-2" role="radiogroup" aria-labelledby="theme-label">
			{#each THEMES as theme}
				<button
					type="button"
					onclick={() => posterStore.setTheme(theme.value)}
					role="radio"
					aria-checked={posterStore.data.theme === theme.value}
					aria-label="{theme.label} theme"
					class="flex items-center gap-2 rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors {posterStore.data
						.theme === theme.value
						? 'border-blue-500'
						: 'border-gray-200 hover:border-gray-300'}"
				>
					<span
						class="flex h-5 w-5 items-center justify-center rounded border border-gray-300"
						style="background-color: {theme.bg}"
						aria-hidden="true"
					>
						<span
							class="text-xs font-bold"
							style="color: {theme.text}"
						>
							A
						</span>
					</span>
					<span class="text-gray-700">{theme.label}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="mb-6">
		<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Customize Colors</h3>
		<div class="space-y-3">
			<div class="flex items-center gap-3">
				<label for="customBg" class="w-24 text-sm font-medium text-gray-700">Background</label>
				<div class="flex flex-1 items-center gap-2">
					<input
						type="color"
						id="customBg"
						value={posterStore.effectiveBgColor}
						oninput={(e) => posterStore.setCustomBgColor((e.target as HTMLInputElement).value)}
						class="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
					/>
					<span class="flex-1 text-xs font-mono text-gray-500">{posterStore.effectiveBgColor}</span>
					{#if posterStore.data.customBgColor}
						<button
							type="button"
							onclick={() => posterStore.setCustomBgColor(null)}
							class="text-xs text-blue-600 hover:text-blue-800 hover:underline"
						>
							Reset
						</button>
					{/if}
				</div>
			</div>
			<div class="flex items-center gap-3">
				<label for="customText" class="w-24 text-sm font-medium text-gray-700">Text</label>
				<div class="flex flex-1 items-center gap-2">
					<input
						type="color"
						id="customText"
						value={posterStore.effectiveTextColor}
						oninput={(e) => posterStore.setCustomTextColor((e.target as HTMLInputElement).value)}
						class="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
					/>
					<span class="flex-1 text-xs font-mono text-gray-500">{posterStore.effectiveTextColor}</span>
					{#if posterStore.data.customTextColor}
						<button
							type="button"
							onclick={() => posterStore.setCustomTextColor(null)}
							class="text-xs text-blue-600 hover:text-blue-800 hover:underline"
						>
							Reset
						</button>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<section class="mb-6">
		<h3 id="route-color-label" class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Route Color</h3>
		<div class="flex flex-wrap gap-1" role="radiogroup" aria-labelledby="route-color-label">
			{#each ROUTE_COLOR_OPTIONS as color}
				<button
					type="button"
					onclick={() => {
						posterStore.setRouteColor(color.value);
						posterStore.setCustomRouteColor(null);
					}}
					class="group relative p-1.5"
					role="radio"
					aria-checked={posterStore.data.routeColor === color.value && !posterStore.data.customRouteColor}
					aria-label="{color.label} route color"
				>
					<span
						class="block h-8 w-8 md:h-7 md:w-7 rounded-full border-2 transition-transform {posterStore.data.routeColor ===
							color.value && !posterStore.data.customRouteColor
							? 'scale-110 border-blue-500'
							: 'border-gray-300 hover:scale-105'}"
						style="background-color: {color.color}"
						aria-hidden="true"
					></span>
				</button>
			{/each}
		</div>
		<div class="mt-3 flex items-center gap-3">
			<label for="customRoute" class="text-sm font-medium text-gray-700">Custom</label>
			<div class="flex flex-1 items-center gap-2">
				<input
					type="color"
					id="customRoute"
					value={posterStore.effectiveRouteColor}
					oninput={(e) => posterStore.setCustomRouteColor((e.target as HTMLInputElement).value)}
					class="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
				/>
				<span class="flex-1 text-xs font-mono text-gray-500">{posterStore.effectiveRouteColor}</span>
				{#if posterStore.data.customRouteColor}
					<button
						type="button"
						onclick={() => posterStore.setCustomRouteColor(null)}
						class="text-xs text-blue-600 hover:text-blue-800 hover:underline"
					>
						Reset
					</button>
				{/if}
			</div>
		</div>
	</section>

	<section class="mb-6">
		<h3 id="layout-label" class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Layout</h3>
		<div class="grid grid-cols-2 gap-2" role="radiogroup" aria-labelledby="layout-label">
			{#each LAYOUTS as layout}
				<button
					type="button"
					onclick={() => posterStore.setLayout(layout.value)}
					role="radio"
					aria-checked={posterStore.data.layout === layout.value}
					aria-label="{layout.label} layout"
					class="flex flex-col items-center rounded-md border-2 px-2 py-2 text-sm transition-colors {posterStore.data
						.layout === layout.value
						? 'border-blue-500'
						: 'border-gray-200 hover:border-gray-300'}"
				>
					<span class="font-medium text-gray-700">{layout.label}</span>
					<span class="text-xs text-gray-500 capitalize">{layout.orientation}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="mb-6">
		<h3 id="ratio-label" class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Aspect Ratio</h3>
		<div class="grid grid-cols-2 gap-2" role="radiogroup" aria-labelledby="ratio-label">
			{#each currentAspectRatios as ratio}
				<button
					type="button"
					onclick={() => posterStore.setAspectRatio(ratio.value)}
					role="radio"
					aria-checked={posterStore.data.aspectRatio === ratio.value}
					aria-label="{ratio.label} aspect ratio"
					class="flex flex-col items-center rounded-md border-2 px-2 py-2 text-sm transition-colors {posterStore.data
						.aspectRatio === ratio.value
						? 'border-blue-500'
						: 'border-gray-200 hover:border-gray-300'}"
				>
					<span class="font-medium text-gray-700">{ratio.label}</span>
					<span class="text-xs text-gray-500">{ratio.printSize}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="mb-6">
		<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">QR Code</h3>
		<div class="space-y-3">
			<div>
				<label for="qrCodeUrl" class="mb-1 block text-sm font-medium text-gray-700">Activity URL</label>
				<input
					type="url"
					id="qrCodeUrl"
					value={qrCodeInputValue}
					oninput={handleQrCodeUrlChange}
					placeholder="e.g. https://strava.com/activities/..."
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
				<p class="mt-1 text-xs text-gray-500">Optional: Add a QR code linking to your activity</p>
			</div>
			<div>
				<label for="qrDotStyle" class="mb-1 block text-sm font-medium text-gray-700">Dot Style</label>
				<select
					id="qrDotStyle"
					value={posterStore.data.qrDotStyle}
					onchange={(e) => posterStore.setQrDotStyle((e.target as HTMLSelectElement).value as import('$lib/types/index.js').QrDotStyle)}
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				>
					<option value="rounded">Rounded</option>
					<option value="dots">Dots</option>
					<option value="classy">Classy</option>
					<option value="classy-rounded">Classy Rounded</option>
					<option value="square">Square</option>
					<option value="extra-rounded">Extra Rounded</option>
				</select>
			</div>
			<div>
				<label class="flex items-center gap-2 text-sm font-medium text-gray-700">
					<input
						type="checkbox"
						checked={posterStore.data.qrGradientEnabled}
						onchange={(e) => posterStore.setQrGradientEnabled((e.target as HTMLInputElement).checked)}
						class="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
					/>
					Gradient effect
				</label>
			</div>
		</div>
	</section>

	<section class="mt-auto border-t border-gray-200 pt-4">
		<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Export</h3>
		<ExportButton raceName={posterStore.data.raceName} date={posterStore.data.date} />
	</section>
</div>
