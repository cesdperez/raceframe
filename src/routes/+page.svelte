<script lang="ts">
	import { tick, onMount } from "svelte";
	import { fly } from "svelte/transition";
	import type { AppView, UploadError, GPXData } from "$lib/types/index.js";
	import { posterStore } from "$lib/stores/poster.svelte.js";
	import FileUpload from "$lib/components/FileUpload.svelte";
	import ErrorMessage from "$lib/components/ErrorMessage.svelte";
	import PosterPreview from "$lib/components/PosterPreview.svelte";
	import EditorPanel from "$lib/components/EditorPanel.svelte";

	let currentView = $state<AppView>("landing");
	let uploadError = $state<UploadError | null>(null);
	let statusMessage = $state("");

	let isMobile = $state(false);
	let isPreviewEnlarged = $state(false);

	let editorHeading = $state<HTMLHeadingElement | null>(null);

	const activities = ["running", "cycling"];
	let activityIndex = $state(0);

	onMount(() => {
		const mobileMediaQuery = window.matchMedia("(max-width: 1023px)");
		isMobile = mobileMediaQuery.matches;

		const handleMobileChange = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
		};
		mobileMediaQuery.addEventListener("change", handleMobileChange);

		const reducedMotionQuery = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);
		if (reducedMotionQuery.matches) {
			return () =>
				mobileMediaQuery.removeEventListener(
					"change",
					handleMobileChange,
				);
		}

		const interval = setInterval(() => {
			activityIndex = (activityIndex + 1) % activities.length;
		}, 3000);

		return () => {
			mobileMediaQuery.removeEventListener("change", handleMobileChange);
			clearInterval(interval);
		};
	});

	async function handleUploadSuccess(gpxData: GPXData) {
		posterStore.loadFromGPX(gpxData);
		currentView = "editor";
		uploadError = null;
		statusMessage =
			"GPX file loaded successfully. You can now customize your poster.";
		await tick();
		editorHeading?.focus();
	}

	function handleUploadError(error: UploadError) {
		uploadError = error;
		statusMessage = `Error: ${error.message}`;
	}

	function handleDismissError() {
		uploadError = null;
		statusMessage = "";
	}

	function handleStartOver() {
		posterStore.reset();
		currentView = "landing";
		uploadError = null;
		statusMessage = "";
	}

	async function handleDemoMode() {
		posterStore.loadDemoData();
		currentView = "editor";
		statusMessage = "Demo mode loaded. Some features are limited.";
		await tick();
		editorHeading?.focus();
	}

	function togglePreviewEnlarged() {
		isPreviewEnlarged = !isPreviewEnlarged;
	}

	let isPreviewEnlargedOnMobile = $derived(isMobile && isPreviewEnlarged);

	$effect(() => {
		if (currentView === "editor" && isPreviewEnlargedOnMobile) {
			document.body.classList.add("scroll-locked");
		} else {
			document.body.classList.remove("scroll-locked");
		}
	});
</script>

<a href="#main-content" class="skip-link">Skip to main content</a>

<div aria-live="polite" aria-atomic="true" class="sr-only">
	{statusMessage}
</div>

