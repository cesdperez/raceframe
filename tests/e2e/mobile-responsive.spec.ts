import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = path.join(__dirname, '../../src/lib/test-fixtures/sample.gpx');

test.describe('Mobile Responsive Behavior', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('desktop shows preview and editor side by side', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();

		const preview = page.getByRole('img', { name: /poster preview/i });
		await expect(preview).toBeVisible();

		const editorPanel = page.getByRole('complementary', { name: /poster customization options/i });
		await expect(editorPanel).toBeVisible();
	});

	test('mobile shows preview on top with editor below', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();

		const preview = page.getByRole('img', { name: /poster preview/i });
		await expect(preview).toBeVisible();

		const editorPanel = page.getByRole('complementary', { name: /poster customization options/i });
		await expect(editorPanel).toBeVisible();

		const previewToggle = page.getByRole('button', { name: /enlarge preview/i });
		await expect(previewToggle).toBeVisible();
	});

	test('mobile preview enlargement hides editor panel', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		const preview = page.getByRole('img', { name: /poster preview/i });
		await expect(preview).toBeVisible();

		const previewToggle = page.locator('.preview-toggle-btn');
		await expect(previewToggle).toBeVisible();

		await previewToggle.click({ force: true });

		await expect(previewToggle).toHaveAttribute('aria-label', /show editor panel/i);

		const editorPanel = page.getByRole('complementary', { name: /poster customization options/i });
		await expect(editorPanel).toBeHidden();
	});

	test('mobile preview collapse shows editor panel again', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		const previewToggle = page.locator('.preview-toggle-btn');
		await previewToggle.click({ force: true });

		const editorPanel = page.getByRole('complementary', { name: /poster customization options/i });
		await expect(editorPanel).toBeHidden();

		await previewToggle.click({ force: true });

		await expect(previewToggle).toHaveAttribute('aria-label', /enlarge preview/i);
		await expect(editorPanel).toBeVisible();
	});

	test('maximize button only visible on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		const previewToggle = page.getByRole('button', { name: /enlarge preview/i });
		await expect(previewToggle).toBeHidden();

		await page.setViewportSize({ width: 375, height: 667 });

		await expect(previewToggle).toBeVisible();
	});
});

test.describe('Desktop Layout Behavior', () => {
	test('desktop body does not have overflow hidden in editor', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();

		const bodyOverflow = await page.evaluate(() =>
			window.getComputedStyle(document.body).overflow
		);
		expect(bodyOverflow).not.toBe('hidden');
	});

	test('desktop preview has minimum height', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		const preview = page.getByRole('img', { name: /poster preview/i });
		await expect(preview).toBeVisible();

		const previewBox = await preview.boundingBox();
		expect(previewBox!.height).toBeGreaterThanOrEqual(400);
	});
});
