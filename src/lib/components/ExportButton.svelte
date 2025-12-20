<script lang="ts">
	import { exportPoster, type ExportScale } from '../utils/export.js';
	import LoadingSpinner from './LoadingSpinner.svelte';

	interface Props {
		eventName: string;
		date: Date | null;
		disabled?: boolean;
		disabledReason?: string;
	}

	let { eventName, date, disabled = false, disabledReason = '' }: Props = $props();

	let isExporting = $state(false);
	let error = $state<string | null>(null);
	let exportStatus = $state('');

	async function handleExport(scale: ExportScale) {
		if (disabled) return;
		isExporting = true;
		error = null;
		const resLabel = scale === 4 ? 'high-resolution' : 'standard';
		exportStatus = `Preparing ${resLabel} export...`;

		try {
			exportStatus = 'Generating PNG...';
			await exportPoster({ scale, eventName, date });
			exportStatus = 'Download started!';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to export poster';
			exportStatus = `Export failed: ${error}`;
		} finally {
			isExporting = false;
		}
	}
</script>

<div class="space-y-3">
	<div aria-live="polite" aria-atomic="true" class="sr-only">
		{exportStatus}
	</div>

	{#if disabled && disabledReason}
		<p class="text-center text-xs text-amber-600">{disabledReason}</p>
	{/if}

	<div>
		<p class="mb-2 text-xs font-medium text-gray-600">Download PNG</p>
		<div class="flex gap-2">
			<button
				type="button"
				onclick={() => handleExport(2)}
				disabled={isExporting || disabled}
				aria-label="Download PNG at 2x resolution for web use"
				class="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isExporting}
					<LoadingSpinner size="sm" />
				{:else}
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
				{/if}
				2x Web
			</button>
			<button
				type="button"
				onclick={() => handleExport(4)}
				disabled={isExporting || disabled}
				aria-label="Download PNG at 4x resolution for high-quality print"
				class="flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-blue-500 bg-white px-3 py-2 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isExporting}
					<LoadingSpinner size="sm" />
				{:else}
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
				{/if}
				4x Print
			</button>
		</div>
	</div>

	<p class="text-center text-xs text-gray-500">
		2x for web/screen (~150 DPI), 4x for print (300 DPI)
	</p>
	{#if error}
		<p class="text-center text-sm text-red-500" role="alert">{error}</p>
	{/if}
</div>
