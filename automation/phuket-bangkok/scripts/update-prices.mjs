import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { chromium } from 'playwright';

const ADMIN_LIST_URL = 'https://almullhimtravel.runasp.net/admin/packages';
const DEFAULT_DESTINATION_TEXT = 'تايلند'; // fallback

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pricesPath = path.resolve(__dirname, '..', 'prices.json');
const prices = JSON.parse(fs.readFileSync(pricesPath, 'utf-8'));

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function normalizeCode(s) {
  return (s ?? '').trim();
}

async function chooseDestinationIfNeeded(modal) {
  // If dropdown already has a value, do nothing.
  const destCombo = modal.getByRole('combobox', { name: 'الوجهة' });
  if (!(await destCombo.count())) return;

  const current = (await destCombo.inputValue().catch(() => ''))?.trim();
  if (current) return;

  await destCombo.click();
  // select Thailand
  await modal.getByRole('option', { name: DEFAULT_DESTINATION_TEXT }).click();
}

async function fillPrice(modal, price) {
  const priceBox = modal.getByRole('textbox', { name: 'السعر' });
  // In some UIs number input is still textbox role.
  if (!(await priceBox.count())) {
    // fallback: input next to label
    const input = modal.locator('label:has-text("السعر")').locator('..').locator('input').first();
    await input.fill(String(price));
    return;
  }
  await priceBox.fill(String(price));
}

async function getPackageCodeFromModal(modal) {
  // "رمز الباقة" field
  const codeBox = modal.getByRole('textbox', { name: 'رمز الباقة' });
  if (await codeBox.count()) {
    return normalizeCode(await codeBox.inputValue());
  }
  // fallback by label
  const input = modal.locator('label:has-text("رمز الباقة")').locator('..').locator('input').first();
  return normalizeCode(await input.inputValue());
}

async function closeModal(modal) {
  // try X button
  const closeBtn = modal.getByRole('button', { name: '×' });
  if (await closeBtn.count()) {
    await closeBtn.click();
    return;
  }
  await modal.keyboard.press('Escape').catch(() => {});
}

async function saveModal(modal) {
  // We saw buttons "إضافة" and likely "تعديل"; try common ones
  const candidates = ['تعديل', 'حفظ', 'تحديث', 'إضافة'];
  for (const name of candidates) {
    const btn = modal.getByRole('button', { name });
    if (await btn.count()) {
      await btn.click();
      return;
    }
  }
  // fallback: submit first button at bottom right
  await modal.locator('button').last().click();
}

async function run() {
  console.log('Will update prices for', Object.keys(prices).length, 'packages');
  console.log('Launching browser...');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(ADMIN_LIST_URL, { waitUntil: 'domcontentloaded' });

  console.log('\n1) Log in in the opened browser window.');
  console.log('2) Make sure you can see the packages table.');
  await rl.question('Press ENTER here to start automation...');

  const targets = new Set(Object.keys(prices));
  const results = [];

  // Pagination: try to loop pages until no "التالي" button or targets empty.
  for (let pageIndex = 1; pageIndex <= 50 && targets.size > 0; pageIndex++) {
    console.log(`\nScanning admin list page ${pageIndex}... remaining targets: ${targets.size}`);

    // Wait for rows
    const table = page.locator('table');
    await table.first().waitFor({ state: 'visible', timeout: 30000 });

    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount && targets.size > 0; i++) {
      const row = rows.nth(i);

      // Click pencil icon (edit). It seems to be a button with a pencil SVG; use nth button in actions cell.
      // We will click the last button in the row that is not delete (trash) and not program/hotels if possible.
      const buttons = row.locator('button');
      const btnCount = await buttons.count();
      if (btnCount === 0) continue;

      // Robust: try to find edit control. If not labeled, click buttons in the row until the edit form appears.
      // We'll detect the edit UI by the presence of the "رمز الباقة" input.
      let modal;

      const labeledEdit = row.locator('button[title*="تعديل"], button[aria-label*="تعديل"], a[title*="تعديل"], a[aria-label*="تعديل"]').first();
      const tryClick = async (el) => {
        await el.click();
        // edit might be a dialog or an in-page form; detect by "رمز الباقة" field
        const codeField = page.getByRole('textbox', { name: 'رمز الباقة' });
        const byLabel = page.locator('label:has-text("رمز الباقة")').locator('..').locator('input').first();
        try {
          await Promise.race([
            codeField.first().waitFor({ state: 'visible', timeout: 2500 }),
            byLabel.waitFor({ state: 'visible', timeout: 2500 })
          ]);
        } catch {
          return false;
        }
        // scope modal/form container: prefer dialog, else use page as container
        const dlg = page.locator('div[role="dialog"]').filter({ has: codeField }).first();
        modal = (await dlg.count()) ? dlg : page;
        return true;
      };

      let opened = false;
      if (await labeledEdit.count()) {
        opened = await tryClick(labeledEdit);
      }

      if (!opened) {
        // Try each button in the row (usually 4 buttons)
        for (let b = 0; b < Math.min(btnCount, 6); b++) {
          const candidate = buttons.nth(b);
          opened = await tryClick(candidate);
          if (opened) break;
          // close any accidental modal
          await page.keyboard.press('Escape').catch(() => {});
          await page.waitForTimeout(150);
        }
      }

      if (!opened) {
        // couldn't open edit UI for this row
        continue;
      }

      const code = await getPackageCodeFromModal(modal);

      if (!targets.has(code)) {
        await closeModal(modal);
        await modal.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        continue;
      }

      const price = prices[code];
      console.log('Updating', code, '→', price);

      await chooseDestinationIfNeeded(modal);
      await fillPrice(modal, price);

      // ignore video link per instruction (do nothing)

      // Confirm step (review)
      // Auto-save mode (no per-package prompts). Set AUTO_SAVE=0 to ask each time.
      const autoSave = (process.env.AUTO_SAVE ?? '1') !== '0';
      if (!autoSave) {
        const ans = (await rl.question(`Save changes for ${code} with price ${price}? (y/n) `)).trim().toLowerCase();
        if (ans !== 'y') {
          results.push({ code, status: 'skipped_by_user' });
          targets.delete(code);
          await closeModal(modal);
          continue;
        }
      }

      await saveModal(modal);
      // wait a bit for save
      await page.waitForTimeout(1200);

      results.push({ code, status: 'updated', price });
      targets.delete(code);

      // close after save if still open
      await closeModal(modal);
      await page.waitForTimeout(400);
    }

    // Try next page
    const nextBtn = page.getByRole('button', { name: 'التالي' }).or(page.getByRole('link', { name: 'التالي' }));
    if (await nextBtn.count()) {
      const disabled = await nextBtn.first().isDisabled().catch(() => false);
      if (!disabled) {
        await nextBtn.first().click();
        await page.waitForTimeout(800);
        continue;
      }
    }
    break;
  }

  // Write report
  const reportPath = path.resolve(__dirname, '..', 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ results, remaining: Array.from(targets) }, null, 2));

  console.log('\nDone. Report written to', reportPath);
  if (targets.size) console.log('Not found:', Array.from(targets));

  await rl.question('Press ENTER to close browser...');
  await browser.close();
  rl.close();
}

run().catch((err) => {
  console.error('ERROR', err);
  process.exit(1);
});
