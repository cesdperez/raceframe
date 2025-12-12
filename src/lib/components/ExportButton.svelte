<script lang="ts">
	import { exportPoster, type ExportScale } from '../utils/export.js';

	interface Props {
		raceName: string;
		date: Date | null;
	}

	let { raceName, date }: Props = $props();

	let isExporting = $state(false);
	let error = $state<string | null>(null);

	async function handleExport(scale: ExportScale) {
		isExporting = true;
		error = null;

		try {
			await exportPoster({ scale, raceName, date });
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to export poster';
		} finally {
			isExporting = false;
		}
	}
</script>

<div class="space-y-3">
	<div class="flex gap-2">
		<button
			type="button"
			onclick={() => handleExport(2)}
			disabled={isExporting}
			class="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if isExporting}
				<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Exporting...
			{:else}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
				Download 2x
			{/if}
		</button>
		<button
			type="button"
			onclick={() => handleExport(4)}
			disabled={isExporting}
			class="flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-blue-500 bg-white px-4 py-3 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if isExporting}
				<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			{:else}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
				Download 4x
			{/if}
		</button>
	</div>
	<p class="text-center text-xs text-gray-500">2x for web, 4x for high-quality print (300 DPI)</p>
	{#if error}
		<p class="text-center text-sm text-red-500">{error}</p>
	{/if}
</div>
