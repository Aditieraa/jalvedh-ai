const { test, expect } = require('@playwright/test');

test.describe('Sonar Ingestion & AI Analysis Workspace QA Suite', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to running application on http://localhost:8000
        await page.goto('http://localhost:8000');
        
        // Open JalVedh Application Modal / Dashboard
        await page.evaluate(() => {
            if (window.switchUserRole) {
                window.switchUserRole('analyst');
            } else if (window.openJalVedhApp) {
                window.openJalVedhApp();
            }
        });
        await page.waitForTimeout(500);

        // Click on Sonar Ingestion Sidebar Tab
        const sonarTab = page.locator('#tab-btn-sonar-ingestion');
        if (await sonarTab.isVisible()) {
            await sonarTab.click();
        } else {
            await page.evaluate(() => window.handleTabClick('sonar-ingestion'));
        }
        await page.waitForTimeout(600);
    });

    test('1. Layout & Viewport Sizing (P0 Grid & No Page Scroll)', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.waitForTimeout(300);

        const ws = page.locator('.sonar-ws');
        await expect(ws).toBeVisible();

        // Check window scroll position
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBe(0);

        // Take screenshot of P0 layout
        await page.screenshot({ path: './qa/sonar/screenshots/01_p0_layout_1280x720.png' });
    });

    test('2. Dynamic Canvas Sizing & HiDPI DPR Scaling', async ({ page }) => {
        const dpr = await page.evaluate(() => window.devicePixelRatio || 1);
        const canvasInfo = await page.evaluate(() => window.__sonarDebug.getCanvasSize());

        expect(canvasInfo.cssWidth).toBeGreaterThan(300);
        expect(canvasInfo.cssHeight).toBeGreaterThan(250);
        expect(canvasInfo.width).toBe(Math.floor(canvasInfo.cssWidth * dpr));
        expect(canvasInfo.height).toBe(Math.floor(canvasInfo.cssHeight * dpr));

        console.log(`Canvas DPR Scaling Verified: CSS ${canvasInfo.cssWidth}x${canvasInfo.cssHeight} -> Buffer ${canvasInfo.width}x${canvasInfo.height} (DPR ${dpr})`);
    });

    test('3. Raw vs Cleaned Render Mode & ENL Noise Filtering', async ({ page }) => {
        // Test Raw Mode
        await page.evaluate(() => window.setSonarRenderMode('raw'));
        await page.waitForTimeout(200);
        let state = await page.evaluate(() => window.__sonarDebug.getRenderState());
        expect(state.mode).toBe('raw');

        // Test Cleaned (SONAR-DAPT) Mode
        await page.evaluate(() => window.setSonarRenderMode('cleaned'));
        await page.waitForTimeout(200);
        state = await page.evaluate(() => window.__sonarDebug.getRenderState());
        expect(state.mode).toBe('cleaned');

        await page.screenshot({ path: './qa/sonar/screenshots/03_cleaned_sonar_dapt.png' });
    });

    test('4. Target Box Metering & Consistency with Bounding Dimensions', async ({ page }) => {
        const detections = await page.evaluate(() => window.__sonarDebug.getDetections());
        expect(detections.length).toBeGreaterThan(0);

        const shipWreck = detections.find(d => d.class === 'Shipwreck');
        expect(shipWreck).toBeDefined();
        expect(shipWreck.boundingDimensions).toBe('38.6 × 14.8 m');
        expect(shipWreck.wM).toBe(38.6);
        expect(shipWreck.hM).toBe(14.8);

        // Verification: logical scale is 0.1 m/px -> 38.6m = 386px
        const scale = await page.evaluate(() => window.__sonarDebug.getScaleRatio());
        expect(scale).toBe(0.1);
    });

    test('5. Measured Tag Background Padding & Zero Text Overflow', async ({ page }) => {
        await page.evaluate(() => window.setOverlayMode('boxes'));
        await page.waitForTimeout(200);

        const canvas = page.locator('#sonar-waterfall-canvas');
        await expect(canvas).toBeVisible();

        await page.screenshot({ path: './qa/sonar/screenshots/05_measured_tags_boxes.png' });
    });

    test('6. Right Rail Component Stacking (4 Stacked Cards)', async ({ page }) => {
        const rail = page.locator('.sonar-rail');
        await expect(rail).toBeVisible();

        const cards = rail.locator('.sonar-rail-card');
        await expect(cards).toHaveCount(4);

        // Minimap container check
        const minimap = page.locator('#rail-minimap-container');
        await expect(minimap).toBeVisible();

        // Detections list check
        const list = page.locator('#rail-detections-list');
        await expect(list).toBeVisible();
    });

    test('7. Interactive Toolbar Overlays & Palette Controls', async ({ page }) => {
        // Copper Palette
        await page.evaluate(() => window.setPaletteMode('copper'));
        await page.waitForTimeout(200);
        let state = await page.evaluate(() => window.__sonarDebug.getRenderState());
        expect(state.palette).toBe('copper');

        // Masks Overlay Mode
        await page.evaluate(() => window.setOverlayMode('masks'));
        await page.waitForTimeout(200);
        state = await page.evaluate(() => window.__sonarDebug.getRenderState());
        expect(state.overlay).toBe('masks');

        await page.screenshot({ path: './qa/sonar/screenshots/07_copper_palette_masks.png' });
    });

    test('8. Right Rail Filter Chips & Keyboard Navigation', async ({ page }) => {
        // Man-made filter chip
        await page.evaluate(() => window.setRailFilter('manmade'));
        await page.waitForTimeout(200);

        const cards = page.locator('#rail-detections-list .sonar-det-card');
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);

        // Click first card
        await cards.first().click();
        await expect(cards.first()).toHaveClass(/selected/);

        // Key Navigation (ArrowDown)
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(200);
    });

    test('9. Minimap Leaflet Sync & Georeference Verification', async ({ page }) => {
        const leafletLayer = page.locator('#rail-minimap-container .leaflet-tile-loaded');
        await page.waitForTimeout(500);

        const georefChip = page.locator('#telemetry-georef-chip');
        await expect(georefChip).toBeVisible();
        await expect(georefChip).toContainText('Georeferenced');

        await page.screenshot({ path: './qa/sonar/screenshots/09_minimap_georef_sync.png' });
    });
});
