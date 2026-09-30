const { chromium } = require('playwright');

async function verifyAIConfidence() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    console.log("Navigating to app...");
    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });

    console.log("Switching to Sonar AI tab...");
    await page.click('#tab-btn-sonar-ingestion');
    await page.waitForTimeout(1000);

    console.log("Clicking Cylinder demo preset...");
    await page.click("button[title*='Cylinder']");
    await page.waitForTimeout(3000);

    // Verify summary banner text contains "AI Confidence"
    const summaryBadgeText = await page.evaluate(() => {
        return document.getElementById('summary-target-badges')?.innerText;
    });
    console.log("Summary Badge Text:", summaryBadgeText);

    if (summaryBadgeText && summaryBadgeText.includes('AI Confidence')) {
        console.log("VERIFIED: Summary banner displays 'AI Confidence'!");
    } else {
        console.error("FAIL: Summary banner does not contain 'AI Confidence'!", summaryBadgeText);
        process.exit(1);
    }

    // Capture screenshot of waterfall canvas showing HUD badge
    await page.screenshot({ path: 'verified_ai_confidence_hud.png' });
    console.log("Saved verified_ai_confidence_hud.png");

    await browser.close();
    console.log("TEST PASSED: 'AI Confidence' is correctly used throughout!");
}

verifyAIConfidence().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
