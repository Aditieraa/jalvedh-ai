const fs = require('fs');

const appJs = fs.readFileSync('Client/Javascript/app-dashboard.js', 'utf8');
const mockApiJs = fs.readFileSync('Client/Javascript/mockApi.js', 'utf8');
const appHtml = fs.readFileSync('Client/app.html', 'utf8');
const landingHtml = fs.readFileSync('Client/landing.html', 'utf8');

console.log('=== RUNNING DEEP COMPREHENSIVE LOGICAL AUDIT ===\n');

const issues = [];

// 1. Check Real Names vs Mock Indian Names
const realNames = ['Dr. S. K. Raman', 'Dr. Raman', 'Dr. M. Ravichandran', 'Dr. G. A. Ramadass', 'Dr. Atmanand'];
realNames.forEach(rn => {
    if (appJs.includes(rn) || mockApiJs.includes(rn) || appHtml.includes(rn) || landingHtml.includes(rn)) {
        issues.push({ category: 'NAMING', detail: `Real person name found: ${rn}` });
    }
});

// 2. Check Seabed Formations
const seabedTerms = ['rock formation', 'sand ripple', 'marine ridge'];
seabedTerms.forEach(term => {
    const found = (appJs + mockApiJs).toLowerCase().includes(term);
    if (!found) {
        issues.push({ category: 'SEABED_FEATURES', detail: `Seabed term missing: ${term}` });
    }
});

// 3. Check 4 Platform Consistency
const platforms = ['AUV', 'Towfish', 'Hull-Mounted', 'ASV'];
platforms.forEach(p => {
    if (!mockApiJs.includes(p)) {
        issues.push({ category: 'PLATFORMS', detail: `Platform missing from mock data: ${p}` });
    }
});

// 4. Check View IDs and Tab IDs
const tabs = ['sonar-ingestion', 'missions', 'dashboard', 'anomaly-map', 'reports-export', 'high-risk-triage', 'marlin-engine', 'sonar-dapt', 'ocean-learn', 'edge-fleet', 'admin-panel', 'impact-about'];
tabs.forEach(t => {
    const hasView = appHtml.includes(`id="view-${t}"`) || appJs.includes(`id="view-${t}"`);
    const hasBtn = appHtml.includes(`id="tab-btn-${t}"`) || appJs.includes(`id="tab-btn-${t}"`);
    if (!hasView) issues.push({ category: 'NAVIGATION', detail: `View container view-${t} not found in HTML/JS template` });
    if (!hasBtn) issues.push({ category: 'NAVIGATION', detail: `Tab button tab-btn-${t} not found in HTML/JS template` });
});

// 5. Check Export Handlers
const exportFns = ['exportMissionGeoJSON', 'exportMissionCSV', 'exportMissionJSON', 'exportMissionNMEA', 'exportMissionKML', 'exportMissionPDF', 'exportEvidenceBundle'];
exportFns.forEach(fn => {
    if (!appJs.includes(fn)) {
        issues.push({ category: 'EXPORTS', detail: `Export function ${fn} is missing` });
    }
});

// 6. Check DOM Elements Referenced in app-dashboard.js
const domIdRegex = /document\.getElementById\(['"]([a-zA-Z0-9_-]+)['"]\)/g;
let match;
const queriedIds = new Set();
while ((match = domIdRegex.exec(appJs)) !== null) {
    queriedIds.add(match[1]);
}

const fullMarkup = appHtml + '\n' + appJs; // Since views are dynamically rendered in JS template strings
const missingIds = [];
const dynamicModalIds = [
    'new-mission-modal', 'edit-mission-modal', 'role-switcher-modal', 'marlin-inspector-modal',
    'report-preview-modal', 'score-guide-modal', 'add-user-modal', 'mission-summary-modal',
    'toast-container', 'sonar-dapt-modal'
];

queriedIds.forEach(id => {
    if (!fullMarkup.includes(`id="${id}"`) && !fullMarkup.includes(`id='${id}'`) && !dynamicModalIds.includes(id)) {
        // Check if dynamically constructed (e.g. tab-btn-, view-, filter-mission-, dapt-freq-, dapt-plat-)
        const isDynamicPrefix = ['tab-btn-', 'view-', 'filter-mission-', 'dapt-freq-', 'dapt-plat-', 'ocean-', 'triage-row-'].some(p => id.startsWith(p));
        if (!isDynamicPrefix) {
            missingIds.push(id);
        }
    }
});

if (missingIds.length > 0) {
    issues.push({ category: 'DOM_INTEGRITY', detail: `Potentially queried IDs not found statically: ${missingIds.join(', ')}` });
}

// 7. Check Programme Affiliation in all mock missions
try {
    const mockMissionsMatch = mockApiJs.match(/mockMissions:\s*\[([\s\S]*?)\],\s*mockDetections/);
    if (mockMissionsMatch) {
        // eval missions
        const raw = '([' + mockMissionsMatch[1] + '])';
        const missions = eval(raw);
        missions.forEach(m => {
            if (!m.programme) {
                issues.push({ category: 'MISSION_DATA', detail: `Mission ${m.id} is missing programme field!` });
            }
            if (!m.status) {
                issues.push({ category: 'MISSION_DATA', detail: `Mission ${m.id} is missing status field!` });
            }
        });
    }
} catch (e) {
    console.log('Error parsing mock missions:', e.message);
}

// 8. Check Playwright UI Render and Console Errors across all tabs
console.log('Static Audit Found', issues.length, 'potential issues:');
issues.forEach(i => console.log(`  [${i.category}] ${i.detail}`));

fs.writeFileSync('scratch_audit_results.json', JSON.stringify(issues, null, 2));
