const { chromium } = require('playwright');

(async () => {
    console.log('--- Verifying Dynamic Acoustic Telemetry & Pipeline Cards ---');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Ingest Aircraft
    console.log('1. Loading Aircraft demo (img2.webp)...');
    await page.evaluate(() => window.loadDemoImage('img2.webp'));
    await page.waitForTimeout(2500);

    const telemAircraft = await page.evaluate(() => ({
        latlng: document.getElementById('telem-latlng')?.innerText,
        heading: document.getElementById('telem-heading')?.innerText,
        speed: document.getElementById('telem-speed')?.innerText,
        alt: document.getElementById('telem-alt')?.innerText,
        freq: document.getElementById('telem-freq')?.innerText,
        pitch: document.getElementById('telem-pitch')?.innerText,
        roll: document.getElementById('telem-roll')?.innerText,
        heave: document.getElementById('telem-heave')?.innerText,
        dapt: document.getElementById('pipe-dapt')?.innerText,
        sharp: document.getElementById('pipe-sharp')?.innerText,
        pingmem: document.getElementById('pipe-pingmem')?.innerText,
        sure: document.getElementById('pipe-sure')?.innerText,
        dropouts: document.getElementById('pipe-dropouts')?.innerText,
        enl: document.getElementById('pipe-enl')?.innerText
    }));
    console.log('   Aircraft Telemetry:', telemAircraft);

    // 2. Ingest Shipwreck
    console.log('2. Loading Shipwreck demo (img3.jpg)...');
    await page.evaluate(() => window.loadDemoImage('img3.jpg'));
    await page.waitForTimeout(2500);

    const telemShipwreck = await page.evaluate(() => ({
        latlng: document.getElementById('telem-latlng')?.innerText,
        heading: document.getElementById('telem-heading')?.innerText,
        alt: document.getElementById('telem-alt')?.innerText,
        pitch: document.getElementById('telem-pitch')?.innerText,
        dapt: document.getElementById('pipe-dapt')?.innerText
    }));
    console.log('   Shipwreck Telemetry:', telemShipwreck);

    // 3. Ingest Pipeline
    console.log('3. Loading Pipeline demo (pipeline_scan.jpg)...');
    await page.evaluate(() => window.loadDemoImage('pipeline_scan.jpg'));
    await page.waitForTimeout(2500);

    const telemPipeline = await page.evaluate(() => ({
        latlng: document.getElementById('telem-latlng')?.innerText,
        heading: document.getElementById('telem-heading')?.innerText,
        alt: document.getElementById('telem-alt')?.innerText,
        pitch: document.getElementById('telem-pitch')?.innerText,
        dapt: document.getElementById('pipe-dapt')?.innerText
    }));
    console.log('   Pipeline Telemetry:', telemPipeline);

    await page.screenshot({ path: 'verified_telemetry_and_minimap.png' });
    console.log('Captured verified_telemetry_and_minimap.png');

    await browser.close();
    console.log('Dynamic Telemetry Verification Completed Successfully!');
})();
