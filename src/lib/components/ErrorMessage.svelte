<script lang="ts">
	import type { UploadError } from '$lib/types/index.js';

	interface Props {
		error: UploadError;
		onDismiss?: () => void;
		onRetry?: () => void;
	}

	let { error, onDismiss = undefined, onRetry = undefined }: Props = $props();

	function getErrorHint(type: string): string {
		switch (type) {
			case 'invalid-type':
				return 'Make sure your file has a .gpx extension.';
			case 'empty-file':
				return 'The file appears to be empty. Try exporting your activity again.';
			case 'file-too-large':
				return 'Try a shorter activity or export with fewer data points.';
			case 'parse-error':
				return 'The file may be corrupted. Try downloading it again from your GPS app.';
			default:
				return '';
		}
	}

	const hint = $derived(getErrorHint(error.type));
</script>

<div class="px-4 py-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
	<div class="flex items-start gap-3">
		<svg
			class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<div class="flex-1">
			<p class="text-red-700 text-sm font-medium">{error.message}</p>
			{#if hint}
				<p class="text-red-600 text-xs mt-1">{hint}</p>
			{/if}
		</div>
		{#if onDismiss}
			<button
				onclick={onDismiss}
				class="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
				aria-label="Dismiss error"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
	{#if onRetry}
		<div class="mt-3 flex justify-end">
			<button
				onclick={onRetry}
				class="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
			>
				Try again
			</button>
		</div>
	{/if}
</div>
