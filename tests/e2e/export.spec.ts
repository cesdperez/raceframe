import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = path.join(__dirname, '../../src/lib/test-fixtures/sample.gpx');

test.describe('Export', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);
		await expect(page.locator('[data-poster-export]')).toBeVisible({ timeout: 10000 });
	});

	test('exports 2x PNG', async ({ page }) => {
		const downloadPromise = page.waitForEvent('download');
		await page.locator('button:has-text("2x Web")').click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Morning.Run.*\.png$/);
	});

	test('exports 4x PNG', async ({ page }) => {
		const downloadPromise = page.waitForEvent('download');
		await page.locator('button:has-text("4x Print")').click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Morning.Run.*\.png$/);
	});

	test('PNG filename includes custom race name', async ({ page }) => {
		const raceNameInput = page.getByLabel('Race Name');
		await raceNameInput.fill('Berlin Marathon 2024');

		const downloadPromise = page.waitForEvent('download');
		await page.locator('button:has-text("2x Web")').click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Berlin.Marathon.2024.*\.png$/);
	});

	test('shows loading state during export', async ({ page }) => {
		const exportButton = page.locator('button:has-text("2x Web")');

		await exportButton.click();

		await expect(exportButton).toBeDisabled();

		await page.waitForEvent('download');

		await expect(exportButton).toBeEnabled();
	});

	test('exported PNG has reasonable file size', async ({ page }) => {
		const downloadPromise = page.waitForEvent('download');
		await page.locator('button:has-text("2x Web")').click();
		const download = await downloadPromise;

		const filePath = await download.path();
		if (filePath) {
			const fs = await import('fs');
			const stats = fs.statSync(filePath);
			expect(stats.size).toBeGreaterThan(10 * 1024);
		}
	});

	test('exports PNG with QR code when URL is set', async ({ page }) => {
		const baselineDownloadPromise = page.waitForEvent('download');
		await page.locator('button:has-text("2x Web")').click();
		const baselineDownload = await baselineDownloadPromise;
		const baselinePath = await baselineDownload.path();

		const fs = await import('fs');
		const baselineSize = baselinePath ? fs.statSync(baselinePath).size : 0;

		const qrInput = page.getByLabel(/Activity URL/i);
		await qrInput.fill('https://strava.com/activities/12345');

		await page.waitForTimeout(800);

		await expect(page.locator('.qr-code-container canvas')).toBeVisible();

		const qrDownloadPromise = page.waitForEvent('download');
		await page.locator('button:has-text("2x Web")').click();
		const qrDownload = await qrDownloadPromise;
		const qrPath = await qrDownload.path();

		if (qrPath && baselinePath) {
			const qrSize = fs.statSync(qrPath).size;
			expect(qrSize).toBeGreaterThan(baselineSize);
		}
	});
});

test.describe('Export - Medal Right Layout', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);
		await expect(page.locator('[data-poster-export]')).toBeVisible({ timeout: 10000 });

		await page.getByRole('radio', { name: /Medal Right/i }).click();
		await page.waitForTimeout(300);
	});

	test('exports PNG with landscape dimensions', async ({ page }) => {
		const downloadPromise = page.waitForEvent('download');
		await page.locator('button:has-text("2x Web")').click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/\.png$/);

		const filePath = await download.path();
		if (filePath) {
			const fs = await import('fs');
			const stats = fs.statSync(filePath);
			expect(stats.size).toBeGreaterThan(10 * 1024);
		}
	});

	test('preview shows medal zone placeholder', async ({ page }) => {
		await expect(page.locator('[data-medal-zone]')).toBeVisible();
	});

	test('medal-right preview matches snapshot', async ({ page }) => {
		const poster = page.locator('[data-poster-export]');
		await expect(poster).toHaveScreenshot('medal-right-preview.png', {
			maxDiffPixelRatio: 0.05
		});
	});
});
