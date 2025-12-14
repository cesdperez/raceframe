import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = path.join(__dirname, '../../src/lib/test-fixtures/sample.gpx');

test.describe('GPX Upload', () => {
	test('shows landing page with upload area', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { name: 'RaceFrame' })).toBeVisible();
		await expect(page.getByText('Drop your GPX file here')).toBeVisible();
		await expect(page.getByRole('button', { name: /upload gpx file/i })).toBeVisible();
	});

	test('uploads GPX file and shows editor', async ({ page }) => {
		await page.goto('/');

		// Wait for hydration before interacting with file input
		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		// Should transition to editor view
		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();

		// Should display the race name from the GPX file
		const raceNameInput = page.getByLabel('Race Name');
		await expect(raceNameInput).toHaveValue('Morning Run');

		// Should show poster preview area
		await expect(page.getByRole('img', { name: /poster preview/i })).toBeVisible();
	});

	test('shows error for invalid file type', async ({ page }) => {
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles({
			name: 'test.txt',
			mimeType: 'text/plain',
			buffer: Buffer.from('not a gpx file'),
		});

		await expect(page.getByRole('alert')).toContainText(/gpx/i);
	});

	test('can edit race details after upload', async ({ page }) => {
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();

		// Edit race name
		const raceNameInput = page.getByLabel('Race Name');
		await raceNameInput.fill('My Custom Race');
		await expect(raceNameInput).toHaveValue('My Custom Race');

		// Edit runner name
		const runnerNameInput = page.getByLabel('Your Name');
		await runnerNameInput.fill('Test Runner');
		await expect(runnerNameInput).toHaveValue('Test Runner');

		// Edit bib number
		const bibInput = page.getByLabel('Bib Number');
		await bibInput.fill('12345');
		await expect(bibInput).toHaveValue('12345');
	});

	test('can change theme', async ({ page }) => {
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();

		// Select dark theme
		const darkThemeButton = page.getByRole('radio', { name: /dark theme/i });
		await darkThemeButton.click();
		await expect(darkThemeButton).toHaveAttribute('aria-checked', 'true');
	});

	test('can switch distance units', async ({ page }) => {
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();

		// Switch to miles
		const milesButton = page.getByRole('button', { name: 'mi' });
		await milesButton.click();
		await expect(milesButton).toHaveAttribute('aria-pressed', 'true');

		// Switch back to km
		const kmButton = page.getByRole('button', { name: 'km' });
		await kmButton.click();
		await expect(kmButton).toHaveAttribute('aria-pressed', 'true');
	});

	test('can edit distance manually and see it in preview', async ({ page }) => {
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();

		// Get the distance input and set a new value
		const distanceInput = page.getByRole('spinbutton', { name: 'Distance' });
		await distanceInput.fill('99.9');

		// Verify the preview displays the new distance
		const poster = page.locator('[data-poster-export]');
		await expect(poster.locator('.stat-value').first()).toHaveText('99.9');
	});

	test('pace updates when time or distance changes', async ({ page }) => {
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();

		// Set known values: 10 km in 1 hour = 6'00"/km pace
		const distanceInput = page.getByRole('spinbutton', { name: 'Distance' });
		await distanceInput.fill('10');

		const timeInput = page.getByLabel('Finish Time');
		await timeInput.fill("1:00'00\"");

		// Verify the pace in preview is 6'00"
		const poster = page.locator('[data-poster-export]');
		const paceValue = poster.locator('.stat-value').nth(2);
		await expect(paceValue).toHaveText("6'00\"");

		// Change distance to 20 km, pace should become 3'00"/km
		await distanceInput.fill('20');
		await expect(paceValue).toHaveText("3'00\"");
	});

	test('start over returns to landing page', async ({ page }) => {
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();

		// Click start over (desktop version)
		await page.setViewportSize({ width: 1280, height: 720 });
		const startOverButton = page.getByRole('button', { name: 'Start Over' }).first();
		await startOverButton.click();

		// Should return to landing
		await expect(page.getByText('Drop your GPX file here')).toBeVisible();
	});
});
