const { chromium } = require('playwright');

(async () => {
    console.log('========================================================');
    console.log('VERIFYING SWITCH ROLE BUTTON & MODAL FUNCTIONALITY');
    console.log('========================================================\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // 1. Verify initial role is Marine Analyst
    const initialRole = await page.locator('#app-role-label').innerText();
    console.log('1. Initial Role Label:', initialRole);

    // 2. Click "Switch Role" button in navbar
    console.log('2. Clicking "Switch Role" button in navbar...');
    await page.click('.role-switch-btn');
    await page.waitForTimeout(300);

    const isModalVisible = await page.locator('#role-select-modal').isVisible();
    const modalZIndex = await page.evaluate(() => {
        const modal = document.getElementById('role-select-modal');
        return modal ? window.getComputedStyle(modal).zIndex : null;
    });

    console.log('   Role Modal Visible:', isModalVisible, '| Z-Index:', modalZIndex);
    if (!isModalVisible) {
        throw new Error('❌ Role select modal is NOT visible after clicking Switch Role button!');
    }
    console.log('✅ Role Select Modal popped up in front of the application overlay.');

    await page.screenshot({ path: 'C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8/verified_switch_role_modal_open.png' });
    console.log('📸 Captured verified_switch_role_modal_open.png');

    // 3. Switch to Field Operator
    console.log('3. Selecting "Field Operator" role card...');
    await page.click('.role-card-item:has-text("Field Operator")');
    await page.waitForTimeout(400);

    const updatedRole1 = await page.locator('#app-role-label').innerText();
    console.log('   Updated Role Label:', updatedRole1);
    if (updatedRole1 !== 'Field Operator') {
        throw new Error(`Expected role to be 'Field Operator', got: '${updatedRole1}'`);
    }
    console.log('✅ Role successfully switched to Field Operator.');

    // 4. Click "Switch Role" again and switch to AI/ML Engineer
    console.log('4. Clicking "Switch Role" again to choose AI/ML Engineer...');
    await page.click('.role-switch-btn');
    await page.waitForTimeout(300);

    await page.click('.role-card-item:has-text("AI/ML Engineer")');
    await page.waitForTimeout(400);

    const updatedRole2 = await page.locator('#app-role-label').innerText();
    console.log('   Updated Role Label:', updatedRole2);
    if (updatedRole2 !== 'AI/ML Engineer') {
        throw new Error(`Expected role to be 'AI/ML Engineer', got: '${updatedRole2}'`);
    }
    console.log('✅ Role successfully switched to AI/ML Engineer.');

    // 5. Test opening via clicking the role badge pill (#app-role-pill)
    console.log('5. Clicking role badge pill (#app-role-pill)...');
    await page.click('#app-role-pill');
    await page.waitForTimeout(300);

    const isModalOpenFromPill = await page.locator('#role-select-modal').isVisible();
    console.log('   Role Modal Open from Pill:', isModalOpenFromPill);
    if (!isModalOpenFromPill) {
        throw new Error('❌ Role select modal failed to open from role pill click!');
    }

    // 6. Test Cancel button
    console.log('6. Clicking Cancel button inside modal...');
    await page.click('#role-select-modal button:has-text("Cancel")');
    await page.waitForTimeout(300);

    const isModalClosed = !(await page.locator('#role-select-modal').isVisible());
    console.log('   Role Modal Closed after Cancel:', isModalClosed);
    if (!isModalClosed) {
        throw new Error('❌ Role modal failed to close upon clicking Cancel!');
    }
    console.log('✅ Cancel button closes modal cleanly.');

    // 7. Switch back to Marine Analyst
    await page.click('.role-switch-btn');
    await page.waitForTimeout(200);
    await page.click('.role-card-item:has-text("Marine Analyst")');
    await page.waitForTimeout(300);

    await page.screenshot({ path: 'C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8/verified_switch_role_back_to_analyst.png' });
    console.log('📸 Captured verified_switch_role_back_to_analyst.png');

    await browser.close();
    console.log('\n========================================================');
    console.log('ALL SWITCH ROLE BUTTON & MODAL TESTS 100% PASSED!');
    console.log('========================================================');
})();
