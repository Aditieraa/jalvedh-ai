const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    await page.click('#tab-btn-sonar-ingestion');
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8/verified_curated_datasets_moved_down.png' });
    console.log('📸 Captured verified_curated_datasets_moved_down.png');
    await browser.close();
})();
