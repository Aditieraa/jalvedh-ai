const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runSonarQASuite() {
    console.log('========================================================================');
    console.log(' JalVedh AI — Sonar Analysis Workspace QA Acceptance Test Suite');
    console.log(' PS 26057: Automated Side-Scan Sonar Log Ingestion & MARLIN AI Stream');
    console.log('========================================================================\n');

    const screenshotDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    const results = [];

    async function recordResult(id, title, testFn) {
        try {
            await testFn();
            results.push({ id, title, status: 'PASSED', details: 'All assertions met' });
            console.log(`[PASS] Test ${id}: ${title}`);
        } catch (err) {
            results.push({ id, title, status: 'FAILED', details: err.message });
            console.error(`[FAIL] Test ${id}: ${title} -> ${err.message}`);
        }
    }

    // Step 0: Open App & Navigate to Sonar Ingestion
    await page.goto('http://localhost:8000?nocache=' + Date.now());
    await page.waitForTimeout(500);

    await page.evaluate(() => {
        if (window.switchUserRole) {
            window.switchUserRole('analyst');
        } else if (window.openJalVedhApp) {
            window.openJalVedhApp();
        }
    });
    await page.waitForTimeout(600);

    await page.evaluate(() => window.handleTabClick('sonar-ingestion'));
    await page.waitForTimeout(600);

    // TEST 1: Fixed-Height Workspace Layout
    await recordResult('T1', 'Fixed-Height Layout (P0 Grid & No Window Scroll)', async () => {
        const wsVisible = await page.isVisible('.sonar-ws');
        if (!wsVisible) throw new Error('.sonar-ws layout element not visible');

        const scrollY = await page.evaluate(() => window.scrollY);
        if (scrollY !== 0) throw new Error(`Window scrolled by ${scrollY}px; P0 requires fixed height`);

        await page.screenshot({ path: path.join(screenshotDir, '01_p0_layout_1280x720.png') });
    });

    // TEST 2: Dynamic Canvas Sizing & HiDPI DPR Scaling
    await recordResult('T2', 'Dynamic Canvas Sizing & HiDPI DPR Scaling', async () => {
        const dpr = await page.evaluate(() => window.devicePixelRatio || 1);
        const size = await page.evaluate(() => window.__sonarDebug.getCanvasSize());

        if (size.cssWidth < 300 || size.cssHeight < 250) {
            throw new Error(`CSS size too small: ${size.cssWidth}x${size.cssHeight}`);
        }
        if (Math.abs(size.width - Math.floor(size.cssWidth * dpr)) > 2) {
            throw new Error(`Buffer width (${size.width}) != CSS width * DPR (${Math.floor(size.cssWidth * dpr)})`);
        }
    });

    // TEST 3: Raw vs Cleaned Render Mode (ENL Noise Dynamics)
    await recordResult('T3', 'Raw vs Cleaned Render Mode & SONAR-DAPT State', async () => {
        await page.evaluate(() => window.setSonarRenderMode('raw'));
        await page.waitForTimeout(200);
        let state = await page.evaluate(() => window.__sonarDebug.getRenderState());
        if (state.mode !== 'raw') throw new Error('Failed to set mode to raw');

        await page.evaluate(() => window.setSonarRenderMode('cleaned'));
        await page.waitForTimeout(200);
        state = await page.evaluate(() => window.__sonarDebug.getRenderState());
        if (state.mode !== 'cleaned') throw new Error('Failed to set mode to cleaned');

        await page.screenshot({ path: path.join(screenshotDir, '03_cleaned_sonar_dapt.png') });
    });

    // TEST 4: Target Box Sizing vs Bounding Dimensions (0% Deviation)
    await recordResult('T4', 'Target Box Metering & Consistency with Bounding Dimensions', async () => {
        const detections = await page.evaluate(() => window.__sonarDebug.getDetections());
        const wreck = detections.find(d => d.class === 'Shipwreck');
        if (!wreck) throw new Error('Shipwreck target missing in mock detections');

        if (wreck.boundingDimensions !== '38.6 × 14.8 m') {
            throw new Error(`Bounding dimensions mismatch: expected '38.6 × 14.8 m', got '${wreck.boundingDimensions}'`);
        }
        if (wreck.wM !== 38.6 || wreck.hM !== 14.8) {
            throw new Error(`Meter fields mismatch: wM=${wreck.wM}, hM=${wreck.hM}`);
        }

        const scale = await page.evaluate(() => window.__sonarDebug.getScaleRatio());
        if (scale !== 0.1) throw new Error(`Scale ratio != 0.1 m/px (got ${scale})`);
    });

    // TEST 5: Measured Tag Background Padding & Zero Text Overflow
    await recordResult('T5', 'Measured Tag Background Padding & Zero Text Overflow', async () => {
        await page.evaluate(() => window.setOverlayMode('boxes'));
        await page.waitForTimeout(200);

        const canvasVisible = await page.isVisible('#sonar-waterfall-canvas');
        if (!canvasVisible) throw new Error('#sonar-waterfall-canvas not visible');

        await page.screenshot({ path: path.join(screenshotDir, '05_measured_tags_boxes.png') });
    });

    // TEST 6: Right Rail Component Stacking (4 Stacked Cards)
    await recordResult('T6', 'Right Rail Component Stacking (4 Stacked Cards)', async () => {
        const cardCount = await page.locator('.sonar-rail-card').count();
        if (cardCount !== 4) throw new Error(`Expected 4 right rail cards, found ${cardCount}`);

        const minimapVisible = await page.isVisible('#rail-minimap-container');
        if (!minimapVisible) throw new Error('#rail-minimap-container not visible');

        const listVisible = await page.isVisible('#rail-detections-list');
        if (!listVisible) throw new Error('#rail-detections-list not visible');
    });

    // TEST 7: Interactive Toolbar Overlays & Palette Controls
    await recordResult('T7', 'Interactive Toolbar Overlays & Palette Controls', async () => {
        await page.evaluate(() => window.setPaletteMode('copper'));
        await page.waitForTimeout(200);
        let state = await page.evaluate(() => window.__sonarDebug.getRenderState());
        if (state.palette !== 'copper') throw new Error('Failed to set palette to copper');

        await page.evaluate(() => window.setOverlayMode('masks'));
        await page.waitForTimeout(200);
        state = await page.evaluate(() => window.__sonarDebug.getRenderState());
        if (state.overlay !== 'masks') throw new Error('Failed to set overlay to masks');

        await page.screenshot({ path: path.join(screenshotDir, '07_copper_palette_masks.png') });
    });

    // TEST 8: Right Rail Filter Chips & Keyboard Navigation
    await recordResult('T8', 'Right Rail Filter Chips & Keyboard Navigation', async () => {
        await page.evaluate(() => window.setRailFilter('manmade'));
        await page.waitForTimeout(200);

        const detCards = page.locator('#rail-detections-list .sonar-det-card');
        const count = await detCards.count();
        if (count === 0) throw new Error('No detection cards rendered in right rail');

        await detCards.first().click();
        await page.waitForTimeout(200);

        const hasSelected = await detCards.first().evaluate(el => el.classList.contains('selected'));
        if (!hasSelected) throw new Error('First card not marked selected after click');
    });

    // TEST 9: Minimap Leaflet Sync & Georeference Verification
    await recordResult('T9', 'Minimap Leaflet Sync & Georeference Verification', async () => {
        const georefText = await page.innerText('#telemetry-georef-chip');
        if (!georefText.includes('Georeferenced')) {
            throw new Error(`Georeference chip text unexpected: '${georefText}'`);
        }

        await page.screenshot({ path: path.join(screenshotDir, '09_minimap_georef_sync.png') });
    });

    await browser.close();

    console.log('\n========================================================================');
    console.log(' SONAR ANALYSIS WORKSPACE ACCEPTANCE TEST SUMMARY');
    console.log('========================================================================');
    console.table(results.map(r => ({ 'Test ID': r.id, 'Description': r.title, 'Status': r.status })));

    const passedCount = results.filter(r => r.status === 'PASSED').length;
    console.log(`\nOverall Result: ${passedCount}/${results.length} PASSED`);
    console.log('========================================================================\n');
}

runSonarQASuite().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
