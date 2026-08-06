import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = process.env.A11Y_BASE_URL ?? 'http://127.0.0.1:4173';
const targetUrl = new URL('/', baseUrl).toString();
const nonBlockingRuleIds = new Set(['aria-required-children']);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();

try {
  const page = await context.newPage();
  const response = await page.goto(targetUrl, { waitUntil: 'networkidle' });

  if (!response || !response.ok()) {
    throw new Error(`[a11y] Failed to load ${targetUrl} (status: ${response?.status() ?? 'no response'})`);
  }

  await page.waitForSelector('body');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const blocking = results.violations.filter(
    (violation) => !nonBlockingRuleIds.has(violation.id)
      && violation.nodes.some((node) => node.impact === 'critical'),
  );

  const serious = results.violations.filter((violation) =>
    violation.nodes.some((node) => node.impact === 'serious') || nonBlockingRuleIds.has(violation.id),
  );

  if (blocking.length > 0) {
    console.error(`[a11y] Found ${blocking.length} critical accessibility violation(s).`);
    for (const violation of blocking) {
      console.error(`- ${violation.id}: ${violation.help} (${violation.helpUrl})`);
    }
    process.exit(1);
  }

  if (serious.length > 0) {
    console.warn(`[a11y] WARN: Found ${serious.length} serious accessibility violation(s).`);
    for (const violation of serious) {
      console.warn(`- ${violation.id}: ${violation.help} (${violation.helpUrl})`);
    }
  }

  console.log(`[a11y] PASS: no critical violations at ${targetUrl}`);
} finally {
  await context.close();
  await browser.close();
}
