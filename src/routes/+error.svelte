<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Page Not Found - RaceFrame</title>
</svelte:head>

<main class="error-page">
	<div class="error-content">
		<h1>404</h1>
		<p class="message">{page.error?.message || 'Page not found'}</p>
		<p class="description">The page you're looking for doesn't exist or has been moved.</p>
		<a href="{base}/" class="home-link">Go to RaceFrame</a>
	</div>
</main>

<style>
	.error-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg);
		color: var(--color-text);
		padding: 2rem;
	}

	.error-content {
		text-align: center;
		max-width: 400px;
	}

	h1 {
		font-family: 'Oswald', sans-serif;
		font-size: 8rem;
		font-weight: 600;
		line-height: 1;
		margin: 0;
		color: var(--color-accent, #3b82f6);
	}

	.message {
		font-size: 1.5rem;
		font-weight: 500;
		margin: 1rem 0;
	}

	.description {
		color: var(--color-text-secondary, #6b7280);
		margin-bottom: 2rem;
	}

	.home-link {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: var(--color-accent, #3b82f6);
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
		font-weight: 500;
		transition: opacity 0.2s;
	}

	.home-link:hover {
		opacity: 0.9;
	}
</style>
