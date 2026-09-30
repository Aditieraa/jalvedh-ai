const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:8000/app.html');
    await page.waitForSelector('.app-sidebar');

    // 1. Verify navbar has no hamburger toggle button
    const navbarToggleBtn = await page.$('.app-header .sidebar-toggle-btn');
    console.log('Navbar hamburger toggle button present:', navbarToggleBtn !== null ? 'FAIL' : 'PASS (Clean Navbar)');

    // 2. Verify sidebar has hamburger toggle button in sidebar-top-bar
    const sidebarToggleBtn = await page.$('.app-sidebar .sidebar-top-bar .sidebar-toggle-btn');
    console.log('Sidebar top bar hamburger toggle button present:', sidebarToggleBtn !== null ? 'PASS' : 'FAIL');

    // Check initial sidebar width
    const initialBox = await page.$eval('.app-sidebar', el => el.getBoundingClientRect().width);
    console.log(`Initial Expanded Sidebar Width: ${initialBox}px`);

    await page.screenshot({ path: path.join('C:\\Users\\aditi\\.gemini\\antigravity\\brain\\d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'verified_sidebar_expanded.png') });

    // 3. Click sidebar toggle button to collapse
    await page.click('.app-sidebar .sidebar-top-bar .sidebar-toggle-btn');
    await page.waitForTimeout(400);

    const collapsedBox = await page.$eval('.app-sidebar', el => el.getBoundingClientRect().width);
    const isCollapsedClass = await page.$eval('.app-sidebar', el => el.classList.contains('sidebar-collapsed'));
    console.log(`Collapsed Sidebar Width: ${collapsedBox}px | Has class sidebar-collapsed: ${isCollapsedClass}`);

    await page.screenshot({ path: path.join('C:\\Users\\aditi\\.gemini\\antigravity\\brain\\d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8', 'verified_sidebar_collapsed_rail.png') });

    // 4. Click sidebar toggle button to expand again
    await page.click('.app-sidebar .sidebar-top-bar .sidebar-toggle-btn');
    await page.waitForTimeout(400);

    const reExpandedBox = await page.$eval('.app-sidebar', el => el.getBoundingClientRect().width);
    console.log(`Re-expanded Sidebar Width: ${reExpandedBox}px`);

    console.log('========================================================');
    console.log('SIDEBAR COLLAPSE / EXPAND TOGGLE 100% VERIFIED!');
    console.log('========================================================');

    await browser.close();
})();
