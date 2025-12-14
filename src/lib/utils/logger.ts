const isDev = import.meta.env.DEV;

export function warnDev(message: string, ...args: unknown[]): void {
	if (isDev) {
		console.warn(message, ...args);
	}
}
