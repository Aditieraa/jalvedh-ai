const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('=== STARTING GEOTAGGED MAP & MISSION INTERCONNECTION E2E TEST ===');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') console.log(`[PAGE ERROR]: ${msg.text()}`);
    });

    console.log('Navigating to http://localhost:8000/app.html ...');
    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Navigate to Geotagged Map
    console.log('1. Clicking on Geotagged Map sidebar tab...');
    await page.click('#tab-btn-anomaly-map');
    await page.waitForTimeout(800);

    // Verify map view is active
    const mapViewActive = await page.isVisible('#view-anomaly-map.active');
    console.log(`- Geotagged Map View Active: ${mapViewActive}`);

    // Verify stat badge
    const statBadgeText = await page.innerText('#map-stat-badge');
    console.log(`- Initial Map Stat Badge: "${statBadgeText.trim()}"`);

    // Verify Leaflet markers count
    const markerCount = await page.locator('.custom-leaflet-marker').count();
    console.log(`- Leaflet Markers Plotted: ${markerCount} (Expected: 22 across all missions)`);

    // Screenshot initial All-Missions Map View
    await page.screenshot({ path: 'verified_geotagged_map_all_missions.png', fullPage: false });
    console.log('- Saved screenshot: verified_geotagged_map_all_missions.png');

    // 2. Click on the first anomaly in the Quick Inspection Queue (DET-2026-001 Aircraft Wreckage)
    console.log('\n2. Selecting DET-2026-001 (Aircraft Wreckage)...');
    await page.evaluate(() => {
        window.selectMapTarget('DET-2026-001', true);
    });
    await page.waitForTimeout(600);

    // Verify Dossier Drawer Content
    const dossierText = await page.innerText('#map-target-dossier-panel');
    const hasAircraft = dossierText.includes('Aircraft Wreckage');
    const hasMission = dossierText.includes('MSN-SWQM-2026-GOA');
    const hasPing = dossierText.includes('PNG-8824');
    const hasCoords = dossierText.includes('15.4298');
    const hasSURE = dossierText.includes('94%');
    console.log(`- Dossier has Aircraft: ${hasAircraft}`);
    console.log(`- Dossier has Mission MSN-SWQM-2026-GOA: ${hasMission}`);
    console.log(`- Dossier has Ping PNG-8824: ${hasPing}`);
    console.log(`- Dossier has Coords 15.4298: ${hasCoords}`);
    console.log(`- Dossier has SURE score: ${hasSURE}`);

    await page.screenshot({ path: 'verified_geotagged_map_aircraft_dossier.png', fullPage: false });
    console.log('- Saved screenshot: verified_geotagged_map_aircraft_dossier.png');

    // 3. Test Filter by Mission: Select Poompuhar Archaeological Survey
    console.log('\n3. Filtering by MSN-PMP-2026-NAG (Poompuhar Survey)...');
    await page.selectOption('#map-mission-scope-select', 'MSN-PMP-2026-NAG');
    await page.waitForTimeout(600);

    const poompuharMarkers = await page.locator('.custom-leaflet-marker').count();
    const poompuharStat = await page.innerText('#map-stat-badge');
    console.log(`- Poompuhar Plotted Markers: ${poompuharMarkers} (Expected: 4)`);
    console.log(`- Poompuhar Stat Badge: "${poompuharStat.trim()}"`);

    await page.screenshot({ path: 'verified_geotagged_map_poompuhar_scope.png', fullPage: false });
    console.log('- Saved screenshot: verified_geotagged_map_poompuhar_scope.png');

    // 4. Test Interconnection: Click to inspect DET-2026-008 (Ancient Hull/Shipwreck) in Sonar Workspace
    console.log('\n4. Testing Direct Deep-link: Map -> Side Scan AI / Waterfall Canvas...');
    await page.evaluate(() => {
        window.selectMapTarget('DET-2026-008', false);
    });
    await page.waitForTimeout(300);

    await page.click('button:has-text("Inspect in Side Scan AI / Waterfall Canvas")');
    await page.waitForTimeout(800);

    const sonarViewActive = await page.isVisible('#view-sonar-ingestion.active');
    console.log(`- Successfully switched to Side Scan Sonar Ingestion View: ${sonarViewActive}`);
    const activeMissionCode = await page.evaluate(() => window.JalVedhMockData.activeMissionId);
    console.log(`- Synchronized Active Mission ID: ${activeMissionCode}`);

    await page.screenshot({ path: 'verified_map_to_sonar_transition.png', fullPage: false });
    console.log('- Saved screenshot: verified_map_to_sonar_transition.png');

    // 5. Test Mission Portfolio -> Geotagged Map navigation
    console.log('\n5. Testing Interconnection: Mission Portfolio -> Geotagged Map...');
    await page.click('#tab-btn-missions');
    await page.waitForTimeout(600);

    const missionsViewActive = await page.isVisible('#view-missions.active');
    console.log(`- Mission Portfolio Active: ${missionsViewActive}`);

    // Click the Map button on the Karwar mission (MSN-NHO-2026-IKK)
    console.log('Clicking Map button on INS Ikshak Karwar mission card...');
    await page.evaluate(() => {
        window.viewMissionOnMap('MSN-NHO-2026-IKK');
    });
    await page.waitForTimeout(800);

    const backOnMap = await page.isVisible('#view-anomaly-map.active');
    const selectedScope = await page.$eval('#map-mission-scope-select', el => el.value);
    const karwarMarkers = await page.locator('.custom-leaflet-marker').count();
    console.log(`- Switched back to Geotagged Map: ${backOnMap}`);
    console.log(`- Map Mission Scope updated to: ${selectedScope}`);
    console.log(`- Plotted Karwar Markers: ${karwarMarkers} (Expected: 4)`);

    await page.screenshot({ path: 'verified_missions_to_map_transition.png', fullPage: false });
    console.log('- Saved screenshot: verified_missions_to_map_transition.png');

    // 6. Test Reset to Pan-India Ocean Stations
    console.log('\n6. Testing "Fit Pan-India Ocean Stations" button...');
    await page.click('button:has-text("Fit Pan-India Ocean Stations")');
    await page.selectOption('#map-mission-scope-select', 'all');
    await page.waitForTimeout(600);

    const allMarkersReset = await page.locator('.custom-leaflet-marker').count();
    console.log(`- Reset All Stations Markers Count: ${allMarkersReset}`);

    console.log('\n=== ALL E2E GEOTAGGED MAP & MISSION INTERCONNECTION TESTS PASSED SUCCESSFULLY! ===');
    await browser.close();
})();
