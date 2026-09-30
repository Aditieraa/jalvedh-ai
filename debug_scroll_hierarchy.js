const { chromium } = require('./node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 396, height: 578 } });
    
    await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
        if (window.openJalVedhApp) window.openJalVedhApp('analyst');
        if (window.handleTabClick) window.handleTabClick('sonar-ingestion');
    });
    await page.waitForTimeout(800);

    const scrollHierarchy = await page.evaluate(() => {
        const overlay = document.getElementById('jalvedh-app-overlay');
        const body = document.querySelector('.app-body');
        const viewport = document.querySelector('.app-main-viewport');
        const tab = document.getElementById('view-sonar-ingestion');
        const ws = document.querySelector('.sonar-ws');

        return {
            doc: { sh: document.documentElement.scrollHeight, ch: document.documentElement.clientHeight },
            overlay: overlay ? { sh: overlay.scrollHeight, ch: overlay.clientHeight, st: overlay.scrollTop } : null,
            body: body ? { sh: body.scrollHeight, ch: body.clientHeight, st: body.scrollTop } : null,
            viewport: viewport ? { sh: viewport.scrollHeight, ch: viewport.clientHeight, st: viewport.scrollTop } : null,
            tab: tab ? { sh: tab.scrollHeight, ch: tab.clientHeight, st: tab.scrollTop } : null,
            ws: ws ? { sh: ws.scrollHeight, ch: ws.clientHeight, st: ws.scrollTop } : null
        };
    });

    console.log('Hierarchy:', JSON.stringify(scrollHierarchy, null, 2));

    await page.close();
    await browser.close();
})();
