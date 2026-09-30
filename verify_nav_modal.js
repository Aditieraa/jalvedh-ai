const { chromium } = require('./node_modules/playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('http://localhost:8000/index.html#dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Open app and sonar ingestion tab
    await page.evaluate(() => {
        if (window.openJalVedhApp) window.openJalVedhApp('analyst');
        if (window.handleTabClick) window.handleTabClick('sonar-ingestion');
        if (window.loadPresetSampleLog) window.loadPresetSampleLog();
    });
    await page.waitForTimeout(600);

    // Click Attach Nav File or openNavFileModal
    await page.evaluate(() => {
        if (window.openNavFileModal) window.openNavFileModal();
    });
    await page.waitForTimeout(600);

    const artifactPath = path.join('C:', 'Users', 'aditi', '.gemini', 'antigravity', 'brain', 'd071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'nav_file_modal_preview.png');
    await page.screenshot({ path: artifactPath, fullPage: false });
    console.log('Saved nav modal screenshot to:', artifactPath);

    await browser.close();
})();