<div class="min-h-screen flex flex-col">
	{#if currentView === "landing"}
		<main
			id="main-content"
			class="landing-main flex-1 flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden"
		>
			<!-- Decorative background elements -->
			<div class="landing-bg-pattern" aria-hidden="true"></div>
			<div
				class="landing-gradient-orb landing-gradient-orb-1"
				aria-hidden="true"
			></div>
			<div
				class="landing-gradient-orb landing-gradient-orb-2"
				aria-hidden="true"
			></div>

			<div class="max-w-2xl mx-auto text-center relative z-10">
				<!-- Hero Title -->
				<h1
					class="animate-stagger-1 text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
					style="font-family: var(--font-heading); letter-spacing: -0.02em;"
				>
					<span
						class="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] via-[var(--accent-gold)] to-[var(--brand-primary)]"
					>
						RaceFrame
					</span>
				</h1>

				<!-- Tagline with animated activity word -->
				<p
					class="animate-stagger-2 text-xl md:text-2xl lg:text-3xl text-text-primary mb-6 min-h-[1.5em] text-center leading-relaxed font-medium"
				>
					Create beautiful
					<span class="activity-word-container">
						<span class="sr-only">running and cycling</span>
						{#key activityIndex}
							<span
								in:fly={{ y: 20, duration: 500, delay: 150 }}
								out:fly={{ y: -20, duration: 400 }}
								class="activity-word"
								aria-hidden="true"
							>
								{activities[activityIndex]}
							</span>
						{/key}
						<span class="invisible font-bold" aria-hidden="true"
							>running</span
						>
					</span>
					posters
				</p>

				<p
					class="animate-stagger-3 text-text-secondary mb-10 max-w-lg mx-auto text-base md:text-lg leading-relaxed"
				>
					Upload your race data, customize the design, and download a
					print-ready poster.
					<span class="text-text-muted"
						>Free, private, works with any GPX source.</span
					>
				</p>

				<!-- File Upload -->
				<div class="animate-stagger-4 mb-5 md:mb-6">
					<FileUpload
						onSuccess={handleUploadSuccess}
						onError={handleUploadError}
					/>
				</div>

				<!-- Demo Mode Button -->
				<button
					onclick={handleDemoMode}
					class="animate-stagger-4 group inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-white/80 hover:bg-white border border-border-default/80 rounded-full text-sm font-medium text-text-secondary hover:text-brand-primary transition-all duration-300 active:scale-[0.97] shadow-sm hover:shadow-md hover:border-brand-primary/30"
				>
					<svg
						class="w-4 h-4 transition-transform group-hover:scale-110"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						/>
					</svg>
					<span>No GPX? Explore the editor</span>
					<svg
						class="w-4 h-4 transition-transform group-hover:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>

				{#if uploadError}
					<div class="mb-8 max-w-md mx-auto mt-4">
						<ErrorMessage
							error={uploadError}
							onDismiss={handleDismissError}
						/>
					</div>
				{/if}

				<!-- Feature Cards -->
				<div
					class="animate-stagger-5 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left mt-12"
				>
					<div class="feature-card group">
						<div class="feature-icon feature-icon-upload">
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>
						<div>
							<h3
								class="feature-title"
								style="font-family: var(--font-heading);"
							>
								Upload
							</h3>
							<p class="feature-description">
								Drop your GPX file from Strava, Garmin, or any
								GPS device
							</p>
						</div>
					</div>
					<div class="feature-card group">
						<div class="feature-icon feature-icon-customize">
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
						</div>
						<div>
							<h3
								class="feature-title"
								style="font-family: var(--font-heading);"
							>
								Customize
							</h3>
							<p class="feature-description">
								Edit details, choose themes, and personalize
								your poster
							</p>
						</div>
					</div>
					<div class="feature-card group">
						<div class="feature-icon feature-icon-download">
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
						</div>
						<div>
							<h3
								class="feature-title"
								style="font-family: var(--font-heading);"
							>
								Download
							</h3>
							<p class="feature-description">
								Export print-ready PNG at 300 DPI for perfect
								prints
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	{:else if currentView === "editor"}
		<main
			id="main-content"
			class="editor-main flex-1 flex flex-col lg:flex-row min-h-0 view-fade-in overflow-hidden"
		>
			<div
				class="preview-container bg-surface-subtle relative overflow-hidden"
				class:preview-enlarged={isPreviewEnlargedOnMobile}
				role="img"
				aria-label="Poster preview showing your race route and details"
			>
				<div class="preview-header">
					<button
						onclick={handleStartOver}
						class="header-btn"
						aria-label="Go back to upload"
						title="Start over"
					>
						<svg
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
					</button>
					{#if isMobile}
						<button
							onclick={togglePreviewEnlarged}
							class="header-btn"
							aria-label={isPreviewEnlarged
								? "Show editor panel"
								: "Enlarge preview"}
							title={isPreviewEnlarged
								? "Show editor panel"
								: "Enlarge preview"}
						>
							{#if isPreviewEnlarged}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
									/>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
									/>
								</svg>
							{/if}
						</button>
					{/if}
				</div>
				<PosterPreview
					{isMobile}
					{isPreviewEnlarged}
					onToggleEnlarged={togglePreviewEnlarged}
				/>
			</div>

			<aside
				class="editor-aside w-full lg:w-80 xl:w-96 bg-white border-t lg:border-t-0 lg:border-l border-border-default flex-shrink-0 flex flex-col"
				class:editor-aside-hidden={isPreviewEnlargedOnMobile}
				aria-label="Poster customization options"
			>
				<div
					class="p-3 md:p-4 border-b border-border-default flex-shrink-0"
				>
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

	<footer
		class="py-6 text-center text-sm text-text-muted transition-opacity duration-300"
		class:footer-hidden={isPreviewEnlargedOnMobile}
	>
		<a
			href="https://github.com/cesdperez/raceframe"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-2 hover:text-text-secondary transition-colors"
		>
			<svg
				viewBox="0 0 24 24"
				class="w-4 h-4 fill-current"
				aria-hidden="true"
			>
				<path
					d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
				/>
			</svg>
			<span>cesdperez/raceframe</span>
		</a>
	</footer>
</div>

<style>
	/* Landing page styles */
	.landing-main {
		background: linear-gradient(
			180deg,
			#fffbf7 0%,
			#ffffff 60%,
			#fffaf5 100%
		);
	}

	.landing-bg-pattern {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(
				circle at 20% 30%,
				rgba(255, 77, 0, 0.03) 0%,
				transparent 50%
			),
			radial-gradient(
				circle at 80% 70%,
				rgba(255, 215, 0, 0.04) 0%,
				transparent 50%
			);
		pointer-events: none;
	}

	.landing-gradient-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		pointer-events: none;
		opacity: 0.5;
	}

	.landing-gradient-orb-1 {
		width: 400px;
		height: 400px;
		top: -100px;
		right: -100px;
		background: radial-gradient(
			circle,
			rgba(255, 77, 0, 0.12) 0%,
			transparent 70%
		);
	}

	.landing-gradient-orb-2 {
		width: 300px;
		height: 300px;
		bottom: 10%;
		left: -50px;
		background: radial-gradient(
			circle,
			rgba(255, 215, 0, 0.15) 0%,
			transparent 70%
		);
	}

	/* Activity word animation */
	.activity-word-container {
		position: relative;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
	}

	.activity-word {
		position: absolute;
		font-weight: 700;
		color: var(--brand-primary);
		white-space: nowrap;
	}

	/* Feature cards */
	.feature-card {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		border-radius: 1rem;
		transition: all 0.3s ease;
	}

	.feature-card:hover {
		background: rgba(255, 255, 255, 0.8);
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
	}

	.feature-icon {
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.feature-icon-upload {
		background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
		color: var(--brand-primary);
		box-shadow: 0 2px 8px rgba(255, 77, 0, 0.15);
	}

	.feature-icon-customize {
		background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
		color: #ca8a04;
		box-shadow: 0 2px 8px rgba(202, 138, 4, 0.15);
	}

	.feature-icon-download {
		background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
		color: #059669;
		box-shadow: 0 2px 8px rgba(5, 150, 105, 0.15);
	}

	.group:hover .feature-icon {
		transform: scale(1.05);
	}

	.feature-title {
		font-size: 1.125rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
		color: var(--text-primary);
		letter-spacing: 0.02em;
	}

	.feature-description {
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	/* Mobile adjustments */
	@media (max-width: 767px) {
		.landing-gradient-orb-1 {
			width: 250px;
			height: 250px;
			top: -50px;
			right: -80px;
		}

		.landing-gradient-orb-2 {
			width: 200px;
			height: 200px;
			bottom: 5%;
			left: -60px;
		}

		.feature-card {
			padding: 0.75rem;
		}

		.feature-icon {
			width: 44px;
			height: 44px;
			border-radius: 12px;
		}
	}

	/* Editor styles */
	.preview-container {
		flex: 1;
		min-height: 400px;
	}

	@media (max-width: 1023px) {
		.preview-container {
			flex: none;
			height: 50vh;
			min-height: 0;
		}

		.preview-container.preview-enlarged {
			height: 100vh;
		}
	}

	@media (min-width: 768px) and (max-width: 1023px) {
		.preview-container {
			height: 60vh;
		}
	}

	.editor-aside-hidden {
		height: 0;
		border-top-width: 0;
		opacity: 0;
		overflow: hidden;
	}

	.footer-hidden {
		opacity: 0;
		pointer-events: none;
	}

	.preview-header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		z-index: 20;
	}

	.header-btn {
		width: 44px;
		height: 44px;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s ease;
		color: var(--text-primary);
	}

	.header-btn:hover {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.header-btn:active {
		transform: scale(0.95);
	}

	.header-btn svg {
		width: 20px;
		height: 20px;
	}
</style>
