const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    await page.goto('http://localhost:8000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // Open Role Selector Modal
    await page.click('.nav-signin');
    await page.waitForTimeout(300);

    const artifactPath = path.join(process.env.USERPROFILE, '.gemini', 'antigravity', 'brain', 'd071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'role_modal_brain_icon_verified.png');
    await page.screenshot({ path: artifactPath, fullPage: false });
    console.log('Saved role modal brain icon screenshot to:', artifactPath);

    await browser.close();
})();
