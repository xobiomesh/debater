import { test, expect } from '@playwright/test';

test('Start Debate button and api connection', async ({ page }) => {
  await page.goto('https://debater-jade.vercel.app');
  await page.click('img.character-icon[alt="Abraham Lincoln"]');
  await page.click('div.character-icons-container.right img.character-icon[alt="Abraham Lincoln"]');
  await page.type('#debateInput', 'Your debate topic here');
  await page.getByRole('button', { name: 'Start Debate' }).click();

  const message = page.locator('#messages .message');
  await expect(message).toHaveText('Debate started. Topic: Your debate topic here. You can now request responses from the characters.');
});


