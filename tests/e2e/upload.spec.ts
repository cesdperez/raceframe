import { test, expect, FIXTURE_PATH } from './fixtures.js';

test.describe('Landing Page', () => {
	test('shows upload area', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { name: 'RaceFrame' })).toBeVisible();
		await expect(page.getByText('Drop your GPX file here')).toBeVisible();
		await expect(page.getByRole('button', { name: /upload gpx file/i })).toBeVisible();
	});

	test('uploads GPX file and shows editor', async ({ page }) => {
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();
		const eventNameInput = page.getByLabel('Event Name');
		await expect(eventNameInput).toHaveValue('Morning Run');
		await expect(page.getByRole('img', { name: /poster preview/i })).toBeVisible();
	});

	test('shows error for invalid file type', async ({ page }) => {
		await page.goto('/');

		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles({
			name: 'test.txt',
			mimeType: 'text/plain',
			buffer: Buffer.from('not a gpx file')
		});

		await expect(page.getByRole('alert')).toContainText(/gpx/i);
	});
});

test.describe('Editor', () => {
	test.beforeEach(async ({ editorPage }) => {
		// editorPage fixture handles GPX upload
	});

	test('can edit race details', async ({ page }) => {
		const eventNameInput = page.getByLabel('Event Name');
		await eventNameInput.fill('My Custom Race');
		await expect(eventNameInput).toHaveValue('My Custom Race');

		const athleteNameInput = page.getByLabel('Name', { exact: true });
		await athleteNameInput.fill('Test Runner');
		await expect(athleteNameInput).toHaveValue('Test Runner');

		const bibInput = page.getByLabel('Bib', { exact: true });
		await bibInput.fill('12345');
		await expect(bibInput).toHaveValue('12345');
	});

	test('can apply design preset', async ({ page }) => {
		const noirPreset = page.getByRole('radio', { name: /noir/i });
		await noirPreset.click();
		await expect(noirPreset).toContainText('✓');
	});

	test('can switch distance units', async ({ page }) => {
		const milesButton = page.getByRole('button', { name: 'MI', exact: true });
		await milesButton.click();
		await expect(milesButton).toHaveClass(/bg-blue-600/);

		const kmButton = page.getByRole('button', { name: 'KM', exact: true });
		await kmButton.click();
		await expect(kmButton).toHaveClass(/bg-blue-600/);
	});

	test('can edit distance manually and see it in preview', async ({ page }) => {
		const distanceInput = page.getByRole('spinbutton', { name: 'Distance' });
		await distanceInput.fill('99.9');

		const poster = page.locator('[data-poster-export]');
		await expect(poster.locator('.stat-value').first()).toHaveText('99.9');
	});

	test('pace updates when time or distance changes', async ({ page }) => {
		const distanceInput = page.getByRole('spinbutton', { name: 'Distance' });
		await distanceInput.fill('10');

		const timeInput = page.getByLabel('Finish Time');
		await timeInput.fill("1:00'00\"");

		const poster = page.locator('[data-poster-export]');
		const paceValue = poster.locator('.stat-value').nth(2);
		await expect(paceValue).toHaveText("6'00\"");

		await distanceInput.fill('20');
		await expect(paceValue).toHaveText("3'00\"");
	});

	test('back button returns to landing page', async ({ page }) => {
		const backButton = page.getByRole('button', { name: /go back to upload/i });
		await backButton.click();

		await expect(page.getByText('Drop your GPX file here')).toBeVisible();
	});
});
