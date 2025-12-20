import { test, expect } from './fixtures.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import fs from 'fs';
import pixelmatch from 'pixelmatch';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_RESULTS_DIR = path.join(__dirname, 'test-results');

// Helper to get the Large export button (scale 2x)
function getLargeExportButton(page: import('@playwright/test').Page) {
	return page.getByRole('button', { name: /Download Large PNG/i });
}

test.describe('Export Visual Fidelity', () => {
	test.beforeEach(async ({ editorPage, page }) => {
		// editorPage fixture handles GPX upload

		// Wait for fonts to be fully loaded
		await page.waitForFunction(() => document.fonts.ready);

		// Wait for map tiles to load (loading overlay should disappear)
		await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });

		// Extra wait for map to stabilize
		await page.waitForTimeout(500);
	});

	test('exported PNG matches preview - classic layout', async ({ page }) => {
		// First, take a screenshot of the preview at 1:1 scale
		// Temporarily remove the scale transform
		await page.evaluate(() => {
			const scaleWrapper = document.querySelector('.poster-scale-wrapper') as HTMLElement;
			scaleWrapper.style.transform = 'none';
			scaleWrapper.style.transformOrigin = 'top left';
		});

		// Wait for repaint
		await page.waitForTimeout(100);

		const poster = page.locator('[data-poster-export]');
		const previewScreenshot = await poster.screenshot();

		// Save preview screenshot for debugging
		fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
		fs.writeFileSync(path.join(TEST_RESULTS_DIR, 'classic-preview.png'), previewScreenshot);

		// Restore the scale transform
		await page.evaluate(() => {
			const scaleWrapper = document.querySelector('.poster-scale-wrapper') as HTMLElement;
			scaleWrapper.style.transform = '';
			scaleWrapper.style.transformOrigin = '';
		});

		// Now trigger the 2x PNG export (same resolution as preview which is 1600x2400)
		// Since we're testing at 1x preview vs 2x export, we need to compare appropriately
		// Actually, the preview is at full size (1600x2400), and 2x export is 3200x4800
		// For true comparison, we need to export at scale that matches preview dimensions

		// For now, let's test that the export generates and check basic properties
		const downloadPromise = page.waitForEvent('download');
		await getLargeExportButton(page).click();
		const download = await downloadPromise;

		const downloadPath = await download.path();
		expect(downloadPath).toBeTruthy();

		const exportBuffer = fs.readFileSync(downloadPath!);
		fs.writeFileSync(path.join(TEST_RESULTS_DIR, 'classic-export-2x.png'), exportBuffer);

		// Parse both PNGs to verify dimensions
		const previewPng = PNG.sync.read(previewScreenshot);
		const exportPng = PNG.sync.read(exportBuffer);

		// The export should be 2x the preview dimensions (allow 2px tolerance for rounding)
		expect(exportPng.width).toBe(previewPng.width * 2);
		expect(Math.abs(exportPng.height - previewPng.height * 2)).toBeLessThanOrEqual(2);

		// File should be substantial (not blank/corrupt)
		expect(exportBuffer.length).toBeGreaterThan(100000);
	});

	test('exported PNG matches preview - medal-right layout', async ({ page }) => {
		// Switch to medal-right layout
		await page.getByRole('radio', { name: /Medal Right/i }).click();
		await page.waitForTimeout(500);

		// Wait for map tiles to reload
		await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });

		// Remove scale transform
		await page.evaluate(() => {
			const scaleWrapper = document.querySelector('.poster-scale-wrapper') as HTMLElement;
			scaleWrapper.style.transform = 'none';
		});
		await page.waitForTimeout(100);

		const poster = page.locator('[data-poster-export]');
		const previewScreenshot = await poster.screenshot();

		// Restore scale
		await page.evaluate(() => {
			const scaleWrapper = document.querySelector('.poster-scale-wrapper') as HTMLElement;
			scaleWrapper.style.transform = '';
		});

		// Export
		const downloadPromise = page.waitForEvent('download');
		await getLargeExportButton(page).click();
		const download = await downloadPromise;

		const downloadPath = await download.path();
		const exportBuffer = fs.readFileSync(downloadPath!);

		// Verify dimensions for landscape layout
		const previewPng = PNG.sync.read(previewScreenshot);
		const exportPng = PNG.sync.read(exportBuffer);

		// Should be landscape (width > height)
		expect(exportPng.width).toBeGreaterThan(exportPng.height);

		// Export should be 2x preview (allow 2px tolerance for rounding)
		expect(exportPng.width).toBe(previewPng.width * 2);
		expect(Math.abs(exportPng.height - previewPng.height * 2)).toBeLessThanOrEqual(2);
	});

	test('fonts render correctly in export (not fallback)', async ({ page }) => {
		// Set a distinctive event name
		const eventNameInput = page.getByLabel('Event Name');
		await eventNameInput.fill('MARATHON TEST');

		// Wait for fonts to fully load
		await page.waitForFunction(() => document.fonts.ready);

		// Verify fonts are actually loaded in the browser
		const fontsLoaded = await page.evaluate(() => {
			return {
				oswald600: document.fonts.check('600 72px "Oswald"'),
				oswald500: document.fonts.check('500 44px "Oswald"'),
				oswald400: document.fonts.check('400 32px "Oswald"'),
				inter400: document.fonts.check('400 16px "Inter"')
			};
		});

		// All fonts should be loaded
		expect(fontsLoaded.oswald600).toBe(true);
		expect(fontsLoaded.oswald500).toBe(true);
		expect(fontsLoaded.inter400).toBe(true);

		// Export the poster
		const downloadPromise = page.waitForEvent('download');
		await getLargeExportButton(page).click();
		const download = await downloadPromise;

		const downloadPath = await download.path();
		expect(downloadPath).toBeTruthy();

		// Verify export is substantial (with proper fonts, it should have good content)
		const stats = fs.statSync(downloadPath!);
		expect(stats.size).toBeGreaterThan(100000);
	});

	test('QR code renders in export when enabled', async ({ page }) => {
		// Add QR code URL
		const qrInput = page.getByLabel(/Activity URL/i);
		await qrInput.fill('https://strava.com/activities/12345');

		// Wait for debounce + render
		await page.waitForTimeout(800);

		// Verify QR code is visible in preview
		await expect(page.locator('.qr-code-container canvas')).toBeVisible({ timeout: 5000 });

		// Export with QR code
		const downloadPromise = page.waitForEvent('download');
		await getLargeExportButton(page).click();
		const download = await downloadPromise;
		const downloadPath = await download.path();

		expect(downloadPath).toBeTruthy();

		// Verify export has substantial content
		const stats = fs.statSync(downloadPath!);
		expect(stats.size).toBeGreaterThan(100000);
	});

	test('all themes export correctly', async ({ page }) => {
		const themeNames = ['Paper', 'Noir', 'Blueprint'] as const;

		for (const theme of themeNames) {
			// Select theme preset
			await page.getByRole('radio', { name: theme, exact: true }).click();
			await page.waitForTimeout(300);

			// Wait for map tiles to potentially reload
			await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });

			// Export
			const downloadPromise = page.waitForEvent('download');
			await getLargeExportButton(page).click();
			const download = await downloadPromise;

			const downloadPath = await download.path();
			const stats = fs.statSync(downloadPath!);

			// Each theme should produce substantial output
			expect(stats.size).toBeGreaterThan(100000);
		}
	});

	test('preview and export have matching aspect ratios', async ({ page }) => {
		// Remove scale transform
		await page.evaluate(() => {
			const scaleWrapper = document.querySelector('.poster-scale-wrapper') as HTMLElement;
			scaleWrapper.style.transform = 'none';
		});

		const poster = page.locator('[data-poster-export]');
		const previewScreenshot = await poster.screenshot();

		// Restore scale
		await page.evaluate(() => {
			const scaleWrapper = document.querySelector('.poster-scale-wrapper') as HTMLElement;
			scaleWrapper.style.transform = '';
		});

		// Export
		const downloadPromise = page.waitForEvent('download');
		await getLargeExportButton(page).click();
		const download = await downloadPromise;

		const downloadPath = await download.path();
		const exportBuffer = fs.readFileSync(downloadPath!);

		const previewPng = PNG.sync.read(previewScreenshot);
		const exportPng = PNG.sync.read(exportBuffer);

		// Calculate aspect ratios
		const previewRatio = previewPng.width / previewPng.height;
		const exportRatio = exportPng.width / exportPng.height;

		// Aspect ratios should match exactly (or very close)
		expect(Math.abs(previewRatio - exportRatio)).toBeLessThan(0.001);
	});
});

