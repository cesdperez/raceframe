<script lang="ts">
	import { onMount } from 'svelte';
	import { posterStore } from '$lib/stores/poster.svelte';
	import PosterMap from './PosterMap.svelte';

	const POSTER_WIDTH = 1600;
	const POSTER_HEIGHT = 2240;

	let containerEl: HTMLDivElement;
	let scale = $state(1);

	function calculateScale() {
		if (!containerEl) return;

		const containerRect = containerEl.getBoundingClientRect();
		const availableWidth = containerRect.width - 40;
		const availableHeight = containerRect.height - 40;

		const scaleX = availableWidth / POSTER_WIDTH;
		const scaleY = availableHeight / POSTER_HEIGHT;

		scale = Math.min(scaleX, scaleY, 1);
	}

	onMount(() => {
		calculateScale();
		window.addEventListener('resize', calculateScale);
		return () => window.removeEventListener('resize', calculateScale);
	});

	const raceName = $derived(posterStore.data.raceName || 'RACE NAME');
	const runnerName = $derived(posterStore.data.runnerName || 'RUNNER NAME');
	const bibNumber = $derived(posterStore.data.bibNumber);
	const formattedDate = $derived(posterStore.formattedDate);
	const formattedDistance = $derived(posterStore.formattedDistance);
	const finishTime = $derived(posterStore.data.finishTime || "--:--'--\"");
	const formattedPace = $derived(posterStore.formattedPace);
	const unit = $derived(posterStore.data.unit);
	const paceLabel = $derived(posterStore.paceLabel);
	const theme = $derived(posterStore.data.theme);
</script>

<div class="poster-viewport" bind:this={containerEl}>
	<div
		class="poster-scale-wrapper"
		style="transform: scale({scale}); transform-origin: center center;"
	>
		<div class="poster" data-theme={theme} data-poster-export>
			<header class="poster-header">
				<h1 class="race-name">{raceName.toUpperCase()}</h1>
				<p class="race-date">{formattedDate}</p>
			</header>

			<div class="poster-map-container">
				<PosterMap />
			</div>

			<div class="poster-divider"></div>

			<div class="runner-info">
				<span class="runner-name">{runnerName.toUpperCase()}</span>
				{#if bibNumber}
					<span class="bib-number">#{bibNumber}</span>
				{/if}
			</div>

			<div class="stats-row">
				<div class="stat">
					<span class="stat-value">{formattedDistance}</span>
					<span class="stat-label">{unit.toUpperCase()}</span>
				</div>
				<div class="stat">
					<span class="stat-value">{finishTime}</span>
					<span class="stat-label">TIME</span>
				</div>
				<div class="stat">
					<span class="stat-value">{formattedPace}</span>
					<span class="stat-label">{paceLabel}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.poster-viewport {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px;
		overflow: hidden;
	}

	.poster-scale-wrapper {
		flex-shrink: 0;
	}

	.poster {
		width: 1600px;
		height: 2240px;
		background-color: var(--color-bg);
		color: var(--color-text);
		display: flex;
		flex-direction: column;
		padding: 80px 60px;
		box-sizing: border-box;
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.25),
			0 0 0 1px rgba(0, 0, 0, 0.05);
		border-radius: 4px;
	}

	.poster-header {
		text-align: center;
		margin-bottom: 50px;
	}

	.race-name {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 72px;
		letter-spacing: 0.08em;
		margin: 0 0 16px 0;
		line-height: 1.1;
	}

	.race-date {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 32px;
		margin: 0;
		opacity: 0.6;
		letter-spacing: 0.02em;
	}

	.poster-map-container {
		flex: 1;
		min-height: 0;
		max-height: 1300px;
		margin: 0 0 50px 0;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
	}

	.poster-divider {
		height: 3px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			currentColor 20%,
			currentColor 80%,
			transparent 100%
		);
		opacity: 0.15;
		margin: 0 0 50px 0;
	}

	.runner-info {
		text-align: center;
		margin-bottom: 50px;
	}

	.runner-name {
		font-family: var(--font-heading);
		font-weight: 500;
		font-size: 44px;
		letter-spacing: 0.05em;
	}

	.bib-number {
		font-family: var(--font-heading);
		font-weight: 500;
		font-size: 44px;
		margin-left: 20px;
		opacity: 0.5;
	}

	.stats-row {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 120px;
	}

	.stat {
		text-align: center;
	}

	.stat-value {
		display: block;
		font-family: var(--font-heading);
		font-weight: 500;
		font-size: 56px;
		letter-spacing: 0.02em;
	}

	.stat-label {
		display: block;
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 18px;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		opacity: 0.5;
		margin-top: 12px;
	}
</style>
