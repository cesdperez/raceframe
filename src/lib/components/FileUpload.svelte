<script lang="ts">
	import type { GPXData, UploadError } from '$lib/types/index.js';
	import { parseGPX } from '$lib/utils/gpx.js';
	import { validateGpxFile } from '$lib/utils/validation.js';

	let {
		onSuccess,
		onError
	}: {
		onSuccess: (gpxData: GPXData) => void;
		onError: (error: UploadError) => void;
	} = $props();

	let isDragging = $state(false);
	let isLoading = $state(false);
	let fileInput: HTMLInputElement;

	async function processFile(file: File) {
		const validationError = validateGpxFile(file);
		if (validationError) {
			onError(validationError);
			return;
		}

		isLoading = true;
		try {
			const text = await file.text();
			const gpxData = parseGPX(text);
			onSuccess(gpxData);
		} catch (e) {
			onError({
				message: e instanceof Error ? e.message : 'Failed to parse GPX file',
				type: 'parse-error'
			});
		} finally {
			isLoading = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) processFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleClick() {
		fileInput?.click();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) processFile(file);
		input.value = '';
	}
</script>

<div
	role="button"
	tabindex="0"
	aria-label="Upload GPX file. Drop your file here or press Enter to browse"
	aria-busy={isLoading}
	class="border-2 border-dashed rounded-xl p-8 md:p-12 transition-colors cursor-pointer min-h-[180px] flex flex-col items-center justify-center
		{isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400 active:bg-gray-100'}
		{isLoading ? 'opacity-60 cursor-wait' : ''}"
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	onclick={handleClick}
	onkeydown={handleKeyDown}
>
	{#if isLoading}
		<div class="text-gray-400 mb-4">
			<svg
				class="w-12 h-12 mx-auto animate-spin"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
		</div>
		<p class="text-gray-600 font-medium">Processing GPX file...</p>
	{:else}
		<div class="text-gray-400 mb-4">
			<svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
				/>
			</svg>
		</div>
		<p class="text-gray-600 font-medium mb-1">Drop your GPX file here</p>
		<p class="text-gray-400 text-sm">or click to browse</p>
	{/if}
</div>

<input
	bind:this={fileInput}
	type="file"
	accept=".gpx"
	class="hidden"
	onchange={handleFileChange}
/>
