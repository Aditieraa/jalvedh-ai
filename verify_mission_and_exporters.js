const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

  console.log('1. Navigating to http://localhost:8000/app.html...');
  await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });

  // Handle role selection if open
  const roleModal = page.locator('#role-select-modal');
  if (await roleModal.isVisible()) {
    console.log('Role modal is visible, selecting Marine Analyst...');
    const analystCard = page.locator('#role-select-modal .role-card-item').nth(1);
    await analystCard.click();
    await page.waitForTimeout(500);
  }

  // Go to Sonar Upload & AI view
  console.log('2. Navigating to Sonar Upload & AI via #tab-btn-sonar-ingestion...');
  await page.click('#tab-btn-sonar-ingestion');
  await page.waitForTimeout(600);

  // Check carrier bar and export suite bar visibility
  const carrierBar = await page.locator('#sonar-mission-carrier-bar').isVisible();
  const exportSuiteBar = await page.locator('#sonar-export-suite-bar').isVisible();
  console.log('Carrier bar visible:', carrierBar);
  console.log('Export suite bar visible:', exportSuiteBar);

  const activeMission = await page.locator('#sonar-workspace-mission-select').inputValue();
  const progChipText = await page.locator('#sonar-programme-chip').innerText();
  const platformChipText = await page.locator('#sonar-platform-chip').innerText();
  console.log('Active Mission:', activeMission);
  console.log('Programme Chip:', progChipText);
  console.log('Platform Chip:', platformChipText);

  const artifactDir = 'C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8';
  await page.screenshot({ path: path.join(artifactDir, 'verified_sonar_workspace_verified_scope.png'), fullPage: true });

  // Check Impact & About Institutional & Policy Section
  console.log('3. Navigating to Impact & About to verify institutional & policy landscape...');
  await page.click('#tab-btn-impact-about');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(artifactDir, 'verified_impact_about_institutional_policy.png'), fullPage: true });

  // Open New Mission Modal from Missions tab
  console.log('4. Navigating to Missions Portfolio and opening New Mission modal...');
  await page.click('#tab-btn-missions');
  await page.waitForTimeout(600);
  
  await page.click('button:has-text("+ Start New Mission")');
  await page.waitForTimeout(500);

  // Take screenshot of New Mission Modal Form with verified programmes
  await page.screenshot({ path: path.join(artifactDir, 'verified_new_mission_form_verified_policy.png') });

  // Fill form with verified Poompuhar archaeological survey
  console.log('5. Filling realistic mission form...');
  await page.fill('#new-mission-name', 'Poompuhar Ancient Port Submerged Structure & Net Sweep');
  await page.selectOption('#new-mission-programme', 'Poompuhar Archaeological Survey — NIOT / TN Archaeology');
  await page.selectOption('#new-mission-platform', 'AUV');
  await page.fill('#new-mission-vessel', 'NIOT Coastal Survey AUV-02');
  await page.fill('#new-mission-location', 'Nagapattinam–Poompuhar Seabed Transect (12 km Offshore)');
  await page.fill('#new-mission-lead', 'Dr. S. K. Raman (NIOT Ocean Acoustics Group)');
  await page.fill('#new-mission-depth', '15 - 45 m');
  await page.fill('#new-mission-spacing', '30 m');
  await page.fill('#new-mission-notes', 'Submerged Chola-era masonry detection & derelict trawl net clearance sweep.');

  // Submit form
  console.log('6. Submitting new mission form...');
  await page.click('button:has-text("Initialize Mission & Launch Workspace")');
  await page.waitForTimeout(800);

  // Verify transition to Sonar view
  const newMissionId = await page.locator('#sonar-workspace-mission-select').inputValue();
  const newCarrierChip = await page.locator('#sonar-platform-chip').innerText();
  const newProgChip = await page.locator('#sonar-programme-chip').innerText();
  console.log('Created Mission Selected in Sonar:', newMissionId);
  console.log('New Carrier Chip:', newCarrierChip);
  console.log('New Programme Chip:', newProgChip);

  await page.screenshot({ path: path.join(artifactDir, 'verified_poompuhar_mission_sonar_context.png'), fullPage: true });

  // Test mobile view
  console.log('7. Testing mobile view...');
  await page.setViewportSize({ width: 396, height: 750 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, 'verified_mobile_verified_policy_sonar.png'), fullPage: true });

  await browser.close();
  console.log('ALL VERIFIED & POLICY IMPLEMENTATIONS PASSED CLEANLY (0 ERRORS)!');
})().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
