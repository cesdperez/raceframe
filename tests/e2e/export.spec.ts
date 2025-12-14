import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = path.join(__dirname, '../../src/lib/test-fixtures/sample.gpx');

test.describe('Export', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Drop your GPX file here')).toBeVisible();
		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles(FIXTURE_PATH);
		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();
		// Wait for poster preview to be visible (map rendering can take a moment)
		await expect(page.getByRole('img', { name: /poster preview/i })).toBeVisible({ timeout: 10000 });
	});

	test('exports 2x PNG', async ({ page }) => {
		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /Download PNG at 2x/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Morning.Run.*\.png$/);
	});

	test('exports 4x PNG', async ({ page }) => {
		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /Download PNG at 4x/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Morning.Run.*\.png$/);
	});

	test('exports 2x PDF', async ({ page }) => {
		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /Download PDF at 2x/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Morning.Run.*\.pdf$/);
	});

	test('exports 4x PDF', async ({ page }) => {
		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /Download PDF at 4x/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Morning.Run.*\.pdf$/);
	});

	test('PNG filename includes custom race name', async ({ page }) => {
		const raceNameInput = page.getByLabel('Race Name');
		await raceNameInput.fill('Berlin Marathon 2024');

		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /Download PNG at 2x/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Berlin.Marathon.2024.*\.png$/);
	});

	test('shows loading state during export', async ({ page }) => {
		const exportButton = page.getByRole('button', { name: /Download PNG at 2x/i });

		await exportButton.click();

		// Button should be disabled during export
		await expect(exportButton).toBeDisabled();

		// Wait for download to complete
		await page.waitForEvent('download');

		// Button should be enabled again
		await expect(exportButton).toBeEnabled();
	});

	test('exported PNG has reasonable file size', async ({ page }) => {
		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /Download PNG at 2x/i }).click();
		const download = await downloadPromise;

		const filePath = await download.path();
		if (filePath) {
			const fs = await import('fs');
			const stats = fs.statSync(filePath);
			// PNG should be at least 10KB (sanity check that it's not empty/broken)
			expect(stats.size).toBeGreaterThan(10 * 1024);
		}
	});

	test('exported PDF has reasonable file size', async ({ page }) => {
		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /Download PDF at 2x/i }).click();
		const download = await downloadPromise;

		const filePath = await download.path();
		if (filePath) {
			const fs = await import('fs');
			const stats = fs.statSync(filePath);
			// PDF should be at least 10KB
			expect(stats.size).toBeGreaterThan(10 * 1024);
		}
	});

	test('exports PNG with QR code when URL is set', async ({ page }) => {
		// First export without QR code to get baseline size
		const baselineDownloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /Download PNG at 2x/i }).click();
		const baselineDownload = await baselineDownloadPromise;
		const baselinePath = await baselineDownload.path();

		const fs = await import('fs');
		const baselineSize = baselinePath ? fs.statSync(baselinePath).size : 0;

		// Add QR code URL
		const qrInput = page.getByLabel(/Activity URL/i);
		await qrInput.fill('https://strava.com/activities/12345');

		// Wait for debounce (500ms) + QR code render time
		await page.waitForTimeout(800);

		// Verify QR code is visible in preview
		await expect(page.locator('.qr-code-container canvas')).toBeVisible();

		// Export with QR code
		const qrDownloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /Download PNG at 2x/i }).click();
		const qrDownload = await qrDownloadPromise;
		const qrPath = await qrDownload.path();

		if (qrPath && baselinePath) {
			const qrSize = fs.statSync(qrPath).size;
			// PNG with QR code should be larger than without
			expect(qrSize).toBeGreaterThan(baselineSize);
		}
	});

	test('exports PDF with QR code when URL is set', async ({ page }) => {
		// Add QR code URL
		const qrInput = page.getByLabel(/Activity URL/i);
		await qrInput.fill('https://strava.com/activities/12345');

		// Wait for QR code to render
		await page.waitForTimeout(500);

		// Verify QR code is visible in preview
		await expect(page.locator('.qr-code-container canvas')).toBeVisible();

		// Export PDF
		const downloadPromise = page.waitForEvent('download');
		await page.getByRole('button', { name: /Download PDF at 2x/i }).click();
		const download = await downloadPromise;

		const filePath = await download.path();
		if (filePath) {
			const fs = await import('fs');
			const stats = fs.statSync(filePath);
			// PDF with QR code should be substantial
			expect(stats.size).toBeGreaterThan(10 * 1024);
		}
	});
});
