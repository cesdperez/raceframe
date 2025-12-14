<script lang="ts">
	import { onMount } from 'svelte';
	import { posterStore } from '$lib/stores/poster.svelte';
	import PosterMap from './PosterMap.svelte';
	import QrCode from './QrCode.svelte';

	let containerEl: HTMLDivElement;
	let scale = $state(1);

	const posterWidth = $derived(posterStore.posterWidth);
	const posterHeight = $derived(posterStore.posterHeight);
	const layout = $derived(posterStore.data.layout);

	function calculateScale() {
		if (!containerEl) return;

		const containerRect = containerEl.getBoundingClientRect();
		const availableWidth = containerRect.width - 40;
		const availableHeight = containerRect.height - 40;

		const scaleX = availableWidth / posterWidth;
		const scaleY = availableHeight / posterHeight;

		scale = Math.min(scaleX, scaleY, 1);
	}

	onMount(() => {
		calculateScale();
		window.addEventListener('resize', calculateScale);
		return () => window.removeEventListener('resize', calculateScale);
	});

	$effect(() => {
		posterWidth;
		posterHeight;
		calculateScale();
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
	const customBgColor = $derived(posterStore.data.customBgColor);
	const customTextColor = $derived(posterStore.data.customTextColor);
	const qrCodeUrl = $derived(posterStore.data.qrCodeUrl);
	const qrDotStyle = $derived(posterStore.data.qrDotStyle);
	const qrGradientEnabled = $derived(posterStore.data.qrGradientEnabled);

	const mapMaxHeight = $derived(Math.round(posterHeight * 0.58));
</script>

<div class="poster-viewport" bind:this={containerEl}>
	<div
		class="poster-scale-wrapper"
		style="transform: scale({scale}); transform-origin: center center;"
	>
		{#if layout === 'medal-right'}
			<!-- Medal Right: Two-column landscape layout -->
			<div
				class="poster poster-landscape"
				data-theme={theme}
				data-poster-export
				style:--color-bg={customBgColor}
				style:--color-text={customTextColor}
				style:width="{posterWidth}px"
				style:height="{posterHeight}px"
			>
				<div class="poster-column-left">
					<header class="poster-header-landscape">
						<h1 class="race-name-landscape">{raceName.toUpperCase()}</h1>
						<p class="race-date-landscape">{formattedDate}</p>
					</header>

					<div class="poster-map-container-landscape">
						<PosterMap />
					</div>
				</div>

				<div class="poster-column-right">
					<div class="medal-zone" data-medal-zone>
						<svg class="medal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<circle cx="12" cy="9" r="6" />
							<path d="M9 14.5L7 22l5-3 5 3-2-7.5" />
						</svg>
					</div>

					<div class="achievement-section">
						<div class="runner-info-landscape">
							<span class="runner-name-landscape">{runnerName.toUpperCase()}</span>
							{#if bibNumber}
								<span class="bib-number-landscape">#{bibNumber}</span>
							{/if}
						</div>

						<div class="stats-row-landscape">
							<div class="stat-landscape">
								<span class="stat-value-landscape">{formattedDistance}</span>
								<span class="stat-label-landscape">{unit.toUpperCase()}</span>
							</div>
							<div class="stat-landscape">
								<span class="stat-value-landscape">{finishTime}</span>
								<span class="stat-label-landscape">TIME</span>
							</div>
							<div class="stat-landscape">
								<span class="stat-value-landscape">{formattedPace}</span>
								<span class="stat-label-landscape">{paceLabel}</span>
							</div>
						</div>

						{#if qrCodeUrl}
							<div class="qr-code-container-landscape">
								{#key `${qrCodeUrl}-${posterStore.effectiveTextColor}-${qrDotStyle}-${qrGradientEnabled}`}
									<QrCode url={qrCodeUrl} size={100} color={posterStore.effectiveTextColor} dotStyle={qrDotStyle} gradientEnabled={qrGradientEnabled} />
								{/key}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<!-- Classic: Vertical portrait layout -->
			<div
				class="poster"
				data-theme={theme}
				data-poster-export
				style:--color-bg={customBgColor}
				style:--color-text={customTextColor}
				style:width="{posterWidth}px"
				style:height="{posterHeight}px"
			>
				<header class="poster-header">
					<h1 class="race-name">{raceName.toUpperCase()}</h1>
					<p class="race-date">{formattedDate}</p>
				</header>

				<div class="poster-map-container" style:max-height="{mapMaxHeight}px">
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

				{#if qrCodeUrl}
					<div class="qr-code-container">
						{#key `${qrCodeUrl}-${posterStore.effectiveTextColor}-${qrDotStyle}-${qrGradientEnabled}`}
							<QrCode url={qrCodeUrl} size={120} color={posterStore.effectiveTextColor} dotStyle={qrDotStyle} gradientEnabled={qrGradientEnabled} />
						{/key}
					</div>
				{/if}
			</div>
		{/if}
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

	/* Classic (Portrait) Layout Styles */
	.poster {
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

	.qr-code-container {
		display: flex;
		justify-content: center;
		margin-top: 40px;
	}

	/* Medal Right (Landscape) Layout Styles */
	.poster-landscape {
		background-color: var(--color-bg);
		color: var(--color-text);
		display: flex;
		flex-direction: row;
		padding: 60px;
		box-sizing: border-box;
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.25),
			0 0 0 1px rgba(0, 0, 0, 0.05);
		border-radius: 4px;
	}

	.poster-column-left {
		width: 50%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding-right: 40px;
	}

	.poster-column-right {
		width: 50%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding-left: 40px;
		border-left: 1px solid currentColor;
		border-left-color: rgba(128, 128, 128, 0.15);
	}

	.poster-header-landscape {
		text-align: center;
		margin-bottom: 40px;
	}

	.race-name-landscape {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 52px;
		letter-spacing: 0.08em;
		margin: 0 0 12px 0;
		line-height: 1.1;
	}

	.race-date-landscape {
		font-family: var(--font-heading);
		font-weight: 400;
		font-size: 24px;
		margin: 0;
		opacity: 0.6;
		letter-spacing: 0.02em;
	}

	.poster-map-container-landscape {
		flex: 1;
		min-height: 0;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
	}

	.medal-zone {
		flex: 70;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2px dashed currentColor;
		border-radius: 12px;
		opacity: 0.25;
	}

	.medal-icon {
		width: 80px;
		height: 80px;
		opacity: 0.6;
	}

	.achievement-section {
		flex: 30;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
	}

	.runner-info-landscape {
		text-align: center;
		white-space: nowrap;
	}

	.runner-name-landscape {
		font-family: var(--font-heading);
		font-weight: 500;
		font-size: 36px;
		letter-spacing: 0.05em;
	}

	.bib-number-landscape {
		font-family: var(--font-heading);
		font-weight: 500;
		font-size: 36px;
		margin-left: 16px;
		opacity: 0.5;
	}

	.stats-row-landscape {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 48px;
	}

	.stat-landscape {
		text-align: center;
	}

	.stat-value-landscape {
		display: block;
		font-family: var(--font-heading);
		font-weight: 500;
		font-size: 36px;
		letter-spacing: 0.02em;
	}

	.stat-label-landscape {
		display: block;
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		opacity: 0.5;
		margin-top: 8px;
	}

	.qr-code-container-landscape {
		display: flex;
		justify-content: center;
	}
</style>
