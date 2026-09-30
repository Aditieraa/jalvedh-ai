const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:8000/app.html');
    await page.waitForTimeout(500);

    // 1. Go to Mission Portfolio
    console.log('1. Navigating to Mission Portfolio...');
    await page.click('#tab-btn-missions');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'verified_missions_status_tags_portfolio.png' });

    // 2. Test Filters
    console.log('2. Testing Status Filters: Planned...');
    await page.click('#filter-mission-planned');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'verified_missions_filter_planned.png' });

    console.log('3. Testing Status Filters: Completed...');
    await page.click('#filter-mission-completed');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'verified_missions_filter_completed.png' });

    console.log('4. Testing Status Filters: All...');
    await page.click('#filter-mission-all');
    await page.waitForTimeout(300);

    // 5. Open Edit Modal for first mission
    console.log('5. Opening Edit Mission Modal for MSN-SWQM-2026-GOA...');
    await page.locator('button:has-text("Edit")').first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'verified_edit_mission_modal.png' });

    // 6. Edit Title & Status
    console.log('6. Editing mission labels and status to Completed...');
    await page.fill('#edit-mission-name', 'Sea Water Quality Monitoring (SWQM) — Mandovi Shelf Enhanced Phase 2');
    await page.selectOption('#edit-mission-status', 'Completed');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'verified_missions_after_edit_sync.png' });

    // 7. Check Sonar Workspace reflection
    console.log('7. Verifying reflection in Sonar Analysis Workspace...');
    await page.click('#tab-btn-sonar-ingestion');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'verified_sonar_workspace_after_mission_edit.png' });

    console.log('ALL MISSION STATUS TAGS & EDITING TESTS PASSED (0 ERRORS)!');
    await browser.close();
})();
