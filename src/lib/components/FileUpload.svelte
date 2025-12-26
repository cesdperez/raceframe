<script lang="ts">
	import { onMount } from 'svelte';
	import type { GPXData, UploadError } from '$lib/types/index.js';
	import { parseGPX } from '$lib/utils/gpx.js';
	import { validateGpxFile } from '$lib/utils/validation.js';
	import LoadingSpinner from './LoadingSpinner.svelte';

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

	// Signals that event listeners are attached (used by E2E tests to avoid race conditions)
	let isHydrated = $state(false);
	onMount(() => {
		isHydrated = true;
	});

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
	class="border-2 border-dashed rounded-xl p-4 md:p-12 transition-all duration-200 cursor-pointer min-h-[180px] md:min-h-[180px] flex flex-col items-center justify-center active:scale-[0.98]
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
			<LoadingSpinner size="lg" class="mx-auto" />
		</div>
		<p class="text-gray-600 font-medium">Processing GPX file...</p>
	{:else}
		<div class="text-gray-400 mb-3">
			<svg class="w-12 h-12 mx-auto md:w-14 md:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
		<p class="text-gray-300 text-xs mt-2">.gpx files only</p>
	{/if}
</div>

<input
	bind:this={fileInput}
	type="file"
	accept=".gpx"
	class="hidden"
	data-upload-ready={isHydrated || undefined}
	onchange={handleFileChange}
/>
