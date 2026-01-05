const puppeteer = require('puppeteer');
const path = require('path');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1400 });

  const filePath = 'file://' + path.resolve(__dirname, '../share-form-v7.html');
  await page.goto(filePath);

  // Add two people to enable modal
  await page.click('.person-card[data-id="2"]');
  await delay(300);
  await page.click('.person-card[data-id="3"]');
  await delay(300);

  // Open modal
  await page.click('#openModalBtn');
  await delay(500);

  // Take full page screenshot showing modal
  await page.screenshot({ path: 'current-modal.png' });

  console.log('✓ Modal screenshot saved as current-modal.png');
  await browser.close();
})();
