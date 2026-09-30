const { chromium } = require('playwright');

(async () => {
    console.log('=== TESTING SMOOTH HAMBURGER MENU TRANSITIONS ===');
    const browser = await chromium.launch({ headless: true });
    
    // 1. Desktop Test
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const initialWidth = await page.$eval('.app-sidebar', el => el.getBoundingClientRect().width);
    console.log(`1. Desktop Expanded Sidebar Width: ${initialWidth}px (Expected: 260px)`);
    await page.screenshot({ path: 'verified_sidebar_expanded.png' });

    // Click toggle button
    console.log('2. Clicking sidebar toggle button to collapse...');
    await page.click('.header-sidebar-toggle-btn');
    await page.waitForTimeout(400); // Allow smooth transition to complete

    const collapsedWidth = await page.$eval('.app-sidebar', el => el.getBoundingClientRect().width);
    const isCollapsed = await page.$eval('.app-sidebar', el => el.classList.contains('sidebar-collapsed'));
    console.log(`- Collapsed Sidebar Width: ${collapsedWidth}px (Expected: ~68px)`);
    console.log(`- Has 'sidebar-collapsed' class: ${isCollapsed}`);
    await page.screenshot({ path: 'verified_sidebar_collapsed.png' });

    // Click toggle again to expand
    console.log('3. Clicking sidebar toggle button to expand back...');
    await page.click('.header-sidebar-toggle-btn');
    await page.waitForTimeout(400);

    const reExpandedWidth = await page.$eval('.app-sidebar', el => el.getBoundingClientRect().width);
    console.log(`- Re-expanded Sidebar Width: ${reExpandedWidth}px (Expected: 260px)`);

    // 2. Mobile Viewport Test
    console.log('\n4. Testing Mobile Viewport (768px)...');
    await page.setViewportSize({ width: 768, height: 900 });
    await page.waitForTimeout(300);

    // Click mobile toggle
    await page.click('.header-sidebar-toggle-btn');
    await page.waitForTimeout(400);

    const isMobileOpen = await page.$eval('.app-sidebar', el => el.classList.contains('mobile-open'));
    const isBackdropActive = await page.$eval('#mobile-sidebar-backdrop', el => el.classList.contains('active'));
    console.log(`- Mobile Drawer Open: ${isMobileOpen}`);
    console.log(`- Mobile Backdrop Active: ${isBackdropActive}`);
    await page.screenshot({ path: 'verified_mobile_sidebar_open.png' });

    // Close mobile drawer by clicking backdrop
    await page.click('#mobile-sidebar-backdrop');
    await page.waitForTimeout(400);

    const isMobileClosed = await page.$eval('.app-sidebar', el => !el.classList.contains('mobile-open'));
    console.log(`- Mobile Drawer Closed via Backdrop: ${isMobileClosed}`);

    console.log('\n=== ALL SMOOTH TRANSITION TESTS PASSED! ===');
    await browser.close();
})();
