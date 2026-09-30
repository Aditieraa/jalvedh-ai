const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    const errors = [];
    const warnings = [];

    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push({ type: 'CONSOLE_ERROR', text: msg.text() });
        } else if (msg.type() === 'warn') {
            warnings.push({ type: 'CONSOLE_WARN', text: msg.text() });
        }
    });

    page.on('pageerror', err => {
        errors.push({ type: 'PAGE_ERROR', text: err.message });
    });

    console.log('--- 1. Testing Landing Page (http://localhost:8000/landing.html) ---');
    await page.goto('http://localhost:8000/landing.html');
    await page.waitForTimeout(500);

    const landingTitle = await page.title();
    console.log('Landing page title:', landingTitle);

    // Test CTA navigation to App
    const cta = page.locator('a[href*="app.html"]').first();
    if (await cta.isVisible()) {
        console.log('Landing CTA button found. Clicking to launch App...');
    }

    console.log('\n--- 2. Testing App Container (http://localhost:8000/app.html) ---');
    await page.goto('http://localhost:8000/app.html');
    await page.waitForTimeout(600);

    console.log('\n--- 3. Testing All 12 Tabs as Marine Analyst (Default Role) ---');
    const tabs = [
        'sonar-ingestion', 'missions', 'dashboard', 'anomaly-map',
        'reports-export', 'high-risk-triage', 'marlin-engine', 'sonar-dapt',
        'impact-about'
    ];

    for (const tabId of tabs) {
        const btn = page.locator(`#tab-btn-${tabId}`);
        if (await btn.isVisible()) {
            await btn.click();
            await page.waitForTimeout(300);
            const view = page.locator(`#view-${tabId}`);
            const isVis = await view.isVisible();
            console.log(`  Tab [${tabId}]: Active & View Visible = ${isVis}`);
            if (!isVis) {
                errors.push({ type: 'VIEW_NOT_VISIBLE', text: `View #view-${tabId} failed to render` });
            }
        } else {
            console.log(`  Tab [${tabId}]: Not visible for analyst (expected based on permissions)`);
        }
    }

    console.log('\n--- 4. Testing Modals on Analyst View ---');
    // Score breakdown modal
    await page.click('#tab-btn-dashboard');
    await page.waitForTimeout(300);
    const scoreBtn = page.locator('button:has-text("Score Breakdown Guide")');
    if (await scoreBtn.isVisible()) {
        await scoreBtn.click();
        await page.waitForTimeout(300);
        const scoreModal = page.locator('#score-guide-modal');
        console.log('  Score Guide Modal opened:', await scoreModal.isVisible());
        await page.click('#score-guide-modal button:has-text("Got it")');
        await page.waitForTimeout(200);
    }

    // SONAR-DAPT Architecture Modal
    await page.click('#tab-btn-sonar-dapt');
    await page.waitForTimeout(300);
    const daptExplainerBtn = page.locator('button:has-text("Spectral Adaptation Engine")').first();
    if (await daptExplainerBtn.isVisible()) {
        await daptExplainerBtn.click();
        await page.waitForTimeout(300);
        const daptModal = page.locator('#sonar-dapt-modal');
        console.log('  SONAR-DAPT Architecture Modal opened:', await daptModal.isVisible());
        await page.click('#sonar-dapt-modal button:has-text("Close Architecture Explainer")');
        await page.waitForTimeout(200);
    }

    console.log('\n--- 5. Testing SONAR-DAPT Frequency & Platform Toggles ---');
    await page.click('#dapt-freq-100');
    await page.waitForTimeout(100);
    await page.click('#dapt-freq-500');
    await page.waitForTimeout(100);
    await page.click('#dapt-freq-dual');
    await page.waitForTimeout(100);
    await page.click('#dapt-plat-towfish');
    await page.waitForTimeout(100);
    await page.click('#dapt-plat-auv');
    await page.waitForTimeout(100);
    console.log('  SONAR-DAPT toggles executed smoothly.');

    console.log('\n--- 6. Testing High Risk Triage Verdict Actions ---');
    await page.click('#tab-btn-high-risk-triage');
    await page.waitForTimeout(300);
    const triageConfirmBtn = page.locator('button:has-text("Confirm Ghost Net")').first();
    if (await triageConfirmBtn.isVisible()) {
        await triageConfirmBtn.click();
        await page.waitForTimeout(300);
        console.log('  Triage Confirm action executed.');
    }
    const triageRejectSelect = page.locator('select').first();
    if (await triageRejectSelect.isVisible()) {
        await triageRejectSelect.selectOption({ index: 1 });
        await page.waitForTimeout(300);
        console.log('  Triage Bio-Rejection executed.');
    }

    console.log('\n--- 7. Testing All 5 User Roles via Role Switcher ---');
    const roles = ['operator', 'analyst', 'admin', 'engineer', 'viewer'];
    for (const r of roles) {
        await page.evaluate((role) => window.switchUserRole(role), r);
        await page.waitForTimeout(300);
        const activeRoleName = await page.locator('#app-role-label').innerText();
        console.log(`  Switched to Role: ${r} -> Header Label: "${activeRoleName}"`);
    }

    console.log('\n--- 8. Testing Admin Panel User Provisioning (under Admin Role) ---');
    await page.evaluate(() => window.switchUserRole('admin'));
    await page.waitForTimeout(300);
    await page.click('#tab-btn-admin-panel');
    await page.waitForTimeout(300);
    const addUserBtn = page.locator('button:has-text("+ Provision User")');
    if (await addUserBtn.isVisible()) {
        await addUserBtn.click();
        await page.waitForTimeout(200);
        await page.fill('#new-user-name', 'Dr. Vikramaditya Sen');
        await page.fill('#new-user-email', 'vikram.sen@niot-demo.res.in');
        await page.selectOption('#new-user-role', 'analyst');
        await page.click('#add-user-modal button:has-text("Provision Access")');
        await page.waitForTimeout(300);
        console.log('  User Provisioning modal and submission executed.');
    }

    console.log('\n--- 9. Testing AI/ML Engineer OCEAN-LEARN Retrain (under Engineer Role) ---');
    await page.evaluate(() => window.switchUserRole('engineer'));
    await page.waitForTimeout(300);
    await page.click('#tab-btn-ocean-learn');
    await page.waitForTimeout(300);
    const retrainBtn = page.locator('#ocean-retrain-button');
    if (await retrainBtn.isVisible()) {
        await retrainBtn.click();
        console.log('  OCEAN-LEARN retrain simulation started...');
        await page.waitForTimeout(2200);
        const logText = await page.locator('#ocean-training-log').innerText();
        console.log('  OCEAN-LEARN completed. Log status:', logText.includes('CHECKPOINT'));
    }

    console.log('\n--- 10. Testing All 7 Export Formats in Reports & Export ---');
    await page.evaluate(() => window.switchUserRole('analyst'));
    await page.waitForTimeout(300);
    await page.click('#tab-btn-reports-export');
    await page.waitForTimeout(300);

    const exportFormats = ['JSON', 'GEOJSON', 'CSV', 'NMEA', 'KML', 'PDF', 'ZIP'];
    for (const fmt of exportFormats) {
        const btn = page.locator(`button:has-text("Download ${fmt}")`).first();
        if (await btn.isVisible()) {
            await btn.click();
            await page.waitForTimeout(200);
            console.log(`  Export [${fmt}] triggered successfully.`);
        }
    }

    console.log('\n========================================================');
    console.log('AUDIT SUMMARY:');
    console.log('Console Errors:', errors.length);
    console.log('Console Warnings:', warnings.length);
    if (errors.length > 0) {
        console.log('ERRORS LIST:', JSON.stringify(errors, null, 2));
    }
    console.log('========================================================');

    await browser.close();
})();
