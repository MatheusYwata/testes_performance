import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await context.clearCookies();
  await context.clearPermissions();

  // 👇 AQUI (antes do goto)
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await page.goto('https://blogdoagi.com.br/', { waitUntil: 'domcontentloaded' });

  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
});

async function abrirBusca(page: Page) {
  await page.locator('a[aria-label="Search button"]').first().click();
  await page.waitForTimeout(500); // ajuda na estabilidade
  await page.locator('#search-field').waitFor({ state: 'visible' });
}

test('Busca com termo válido', async ({ page }) => {
  await abrirBusca(page);

  const input = page.locator('#search-field');
  await input.fill('INSS');
  await input.press('Enter');

  await expect(page.locator('body')).toContainText('INSS');
});

test('Busca com termo inválido', async ({ page }) => {
  await abrirBusca(page);

  const input = page.locator('#search-field');
  await input.fill('asdasdasd123');
  await input.press('Enter');

  await expect(page.locator('body')).toContainText('nada foi encontrado');
});

test('Busca com caracteres especiais', async ({ page }) => {
  await abrirBusca(page);

  const input = page.locator('#search-field');
  await input.fill('!@#$%^&*()');
  await input.press('Enter');

  await expect(page.locator('body')).toContainText('nada foi encontrado');
});

test('Busca sem digitar termo', async ({ page }) => {
  await abrirBusca(page);

  const input = page.locator('#search-field');
  await input.press('Enter');

  await expect(page.locator('article').first()).toBeVisible();
});

test('Busca com digitando espaço vazio', async ({ page }) => {
  await abrirBusca(page);

  const input = page.locator('#search-field');
  await input.fill('  ');
  await input.press('Enter');

  await expect(page.locator('article').first()).toBeVisible();
});