const { chromium } = require('./node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });

    const viewports = [
        { width: 360, height: 740, name: 'Mobile_Android_360x740' },
        { width: 396, height: 578, name: 'Mobile_DevTools_396x578' },
        { width: 390, height: 844, name: 'Mobile_iPhone_390x844' },
        { width: 768, height: 1024, name: 'iPad_Portrait_768x1024' },
        { width: 1024, height: 768, name: 'iPad_Landscape_1024x768' },
        { width: 1280, height: 720, name: 'Laptop_1280x720' },
        { width: 1366, height: 768, name: 'Laptop_1366x768' },
        { width: 1920, height: 1080, name: 'Desktop_1920x1080' }
    ];

    let passed = 0;
    let total = viewports.length;

    for (const vp of viewports) {
        const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
        
        await page.goto('http://localhost:8000/index.html#dashboard', { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        // Open app & select Sonar Ingestion
        await page.evaluate(() => {
            if (window.openJalVedhApp) window.openJalVedhApp('analyst');
            if (window.handleTabClick) window.handleTabClick('sonar-ingestion');
        });
        await page.waitForTimeout(600);

        const check = await page.evaluate(() => {
            const viewport = document.querySelector('.app-main-viewport');
            const overlay = document.getElementById('jalvedh-app-overlay');
            const canvas = document.getElementById('sonar-waterfall-canvas');
            const mapCard = document.getElementById('rail-minimap-container');

            return {
                viewportOverflow: window.getComputedStyle(viewport).overflowY,
                overlayOverflow: window.getComputedStyle(overlay).overflowY,
                viewportScrollHeight: viewport ? viewport.scrollHeight : 0,
                viewportClientHeight: viewport ? viewport.clientHeight : 0,
                hasCanvas: !!canvas && canvas.offsetWidth > 0,
                hasMapCard: !!mapCard,
                canScroll: viewport ? viewport.scrollHeight >= viewport.clientHeight : false
            };
        });

        console.log(`[${vp.name}] Result:`, JSON.stringify(check));
        if (check.hasCanvas && check.hasMapCard && check.canScroll) {
            passed++;
        }

        await page.close();
    }

    await browser.close();
    console.log(`\n=== Verification Summary: ${passed}/${total} Viewports Passed ===`);
})();
