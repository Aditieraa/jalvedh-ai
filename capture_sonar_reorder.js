const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:8000/app.html');
    await page.waitForSelector('#view-sonar-ingestion');

    await page.screenshot({ path: path.join('C:\\Users\\aditi\\.gemini\\antigravity\\brain\\d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'verified_reordered_sonar_workspace.png') });
    console.log('Screenshot captured.');
    await browser.close();
})();
