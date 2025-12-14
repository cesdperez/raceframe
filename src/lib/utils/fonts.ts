export interface FontSpec {
	family: string;
	weight: string;
	size?: string;
}

export const REQUIRED_FONTS: FontSpec[] = [
	{ family: 'Oswald', weight: '400' },
	{ family: 'Oswald', weight: '500' },
	{ family: 'Oswald', weight: '600' },
	{ family: 'Inter', weight: '400' }
];

const GOOGLE_FONTS_CSS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Oswald:wght@400;500;600&display=swap';

let cachedFontCss: string | null = null;

export function areFontsLoaded(fonts: FontSpec[] = REQUIRED_FONTS): boolean {
	return fonts.every((font) => {
		const testSize = font.size || '16px';
		return document.fonts.check(`${font.weight} ${testSize} "${font.family}"`);
	});
}

export async function waitForFonts(timeout = 5000): Promise<boolean> {
	try {
		await Promise.race([
			document.fonts.ready,
			new Promise<never>((_, reject) =>
				setTimeout(() => reject(new Error('Font loading timeout')), timeout)
			)
		]);

		if (areFontsLoaded()) {
			return true;
		}

		const startTime = Date.now();
		while (Date.now() - startTime < timeout) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			if (areFontsLoaded()) {
				return true;
			}
		}

		console.warn('Fonts did not load within timeout, proceeding anyway');
		return false;
	} catch (error) {
		console.warn('Font loading error:', error);
		return false;
	}
}

async function fetchFontAsBase64(url: string): Promise<string> {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
	const mimeType = url.includes('.woff2')
		? 'font/woff2'
		: url.includes('.woff')
			? 'font/woff'
			: 'font/truetype';
	return `data:${mimeType};base64,${base64}`;
}

async function fetchGoogleFontsCss(): Promise<string> {
	const response = await fetch(GOOGLE_FONTS_CSS_URL, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
		}
	});
	return response.text();
}

export async function getEmbeddedFontCss(): Promise<string> {
	if (cachedFontCss) {
		return cachedFontCss;
	}

	try {
		const css = await fetchGoogleFontsCss();

		const urlRegex = /url\(([^)]+)\)/g;
		const urls = new Set<string>();
		let match;

		while ((match = urlRegex.exec(css)) !== null) {
			const url = match[1].replace(/['"]/g, '');
			if (url.startsWith('http')) {
				urls.add(url);
			}
		}

		const urlToDataUrl = new Map<string, string>();
		await Promise.all(
			Array.from(urls).map(async (url) => {
				try {
					const dataUrl = await fetchFontAsBase64(url);
					urlToDataUrl.set(url, dataUrl);
				} catch (e) {
					console.warn(`Failed to fetch font: ${url}`, e);
				}
			})
		);

		let embeddedCss = css;
		for (const [url, dataUrl] of urlToDataUrl) {
			embeddedCss = embeddedCss.replaceAll(`url(${url})`, `url(${dataUrl})`);
		}

		cachedFontCss = embeddedCss;
		return embeddedCss;
	} catch (error) {
		console.warn('Failed to embed fonts:', error);
		return '';
	}
}

export async function loadFonts(): Promise<void> {
	const fontLoadPromises = REQUIRED_FONTS.map(async (font) => {
		try {
			const fontFace = new FontFace(font.family, `local("${font.family}")`, {
				weight: font.weight
			});
			await fontFace.load();
		} catch {
			// Font might already be loaded via CSS, which is fine
		}
	});

	await Promise.allSettled(fontLoadPromises);
	await document.fonts.ready;
}
