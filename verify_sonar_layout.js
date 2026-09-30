const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

    // Navigate to sonar workspace
    await page.evaluate(() => {
        if (window.navTo) window.navTo('workspace');
    });

    await page.waitForTimeout(1000);

    const artifactPath = path.join('C:', 'Users', 'aditi', '.gemini', 'antigravity', 'brain', 'd071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'sonar_repositioned_layout_1280.png');
    await page.screenshot({ path: artifactPath, fullPage: false });
    console.log('Saved screenshot to:', artifactPath);

    await browser.close();
})();
