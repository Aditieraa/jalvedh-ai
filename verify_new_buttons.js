const { chromium } = require('./node_modules/playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const artifactPath = path.join('C:', 'Users', 'aditi', '.gemini', 'antigravity', 'brain', 'd071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'landing_buttons_updated.png');
    await page.screenshot({ path: artifactPath, fullPage: false });
    console.log('Saved updated landing buttons screenshot to:', artifactPath);

    // Open demo video modal
    await page.evaluate(() => window.openDemoVideoModal());
    await page.waitForTimeout(500);

    const videoArtifactPath = path.join('C:', 'Users', 'aditi', '.gemini', 'antigravity', 'brain', 'd071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'demo_video_modal.png');
    await page.screenshot({ path: videoArtifactPath, fullPage: false });
    console.log('Saved demo video modal screenshot to:', videoArtifactPath);

    await browser.close();
})();
