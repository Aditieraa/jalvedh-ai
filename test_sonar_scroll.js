const { chromium } = require('./node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });

    const viewports = [
        { width: 396, height: 578, name: 'Mobile_DevTools_396x578' },
        { width: 390, height: 844, name: 'iPhone_14_390x844' },
        { width: 1366, height: 768, name: 'Laptop_1366x768' },
        { width: 1280, height: 720, name: 'Laptop_1280x720' }
    ];

    for (const vp of viewports) {
        const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
        
        await page.goto('http://localhost:8000/index.html#dashboard', { waitUntil: 'networkidle' });
        await page.waitForTimeout(600);

        // Open app and navigate to sonar ingestion
        await page.evaluate(() => {
            if (window.openJalVedhApp) window.openJalVedhApp('analyst');
            if (window.handleTabClick) window.handleTabClick('sonar-ingestion');
        });
        await page.waitForTimeout(800);

        // Capture initial top view
        const topScreenshot = `C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8/sonar_top_${vp.name}.png`;
        await page.screenshot({ path: topScreenshot, fullPage: false });
        console.log(`[Top View] Saved screenshot for ${vp.name}: ${topScreenshot}`);

        // Scroll down to check bottom rail cards and map
        const scrollInfo = await page.evaluate(() => {
            const viewport = document.querySelector('.app-main-viewport');
            const view = document.getElementById('view-sonar-ingestion');
            
            // Scroll down
            if (viewport) viewport.scrollTop = 500;
            if (view) view.scrollTop = 500;
            window.scrollTo(0, 500);

            return {
                viewportScrollHeight: viewport ? viewport.scrollHeight : null,
                viewportClientHeight: viewport ? viewport.clientHeight : null,
                canScroll: viewport ? viewport.scrollHeight > viewport.clientHeight : false
            };
        });
        await page.waitForTimeout(400);

        const bottomScreenshot = `C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8/sonar_bottom_${vp.name}.png`;
        await page.screenshot({ path: bottomScreenshot, fullPage: false });
        console.log(`[Bottom View] Saved screenshot for ${vp.name}: ${bottomScreenshot}`);
        console.log(`[Scroll Info] ${vp.name}:`, JSON.stringify(scrollInfo));

        await page.close();
    }

    await browser.close();
})();
