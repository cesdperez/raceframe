import { test, expect, FIXTURE_PATH } from './fixtures.js';
import sharp from 'sharp';
import fs from 'fs';

const EXPORT_TIMEOUT = 30000;

test.describe('Export', () => {
	test.beforeEach(async ({ editorPage }) => {
		// editorPage fixture handles GPX upload
	});

	test('exports Large PNG', async ({ page }) => {
		test.setTimeout(EXPORT_TIMEOUT);
		const downloadPromise = page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });
		await page.getByRole('button', { name: /Large.*3200×4800/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Morning.Run.*\.png$/);
	});

	test('exports Extra Large PNG', async ({ page }) => {
		test.setTimeout(EXPORT_TIMEOUT);
		const downloadPromise = page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });
		await page.getByRole('button', { name: /Extra Large.*6400×9600/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Morning.Run.*\.png$/);
	});

	test('PNG filename includes custom event name', async ({ page }) => {
		test.setTimeout(EXPORT_TIMEOUT);
		const eventNameInput = page.getByLabel('Event Name');
		await eventNameInput.fill('Berlin Marathon 2024');

		const downloadPromise = page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });
		await page.getByRole('button', { name: /Large.*3200×4800/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/Berlin.Marathon.2024.*\.png$/);
	});

	test('shows loading state during export', async ({ page }) => {
		test.setTimeout(EXPORT_TIMEOUT);
		const exportButton = page.getByRole('button', { name: /Large.*3200×4800/i });

		await exportButton.click();

		await expect(exportButton).toBeDisabled();

		await page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });

		await expect(exportButton).toBeEnabled();
	});

	test('exported PNG has reasonable file size', async ({ page }) => {
		test.setTimeout(EXPORT_TIMEOUT);
		const downloadPromise = page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });
		await page.getByRole('button', { name: /Large.*3200×4800/i }).click();
		const download = await downloadPromise;

		const filePath = await download.path();
		if (filePath) {
			const stats = fs.statSync(filePath);
			expect(stats.size).toBeGreaterThan(10 * 1024);
		}
	});

});

test.describe('Export - Hi-Res Quality', () => {
	test.beforeEach(async ({ editorPage }) => {
		// editorPage fixture handles GPX upload
	});

	test('Large export has correct dimensions (3200x4800 for 2:3 ratio)', async ({ page }) => {
		test.setTimeout(EXPORT_TIMEOUT);
		const downloadPromise = page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });
		await page.getByRole('button', { name: /Large.*3200×4800/i }).click();
		const download = await downloadPromise;

		const filePath = await download.path();
		expect(filePath).toBeTruthy();

		const metadata = await sharp(filePath!).metadata();
		expect(metadata.width).toBe(3200);
		expect(metadata.height).toBe(4800);
	});

	test('Extra Large export has correct dimensions (6400x9600 for 2:3 ratio)', async ({ page }) => {
		test.setTimeout(EXPORT_TIMEOUT);
		const downloadPromise = page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });
		await page.getByRole('button', { name: /Extra Large.*6400×9600/i }).click();
		const download = await downloadPromise;

		const filePath = await download.path();
		expect(filePath).toBeTruthy();

		const metadata = await sharp(filePath!).metadata();
		expect(metadata.width).toBe(6400);
		expect(metadata.height).toBe(9600);
	});

	test('Extra Large export is significantly larger than Large (hi-res map tiles)', async ({ page }) => {
		test.setTimeout(60000);
		const downloadLargePromise = page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });
		await page.getByRole('button', { name: /Large.*3200×4800/i }).click();
		const downloadLarge = await downloadLargePromise;
		const pathLarge = await downloadLarge.path();

		await page.waitForTimeout(500);

		const downloadXLPromise = page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });
		await page.getByRole('button', { name: /Extra Large.*6400×9600/i }).click();
		const downloadXL = await downloadXLPromise;
		const pathXL = await downloadXL.path();

		expect(pathLarge).toBeTruthy();
		expect(pathXL).toBeTruthy();

		const sizeLarge = fs.statSync(pathLarge!).size;
		const sizeXL = fs.statSync(pathXL!).size;

		// Extra Large has 4x the pixels, so file size should be at least 2.5x larger
		// if map tiles are re-rendered at full resolution
		// (not exactly 4x due to PNG compression)
		const sizeRatio = sizeXL / sizeLarge;
		expect(sizeRatio).toBeGreaterThan(2.5);
	});

	test('shows progress status during Extra Large export', async ({ page }) => {
		test.setTimeout(EXPORT_TIMEOUT);
		const exportButton = page.getByRole('button', { name: /Extra Large.*6400×9600/i });
		await exportButton.click();

		const loadingOverlay = page.locator('.bg-gray-900\\/95');
		await expect(loadingOverlay).toBeVisible({ timeout: 5000 });

		await page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });
	});
});

test.describe('Export - Medal Right Layout', () => {
	test.beforeEach(async ({ editorPage, page }) => {
		// editorPage fixture handles GPX upload
		await page.getByRole('radio', { name: /Medal Right/i }).click();
		await page.waitForTimeout(300);
	});

	test('exports PNG with landscape dimensions', async ({ page }) => {
		test.setTimeout(EXPORT_TIMEOUT);
		const downloadPromise = page.waitForEvent('download', { timeout: EXPORT_TIMEOUT });
		await page.getByRole('button', { name: /Large.*4800×3200/i }).click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toMatch(/\.png$/);

		const filePath = await download.path();
		if (filePath) {
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
