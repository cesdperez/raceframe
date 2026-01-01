<script lang="ts">
	import { clickOutside } from '../actions/clickOutside.js';

	interface Option {
		value: string;
		label: string;
	}

	let {
		id,
		options,
		value,
		onchange
	}: {
		id: string;
		options: readonly Option[];
		value: string;
		onchange: (value: string) => void;
	} = $props();

	let open = $state(false);

	const selectedLabel = $derived(options.find((o) => o.value === value)?.label ?? '');
</script>

<div class="relative" use:clickOutside={() => (open = false)}>
	<button
		type="button"
		{id}
		onclick={() => (open = !open)}
		class="flex w-full items-center justify-between rounded border border-border-default bg-white px-2 py-1.5 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none"
		aria-haspopup="listbox"
		aria-expanded={open}
	>
		<span class="truncate text-sm">{selectedLabel}</span>
		<svg
			class="h-3.5 w-3.5 flex-shrink-0 text-text-muted"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4 4 4-4" />
		</svg>
	</button>
	{#if open}
		<div
			class="absolute z-50 mt-1 w-full rounded border border-gray-200 bg-white py-1 shadow-lg"
			role="listbox"
		>
			{#each options as option}
				<button
					type="button"
					onclick={() => {
						onchange(option.value);
						open = false;
					}}
					class="flex w-full items-center px-2 py-1.5 text-sm hover:bg-gray-50 {value === option.value
						? 'bg-brand-primary/10 text-brand-primary'
						: ''}"
					role="option"
					aria-selected={value === option.value}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
