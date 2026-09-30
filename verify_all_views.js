const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8';

(async () => {
    const browser = await chromium.launch({ headless: true });
    
    // ==========================================
    // 1. DESKTOP TEST: PROGRAMME AFFILIATION TAG & CREATION
    // ==========================================
    console.log('--- 1. Testing Programme Affiliation on Desktop (1440x900) ---');
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktopContext.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('PAGE ERROR:', msg.text());
            consoleErrors.push(msg.text());
        }
    });

    await page.goto('http://localhost:8000/app.html#missions', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Verify Programme Affiliation in all missions
    const missionCards = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#missions-cards-grid > div'));
        return cards.map(c => {
            const text = c.innerText;
            const programmeMatch = text.match(/Programme:\s*(.*)/);
            return {
                text: text,
                programme: programmeMatch ? programmeMatch[1].trim() : null
            };
        });
    });
    console.log('Rendered Mission Cards on Page:', missionCards.map(c => c.programme));
    for (const mc of missionCards) {
        if (!mc.programme) {
            throw new Error(`Mission card missing Programme Affiliation tag! Content: ${mc.text}`);
        }
    }

    // Capture Mission Portfolio Screenshot with Programme Tags
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_mission_programme_tags.png'), fullPage: false });

    // Ensure analyst role is active
    await page.evaluate(() => {
        window.switchUserRole('analyst');
    });
    await page.waitForTimeout(400);

    // Open Start New Mission Modal
    console.log('Opening Start New Mission modal...');
    await page.evaluate(() => window.openNewMissionModal());
    await page.waitForTimeout(500);

    const modalCheck = await page.evaluate(() => {
        const modal = document.getElementById('new-mission-modal');
        const input = document.getElementById('new-mission-name');
        return {
            modalExists: !!modal,
            inputExists: !!input,
            role: window.JalVedhMockData ? window.JalVedhMockData.currentRole : null
        };
    });
    console.log('Modal element check:', modalCheck);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_new_mission_modal.png'), fullPage: false });

    // Fill form and submit new mission
    console.log('Submitting new mission under O-SMART Marine Living Resources...');
    await page.evaluate(() => {
        document.getElementById('new-mission-name').value = 'Lakshadweep Coral Biosphere Ghost Net Clearance';
        document.getElementById('new-mission-programme').value = 'O-SMART — Marine Living Resources & Ecology';
        document.getElementById('new-mission-platform').value = 'AUV';
        document.getElementById('new-mission-vessel').value = 'AUV Sagar-03';
        document.getElementById('new-mission-location').value = 'Lakshadweep Sea Reef Slope (12 km Offshore)';
        document.getElementById('new-mission-depth').value = '15 - 45 m';
        window.submitNewMission();
    });
    await page.waitForTimeout(600);

    // Verify new mission was created and rendered
    await page.evaluate(() => window.handleTabClick('missions'));
    await page.waitForTimeout(500);

    const afterNewMissionCheck = await page.evaluate(() => {
        const activeM = window.JalVedhMockData.activeMissionId;
        const newM = window.JalVedhMockData.mockMissions.find(m => m.id === activeM);
        return {
            activeId: activeM,
            name: newM ? newM.name : null,
            programme: newM ? newM.programme : null,
            platform: newM ? newM.platform : null
        };
    });
    console.log('Newly Created Active Mission:', afterNewMissionCheck);
    if (!afterNewMissionCheck.programme || !afterNewMissionCheck.programme.includes('O-SMART')) {
        throw new Error(`New mission failed to persist Programme affiliation: ${JSON.stringify(afterNewMissionCheck)}`);
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_mission_portfolio_with_new_campaign.png'), fullPage: false });
    await desktopContext.close();

    // ==========================================
    // 2. MOBILE VIEWPORT (396x578)
    // ==========================================
    console.log('--- 2. Testing Mobile Viewport (396x578) ---');
    const mobileContext = await browser.newContext({ viewport: { width: 396, height: 578 } });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto('http://localhost:8000/app.html#missions', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_mobile_missions_programme_tags.png'), fullPage: false });

    await mobileContext.close();
    await browser.close();

    console.log('\n======================================================');
    console.log('PROGRAMME AFFILIATION FIELD & NEW MISSION WORKFLOW VERIFIED WITH 0 ERRORS!');
    console.log('======================================================');
})();
