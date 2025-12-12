<script lang="ts">
	import { tick } from 'svelte';
	import type { AppView, UploadError, GPXData } from '$lib/types/index.js';
	import { posterStore } from '$lib/stores/poster.svelte.js';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import PosterPreview from '$lib/components/PosterPreview.svelte';
	import EditorPanel from '$lib/components/EditorPanel.svelte';

	let currentView = $state<AppView>('landing');
	let uploadError = $state<UploadError | null>(null);
	let statusMessage = $state('');

	let editorHeading = $state<HTMLHeadingElement | null>(null);

	async function handleUploadSuccess(gpxData: GPXData) {
		posterStore.loadFromGPX(gpxData);
		currentView = 'editor';
		uploadError = null;
		statusMessage = 'GPX file loaded successfully. You can now customize your poster.';
		await tick();
		editorHeading?.focus();
	}

	function handleUploadError(error: UploadError) {
		uploadError = error;
		statusMessage = `Error: ${error.message}`;
	}

	function handleDismissError() {
		uploadError = null;
		statusMessage = '';
	}

	function handleStartOver() {
		posterStore.reset();
		currentView = 'landing';
		uploadError = null;
		statusMessage = '';
	}
</script>

<a href="#main-content" class="skip-link">Skip to main content</a>

<div aria-live="polite" aria-atomic="true" class="sr-only">
	{statusMessage}
</div>

<div class="min-h-screen flex flex-col">
	{#if currentView === 'landing'}
		<main id="main-content" class="flex-1 flex flex-col items-center justify-center px-4 py-12 view-fade-in">
			<div class="max-w-2xl mx-auto text-center">
				<h1
					class="text-5xl md:text-6xl font-semibold tracking-tight mb-4"
					style="font-family: var(--font-heading);"
				>
					RaceFrame
				</h1>
				<p class="text-xl md:text-2xl text-gray-600 mb-8">
					Create beautiful race posters from your GPX files
				</p>
				<p class="text-gray-500 mb-12 max-w-lg mx-auto">
					Upload your race data, customize the design, and download a high-resolution image ready
					for printing. Free, private, and works with any GPX source.
				</p>

				<div class="mb-4">
					<FileUpload onSuccess={handleUploadSuccess} onError={handleUploadError} />
				</div>

				{#if uploadError}
					<div class="mb-8 max-w-md mx-auto">
						<ErrorMessage error={uploadError} onDismiss={handleDismissError} />
					</div>
				{/if}

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-8">
					<div class="p-4">
						<div class="text-2xl mb-2">1.</div>
						<h3 class="font-medium mb-1" style="font-family: var(--font-heading);">Upload</h3>
						<p class="text-sm text-gray-500">
							Drop your GPX file from Strava, Garmin, or any GPS device
						</p>
					</div>
					<div class="p-4">
						<div class="text-2xl mb-2">2.</div>
						<h3 class="font-medium mb-1" style="font-family: var(--font-heading);">Customize</h3>
						<p class="text-sm text-gray-500">
							Edit details, choose themes, and personalize your poster
						</p>
					</div>
					<div class="p-4">
						<div class="text-2xl mb-2">3.</div>
						<h3 class="font-medium mb-1" style="font-family: var(--font-heading);">Download</h3>
						<p class="text-sm text-gray-500">Export print-ready PNG at 300 DPI for perfect prints</p>
					</div>
				</div>
			</div>
		</main>
	{:else if currentView === 'editor'}
		<main id="main-content" class="flex-1 flex flex-col lg:flex-row min-h-0 view-fade-in">
			<div class="flex-1 min-h-[50vh] md:min-h-[60vh] lg:min-h-0 bg-gray-100 relative" role="img" aria-label="Poster preview showing your race route and details">
				<PosterPreview />
			</div>

			<aside
				class="w-full lg:w-80 xl:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex-shrink-0 flex flex-col max-h-[50vh] md:max-h-[40vh] lg:max-h-none"
				aria-label="Poster customization options"
			>
				<div class="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between">
					<h2
						bind:this={editorHeading}
						tabindex="-1"
						class="text-lg font-medium focus:outline-none"
						style="font-family: var(--font-heading);"
					>
						Customize
					</h2>
					<button
						onclick={handleStartOver}
						class="lg:hidden px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
					>
						Start Over
					</button>
				</div>
				<div class="flex-1 overflow-y-auto">
					<EditorPanel />
				</div>
				<div class="hidden lg:block p-4 border-t border-gray-200">
					<button
						onclick={handleStartOver}
						class="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-gray-950 transition-colors min-h-[44px]"
						style="font-family: var(--font-heading);"
					>
						Start Over
					</button>
				</div>
			</aside>
		</main>
	{/if}

	<footer class="py-6 text-center text-sm text-gray-400">
		<p>Free and open source. No account required. Your data stays on your device.</p>
	</footer>
</div>
