interface ReadinessState {
	map: boolean;
	qrCode: boolean;
}

class ExportReadyStore {
	private state = $state<ReadinessState>({
		map: false,
		qrCode: true
	});

	get isReady(): boolean {
		return this.state.map && this.state.qrCode;
	}

	get status(): ReadinessState {
		return { ...this.state };
	}

	setMapReady(ready: boolean): void {
		this.state.map = ready;
	}

	setQrCodeReady(ready: boolean): void {
		this.state.qrCode = ready;
	}

	async waitUntilReady(timeout = 10000): Promise<boolean> {
		const startTime = Date.now();
		const pollInterval = 50;

		while (Date.now() - startTime < timeout) {
			if (this.isReady) {
				return true;
			}
			await new Promise((resolve) => setTimeout(resolve, pollInterval));
		}

		console.warn('Export ready timeout. Status:', this.status);
		return false;
	}

	reset(): void {
		this.state.map = false;
		this.state.qrCode = true;
	}
}

export const exportReadyStore = new ExportReadyStore();
