const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    console.log('Clicking Aircraft Wreckage demo button...');
    const buttons = await page.locator('button[onclick*="loadDemoImage"]').all();
    console.log('Found demo buttons:', buttons.length);
    if (buttons.length >= 4) {
        await buttons[3].click();
    } else {
        await page.evaluate(() => window.loadDemoImage('img2.webp'));
    }

    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'test_aircraft_canvas_verified.png' });
    console.log('Captured test_aircraft_canvas_verified.png');

    const result = await page.evaluate(() => {
        const chip = document.getElementById('loaded-filename');
        const badge = document.querySelector('#sonar-ingest-loaded-state');
        const copperBtn = document.getElementById('pal-copper-btn');
        const detections = window.JalVedhMockData ? window.JalVedhMockData.mockDetections : [];
        return {
            filename: chip ? chip.innerText : '',
            copperActive: copperBtn ? copperBtn.style.background : '',
            detectionsCount: detections.length,
            topClass: detections[0] ? detections[0].class : '',
            topConfidence: detections[0] ? detections[0].confidence : 0,
            boundingDimensions: detections[0] ? detections[0].boundingDimensions : '',
            lat: detections[0] ? detections[0].lat : 0,
            lng: detections[0] ? detections[0].lng : 0
        };
    });
    console.log('Verification result:', JSON.stringify(result, null, 2));

    await browser.close();
})();
