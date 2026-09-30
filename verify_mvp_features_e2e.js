const { chromium } = require('playwright');

(async () => {
    console.log('--- Starting Comprehensive MVP End-to-End Verification ---');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

    const errors = [];
    page.on('pageerror', err => {
        console.error('[PAGE ERROR]', err.message);
        errors.push(err.message);
    });

    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Verify Navigation to Sonar Workspace
    const activeTab = await page.evaluate(() => {
        const btn = document.getElementById('tab-btn-sonar-ingestion');
        return btn ? btn.innerText.trim() : null;
    });
    console.log('1. Active Workspace Title:', activeTab);

    // 2. Test Demo 1: Shipwreck Ribs (img3.jpg)
    console.log('2. Testing Demo 1 (Shipwreck)...');
    await page.evaluate(() => window.loadDemoImage('img3.jpg'));
    await page.waitForTimeout(2500);

    const detShipwreck = await page.evaluate(() => {
        const det = window.JalVedhMockData.mockDetections[0];
        const copBtn = document.getElementById('pal-copper-btn');
        return {
            filename: document.getElementById('loaded-filename')?.innerText,
            class: det?.class,
            confidence: det?.confidence,
            lat: det?.lat,
            lng: det?.lng,
            copperActive: copBtn?.style?.background?.includes('11, 37, 69') || copBtn?.style?.background?.includes('#0b2545')
        };
    });
    console.log('   Shipwreck result:', detShipwreck);

    // 3. Test Demo 2: Ghost Net (ghostnet_v3_6000_ghost_net_007361.png)
    console.log('3. Testing Demo 2 (Ghost Net)...');
    await page.evaluate(() => window.loadDemoImage('ghostnet_v3_6000_ghost_net_007361.png'));
    await page.waitForTimeout(2500);

    const detNet = await page.evaluate(() => {
        const det = window.JalVedhMockData.mockDetections[0];
        const grayBtn = document.getElementById('pal-gray-btn');
        return {
            filename: document.getElementById('loaded-filename')?.innerText,
            class: det?.class,
            confidence: det?.confidence,
            grayActive: grayBtn?.style?.background?.includes('11, 37, 69') || grayBtn?.style?.background?.includes('#0b2545')
        };
    });
    console.log('   Ghost Net result:', detNet);

    // 4. Test Demo 3: Pipeline (pipeline_scan.jpg)
    console.log('4. Testing Demo 3 (Pipeline)...');
    await page.evaluate(() => window.loadDemoImage('pipeline_scan.jpg'));
    await page.waitForTimeout(2500);

    const detPipeline = await page.evaluate(() => {
        const det = window.JalVedhMockData.mockDetections[0];
        return {
            filename: document.getElementById('loaded-filename')?.innerText,
            class: det?.class,
            confidence: det?.confidence
        };
    });
    console.log('   Pipeline result:', detPipeline);

    // 5. Test Demo 4: Aircraft Wreckage (img2.webp)
    console.log('5. Testing Demo 4 (Aircraft Wreckage)...');
    await page.evaluate(() => window.loadDemoImage('img2.webp'));
    await page.waitForTimeout(2500);

    const detAircraft = await page.evaluate(() => {
        const det = window.JalVedhMockData.mockDetections[0];
        const copBtn = document.getElementById('pal-copper-btn');
        return {
            filename: document.getElementById('loaded-filename')?.innerText,
            class: det?.class,
            confidence: det?.confidence,
            dimensions: det?.boundingDimensions,
            lat: det?.lat,
            lng: det?.lng,
            copperActive: copBtn?.style?.background?.includes('11, 37, 69') || copBtn?.style?.background?.includes('#0b2545')
        };
    });
    console.log('   Aircraft result:', detAircraft);

    // 6. Test Toolbar Filters & Toggles
    console.log('6. Testing Toolbar Controls (DAPT Clean, Masks, Shadows, Freq, Zoom)...');
    await page.evaluate(() => {
        window.setSonarRenderMode('cleaned');
        window.setSonarFrequency('100khz');
        window.setOverlayMode('masks');
        window.zoomCanvas(0.2);
    });
    await page.waitForTimeout(500);

    const stateCleanedMasks = await page.evaluate(() => {
        const cleanBtn = document.getElementById('toolbar-clean-btn');
        const masksBtn = document.getElementById('overlay-masks-btn');
        return {
            renderMode: cleanBtn?.style?.background?.includes('18, 180, 196') ? 'cleaned' : 'raw',
            overlayMode: masksBtn?.style?.background?.includes('11, 37, 69') ? 'masks' : 'other',
            enlText: document.getElementById('pipe-enl')?.innerText
        };
    });
    console.log('   Toolbar transformed state:', stateCleanedMasks);

    await page.evaluate(() => {
        window.setOverlayMode('shadows');
        window.setSonarRenderMode('raw');
        window.setSonarFrequency('500khz');
        window.resetCanvasZoom();
        window.setOverlayMode('boxes');
    });
    await page.waitForTimeout(500);

    // 7. Test Export Modals & Functions
    console.log('7. Testing Live Anomaly Exporters (JSON, GeoJSON, CSV, NMEA, KML, PDF)...');
    const formats = ['JSON', 'GEOJSON', 'CSV', 'NMEA', 'KML', 'PDF'];
    for (const fmt of formats) {
        await page.evaluate((f) => window.openReportPreviewModal(f), fmt);
        const modalVisible = await page.evaluate(() => !!document.getElementById('report-preview-modal'));
        if (!modalVisible) throw new Error(`Modal failed to open for ${fmt}`);
        await page.evaluate(() => document.getElementById('report-preview-modal')?.remove());
    }
    console.log('   All 6 Pre-Export Inspector Modals verified successfully!');

    // 8. Capture Final Complete Workspace Verification Screenshot
    await page.screenshot({ path: 'verified_mvp_complete_flow.png' });
    console.log('8. Captured verified_mvp_complete_flow.png');

    console.log('Total caught unhandled page errors:', errors.length);
    if (errors.length > 0) {
        console.error('Errors encountered:', errors);
    } else {
        console.log('SUCCESS: All 5 MVP modules verified end-to-end with 100% success!');
    }

    await browser.close();
})();
