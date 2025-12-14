import { test as base, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURE_PATH = path.join(__dirname, '../../src/lib/test-fixtures/sample.gpx');

type EditorFixtures = {
	editorPage: void;
};

export const test = base.extend<EditorFixtures>({
	editorPage: async ({ page }, use) => {
		await page.goto('/');
		const fileInput = page.locator('input[type="file"][data-upload-ready]');
		await fileInput.waitFor({ state: 'attached' });
		await fileInput.setInputFiles(FIXTURE_PATH);
		await expect(page.locator('[data-poster-export]')).toBeVisible({ timeout: 10000 });
		await use();
	}
});

export { expect };
