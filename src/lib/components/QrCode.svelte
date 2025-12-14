<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		url: string;
		size?: number;
		color?: string;
	}

	let { url, size = 120, color = '#000000' }: Props = $props();

	let containerEl: HTMLDivElement;

	onMount(() => {
		import('qr-code-styling').then(({ default: QRCodeStyling }) => {
			const qrCode = new QRCodeStyling({
				width: size,
				height: size,
				data: url,
				dotsOptions: {
					color: color,
					type: 'rounded'
				},
				backgroundOptions: {
					color: 'transparent'
				},
				cornersSquareOptions: {
					type: 'extra-rounded'
				},
				cornersDotOptions: {
					type: 'dot'
				}
			});

			if (containerEl) {
				qrCode.append(containerEl);
			}
		});
	});

	onDestroy(() => {
		if (containerEl) {
			containerEl.innerHTML = '';
		}
	});
</script>

<div class="qr-container" bind:this={containerEl}></div>

<style>
	.qr-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.qr-container :global(canvas) {
		display: block;
	}
</style>