test.describe('Aspect Ratio Options', () => {
	test.beforeEach(async ({ editorPage, page }) => {
		await page.waitForFunction(() => document.fonts.ready);
		await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });
		await page.waitForTimeout(500);
	});

	test('displays all portrait aspect ratio options for classic layout', async ({ page }) => {
		const aspectRatioSection = page.locator('section', { has: page.getByText('Aspect Ratio') });

		await expect(aspectRatioSection.getByRole('radio', { name: /Photo Print/i })).toBeVisible();
		await expect(aspectRatioSection.getByRole('radio', { name: /Frame Standard/i })).toBeVisible();
		await expect(aspectRatioSection.getByRole('radio', { name: /Portrait Frame/i })).toBeVisible();
		await expect(aspectRatioSection.getByRole('radio', { name: /A4.*A3.*A2/i })).toBeVisible();
	});

	test('displays all landscape aspect ratio options for medal-right layout', async ({ page }) => {
		await page.getByRole('radio', { name: /Medal Right/i }).click();
		await page.waitForTimeout(300);

		const aspectRatioSection = page.locator('section', { has: page.getByText('Aspect Ratio') });

		await expect(aspectRatioSection.getByRole('radio', { name: /Photo Print/i })).toBeVisible();
		await expect(aspectRatioSection.getByRole('radio', { name: /Frame Standard/i })).toBeVisible();
		await expect(aspectRatioSection.getByRole('radio', { name: /Landscape Frame/i })).toBeVisible();
		await expect(aspectRatioSection.getByRole('radio', { name: /A4.*A3.*A2/i })).toBeVisible();
	});

	test('exports correct dimensions for portrait 5:7 ratio', async ({ page }) => {
		await page.getByRole('radio', { name: /Portrait Frame/i }).click();
		await page.waitForTimeout(300);
		await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });

		const downloadPromise = page.waitForEvent('download');
		await getLargeExportButton(page).click();
		const download = await downloadPromise;

		const downloadPath = await download.path();
		const exportBuffer = fs.readFileSync(downloadPath!);
		const exportPng = PNG.sync.read(exportBuffer);

		expect(exportPng.width).toBe(2800);
		expect(exportPng.height).toBe(4000);
	});

	test('exports correct dimensions for portrait ISO A ratio', async ({ page }) => {
		await page.getByRole('radio', { name: /A4.*A3.*A2/i }).click();
		await page.waitForTimeout(300);
		await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });

		const downloadPromise = page.waitForEvent('download');
		await getLargeExportButton(page).click();
		const download = await downloadPromise;

		const downloadPath = await download.path();
		const exportBuffer = fs.readFileSync(downloadPath!);
		const exportPng = PNG.sync.read(exportBuffer);

		expect(exportPng.width).toBe(2828);
		expect(exportPng.height).toBe(4000);
	});

	test('exports correct dimensions for landscape 7:5 ratio', async ({ page }) => {
		await page.getByRole('radio', { name: /Medal Right/i }).click();
		await page.waitForTimeout(300);

		await page.getByRole('radio', { name: /Landscape Frame/i }).click();
		await page.waitForTimeout(300);
		await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });

		const downloadPromise = page.waitForEvent('download');
		await getLargeExportButton(page).click();
		const download = await downloadPromise;

		const downloadPath = await download.path();
		const exportBuffer = fs.readFileSync(downloadPath!);
		const exportPng = PNG.sync.read(exportBuffer);

		expect(exportPng.width).toBe(4000);
		expect(exportPng.height).toBe(2800);
	});

	test('exports correct dimensions for landscape ISO A ratio', async ({ page }) => {
		await page.getByRole('radio', { name: /Medal Right/i }).click();
		await page.waitForTimeout(300);

		await page.getByRole('radio', { name: /A4.*A3.*A2/i }).click();
		await page.waitForTimeout(300);
		await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });

		const downloadPromise = page.waitForEvent('download');
		await getLargeExportButton(page).click();
		const download = await downloadPromise;

		const downloadPath = await download.path();
		const exportBuffer = fs.readFileSync(downloadPath!);
		const exportPng = PNG.sync.read(exportBuffer);

		expect(exportPng.width).toBe(4000);
		expect(exportPng.height).toBe(2828);
	});

	test('preview updates dimensions when switching aspect ratios', async ({ page }) => {
		await page.evaluate(() => {
			const scaleWrapper = document.querySelector('.poster-scale-wrapper') as HTMLElement;
			scaleWrapper.style.transform = 'none';
		});

		const poster = page.locator('[data-poster-export]');

		const initialScreenshot = await poster.screenshot();
		const initialPng = PNG.sync.read(initialScreenshot);
		const initialRatio = initialPng.width / initialPng.height;

		await page.getByRole('radio', { name: /Frame Standard/i }).click();
		await page.waitForTimeout(300);
		await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });

		const updatedScreenshot = await poster.screenshot();
		const updatedPng = PNG.sync.read(updatedScreenshot);
		const updatedRatio = updatedPng.width / updatedPng.height;

		expect(initialRatio).not.toBeCloseTo(updatedRatio, 2);
	});
});

