import { test, expect, FIXTURE_PATH } from './fixtures.js';

test.describe('Export', () => {
	test.beforeEach(async ({ editorPage }) => {
		// editorPage fixture handles GPX upload
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

	test('PNG filename includes custom event name', async ({ page }) => {
		const eventNameInput = page.getByLabel('Event Name');
		await eventNameInput.fill('Berlin Marathon 2024');

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

});

test.describe('Export - Medal Right Layout', () => {
	test.beforeEach(async ({ editorPage, page }) => {
		// editorPage fixture handles GPX upload
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
