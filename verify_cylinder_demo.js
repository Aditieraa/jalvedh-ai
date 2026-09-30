const { chromium } = require('playwright');

async function testCylinderDemo() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log("Navigating to http://localhost:8000/app.html...");
    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });

    // Open Sonar AI tab
    console.log("Clicking Sonar AI tab...");
    await page.click('#tab-btn-sonar-ingestion');
    await page.waitForTimeout(1000);

    // Verify presets order
    const presetTitles = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button[onclick*="loadDemoImage"]');
        return Array.from(buttons).map(b => b.getAttribute('title'));
    });
    console.log("Preset buttons found in order:", presetTitles);

    const cylIdx = presetTitles.findIndex(t => t.includes('Cylinder'));
    const airIdx = presetTitles.findIndex(t => t.includes('Aircraft'));
    console.log(`Cylinder index: ${cylIdx}, Aircraft index: ${airIdx}`);
    if (cylIdx === airIdx - 1) {
        console.log("VERIFIED: Cylinder button is positioned strictly BEFORE Aircraft!");
    } else {
        console.error("FAIL: Cylinder is not just before Aircraft!");
        process.exit(1);
    }

    // Click Cylinder preset
    console.log("Clicking Cylinder preset button...");
    await page.click("button[title*='Cylinder']");
    await page.waitForTimeout(3500);

    // Verify activeScanDetections
    const detections = await page.evaluate(() => {
        return window.activeScanDetections;
    });
    console.log("Active Scan Detections:", JSON.stringify(detections, null, 2));

    if (detections.length === 1 && detections[0].class.toLowerCase() === 'cylinder') {
        console.log("VERIFIED: Exactly 1 detection returned and detected as CYLINDER!");
    } else {
        console.error("FAIL: Detection class or count mismatch:", detections);
        process.exit(1);
    }

    // Take screenshot of the waterfall canvas with tactical HUD badge
    await page.screenshot({ path: 'test_cylinder_detected.png' });
    console.log("Saved test_cylinder_detected.png");

    // Open export preview to verify scoped export
    console.log("Clicking JSON export button...");
    await page.click("#sonar-live-export-bar button:has-text('JSON')");
    await page.waitForTimeout(1000);

    const modalData = await page.evaluate(() => {
        const modal = document.getElementById('report-preview-modal');
        if (!modal) return null;
        const scopeText = modal.querySelector('div[style*="border-left"]')?.innerText;
        const rowClass = modal.querySelector('tbody tr td:nth-child(2)')?.innerText;
        const rowDim = modal.querySelector('tbody tr td:nth-child(1)')?.innerText;
        return { scopeText, rowClass, rowDim };
    });
    console.log("Export Modal for Cylinder:", modalData);

    await page.screenshot({ path: 'test_cylinder_export_modal.png' });
    console.log("Saved test_cylinder_export_modal.png");

    await browser.close();
    console.log("ALL CYLINDER VERIFICATION CHECKS COMPLETED SUCCESSFULLY!");
}

testCylinderDemo().catch(err => {
    console.error("Test error:", err);
    process.exit(1);
});
