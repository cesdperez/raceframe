<script lang="ts">
	import { onMount, tick, type Snippet } from 'svelte';

	let { text, children }: { text: string; children: Snippet } = $props();

	let wrapperEl: HTMLDivElement;
	let tooltipEl = $state<HTMLDivElement | null>(null);
	let visible = $state(false);
	let tooltipStyle = $state('');
	let arrowStyle = $state('');

	const VIEWPORT_PADDING = 8;

	async function updatePosition() {
		if (!wrapperEl) return;
		const target = wrapperEl.firstElementChild as HTMLElement | null;
		if (!target) return;

		const rect = target.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const topY = rect.top - 6;

		tooltipStyle = `left: ${centerX}px; top: ${topY}px;`;
		arrowStyle = '';

		await tick();

		if (!tooltipEl) return;
		const tooltipRect = tooltipEl.getBoundingClientRect();

		let offsetX = 0;
		if (tooltipRect.right > window.innerWidth - VIEWPORT_PADDING) {
			offsetX = window.innerWidth - VIEWPORT_PADDING - tooltipRect.right;
		} else if (tooltipRect.left < VIEWPORT_PADDING) {
			offsetX = VIEWPORT_PADDING - tooltipRect.left;
		}

		if (offsetX !== 0) {
			tooltipStyle = `left: ${centerX + offsetX}px; top: ${topY}px;`;
			arrowStyle = `left: calc(50% - ${offsetX}px);`;
		}
	}

	function show() {
		visible = true;
		updatePosition();
	}

	function hide() {
		visible = false;
	}

	onMount(() => {
		const target = wrapperEl?.firstElementChild as HTMLElement | null;
		if (!target) return;

		target.addEventListener('mouseenter', show);
		target.addEventListener('mouseleave', hide);
		target.addEventListener('focusin', show);
		target.addEventListener('focusout', hide);

		return () => {
			target.removeEventListener('mouseenter', show);
			target.removeEventListener('mouseleave', hide);
			target.removeEventListener('focusin', show);
			target.removeEventListener('focusout', hide);
		};
	});
</script>

<div class="contents" bind:this={wrapperEl}>
	{@render children()}
</div>

{#if visible}
	<div class="tooltip-portal" style={tooltipStyle} role="tooltip" bind:this={tooltipEl}>
		{text}
		<span class="tooltip-arrow" style={arrowStyle}></span>
	</div>
{/if}

<style>
	.contents {
		display: contents;
	}

	:global(.tooltip-portal) {
		position: fixed;
		transform: translateX(-50%) translateY(-100%);
		padding: 6px 10px;
		background: #1f2937;
		color: white;
		font-size: 11px;
		line-height: 1.4;
		border-radius: 4px;
		white-space: nowrap;
		z-index: 9999;
		pointer-events: none;
	}

	:global(.tooltip-arrow) {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-top-color: #1f2937;
	}
</style>
