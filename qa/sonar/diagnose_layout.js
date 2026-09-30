const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function diagnose() {
    const screenshotDir = path.join(__dirname, 'diag_screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

    const viewports = [
        { width: 1280, height: 720, dpr: 1 },
        { width: 1280, height: 720, dpr: 2 },
        { width: 1366, height: 768, dpr: 1 },
        { width: 1920, height: 1080, dpr: 1 },
        { width: 1920, height: 1080, dpr: 2 },
    ];

    const browser = await chromium.launch({ headless: true });

    for (const vp of viewports) {
        console.log(`\n========================================================================`);
        console.log(` DIAGNOSING VIEWPORT: ${vp.width}x${vp.height} (DPR: ${vp.dpr})`);
        console.log(`========================================================================`);

        const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            deviceScaleFactor: vp.dpr
        });
        const page = await context.newPage();

        await page.goto('http://localhost:8000?nocache=' + Date.now());
        await page.waitForTimeout(500);

        // Open app as Marine Analyst on MSN-GOA-2026-A
        await page.evaluate(() => {
            if (window.switchUserRole) window.switchUserRole('analyst');
            if (window.changeActiveMission) window.changeActiveMission('MSN-GOA-2026-A');
            if (window.handleTabClick) window.handleTabClick('sonar-ingestion');
        });
        await page.waitForTimeout(1000);

        const imgPath = path.join(screenshotDir, `diag_${vp.width}x${vp.height}_dpr${vp.dpr}.png`);
        await page.screenshot({ path: imgPath });
        console.log(`Saved screenshot: ${imgPath}`);

        // Track ResizeObserver sizes over 2 seconds
        const resizeLogs = [];
        const startTrack = Date.now();
        while (Date.now() - startTrack < 2000) {
            const size = await page.evaluate(() => {
                const c = document.getElementById('sonar-waterfall-canvas');
                const wrap = document.getElementById('sonar-canvas-wrap');
                return {
                    time: Date.now(),
                    wrapCss: wrap ? wrap.getBoundingClientRect() : null,
                    canvasAttr: c ? { w: c.width, h: c.height } : null,
                    canvasCss: c ? c.getBoundingClientRect() : null,
                    canvasStyle: c ? { w: c.style.width, h: c.style.height } : null
                };
            });
            resizeLogs.push(size);
            await page.waitForTimeout(300);
        }

        console.log('\n--- ResizeObserver Stability Over 2s ---');
        console.log(`Initial Wrap CSS: ${resizeLogs[0].wrapCss?.width}x${resizeLogs[0].wrapCss?.height}, Canvas Attr: ${resizeLogs[0].canvasAttr?.w}x${resizeLogs[0].canvasAttr?.h}`);
        console.log(`Final Wrap CSS: ${resizeLogs[resizeLogs.length - 1].wrapCss?.width}x${resizeLogs[resizeLogs.length - 1].wrapCss?.height}, Canvas Attr: ${resizeLogs[resizeLogs.length - 1].canvasAttr?.w}x${resizeLogs[resizeLogs.length - 1].canvasAttr?.h}`);

        // Measure Element Geometry & Computed Styles
        const elementSelectors = [
            { name: '.sonar-ws', sel: '.sonar-ws' },
            { name: 'Row A (.sonar-row-a)', sel: '.sonar-row-a' },
            { name: 'Row B (#sonar-row-b)', sel: '#sonar-row-b' },
            { name: 'Row C (.sonar-row-c)', sel: '.sonar-row-c' },
            { name: 'Toolbar (.sonar-toolbar)', sel: '.sonar-toolbar' },
            { name: 'Canvas Container (#sonar-canvas-wrap)', sel: '#sonar-canvas-wrap' },
            { name: 'Canvas (#sonar-waterfall-canvas)', sel: '#sonar-waterfall-canvas' },
            { name: 'Right Rail (.sonar-rail)', sel: '.sonar-rail' },
            { name: 'Minimap Container (#rail-minimap-container)', sel: '#rail-minimap-container' }
        ];

        console.log('\n--- Bounding Rects & Computed Styles ---');
        const diagData = await page.evaluate((selectors) => {
            return selectors.map(item => {
                const el = document.querySelector(item.sel);
                if (!el) return { name: item.name, missing: true };
                const r = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                const obj = {
                    name: item.name,
                    rect: { x: r.x, y: r.y, w: r.width, h: r.height },
                    computed: {
                        display: style.display,
                        position: style.position,
                        overflow: style.overflow,
                        minWidth: style.minWidth,
                        minHeight: style.minHeight,
                        flex: style.flex,
                        gridTemplateRows: style.gridTemplateRows,
                        gridTemplateColumns: style.gridTemplateColumns
                    }
                };
                if (el.tagName === 'CANVAS') {
                    obj.attributes = { width: el.getAttribute('width'), height: el.getAttribute('height') };
                    obj.inlineStyle = { width: el.style.width, height: el.style.height };
                }
                return obj;
            });
        }, elementSelectors);

        // Also get all rail cards
        const railCardsData = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('.sonar-rail-card'));
            return cards.map((c, i) => {
                const r = c.getBoundingClientRect();
                const s = window.getComputedStyle(c);
                return {
                    name: `Rail Card ${i + 1}`,
                    rect: { x: r.x, y: r.y, w: r.width, h: r.height },
                    computed: { display: s.display, position: s.position, overflow: s.overflow, height: s.height }
                };
            });
        });

        console.log(JSON.stringify({ viewport: vp, elements: diagData, railCards: railCardsData }, null, 2));

        // Check for viewport overflow & overlaps
        const vpW = vp.width;
        const vpH = vp.height;
        console.log('\n--- Viewport Overflow & Overlap Checks ---');
        diagData.forEach(d => {
            if (d.missing) return;
            const r = d.rect;
            if (r.x < 0 || r.y < 0 || (r.x + r.w) > vpW + 2 || (r.y + r.h) > vpH + 2) {
                console.log(`[OVERFLOW] ${d.name}: rect (${r.x.toFixed(1)}, ${r.y.toFixed(1)}, ${r.w.toFixed(1)}, ${r.h.toFixed(1)}) extends beyond viewport ${vpW}x${vpH}`);
            }
        });

        await context.close();
    }

    await browser.close();
}

diagnose().catch(err => {
    console.error('Diagnosis error:', err);
    process.exit(1);
});
