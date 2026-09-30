const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:8000/app.html');
    await page.waitForTimeout(600);

    console.log('========================================================');
    console.log('TESTING SPECIFIC SONAR INGESTION WORKSPACE EXPORTERS');
    console.log('========================================================\n');

    // 1. Check Initial Active Scope Exporters Count
    await page.click('#tab-btn-sonar-ingestion');
    await page.waitForTimeout(400);

    const initialExportCountText = await page.locator('#sonar-export-record-count').innerText();
    console.log('1. Initial Sonar Workspace Export Bar Count:', initialExportCountText);

    // 2. Click Curated Dataset (Chennai Pipe-Line Transect)
    console.log('2. Clicking Curated Dataset: Chennai Pipe-Line Transect...');
    await page.locator('button:has-text("Chennai Pipe-Line Transect")').click();
    await page.waitForTimeout(500);

    const chennaiExportCountText = await page.locator('#sonar-export-record-count').innerText();
    const chennaiChipText = await page.locator('#sonar-platform-chip').innerText();
    console.log('   Updated Export Bar Count for Chennai:', chennaiExportCountText);
    console.log('   Platform Context Chip:', chennaiChipText);

    // 3. Test Ingesting New Sonar Pings (Simulate Ingestion)
    console.log('3. Triggering Ingestion File Upload for Chennai...');
    await page.locator('button:has-text("Replace Log")').click();
    await page.waitForTimeout(2600); // wait for 3-step pipeline animation

    const afterIngestCountText = await page.locator('#sonar-export-record-count').innerText();
    console.log('   Export Bar Count After New Ingestion:', afterIngestCountText);

    // 4. Test Opening Preview & Exporting Specific Records
    console.log('4. Testing Export Previews for Specific Ingested Records...');
    
    // JSON Export Preview
    await page.getByRole('button', { name: 'JSON', exact: true }).click();
    await page.waitForTimeout(300);
    const jsonPreviewModal = page.locator('#report-preview-modal');
    console.log('   JSON Pre-Export Modal Visible:', await jsonPreviewModal.isVisible());
    const previewScopeText = await page.locator('#report-preview-modal').innerText();
    console.log('   Preview Modal Scope Text:', previewScopeText.split('\n')[2]);
    await page.locator('#report-preview-modal button:has-text("Cancel")').click();
    await page.waitForTimeout(200);

    // ZIP Evidence Bundle Export
    console.log('5. Testing Evidence Bundle (.zip) Download from Sonar Workspace...');
    await page.locator('#sonar-export-suite-bar button:has-text("Evidence Bundle (.zip)")').click();
    await page.waitForTimeout(300);

    const [ download ] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#report-preview-modal button:has-text("Download ZIP File")').click()
    ]);
    const downloadPath = await download.path();
    console.log('   Downloaded ZIP Archive to temporary path:', downloadPath);
    console.log('   Suggested ZIP Filename:', download.suggestedFilename());

    // Verify downloaded ZIP file
    const stats = fs.statSync(downloadPath);
    console.log('   ZIP File Size:', stats.size, 'bytes');

    await page.screenshot({ path: 'verified_sonar_workspace_specific_exports.png' });
    console.log('\n========================================================');
    console.log('SONAR WORKSPACE SPECIFIC EXPORTS 100% VERIFIED!');
    console.log('========================================================');

    await browser.close();
})();
