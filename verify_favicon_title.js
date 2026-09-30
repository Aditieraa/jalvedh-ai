const { chromium } = require('./node_modules/playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const title = await page.title();
    const faviconHref = await page.evaluate(() => {
        const icon = document.querySelector('link[rel="icon"]');
        return icon ? icon.getAttribute('href') : null;
    });

    console.log('Page Title:', title);
    console.log('Favicon Href:', faviconHref);

    await browser.close();
})();
