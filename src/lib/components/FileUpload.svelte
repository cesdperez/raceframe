<script lang="ts">
	import { onMount } from "svelte";
	import type { GPXData, UploadError } from "$lib/types/index.js";
	import { parseGPX } from "$lib/utils/gpx.js";
	import { validateGpxFile } from "$lib/utils/validation.js";
	import LoadingSpinner from "./LoadingSpinner.svelte";

	let {
		onSuccess,
		onError,
	}: {
		onSuccess: (gpxData: GPXData) => void;
		onError: (error: UploadError) => void;
	} = $props();

	let isDragging = $state(false);
	let isLoading = $state(false);
	let fileInput: HTMLInputElement;

	let isHydrated = $state(false);
	onMount(() => {
		isHydrated = true;
	});

	async function processFile(file: File) {
		const validationError = validateGpxFile(file);
		if (validationError) {
			onError(validationError);
			return;
		}

		isLoading = true;
		try {
			const text = await file.text();
			const gpxData = parseGPX(text);
			onSuccess(gpxData);
		} catch (e) {
			onError({
				message:
					e instanceof Error ? e.message : "Failed to parse GPX file",
				type: "parse-error",
			});
		} finally {
			isLoading = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) processFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleClick() {
		fileInput?.click();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick();
		}
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) processFile(file);
		input.value = "";
	}
</script>

<div
	role="button"
	tabindex="0"
	aria-label="Upload GPX file. Drop your file here or press Enter to browse"
	aria-busy={isLoading}
	class="upload-zone"
	class:upload-zone-dragging={isDragging}
	class:upload-zone-loading={isLoading}
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	onclick={handleClick}
	onkeydown={handleKeyDown}
>
	<!-- Animated route path background -->
	<svg
		class="upload-bg-pattern"
		viewBox="0 0 400 200"
		preserveAspectRatio="xMidYMid slice"
		aria-hidden="true"
	>
		<path
			class="route-path"
			d="M20,100 Q60,40 100,80 T180,60 T260,100 T340,80 T380,100"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<path
			class="route-path route-path-2"
			d="M20,140 Q80,180 140,140 T260,160 T380,130"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
	</svg>

	<div class="upload-content">
		{#if isLoading}
			<div class="upload-icon upload-icon-loading">
				<LoadingSpinner size="lg" />
			</div>
			<p class="upload-text-primary">Processing your race...</p>
		{:else}
			<div class="upload-icon" class:upload-icon-drag={isDragging}>
				<svg
					class="w-8 h-8 md:w-10 md:h-10"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M9 8l3-3m0 0l3 3m-3-3v10"
					/>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M12 15v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4m16 0v4a1 1 0 01-1 1h-6a1 1 0 01-1-1v-4"
						opacity="0.5"
					/>
				</svg>
			</div>
			<p class="upload-text-primary">
				{isDragging ? "Drop it!" : "Drop your race here"}
			</p>
			<p class="upload-text-secondary">or click to browse</p>
			<div class="upload-badge">
				<svg
					class="w-3 h-3"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
				<span>Your data stays private</span>
			</div>
		{/if}
	</div>
</div>

<input
	bind:this={fileInput}
	type="file"
	accept=".gpx"
	class="hidden"
	data-upload-ready={isHydrated || undefined}
	onchange={handleFileChange}
/>

<style>
	.upload-zone {
		position: relative;
		padding: 1.5rem 1rem;
		min-height: 150px;
		border-radius: 1rem;
		cursor: pointer;
		overflow: hidden;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		/* Gradient border effect */
		background:
			linear-gradient(#fff, #fff) padding-box,
			linear-gradient(
					135deg,
					var(--brand-primary) 0%,
					var(--accent-gold) 50%,
					var(--brand-primary) 100%
				)
				border-box;
		border: 2px solid transparent;
		box-shadow:
			0 4px 20px rgba(255, 77, 0, 0.08),
			0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.upload-zone:hover {
		transform: translateY(-2px);
		box-shadow:
			0 8px 30px rgba(255, 77, 0, 0.12),
			0 2px 6px rgba(0, 0, 0, 0.06);
	}

	.upload-zone:active:not(.upload-zone-loading) {
		transform: translateY(0) scale(0.99);
	}

	.upload-zone-dragging {
		background:
			linear-gradient(#fffbf5, #fff7ed) padding-box,
			linear-gradient(
					135deg,
					var(--brand-primary) 0%,
					var(--accent-gold) 100%
				)
				border-box;
		border-width: 3px;
		box-shadow:
			0 0 0 4px rgba(255, 77, 0, 0.1),
			0 12px 40px rgba(255, 77, 0, 0.2);
		animation: borderGlow 1.5s ease-in-out infinite;
	}

	.upload-zone-loading {
		cursor: wait;
		opacity: 0.85;
	}

	/* Background pattern */
	.upload-bg-pattern {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		color: rgba(255, 77, 0, 0.06);
		pointer-events: none;
	}

	.route-path {
		stroke-dasharray: 8 12;
		animation: drawRoute 20s linear infinite;
	}

	.route-path-2 {
		stroke-dasharray: 6 14;
		animation: drawRoute 25s linear infinite reverse;
		opacity: 0.6;
	}

	.upload-zone-dragging .upload-bg-pattern {
		color: rgba(255, 77, 0, 0.12);
	}

	.upload-zone-dragging .route-path {
		animation-duration: 8s;
	}

	@keyframes drawRoute {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: -200;
		}
	}

	/* Content */
	.upload-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.upload-icon {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
		color: var(--brand-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.75rem;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(255, 77, 0, 0.15);
	}

	.upload-icon-drag {
		transform: scale(1.1);
		background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%);
		box-shadow: 0 4px 16px rgba(255, 77, 0, 0.25);
	}

	.upload-icon-loading {
		background: transparent;
		box-shadow: none;
	}

	.upload-text-primary {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.upload-text-secondary {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.upload-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
		padding: 0.25rem 0.625rem;
		background: rgba(255, 77, 0, 0.06);
		border-radius: 9999px;
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.upload-badge svg {
		color: var(--brand-primary);
		opacity: 0.6;
	}

	/* Desktop adjustments */
	@media (min-width: 768px) {
		.upload-zone {
			padding: 2.5rem 2rem;
			min-height: 180px;
		}

		.upload-icon {
			width: 64px;
			height: 64px;
			margin-bottom: 1rem;
		}

		.upload-text-primary {
			font-size: 1.125rem;
		}
	}
</style>
