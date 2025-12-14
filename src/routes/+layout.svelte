<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="{base}/favicon.svg" type="image/svg+xml" />
	<title>RaceFrame - Create Race Posters from GPX Files</title>
</svelte:head>

{@render children()}
