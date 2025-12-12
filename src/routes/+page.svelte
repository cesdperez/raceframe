<script lang="ts">
	import type { AppView, UploadError, GPXData } from '$lib/types/index.js';
	import { posterStore } from '$lib/stores/poster.svelte.js';
	import { formatDistance, formatDate } from '$lib/utils/format.js';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	let currentView = $state<AppView>('landing');
	let uploadError = $state<UploadError | null>(null);

	function handleUploadSuccess(gpxData: GPXData) {
		posterStore.loadFromGPX(gpxData);
		currentView = 'editor';
		uploadError = null;
	}

	function handleUploadError(error: UploadError) {
		uploadError = error;
	}

	function handleDismissError() {
		uploadError = null;
	}

	function handleStartOver() {
		posterStore.reset();
		currentView = 'landing';
		uploadError = null;
	}
</script>

<div class="min-h-screen flex flex-col">
	{#if currentView === 'landing'}
		<main class="flex-1 flex flex-col items-center justify-center px-4 py-12">
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
		<main class="flex-1 flex flex-col items-center justify-center px-4 py-12">
			<div class="max-w-2xl mx-auto text-center">
				<h1
					class="text-3xl md:text-4xl font-semibold tracking-tight mb-6"
					style="font-family: var(--font-heading);"
				>
					GPX Loaded Successfully
				</h1>

				<div class="bg-gray-50 rounded-xl p-6 mb-8 text-left">
					<h2 class="text-lg font-medium mb-4" style="font-family: var(--font-heading);">
						Race Details
					</h2>
					<dl class="grid grid-cols-2 gap-4 text-sm">
						{#if posterStore.data.raceName}
							<div>
								<dt class="text-gray-500">Race Name</dt>
								<dd class="font-medium">{posterStore.data.raceName}</dd>
							</div>
						{/if}
						{#if posterStore.data.date}
							<div>
								<dt class="text-gray-500">Date</dt>
								<dd class="font-medium">{formatDate(posterStore.data.date)}</dd>
							</div>
						{/if}
						<div>
							<dt class="text-gray-500">Distance</dt>
							<dd class="font-medium">
								{formatDistance(posterStore.data.gpxData?.totalDistance ?? 0, posterStore.data.unit)}
								{posterStore.data.unit}
							</dd>
						</div>
						{#if posterStore.data.finishTime}
							<div>
								<dt class="text-gray-500">Finish Time</dt>
								<dd class="font-medium">{posterStore.data.finishTime}</dd>
							</div>
						{/if}
						{#if posterStore.data.gpxData?.coordinates}
							<div>
								<dt class="text-gray-500">Track Points</dt>
								<dd class="font-medium">{posterStore.data.gpxData.coordinates.length}</dd>
							</div>
						{/if}
						{#if posterStore.data.gpxData?.elevationGain}
							<div>
								<dt class="text-gray-500">Elevation Gain</dt>
								<dd class="font-medium">{Math.round(posterStore.data.gpxData.elevationGain)} m</dd>
							</div>
						{/if}
					</dl>
				</div>

				<p class="text-gray-500 mb-6">
					Full editor coming in Phase 6. For now, you can start over to upload a different file.
				</p>

				<button
					onclick={handleStartOver}
					class="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
					style="font-family: var(--font-heading);"
				>
					Start Over
				</button>
			</div>
		</main>
	{/if}

	<footer class="py-6 text-center text-sm text-gray-400">
		<p>Free and open source. No account required. Your data stays on your device.</p>
	</footer>
</div>
