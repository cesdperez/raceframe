<script lang="ts">
	import { exportPoster, type ExportScale, type ExportFormat } from '../utils/export.js';
	import { exportPosterToPdf } from '../utils/pdf-export.js';
	import LoadingSpinner from './LoadingSpinner.svelte';

	interface Props {
		raceName: string;
		date: Date | null;
	}

	let { raceName, date }: Props = $props();

	let isExporting = $state(false);
	let error = $state<string | null>(null);
	let exportStatus = $state('');

	async function handleExport(scale: ExportScale, format: ExportFormat = 'png') {
		isExporting = true;
		error = null;
		const formatLabel = format === 'pdf' ? 'PDF' : 'PNG';
		const resLabel = scale === 4 ? 'high-resolution' : 'standard';
		exportStatus = `Exporting ${resLabel} ${formatLabel}...`;

		try {
			if (format === 'pdf') {
				await exportPosterToPdf({ scale, raceName, date });
			} else {
				await exportPoster({ scale, raceName, date });
			}
			exportStatus = 'Export complete! Your download should start automatically.';
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

	<div>
		<p class="mb-2 text-xs font-medium text-gray-600">PNG Image</p>
		<div class="flex gap-2">
			<button
				type="button"
				onclick={() => handleExport(2, 'png')}
				disabled={isExporting}
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
				2x PNG
			</button>
			<button
				type="button"
				onclick={() => handleExport(4, 'png')}
				disabled={isExporting}
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
				4x PNG
			</button>
		</div>
	</div>

	<div>
		<p class="mb-2 text-xs font-medium text-gray-600">PDF with Bleed (for print)</p>
		<div class="flex gap-2">
			<button
				type="button"
				onclick={() => handleExport(2, 'pdf')}
				disabled={isExporting}
				aria-label="Download PDF at 2x resolution with bleed margins"
				class="flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isExporting}
					<LoadingSpinner size="sm" />
				{:else}
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				{/if}
				2x PDF
			</button>
			<button
				type="button"
				onclick={() => handleExport(4, 'pdf')}
				disabled={isExporting}
				aria-label="Download PDF at 4x resolution with bleed margins for professional print"
				class="flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-emerald-500 bg-white px-3 py-2 text-sm font-medium text-emerald-500 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isExporting}
					<LoadingSpinner size="sm" />
				{:else}
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				{/if}
				4x PDF
			</button>
		</div>
	</div>

	<p class="text-center text-xs text-gray-500">
		2x for web/screen, 4x for print (300 DPI). PDF includes 3mm bleed and crop marks.
	</p>
	{#if error}
		<p class="text-center text-sm text-red-500" role="alert">{error}</p>
	{/if}
</div>
