const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runProofSuite() {
    console.log('========================================================================');
    console.log(' JalVedh AI — Sonar Workspace Step 3 Proof & Geometry Assertions');
    console.log(' PS 26057: Real-Time Side-Scan Sonar Log Ingestion & AI Stream');
    console.log('========================================================================\n');

    const screenshotDir = path.join(__dirname, 'proof_screenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

    const viewports = [
        { width: 1280, height: 720, dpr: 1 },
        { width: 1280, height: 720, dpr: 2 },
        { width: 1366, height: 768, dpr: 1 },
        { width: 1920, height: 1080, dpr: 1 },
        { width: 1920, height: 1080, dpr: 2 },
    ];

    const allResults = [];
    const browser = await chromium.launch({ headless: true });

    for (const vp of viewports) {
        console.log(`------------------------------------------------------------------------`);
        console.log(` TESTING VIEWPORT: ${vp.width}x${vp.height} (DPR: ${vp.dpr})`);
        console.log(`------------------------------------------------------------------------`);

        const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            deviceScaleFactor: vp.dpr
        });
        const page = await context.newPage();

        await page.goto('http://localhost:8000?nocache=' + Date.now());
        await page.waitForTimeout(500);

        await page.waitForFunction(() => typeof window.openJalVedhApp === 'function');

        await page.evaluate(() => {
            window.openJalVedhApp();
            window.switchUserRole('analyst');
            window.changeActiveMission('MSN-GOA-2026-A');
            window.handleTabClick('sonar-ingestion');
        });
        await page.waitForTimeout(500);
        await page.evaluate(() => {
            window.renderSonarWaterfallCanvas();
        });

        const imgPath = path.join(screenshotDir, `proof_${vp.width}x${vp.height}_dpr${vp.dpr}.png`);
        await page.screenshot({ path: imgPath });

        const vpResults = [];

        // ASSERTION 1: Viewport Containment & No Page Scrollbar
        try {
            const pageScrollY = await page.evaluate(() => window.scrollY);
            if (pageScrollY !== 0) throw new Error(`Page scrolled vertically by ${pageScrollY}px`);

            const elementsToCheck = [
                { name: '.sonar-ws', sel: '.sonar-ws' },
                { name: 'Row A', sel: '.sonar-row-a' },
                { name: 'Row B', sel: '#sonar-row-b' },
                { name: 'Row C', sel: '.sonar-row-c' },
                { name: 'Viewer Card', sel: '.sonar-viewer-card' },
                { name: 'Toolbar', sel: '.sonar-toolbar' },
                { name: 'Canvas Container', sel: '#sonar-canvas-wrap' },
                { name: 'Canvas', sel: '#sonar-waterfall-canvas' },
                { name: 'Right Rail', sel: '.sonar-rail' },
                { name: 'Minimap Container', sel: '#rail-minimap-container' }
            ];

            const rects = await page.evaluate((sels) => {
                return sels.map(s => {
                    const el = document.querySelector(s.sel);
                    if (!el) return { name: s.name, missing: true };
                    const r = el.getBoundingClientRect();
                    return { name: s.name, x: r.x, y: r.y, w: r.width, h: r.height };
                });
            }, elementsToCheck);

            for (const r of rects) {
                if (r.missing) throw new Error(`Element ${r.name} missing`);
                if (r.x < -1 || r.y < -1 || (r.x + r.w) > vp.width + 2 || (r.y + r.h) > vp.height + 2) {
                    throw new Error(`${r.name} rect (${r.x.toFixed(1)}, ${r.y.toFixed(1)}, ${r.w.toFixed(1)}, ${r.h.toFixed(1)}) extends beyond viewport ${vp.width}x${vp.height}`);
                }
            }

            vpResults.push({ id: 'A1', desc: `Viewport Containment (${vp.width}x${vp.height} dpr${vp.dpr})`, status: 'PASSED' });
        } catch (err) {
            vpResults.push({ id: 'A1', desc: `Viewport Containment (${vp.width}x${vp.height} dpr${vp.dpr})`, status: 'FAILED', error: err.message });
        }

        // ASSERTION 2: Header Component Ordering & Visibility
        try {
            const headerOrder = await page.evaluate(() => {
                const title = document.querySelector('.sonar-row-a .tab-title')?.getBoundingClientRect();
                const stepper = document.querySelector('.sonar-stepper')?.getBoundingClientRect();
                const rowB = document.getElementById('sonar-row-b')?.getBoundingClientRect();
                const toolbar = document.querySelector('.sonar-toolbar')?.getBoundingClientRect();
                const container = document.getElementById('sonar-canvas-wrap')?.getBoundingClientRect();

                if (!title || !stepper || !rowB || !toolbar || !container) return { missing: true };

                return {
                    titleH: title.height,
                    stepperH: stepper.height,
                    rowBH: rowB.height,
                    toolbarH: toolbar.height,
                    containerH: container.height,
                    ordered: (title.top < rowB.top) && (rowB.top < toolbar.top) && (toolbar.top < container.top)
                };
            });

            if (headerOrder.missing) throw new Error('Header element missing');
            if (headerOrder.titleH <= 0 || headerOrder.stepperH <= 0 || headerOrder.rowBH <= 0 || headerOrder.toolbarH <= 0) {
                throw new Error('Header component has height <= 0');
            }
            if (!headerOrder.ordered) throw new Error('Vertical top-to-bottom ordering violation');

            vpResults.push({ id: 'A2', desc: `Header Order & Visibility (${vp.width}x${vp.height})`, status: 'PASSED' });
        } catch (err) {
            vpResults.push({ id: 'A2', desc: `Header Order & Visibility (${vp.width}x${vp.height})`, status: 'FAILED', error: err.message });
        }

        // ASSERTION 3: Canvas Rect vs Container Content Rect & Buffer Math
        try {
            const canvasMath = await page.evaluate((effectiveDpr) => {
                if (window.renderSonarWaterfallCanvas) window.renderSonarWaterfallCanvas();
                const c = document.getElementById('sonar-waterfall-canvas');
                const wrap = document.getElementById('sonar-canvas-wrap');
                if (!c || !wrap) return null;

                const cr = c.getBoundingClientRect();
                const wr = wrap.getBoundingClientRect();
                const cappedDpr = Math.min(2, effectiveDpr);
                const expectedW = Math.min(4096, Math.round(wr.width * cappedDpr));

                return {
                    dx: Math.abs(cr.x - wr.x),
                    dy: Math.abs(cr.y - wr.y),
                    dw: Math.abs(cr.width - wr.width),
                    dh: Math.abs(cr.height - wr.height),
                    bufferW: c.width,
                    expectedW: expectedW
                };
            }, vp.dpr);

            if (!canvasMath) throw new Error('Canvas or wrapper missing');
            if (canvasMath.dx > 1 || canvasMath.dy > 1 || canvasMath.dw > 1 || canvasMath.dh > 1) {
                throw new Error(`Canvas rect delta from container > 1px (dx:${canvasMath.dx}, dy:${canvasMath.dy}, dw:${canvasMath.dw}, dh:${canvasMath.dh})`);
            }
            if (Math.abs(canvasMath.bufferW - canvasMath.expectedW) > 1) {
                throw new Error(`Canvas buffer width ${canvasMath.bufferW} != expected ${canvasMath.expectedW}`);
            }

            vpResults.push({ id: 'A3', desc: `Canvas Rect & Buffer Math (${vp.width}x${vp.height})`, status: 'PASSED' });
        } catch (err) {
            vpResults.push({ id: 'A3', desc: `Canvas Rect & Buffer Math (${vp.width}x${vp.height})`, status: 'FAILED', error: err.message });
        }

        // ASSERTION 4: Rail Side Positioning, Minimap Containment & Non-Overlapping Matrix
        try {
            const overlapData = await page.evaluate(() => {
                const viewer = document.querySelector('.sonar-viewer-card').getBoundingClientRect();
                const rail = document.querySelector('.sonar-rail').getBoundingClientRect();
                const minimapCard = document.querySelectorAll('.sonar-rail-card')[0].getBoundingClientRect();
                const minimap = document.getElementById('rail-minimap-container').getBoundingClientRect();

                // Compute intersection area between viewer and rail
                const xOverlap = Math.max(0, Math.min(viewer.x + viewer.width, rail.x + rail.width) - Math.max(viewer.x, rail.x));
                const yOverlap = Math.max(0, Math.min(viewer.y + viewer.height, rail.y + rail.height) - Math.max(viewer.y, rail.y));
                const intersectionArea = xOverlap * yOverlap;

                const minimapInside = (minimap.x >= minimapCard.x - 1) &&
                                      (minimap.y >= minimapCard.y - 1) &&
                                      (minimap.x + minimap.width <= minimapCard.x + minimapCard.width + 1) &&
                                      (minimap.y + minimap.height <= minimapCard.y + minimapCard.height + 1);

                return {
                    railX: rail.x,
                    viewerRight: viewer.x + viewer.width,
                    intersectionArea,
                    minimapInside
                };
            });

            if (overlapData.railX < overlapData.viewerRight - 1) {
                throw new Error(`Rail X (${overlapData.railX}) is not to the right of viewer card (${overlapData.viewerRight})`);
            }
            if (overlapData.intersectionArea > 0) {
                throw new Error(`Viewer card and Right Rail overlap by ${overlapData.intersectionArea} px²`);
            }
            if (!overlapData.minimapInside) {
                throw new Error('Minimap container is not fully contained inside Rail Card 1');
            }

            vpResults.push({ id: 'A4', desc: `Rail Alignment & Overlap Matrix (${vp.width}x${vp.height})`, status: 'PASSED' });
        } catch (err) {
            vpResults.push({ id: 'A4', desc: `Rail Alignment & Overlap Matrix (${vp.width}x${vp.height})`, status: 'FAILED', error: err.message });
        }

        // ASSERTION 5: ResizeObserver Stability (2s Growth Check)
        try {
            const initialSize = await page.evaluate(() => {
                const wrap = document.getElementById('sonar-canvas-wrap');
                const c = document.getElementById('sonar-waterfall-canvas');
                const wr = wrap.getBoundingClientRect();
                return { w: wr.width, h: wr.height, bw: c.width, bh: c.height };
            });

            await page.waitForTimeout(2000);

            const finalSize = await page.evaluate(() => {
                const wrap = document.getElementById('sonar-canvas-wrap');
                const c = document.getElementById('sonar-waterfall-canvas');
                const wr = wrap.getBoundingClientRect();
                return { w: wr.width, h: wr.height, bw: c.width, bh: c.height };
            });

            if (Math.abs(finalSize.w - initialSize.w) >= 1 || Math.abs(finalSize.h - initialSize.h) >= 1) {
                throw new Error(`Container resized over 2s: initial (${initialSize.w}x${initialSize.h}) -> final (${finalSize.w}x${finalSize.h})`);
            }
            if (finalSize.bw !== initialSize.bw || finalSize.bh !== initialSize.bh) {
                throw new Error(`Canvas buffer grown over 2s: initial (${initialSize.bw}x${initialSize.bh}) -> final (${finalSize.bw}x${finalSize.bh})`);
            }

            vpResults.push({ id: 'A5', desc: `ResizeObserver 2s Stability (${vp.width}x${vp.height})`, status: 'PASSED' });
        } catch (err) {
            vpResults.push({ id: 'A5', desc: `ResizeObserver 2s Stability (${vp.width}x${vp.height})`, status: 'FAILED', error: err.message });
        }

        // ASSERTION 6: Canvas Pixels (getImageData Analysis)
        try {
            const pixelData = await page.evaluate(() => {
                const canvas = document.getElementById('sonar-waterfall-canvas');
                if (!canvas) return null;
                const ctx = canvas.getContext('2d');

                // Read 40x40 patch of empty seabed
                const seabedImg = ctx.getImageData(40, 100, 40, 40);
                let seabedSum = 0;
                const seabedVals = [];
                for (let i = 0; i < seabedImg.data.length; i += 4) {
                    const avg = (seabedImg.data[i] + seabedImg.data[i+1] + seabedImg.data[i+2]) / 3;
                    seabedSum += avg;
                    seabedVals.push(avg);
                }
                const seabedMean = seabedSum / seabedVals.length;
                const seabedVar = seabedVals.reduce((acc, v) => acc + (v - seabedMean) ** 2, 0) / seabedVals.length;
                const seabedStdDev = Math.sqrt(seabedVar);

                // Read 40x40 patch over nadir strip (center x)
                const nadirX = Math.floor(canvas.width / 2);
                const nadirImg = ctx.getImageData(nadirX - 10, 300, 40, 40);
                let nadirSum = 0;
                for (let i = 0; i < nadirImg.data.length; i += 4) {
                    nadirSum += (nadirImg.data[i] + nadirImg.data[i+1] + nadirImg.data[i+2]) / 3;
                }
                const nadirMean = nadirSum / (nadirImg.data.length / 4);

                // Target regions (detect bright-then-dark pairs)
                // Targets are rendered around y=80, y=155, y=230
                let targetPairsFound = 0;
                [80, 155, 230].forEach(targetY => {
                    const targetImg = ctx.getImageData(0, targetY, canvas.width, 40);
                    let maxBright = 0, minDark = 255;
                    for (let i = 0; i < targetImg.data.length; i += 4) {
                        const val = (targetImg.data[i] + targetImg.data[i+1] + targetImg.data[i+2]) / 3;
                        if (val > maxBright) maxBright = val;
                        if (val < minDark) minDark = val;
                    }
                    if (maxBright > 120 && minDark < 40) {
                        targetPairsFound++;
                    }
                });

                return {
                    seabedMean,
                    seabedStdDev,
                    nadirMean,
                    targetPairsFound
                };
            });

            if (!pixelData) throw new Error('Failed to read canvas pixels');
            if (pixelData.seabedMean < 25 || pixelData.seabedMean > 70) {
                throw new Error(`Seabed mean brightness ${pixelData.seabedMean.toFixed(1)} outside [25, 70]`);
            }
            if (pixelData.seabedStdDev <= 6) {
                throw new Error(`Seabed stddev ${pixelData.seabedStdDev.toFixed(2)} <= 6 (lacks acoustic speckle)`);
            }
            if (pixelData.nadirMean >= pixelData.seabedMean) {
                throw new Error(`Nadir strip mean ${pixelData.nadirMean.toFixed(1)} not darker than seabed ${pixelData.seabedMean.toFixed(1)}`);
            }
            if (pixelData.targetPairsFound < 3) {
                throw new Error(`Found only ${pixelData.targetPairsFound}/3 bright-then-dark target pixel pairs`);
            }

            vpResults.push({ id: 'A6', desc: `Canvas Pixels & Acoustic Physics (${vp.width}x${vp.height})`, status: 'PASSED' });
        } catch (err) {
            vpResults.push({ id: 'A6', desc: `Canvas Pixels & Acoustic Physics (${vp.width}x${vp.height})`, status: 'FAILED', error: err.message });
        }

        allResults.push({ viewport: `${vp.width}x${vp.height} dpr${vp.dpr}`, assertions: vpResults });
        await context.close();
    }

    await browser.close();

    console.log('\n========================================================================');
    console.log(' STEP 3 PROOF ASSERTIONS SUMMARY TABLE');
    console.log('========================================================================');

    const summaryTable = [];
    allResults.forEach(r => {
        r.assertions.forEach(a => {
            summaryTable.push({
                Viewport: r.viewport,
                Assertion: a.desc,
                Status: a.status,
                Detail: a.error || 'All conditions met'
            });
        });
    });

    console.table(summaryTable);
}

runProofSuite().catch(err => {
    console.error('Proof suite error:', err);
    process.exit(1);
});
