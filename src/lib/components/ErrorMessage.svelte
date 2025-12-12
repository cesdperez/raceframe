<script lang="ts">
	import type { UploadError } from '$lib/types/index.js';

	let { error, onDismiss = undefined }: { error: UploadError; onDismiss?: () => void } = $props();
</script>

<div class="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
	<svg
		class="w-5 h-5 text-red-500 flex-shrink-0"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
	<p class="text-red-700 text-sm flex-1">{error.message}</p>
	{#if onDismiss}
		<button
			onclick={onDismiss}
			class="text-red-400 hover:text-red-600 transition-colors"
			aria-label="Dismiss error"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	{/if}
</div>
