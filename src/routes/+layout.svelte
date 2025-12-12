<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>RaceFrame - Create Race Posters from GPX Files</title>
</svelte:head>

{@render children()}
