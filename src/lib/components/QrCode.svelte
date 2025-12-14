<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { QrDotStyle } from '$lib/types/index.js';

	interface Props {
		url: string;
		size?: number;
		color?: string;
		dotStyle?: QrDotStyle;
		gradientEnabled?: boolean;
	}

	let { url, size = 120, color = '#000000', dotStyle = 'rounded', gradientEnabled = false }: Props = $props();

	let containerEl: HTMLDivElement;

	function lightenColor(hex: string, percent: number): string {
		const num = parseInt(hex.replace('#', ''), 16);
		const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent));
		const g = Math.min(255, Math.floor(((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * percent));
		const b = Math.min(255, Math.floor((num & 0x0000ff) + (255 - (num & 0x0000ff)) * percent));
		return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
	}

	onMount(() => {
		import('qr-code-styling').then(({ default: QRCodeStyling }) => {
			const dotsOptions: Record<string, unknown> = {
				type: dotStyle
			};

			if (gradientEnabled) {
				dotsOptions.gradient = {
					type: 'linear',
					rotation: 45,
					colorStops: [
						{ offset: 0, color: color },
						{ offset: 1, color: lightenColor(color, 0.4) }
					]
				};
			} else {
				dotsOptions.color = color;
			}

			const options: ConstructorParameters<typeof QRCodeStyling>[0] = {
				width: size,
				height: size,
				data: url,
				dotsOptions,
				backgroundOptions: {
					color: 'transparent'
				},
				cornersSquareOptions: {
					type: 'extra-rounded'
				},
				cornersDotOptions: {
					type: 'dot'
				}
			};

			const qrCode = new QRCodeStyling(options);

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
