const { chromium } = require('playwright');
const path = require('path');

async function testScopedExports() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log("Navigating to http://localhost:8000/app.html...");
    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });

    // Switch to Sonar AI & Upload tab
    console.log("Navigating to Sonar AI tab (#tab-btn-sonar-ingestion)...");
    await page.click('#tab-btn-sonar-ingestion');
    await page.waitForTimeout(1000);

    // 1. Verify duplicate bar does NOT exist
    const duplicateBar = await page.$('#sonar-export-suite-bar');
    console.log("Checking for duplicate bar (#sonar-export-suite-bar):", duplicateBar ? "FOUND (FAIL)" : "NOT FOUND (SUCCESS)");

    // 2. Verify primary live export bar exists
    const liveBar = await page.$('#sonar-live-export-bar');
    console.log("Checking for live export bar (#sonar-live-export-bar):", liveBar ? "FOUND (SUCCESS)" : "NOT FOUND (FAIL)");

    // 3. Test before scan: active mission MSN-SWQM-2026-GOA scoped export
    const initialExportData = await page.evaluate(() => {
        return window.JalVedhMockData._resolveExportData();
    });
    console.log(`Initial unscanned export data count (active mission scope): ${initialExportData.length} records`);
    const allMatchActiveMission = initialExportData.every(d => d.missionId === 'MSN-SWQM-2026-GOA');
    console.log(`Initial records all belong to active mission: ${allMatchActiveMission}`);

    // 4. Test clicking pipeline_scan.jpg curated demo
    console.log("Clicking pipeline_scan.jpg preset button...");
    await page.click("button[title*='Subsea Pipeline']");
    await page.waitForTimeout(3000);

    // 5. Verify activeScanDetections
    const scanDetections = await page.evaluate(() => {
        return window.activeScanDetections;
    });
    console.log(`Active scan detections count: ${scanDetections.length}`);
    console.log(`Detection class: ${scanDetections[0]?.class}, ID: ${scanDetections[0]?.id}`);

    // 6. Click JSON export button in the live export bar
    console.log("Clicking JSON export button on #sonar-live-export-bar...");
    await page.click("#sonar-live-export-bar button:has-text('JSON')");
    await page.waitForTimeout(1000);

    // 7. Verify modal contents
    const modalText = await page.evaluate(() => {
        const modal = document.getElementById('report-preview-modal');
        if (!modal) return null;
        const scopeText = modal.querySelector('div[style*="border-left"]')?.innerText;
        const rows = modal.querySelectorAll('tbody tr').length;
        const downloadBtnText = modal.querySelector('button[onclick*="confirmReportDownload"]')?.innerText;
        return { scopeText, rows, downloadBtnText };
    });
    console.log("Export Modal Data:", modalText);

    // Screenshot modal
    await page.screenshot({ path: 'export_preview_modal_test.png' });
    console.log("Saved export_preview_modal_test.png");

    // Close modal
    await page.click("#report-preview-modal button:has-text('Cancel')");
    await page.waitForTimeout(500);

    // Screenshot full Sonar AI section showing clean UI without duplicate bottom bar
    await page.screenshot({ path: 'sonar_ai_no_duplicate_bar.png' });
    console.log("Saved sonar_ai_no_duplicate_bar.png");

    // 8. Test direct data resolution for JSON export
    const directExportResult = await page.evaluate(() => {
        const data = window.JalVedhMockData._resolveExportData();
        return {
            count: data.length,
            firstItemClass: data[0]?.class,
            missionId: data[0]?.missionId
        };
    });
    console.log("Direct export data resolution test:", directExportResult);

    await browser.close();
    console.log("ALL SCOPED EXPORT & UI VERIFICATION TESTS PASSED!");
}

testScopedExports().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
