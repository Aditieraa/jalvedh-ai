const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log('--- STARTING E2E VERIFICATION OF SONAR DETECTIONS & SIDEBAR ---');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') console.log(`[BROWSER ERROR] ${msg.text()}`);
    });

    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Verify CORE OPERATIONS label
    const coreLabel = await page.$('#section-label-core');
    if (!coreLabel) {
        throw new Error('Core operations section label not found!');
    }
    const coreBox = await coreLabel.boundingBox();
    const coreText = await coreLabel.innerText();
    const isVisible = await coreLabel.isVisible();
    console.log(`[CHECK 1] Core Operations label: visible=${isVisible}, text="${coreText}", height=${coreBox ? coreBox.height : 0}`);
    if (!isVisible || !coreBox || coreBox.height < 12) {
        throw new Error(`Core operations label is clipped or not visible! height: ${coreBox ? coreBox.height : 0}`);
    }

    // 2. Test Demo 1: Shipwreck (img3.jpg)
    console.log('\n[TEST 2] Testing Demo: img3.jpg (Shipwreck)...');
    await page.evaluate(() => loadDemoImage('img3.jpg'));
    await page.waitForFunction(() => window.activeScanDetections && window.activeScanDetections.length > 0, { timeout: 12000 });
    await page.waitForTimeout(400);

    let activeDets = await page.evaluate(() => window.activeScanDetections);
    let railCards = await page.$$('.sonar-det-card');
    console.log(`  -> Active scan detections count: ${activeDets.length}`);
    console.log(`  -> Rail cards count: ${railCards.length}`);
    if (activeDets.length !== 1 || activeDets[0].class !== 'Shipwreck') {
        throw new Error(`Expected exactly 1 Shipwreck detection, got ${activeDets.length}: ${JSON.stringify(activeDets)}`);
    }
    if (railCards.length !== 1) {
        throw new Error(`Expected exactly 1 rail card for img3.jpg, got ${railCards.length}`);
    }
    await page.screenshot({ path: 'test_shipwreck_verified.png' });
    console.log('  -> Captured test_shipwreck_verified.png');

    // 3. Test Demo 2: Aircraft Wreckage (img2.webp)
    console.log('\n[TEST 3] Testing Demo: img2.webp (Aircraft Wreckage)...');
    await page.evaluate(() => loadDemoImage('img2.webp'));
    await page.waitForFunction(() => window.activeScanDetections && window.activeScanDetections.length > 0 && window.activeScanDetections[0].class === 'Aircraft Wreckage', { timeout: 12000 });
    await page.waitForTimeout(400);

    activeDets = await page.evaluate(() => window.activeScanDetections);
    railCards = await page.$$('.sonar-det-card');
    console.log(`  -> Active scan detections count: ${activeDets.length}`);
    console.log(`  -> Rail cards count: ${railCards.length}`);
    if (activeDets.length !== 1 || activeDets[0].class !== 'Aircraft Wreckage') {
        throw new Error(`Expected exactly 1 Aircraft Wreckage detection, got ${activeDets.length}: ${JSON.stringify(activeDets)}`);
    }
    if (railCards.length !== 1) {
        throw new Error(`Expected exactly 1 rail card for img2.webp, got ${railCards.length}`);
    }
    await page.screenshot({ path: 'test_aircraft_verified.png' });
    console.log('  -> Captured test_aircraft_verified.png');

    // 4. Test Demo 3: Pipeline (pipeline_scan.jpg)
    console.log('\n[TEST 4] Testing Demo: pipeline_scan.jpg (Pipeline)...');
    await page.evaluate(() => loadDemoImage('pipeline_scan.jpg'));
    await page.waitForFunction(() => window.activeScanDetections && window.activeScanDetections.length > 0 && window.activeScanDetections[0].class === 'Pipeline', { timeout: 12000 });
    await page.waitForTimeout(400);

    activeDets = await page.evaluate(() => window.activeScanDetections);
    railCards = await page.$$('.sonar-det-card');
    console.log(`  -> Active scan detections count: ${activeDets.length}`);
    console.log(`  -> Rail cards count: ${railCards.length}`);
    if (activeDets.length !== 1 || activeDets[0].class !== 'Pipeline') {
        throw new Error(`Expected exactly 1 Pipeline detection, got ${activeDets.length}: ${JSON.stringify(activeDets)}`);
    }
    if (railCards.length !== 1) {
        throw new Error(`Expected exactly 1 rail card for pipeline_scan.jpg, got ${railCards.length}`);
    }
    await page.screenshot({ path: 'test_pipeline_verified.png' });
    console.log('  -> Captured test_pipeline_verified.png');

    // 5. Test Demo 4: Ghost Net (ghostnet_v3_6000_ghost_net_007361.png)
    console.log('\n[TEST 5] Testing Demo: Ghost Net...');
    await page.evaluate(() => loadDemoImage('ghostnet_v3_6000_ghost_net_007361.png'));
    await page.waitForFunction(() => window.activeScanDetections && window.activeScanDetections.length > 0 && window.activeScanDetections[0].class === 'Ghost Net', { timeout: 12000 });
    await page.waitForTimeout(400);

    activeDets = await page.evaluate(() => window.activeScanDetections);
    railCards = await page.$$('.sonar-det-card');
    console.log(`  -> Active scan detections count: ${activeDets.length}`);
    console.log(`  -> Rail cards count: ${railCards.length}`);
    if (activeDets.length !== 1 || activeDets[0].class !== 'Ghost Net') {
        throw new Error(`Expected exactly 1 Ghost Net detection, got ${activeDets.length}: ${JSON.stringify(activeDets)}`);
    }
    if (railCards.length !== 1) {
        throw new Error(`Expected exactly 1 rail card for Ghost Net, got ${railCards.length}`);
    }
    await page.screenshot({ path: 'test_ghostnet_verified.png' });
    console.log('  -> Captured test_ghostnet_verified.png');

    // 6. Test User Upload Simulation via file input
    console.log('\n[TEST 6] Testing User File Upload via #sonar-file-input...');
    const uploadFilePath = path.resolve('Client/demo_images/img2.webp');
    const fileInput = await page.$('#sonar-file-input');
    await fileInput.setInputFiles(uploadFilePath);
    await page.waitForFunction(() => window.activeScanDetections && window.activeScanDetections.length > 0 && window.activeScanDetections[0].class === 'Aircraft Wreckage', { timeout: 12000 });
    await page.waitForTimeout(400);

    activeDets = await page.evaluate(() => window.activeScanDetections);
    railCards = await page.$$('.sonar-det-card');
    console.log(`  -> User upload active scan detections count: ${activeDets.length}`);
    console.log(`  -> User upload rail cards count: ${railCards.length}`);
    if (activeDets.length !== 1 || activeDets[0].class !== 'Aircraft Wreckage') {
        throw new Error(`Expected exactly 1 Aircraft Wreckage detection for user upload, got ${activeDets.length}`);
    }
    await page.screenshot({ path: 'test_user_upload_verified.png' });
    console.log('  -> Captured test_user_upload_verified.png');

    // 7. Test Target Inspector Modal
    console.log('\n[TEST 7] Testing Target Profile Inspector...');
    await page.evaluate(() => {
        if (window.activeScanDetections && window.activeScanDetections[0]) {
            openTargetProfileInspector(window.activeScanDetections[0].id);
        }
    });
    await page.waitForTimeout(500);
    const inspectorModal = await page.$('#target-profile-modal');
    if (!inspectorModal) {
        throw new Error('Target profile modal did not open!');
    }
    await page.screenshot({ path: 'test_target_inspector_verified.png' });
    console.log('  -> Captured test_target_inspector_verified.png');

    await browser.close();
    console.log('\n=== ALL E2E VERIFICATION CHECKS PASSED 100% ===');
})();
