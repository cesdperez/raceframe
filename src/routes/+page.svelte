<script lang="ts">
	import { tick, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
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

	const activities = ['running', 'cycling'];
	let activityIndex = $state(0);

	onMount(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mediaQuery.matches) return;

		const timeout = setTimeout(() => {
			activityIndex = (activityIndex + 1) % activities.length;
			const interval = setInterval(() => {
				activityIndex = (activityIndex + 1) % activities.length;
			}, 3000);
			return () => {
				clearInterval(interval);
			};
		}, 2000);

		return () => clearTimeout(timeout);
	});

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

	async function handleDemoMode() {
		posterStore.loadDemoData();
		currentView = 'editor';
		statusMessage = 'Demo mode loaded. Some features are limited.';
		await tick();
		editorHeading?.focus();
	}
</script>

<a href="#main-content" class="skip-link">Skip to main content</a>

<div aria-live="polite" aria-atomic="true" class="sr-only">
	{statusMessage}
</div>

<svelte:head>
	{#if currentView === 'editor'}
		<style>
			html {
				overflow: hidden !important;
				height: 100% !important;
			}
			body {
				height: 100% !important;
				overflow: hidden !important;
			}
		</style>
	{/if}
</svelte:head>

<div class="{currentView === 'editor' ? 'h-screen overflow-hidden' : 'min-h-screen'} flex flex-col">
	{#if currentView === 'landing'}
		<main id="main-content" class="flex-1 flex flex-col items-center justify-center px-4 py-12 view-fade-in">
			<div class="max-w-2xl mx-auto text-center">
				<h1
					class="text-5xl md:text-6xl font-semibold tracking-tight mb-4"
					style="font-family: var(--font-heading);"
				>
					RaceFrame
				</h1>
				<p class="text-lg md:text-2xl text-gray-600 mb-8 min-h-[1.5em] text-center leading-relaxed">
					Create beautiful
					<span class="relative inline-flex flex-col items-center text-blue-600">
						<span class="sr-only">running and cycling</span>
						{#key activityIndex}
							<span
								in:fly={{ y: 12, duration: 400, delay: 100 }}
								out:fly={{ y: -12, duration: 400 }}
								class="absolute font-semibold italic"
								aria-hidden="true"
							>
								{activities[activityIndex]}
							</span>
						{/key}
						<span class="invisible font-semibold italic" aria-hidden="true">running</span>
					</span>
					posters from your GPX files
				</p>
				<p class="text-gray-500 mb-12 max-w-lg mx-auto">
					Upload your race data, customize the design, and download a high-resolution image ready
					for printing. Free, private, and works with any GPX source.
				</p>

				<div class="mb-6">
					<FileUpload onSuccess={handleUploadSuccess} onError={handleUploadError} />
				</div>

				<button
					onclick={handleDemoMode}
					class="group inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-gray-800 transition-all active:scale-[0.97]"
				>
					<svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
					No GPX file? Explore the editor
					<svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>

				{#if uploadError}
					<div class="mb-8 max-w-md mx-auto">
						<ErrorMessage error={uploadError} onDismiss={handleDismissError} />
					</div>
				{/if}

				<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-12">
					<div class="flex gap-4">
						<div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
						</div>
						<div>
							<h3 class="font-medium mb-1" style="font-family: var(--font-heading);">Upload</h3>
							<p class="text-sm text-gray-500">
								Drop your GPX file from Strava, Garmin, or any GPS device
							</p>
						</div>
					</div>
					<div class="flex gap-4">
						<div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
						</div>
						<div>
							<h3 class="font-medium mb-1" style="font-family: var(--font-heading);">Customize</h3>
							<p class="text-sm text-gray-500">
								Edit details, choose themes, and personalize your poster
							</p>
						</div>
					</div>
					<div class="flex gap-4">
						<div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
						</div>
						<div>
							<h3 class="font-medium mb-1" style="font-family: var(--font-heading);">Download</h3>
							<p class="text-sm text-gray-500">Export print-ready PNG at 300 DPI for perfect prints</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	{:else if currentView === 'editor'}
		<main id="main-content" class="flex-1 flex flex-col lg:flex-row min-h-0 view-fade-in overflow-hidden">
			<div class="flex-1 min-h-[50vh] md:min-h-[60vh] lg:min-h-0 bg-gray-100 relative overflow-hidden" style="contain: strict" role="img" aria-label="Poster preview showing your race route and details">
				<PosterPreview />
			</div>

			<button
				onclick={handleStartOver}
				class="fixed top-4 left-4 p-3 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-gray-900 hover:bg-white transition-colors rounded-full shadow-lg z-50"
				aria-label="Go back to upload"
				title="Start over"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
			</button>

			<aside
				class="w-full lg:w-80 xl:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex-shrink-0 flex flex-col max-h-[50vh] md:max-h-[40vh] lg:max-h-none overflow-hidden"
				aria-label="Poster customization options"
			>
				<div class="p-3 md:p-4 border-b border-gray-200">
					<h2
						bind:this={editorHeading}
						tabindex="-1"
						class="text-lg font-medium focus:outline-none"
						style="font-family: var(--font-heading);"
					>
						Customize
					</h2>
				</div>
				<div class="flex-1 overflow-y-auto">
					<EditorPanel />
				</div>
			</aside>
		</main>
	{/if}

	<footer class="py-6 text-center text-sm text-gray-400">
		<a 
			href="https://github.com/cesdperez/raceframe" 
			target="_blank" 
			rel="noopener noreferrer" 
			class="inline-flex items-center gap-1.5 hover:text-gray-600 transition-colors"
		>
			<svg viewBox="0 0 24 24" class="w-4 h-4 fill-current" aria-hidden="true">
				<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
			</svg>
			<span>cesdperez/raceframe</span>
		</a>
	</footer>
</div>
