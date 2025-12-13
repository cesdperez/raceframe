<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		url: string;
		size?: number;
		color?: string;
	}

	let { url, size = 120, color = '#000000' }: Props = $props();

	let containerEl: HTMLDivElement;
	let qrCode: any = null;

	onMount(() => {
		import('qr-code-styling').then(({ default: QRCodeStyling }) => {
			qrCode = new QRCodeStyling({
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

	$effect(() => {
		if (qrCode) {
			qrCode.update({
				data: url,
				dotsOptions: { color }
			});
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
