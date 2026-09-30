const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    for (const vp of [{ width: 1920, height: 1080 }, { width: 1366, height: 768 }, { width: 1280, height: 720 }]) {
        const page = await browser.newPage({ viewport: vp });
        await page.goto('http://localhost:8000');
        await page.evaluate(() => {
            if (typeof openJalVedhApp === 'function') openJalVedhApp();
            else if (typeof switchUserRole === 'function') switchUserRole('analyst');
        });
        await page.waitForTimeout(400);
        await page.evaluate(() => {
            if (typeof handleTabClick === 'function') handleTabClick('sonar-ingestion');
        });
        await page.waitForTimeout(400);
        await page.screenshot({ path: `scratch/test_${vp.width}x${vp.height}_100.png` });

        const info = await page.evaluate(() => {
            const ws = document.querySelector('.sonar-ws');
            const rowC = document.querySelector('.sonar-row-c');
            return {
                viewport: { w: window.innerWidth, h: window.innerHeight },
                wsBottom: ws?.getBoundingClientRect().bottom,
                rowCBottom: rowC?.getBoundingClientRect().bottom,
                fitsInWindow: rowC?.getBoundingClientRect().bottom <= window.innerHeight
            };
        });
        console.log(`${vp.width}x${vp.height}:`, JSON.stringify(info));
        await page.close();
    }
    await browser.close();
})();
