const { chromium } = require('playwright');

(async () => {
    console.log('========================================================');
    console.log('VERIFYING ACTIVE MISSION BUTTON LABEL');
    console.log('========================================================\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Switch to missions tab
    await page.click('#tab-btn-missions');
    await page.waitForTimeout(400);

    // Check initial mission buttons (Default active is Goa)
    const initialButtons = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#missions-cards-grid > div'));
        return cards.map(c => {
            const title = c.querySelector('h3')?.innerText;
            const id = c.querySelector('span')?.innerText;
            const actionBtn = c.querySelector('button:last-child')?.innerText;
            const hasActiveTag = c.innerText.includes('ACTIVE SURVEY SCOPE');
            return { id, title, actionBtn, hasActiveTag };
        });
    });

    console.log('Initial Missions Buttons:', initialButtons);

    const goaCard = initialButtons.find(b => b.id && b.id.includes('GOA'));
    const chennaiCard = initialButtons.find(b => b.id && b.id.includes('CHN'));

    if (!goaCard || goaCard.actionBtn !== 'Ingest →') {
        throw new Error(`Expected active Goa mission button to be 'Ingest →', got: '${goaCard?.actionBtn}'`);
    }
    if (!chennaiCard || chennaiCard.actionBtn !== 'Set as Active & Ingest →') {
        throw new Error(`Expected inactive Chennai mission button to be 'Set as Active & Ingest →', got: '${chennaiCard?.actionBtn}'`);
    }
    console.log('✅ Active mission shows clean "Ingest →" and inactive shows "Set as Active & Ingest →".');

    // Switch active mission to Chennai
    console.log('\nSwitching active mission to Chennai (MSN-NMLAP-2026-CHN)...');
    await page.evaluate(() => window.changeActiveMission('MSN-NMLAP-2026-CHN'));
    await page.evaluate(() => window.populateMissionsView());
    await page.waitForTimeout(300);

    const updatedButtons = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#missions-cards-grid > div'));
        return cards.map(c => {
            const id = c.querySelector('span')?.innerText;
            const actionBtn = c.querySelector('button:last-child')?.innerText;
            return { id, actionBtn };
        });
    });

    console.log('Updated Missions Buttons after switching:', updatedButtons);
    const updatedChennai = updatedButtons.find(b => b.id && b.id.includes('CHN'));
    const updatedGoa = updatedButtons.find(b => b.id && b.id.includes('GOA'));

    if (updatedChennai.actionBtn !== 'Ingest →') {
        throw new Error(`Expected new active Chennai mission button to be 'Ingest →', got: '${updatedChennai.actionBtn}'`);
    }
    if (updatedGoa.actionBtn !== 'Set as Active & Ingest →') {
        throw new Error(`Expected previously active Goa mission button to become 'Set as Active & Ingest →', got: '${updatedGoa.actionBtn}'`);
    }

    await page.screenshot({ path: 'C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8/verified_active_mission_ingest_button.png' });
    console.log('📸 Captured verified_active_mission_ingest_button.png');

    await browser.close();
    console.log('\n========================================================');
    console.log('ACTIVE MISSION BUTTON LABEL 100% VERIFIED!');
    console.log('========================================================');
})();
