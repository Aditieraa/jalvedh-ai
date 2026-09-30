const { chromium } = require('./node_modules/playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Scroll to AI Engine
    await page.evaluate(() => {
        const el = document.getElementById('ai-engine');
        if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const aiArtifactPath = path.join('C:', 'Users', 'aditi', '.gemini', 'antigravity', 'brain', 'd071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'ai_engine_section.png');
    await page.screenshot({ path: aiArtifactPath, fullPage: false });
    console.log('Saved AI Engine screenshot to:', aiArtifactPath);

    // Scroll to Impact
    await page.evaluate(() => {
        const el = document.getElementById('impact');
        if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(500);

    const impactArtifactPath = path.join('C:', 'Users', 'aditi', '.gemini', 'antigravity', 'brain', 'd071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'impact_section.png');
    await page.screenshot({ path: impactArtifactPath, fullPage: false });
    console.log('Saved Impact screenshot to:', impactArtifactPath);

    await browser.close();
})();
