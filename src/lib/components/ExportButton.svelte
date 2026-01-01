<script lang="ts">
	import { onDestroy } from 'svelte';
	import { exportPoster, type ExportScale } from '../utils/export.js';
	import { EXPORT_SCALES } from '../constants/poster.js';
	import { posterStore } from '../stores/poster.svelte.js';
	import LoadingSpinner from './LoadingSpinner.svelte';

	const EXPORT_PHRASES = [
		'Warming up your pixels...',
		'Lacing up the details...',
		'Pushing to the finish...',
		'Hydrating your poster...',
		'Finding your pace...',
		'Crossing the finish line...',
		'Climbing the final hill...',
		'Stretching the canvas...',
		'Drawing your masterpiece...',
		'Cooking up something nice...',
		'Brewing your artwork...',
		'Polishing your moment...',
		'Adding finishing touches...',
		'Mixing the perfect colors...',
		'Teaching pixels to run...',
		'Making memories permanent...',
		'Capturing your glory...'
	];

	interface Props {
		eventName: string;
		date: Date | null;
		disabled?: boolean;
		disabledReason?: string;
	}

	let { eventName, date, disabled = false, disabledReason = '' }: Props = $props();

	let isExporting = $state(false);
	let error = $state<string | null>(null);
	let screenReaderStatus = $state('');
	let currentPhrase = $state(EXPORT_PHRASES[0]);
	let phraseInterval: ReturnType<typeof setInterval> | null = null;
	let currentExportScale = $state<ExportScale | null>(null);
	let showLoadingOverlay = $derived(isExporting && currentExportScale !== null && currentExportScale > 1);

	function startPhraseRotation() {
		let index = Math.floor(Math.random() * EXPORT_PHRASES.length);
		currentPhrase = EXPORT_PHRASES[index];
		phraseInterval = setInterval(() => {
			index = (index + 1) % EXPORT_PHRASES.length;
			currentPhrase = EXPORT_PHRASES[index];
		}, 2000);
	}

	function stopPhraseRotation() {
		if (phraseInterval) {
			clearInterval(phraseInterval);
			phraseInterval = null;
		}
	}

	onDestroy(stopPhraseRotation);

	function getResolutionLabel(scale: ExportScale): string {
		const config = EXPORT_SCALES.find((s) => s.value === scale);
		return config?.label.toLowerCase() ?? 'standard';
	}

	function getPixelDimensions(scale: ExportScale): string {
		const width = posterStore.posterWidth * scale;
		const height = posterStore.posterHeight * scale;
		return `${width}×${height}`;
	}

	async function handleExport(scale: ExportScale) {
		if (disabled) return;
		isExporting = true;
		currentExportScale = scale;
		error = null;
		screenReaderStatus = `Preparing ${getResolutionLabel(scale)} export...`;

		if (scale > 1) {
			startPhraseRotation();
		}

		try {
			await exportPoster({ scale, eventName, date }, (message) => {
				screenReaderStatus = message;
			});
			screenReaderStatus = 'Download started!';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to export poster';
			screenReaderStatus = `Export failed: ${error}`;
		} finally {
			isExporting = false;
			currentExportScale = null;
			stopPhraseRotation();
		}
	}
</script>

<div class="space-y-3">
	<div aria-live="polite" aria-atomic="true" class="sr-only">
		{screenReaderStatus}
	</div>

	{#if disabled && disabledReason}
		<p class="text-center text-xs text-warning">{disabledReason}</p>
	{/if}

	<div class="relative">
		<h3 class="mb-2 text-sm font-bold text-brand-primary">Export PNG</h3>

		<div class="relative">
			{#if showLoadingOverlay}
				<div class="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-lg bg-gray-900/95 backdrop-blur-sm">
					<LoadingSpinner size="sm" class="text-white" />
					<span class="text-sm font-medium text-white">{currentPhrase}</span>
				</div>
			{/if}

			<div class="flex gap-2">
				{#each EXPORT_SCALES as scaleConfig}
					<button
						type="button"
						onclick={() => handleExport(scaleConfig.value)}
						disabled={isExporting || disabled}
						aria-label="Download {scaleConfig.label} PNG at {getPixelDimensions(scaleConfig.value)} pixels, recommended for {scaleConfig.printGuidance}"
						class="btn-export group"
					>
						<span class="text-xs font-bold text-gray-700 group-hover:text-brand-primary-dark">{scaleConfig.label}</span>
						<span class="text-xs font-medium text-gray-500 group-hover:text-brand-primary">{getPixelDimensions(scaleConfig.value)}</span>
						<span class="text-xs text-gray-400 group-hover:text-brand-primary/80">{scaleConfig.printGuidance}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>

		{#if error}
		<p class="text-center text-sm text-error" role="alert">{error}</p>
	{/if}
</div>
