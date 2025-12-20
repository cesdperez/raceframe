import { test, expect } from '@playwright/test';

test.describe('Demo Mode', () => {
	test('shows demo mode link on landing page', async ({ page }) => {
		await page.goto('/');

		await expect(
			page.getByRole('button', { name: /No GPX file\? Explore the editor/i })
		).toBeVisible();
	});

	test('clicking demo link enters editor in demo mode', async ({ page }) => {
		await page.goto('/');

		const demoButton = page.getByRole('button', { name: /No GPX file\? Explore the editor/i });
		await demoButton.click();

		await expect(page.getByRole('heading', { name: 'Customize', exact: true })).toBeVisible();
		await expect(page.getByText('Demo Mode', { exact: true })).toBeVisible();
	});

	test('demo mode shows Valencia Marathon data', async ({ page }) => {
		await page.goto('/');

		const demoButton = page.getByRole('button', { name: /No GPX file\? Explore the editor/i });
		await demoButton.click();

		const eventNameInput = page.getByLabel('Event Name');
		await expect(eventNameInput).toHaveValue('Valencia Marathon');

		const athleteNameInput = page.getByLabel('Name', { exact: true });
		await expect(athleteNameInput).toHaveValue('Jon Snow');
	});

	test('demo mode shows limitation banner', async ({ page }) => {
		await page.goto('/');

		const demoButton = page.getByRole('button', { name: /No GPX file\? Explore the editor/i });
		await demoButton.click();

		await expect(page.getByRole('status')).toContainText('Demo Mode');
		await expect(page.getByRole('status')).toContainText(
			'Some map styles and export are disabled'
		);
	});

	test('demo mode disables export buttons', async ({ page }) => {
		await page.goto('/');

		const demoButton = page.getByRole('button', { name: /No GPX file\? Explore the editor/i });
		await demoButton.click();

		await expect(page.getByText('Upload a GPX file to enable export')).toBeVisible();

		const exportButtons = page.getByRole('button', { name: /download png/i });
		const buttonCount = await exportButtons.count();
		for (let i = 0; i < buttonCount; i++) {
			await expect(exportButtons.nth(i)).toBeDisabled();
		}
	});

	test('demo mode shows limited map styles', async ({ page }) => {
		await page.goto('/');

		const demoButton = page.getByRole('button', { name: /No GPX file\? Explore the editor/i });
		await demoButton.click();

		await expect(page.locator('label[for="map-style-select"]')).toContainText('(limited)');
	});

	test('demo mode disables non-CARTO presets', async ({ page }) => {
		await page.goto('/');

		const demoButton = page.getByRole('button', { name: /No GPX file\? Explore the editor/i });
		await demoButton.click();

		const noirPreset = page.getByRole('radio', { name: /noir/i });
		await expect(noirPreset).toBeDisabled();

		const watercolorPreset = page.getByRole('radio', { name: /watercolor/i });
		await expect(watercolorPreset).toBeDisabled();

		const paperPreset = page.getByRole('radio', { name: 'Paper', exact: true });
		await expect(paperPreset).toBeEnabled();
	});

	test('demo mode allows editing all data fields', async ({ page }) => {
		await page.goto('/');

		const demoButton = page.getByRole('button', { name: /No GPX file\? Explore the editor/i });
		await demoButton.click();

		const eventNameInput = page.getByLabel('Event Name');
		await eventNameInput.fill('My Custom Race');
		await expect(eventNameInput).toHaveValue('My Custom Race');

		const athleteNameInput = page.getByLabel('Name', { exact: true });
		await athleteNameInput.fill('Arya Stark');
		await expect(athleteNameInput).toHaveValue('Arya Stark');
	});

	test('back button from demo mode returns to landing', async ({ page }) => {
		await page.goto('/');

		const demoButton = page.getByRole('button', { name: /No GPX file\? Explore the editor/i });
		await demoButton.click();

		await expect(page.getByText('Demo Mode', { exact: true })).toBeVisible();

		const backButton = page.getByRole('button', { name: /go back to upload/i });
		await backButton.click();

		await expect(page.getByText('Drop your GPX file here')).toBeVisible();
	});
});
