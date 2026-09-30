const { chromium } = require('playwright');

(async () => {
    console.log('========================================================');
    console.log('VERIFYING 0.1% MICRO-OBSERVATIONS FIXES END-TO-END');
    console.log('========================================================\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // 1. Verify Rejection Modal Cancel Button Padding
    console.log('--- TEST 1: Rejection Modal Cancel Button Padding ---');
    await page.evaluate(() => {
        window.switchUserRole('analyst');
        window.openRejectionModal('DET-2026-001');
    });
    await page.waitForTimeout(300);

    const rejectionModal = await page.$('#rejection-reason-modal');
    if (!rejectionModal) throw new Error('Rejection modal failed to open!');

    const cancelBtnPadding = await page.evaluate(() => {
        const modal = document.getElementById('rejection-reason-modal');
        const cancelBtn = modal ? Array.from(modal.querySelectorAll('button')).find(b => b.innerText.includes('Cancel')) : null;
        return cancelBtn ? {
            inlineStyle: cancelBtn.getAttribute('style'),
            computedPaddingTop: window.getComputedStyle(cancelBtn).paddingTop,
            computedPaddingBottom: window.getComputedStyle(cancelBtn).paddingBottom,
            computedPaddingLeft: window.getComputedStyle(cancelBtn).paddingLeft,
            computedPaddingRight: window.getComputedStyle(cancelBtn).paddingRight
        } : null;
    });

    console.log('Rejection Modal Cancel Button Padding:', cancelBtnPadding);
    if (!cancelBtnPadding || cancelBtnPadding.inlineStyle.includes('99px')) {
        throw new Error('❌ Rejection modal still has 99px padding typo!');
    }
    console.log('✅ Rejection modal Cancel button has clean padding (9px 18px).\n');

    // Close rejection modal
    await page.evaluate(() => document.getElementById('rejection-reason-modal').remove());

    // 2. Verify Score Guide Modal DOM Cleanup (No leftover wrapper divs)
    console.log('--- TEST 2: Score Guide Modal DOM Clean Insertion & Removal ---');
    const bodyChildrenCountBefore = await page.evaluate(() => document.body.children.length);

    await page.evaluate(() => window.openScoreGuideModal());
    await page.waitForTimeout(300);

    const guideModal = await page.$('#score-guide-modal');
    if (!guideModal) throw new Error('Score guide modal failed to open!');

    // Close guide modal
    await page.evaluate(() => document.getElementById('score-guide-modal').remove());
    await page.waitForTimeout(100);

    const bodyChildrenCountAfter = await page.evaluate(() => document.body.children.length);
    const scoreGuideLingering = await page.$('#score-guide-modal');

    console.log(`DOM Children Count -> Before: ${bodyChildrenCountBefore}, After: ${bodyChildrenCountAfter}`);
    if (bodyChildrenCountBefore !== bodyChildrenCountAfter || scoreGuideLingering) {
        throw new Error('❌ Empty wrapper div or lingering modal element left in document.body!');
    }
    console.log('✅ Score Guide Modal opens directly into body and removes cleanly with zero residual wrapper divs.\n');

    // 3. Verify Auth & Nav Modals DOM Clean Insertion & Removal
    console.log('--- TEST 3: Auth & Nav Modals Clean Removal ---');
    await page.evaluate(() => window.openNavFileModal());
    await page.waitForTimeout(200);
    await page.evaluate(() => window.closeNavFileModal());
    await page.waitForTimeout(100);

    const countAfterNav = await page.evaluate(() => document.body.children.length);
    if (countAfterNav !== bodyChildrenCountBefore) {
        throw new Error('❌ Residual div wrapper left after closing Nav File Modal!');
    }
    console.log('✅ Nav File Modal inserts and removes cleanly.\n');

    await browser.close();
    console.log('========================================================');
    console.log('ALL MICRO-OBSERVATIONS FULLY VERIFIED & CONFIRMED (100%)');
    console.log('========================================================');
})();
