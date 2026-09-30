const { chromium } = require('./node_modules/playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Take landing navbar screenshot
    const navArtifactPath = path.join('C:', 'Users', 'aditi', '.gemini', 'antigravity', 'brain', 'd071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'landing_navbar_updated.png');
    await page.screenshot({ path: navArtifactPath, fullPage: false });
    console.log('Saved navbar screenshot to:', navArtifactPath);

    // Test Sign in modal
    await page.evaluate(() => window.openAuthModal());
    await page.waitForTimeout(500);

    const ssoArtifactPath = path.join('C:', 'Users', 'aditi', '.gemini', 'antigravity', 'brain', 'd071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'landing_sso_modal.png');
    await page.screenshot({ path: ssoArtifactPath, fullPage: false });
    console.log('Saved SSO modal screenshot to:', ssoArtifactPath);

    await browser.close();
})();
