<script lang="ts">
	import { base } from '$app/paths';
</script>

<div class="min-h-screen flex flex-col">
	<main class="flex-1 flex flex-col items-center justify-center px-4 py-12">
		<div class="max-w-2xl mx-auto text-center">
			<h1 class="text-5xl md:text-6xl font-semibold tracking-tight mb-4" style="font-family: var(--font-heading);">
				RaceFrame
			</h1>
			<p class="text-xl md:text-2xl text-gray-600 mb-8">
				Create beautiful race posters from your GPX files
			</p>
			<p class="text-gray-500 mb-12 max-w-lg mx-auto">
				Upload your race data, customize the design, and download a high-resolution image ready for printing. Free, private, and works with any GPX source.
			</p>

			<div
				class="border-2 border-dashed border-gray-300 rounded-xl p-12 mb-12 bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
			>
				<div class="text-gray-400 mb-4">
					<svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
					</svg>
				</div>
				<p class="text-gray-600 font-medium mb-1">Drop your GPX file here</p>
				<p class="text-gray-400 text-sm">or click to browse</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
				<div class="p-4">
					<div class="text-2xl mb-2">1.</div>
					<h3 class="font-medium mb-1" style="font-family: var(--font-heading);">Upload</h3>
					<p class="text-sm text-gray-500">Drop your GPX file from Strava, Garmin, or any GPS device</p>
				</div>
				<div class="p-4">
					<div class="text-2xl mb-2">2.</div>
					<h3 class="font-medium mb-1" style="font-family: var(--font-heading);">Customize</h3>
					<p class="text-sm text-gray-500">Edit details, choose themes, and personalize your poster</p>
				</div>
				<div class="p-4">
					<div class="text-2xl mb-2">3.</div>
					<h3 class="font-medium mb-1" style="font-family: var(--font-heading);">Download</h3>
					<p class="text-sm text-gray-500">Export print-ready PNG at 300 DPI for perfect prints</p>
				</div>
			</div>
		</div>
	</main>

	<footer class="py-6 text-center text-sm text-gray-400">
		<p>Free and open source. No account required. Your data stays on your device.</p>
	</footer>
</div>