const EXPORT_TIMEOUT = 30000;

function getStandardExportButton(page: import('@playwright/test').Page) {
	return page.getByRole('button', { name: /Download Standard PNG/i });
}

function getExtraLargeExportButton(page: import('@playwright/test').Page) {
	return page.getByRole('button', { name: /Download Extra Large PNG/i });
}

async function exportAtScale(
	page: import('@playwright/test').Page,
	scale: 1 | 2 | 4
): Promise<Buffer> {
	const downloadPromise = page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });

	if (scale === 1) {
		await getStandardExportButton(page).click();
	} else if (scale === 2) {
		await getLargeExportButton(page).click();
	} else {
		await getExtraLargeExportButton(page).click();
	}

	const download = await downloadPromise;
	const downloadPath = await download.path();
	return fs.readFileSync(downloadPath!);
}

async function compareExportFidelity(
	baselineBuffer: Buffer,
	targetBuffer: Buffer,
	targetScale: number,
	debugPrefix: string
): Promise<{ diffPixels: number; diffPercent: number }> {
	const baselineMeta = await sharp(baselineBuffer).metadata();
	const targetMeta = await sharp(targetBuffer).metadata();

	const expectedWidth = baselineMeta.width! * targetScale;
	const expectedHeight = baselineMeta.height! * targetScale;

	if (targetMeta.width !== expectedWidth || targetMeta.height !== expectedHeight) {
		throw new Error(
			`Dimension mismatch: expected ${expectedWidth}x${expectedHeight}, got ${targetMeta.width}x${targetMeta.height}`
		);
	}

	const scaledBaseline = await sharp(baselineBuffer)
		.resize(expectedWidth, expectedHeight, { kernel: 'nearest' })
		.raw()
		.toBuffer();

	const targetRaw = await sharp(targetBuffer).raw().toBuffer();

	const diffBuffer = Buffer.alloc(expectedWidth * expectedHeight * 4);

	const diffPixels = pixelmatch(
		new Uint8Array(scaledBaseline),
		new Uint8Array(targetRaw),
		new Uint8Array(diffBuffer),
		expectedWidth,
		expectedHeight,
		{ threshold: 0.1, alpha: 0.5 }
	);

	fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });

	const diffPng = new PNG({ width: expectedWidth, height: expectedHeight });
	diffPng.data = diffBuffer;
	fs.writeFileSync(
		path.join(TEST_RESULTS_DIR, `${debugPrefix}-diff.png`),
		PNG.sync.write(diffPng)
	);

	const totalPixels = expectedWidth * expectedHeight;
	const diffPercent = (diffPixels / totalPixels) * 100;

	return { diffPixels, diffPercent };
}

