const { chromium } = require('./node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('http://localhost:8000/index.html#dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Open app
    await page.evaluate(() => {
        if (window.openJalVedhApp) window.openJalVedhApp('analyst');
    });
    await page.waitForTimeout(500);

    // Trigger logout
    await page.evaluate(() => {
        if (window.logoutJalVedhApp) window.logoutJalVedhApp();
    });
    await page.waitForTimeout(500);

    // Check toast content
    const toastText = await page.evaluate(() => {
        const toast = document.querySelector('#jalvedh-toast-container div');
        return toast ? toast.innerText : '';
    });

    console.log('Logout Toast Text:', toastText);

    await browser.close();
})();
