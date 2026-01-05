const puppeteer = require('puppeteer');
const path = require('path');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1400 });

  const filePath = 'file://' + path.resolve(__dirname, '../share-form-v7.html');
  await page.goto(filePath);

  // Helper function to get FULL container bounding box and take cropped screenshot
  const takeContainerScreenshot = async (filename) => {
    // Always get the full container dimensions (entire height)
    const container = await page.$('.container');
    const box = await container.boundingBox();

    const paddingTop = 20;
    const paddingRight = 60; // Extra padding on right for button
    const paddingBottom = 20;
    const paddingLeft = 20;

    // Capture FULL container height (from h1 to bottom of all cards)
    const clipBox = {
      x: Math.max(0, box.x - paddingLeft),
      y: Math.max(0, box.y - paddingTop),
      width: box.width + paddingLeft + paddingRight,
      height: box.height + paddingTop + paddingBottom
    };

    await page.screenshot({
      path: filename,
      clip: clipBox
    });
  };

  // Step 1: Empty state with focused input
  await page.click('#searchField');  // Focus the input to show blue border
  await delay(300);
  await takeContainerScreenshot('step-01.png');

  // Step 2: Type in search
  await page.type('#searchField', 'Anna');
  await delay(500);
  await takeContainerScreenshot('step-02.png');

  // Step 3: Autocomplete dropdown visible
  await page.waitForSelector('.autocomplete-dropdown.active');
  await delay(300);
  await takeContainerScreenshot('step-03.png');

  // Step 4: Select from dropdown
  await page.click('.autocomplete-item[data-id="2"]');
  await delay(500);
  await takeContainerScreenshot('step-04.png');

  // Step 5: Click card to add second person
  await page.click('.person-card[data-id="3"]');
  await delay(500);
  await takeContainerScreenshot('step-05.png');

  // Step 6: Check permission checkbox
  await page.click('#globalEdit');
  await delay(300);
  await takeContainerScreenshot('step-06.png');

  // Step 7: Modal screenshot (two-part approach)
  // First, capture FULL container (from h1 to bottom) without modal
  const containerStep7 = await page.$('.container');
  const containerBox = await containerStep7.boundingBox();

  // Capture full container height from top to bottom
  await page.screenshot({
    path: 'step-07-base.png',
    clip: {
      x: Math.max(0, containerBox.x - 20),
      y: Math.max(0, containerBox.y - 20),
      width: containerBox.width + 20 + 60,
      height: containerBox.height + 20 + 20
    }
  });

  // Then open modal and capture full viewport
  await page.click('#openModalBtn');
  await delay(500);
  await page.screenshot({ path: 'step-07-modal-full.png', fullPage: false });

  console.log('✓ Screenshots captured (step 7 needs compositing)');
  await browser.close();
})();