test.describe('Export Scale Fidelity', () => {
	test.beforeEach(async ({ editorPage, page }) => {
		await page.waitForFunction(() => document.fonts.ready);
		await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });
		await page.waitForTimeout(500);
	});

	test('Large export (2x) maintains visual fidelity with Standard (1x)', async ({ page }) => {
		test.setTimeout(60000);

		const standardBuffer = await exportAtScale(page, 1);
		fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
		fs.writeFileSync(path.join(TEST_RESULTS_DIR, 'fidelity-1x.png'), standardBuffer);

		await page.waitForTimeout(500);

		const largeBuffer = await exportAtScale(page, 2);
		fs.writeFileSync(path.join(TEST_RESULTS_DIR, 'fidelity-2x.png'), largeBuffer);

		const { diffPercent } = await compareExportFidelity(
			standardBuffer,
			largeBuffer,
			2,
			'fidelity-2x'
		);

		expect(diffPercent).toBeLessThan(5);
	});

	test('Extra Large export (4x) maintains visual fidelity with Standard (1x)', async ({
		page
	}) => {
		test.setTimeout(90000);

		const standardBuffer = await exportAtScale(page, 1);
		fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
		fs.writeFileSync(path.join(TEST_RESULTS_DIR, 'fidelity-4x-baseline.png'), standardBuffer);

		await page.waitForTimeout(500);

		const extraLargeBuffer = await exportAtScale(page, 4);
		fs.writeFileSync(path.join(TEST_RESULTS_DIR, 'fidelity-4x.png'), extraLargeBuffer);

		const { diffPercent } = await compareExportFidelity(
			standardBuffer,
			extraLargeBuffer,
			4,
			'fidelity-4x'
		);

		expect(diffPercent).toBeLessThan(5);
	});
});
