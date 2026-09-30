const fs = require('fs');

const jsCode = fs.readFileSync('Client/Javascript/app-dashboard.js', 'utf8');
const mockCode = fs.readFileSync('Client/Javascript/mockApi.js', 'utf8');
const indexHtml = fs.readFileSync('Client/index.html', 'utf8');
const appHtml = fs.readFileSync('Client/app.html', 'utf8');
const cssDashboard = fs.readFileSync('Client/css/app-dashboard.css', 'utf8');

console.log('========================================================');
console.log('JALVEDH AI - COMPREHENSIVE FRONTEND LOGICAL AUDIT');
console.log('========================================================\n');

// 1. Check Tabs & Navigation
console.log('--- 1. TAB & VIEW MAPPINGS ---');
const definedTabs = [
    'sonar-ingestion', 'missions', 'dashboard', 'anomaly-map', 
    'reports-export', 'high-risk-triage', 'marlin-engine', 
    'sonar-dapt', 'ocean-learn', 'edge-fleet', 'admin-panel', 'impact-about'
];

let tabIssues = [];
definedTabs.forEach(tab => {
    const hasBtn = jsCode.includes(`id="tab-btn-${tab}"`);
    const hasView = jsCode.includes(`id="view-${tab}"`);
    if (!hasBtn) tabIssues.push(`Missing sidebar button for tab: tab-btn-${tab}`);
    if (!hasView) tabIssues.push(`Missing view container for tab: view-${tab}`);
});
console.log(`Checked ${definedTabs.length} tabs. Tab issues count: ${tabIssues.length}`);
if (tabIssues.length > 0) console.log(tabIssues);

// 2. Check Roles & Allowed Tabs
console.log('\n--- 2. RBAC & ALLOWED TABS CONSISTENCY ---');
const rolesMatch = mockCode.match(/roles:\s*({[\s\S]*?})\s*,\s*filterState/);
let rbacIssues = [];
if (rolesMatch) {
    const rolesObj = eval('(' + rolesMatch[1] + ')');
    Object.keys(rolesObj).forEach(rKey => {
        const r = rolesObj[rKey];
        if (!r.allowedTabs || r.allowedTabs.length === 0) {
            rbacIssues.push(`Role ${rKey} has no allowedTabs!`);
        } else {
            r.allowedTabs.forEach(t => {
                if (!definedTabs.includes(t)) {
                    rbacIssues.push(`Role ${rKey} contains undefined tab: '${t}'`);
                }
            });
        }
        if (r.defaultTab && !definedTabs.includes(r.defaultTab)) {
            rbacIssues.push(`Role ${rKey} has invalid defaultTab: '${r.defaultTab}'`);
        }
    });
}
console.log(`RBAC issues count: ${rbacIssues.length}`);
if (rbacIssues.length > 0) console.log(rbacIssues);

// 3. Check Missions & Detections
console.log('\n--- 3. MISSIONS, CARRIER PLATFORMS & GEOGRAPHY ---');
let window = {};
eval(mockCode);
const JalVedhMockData = window.JalVedhMockData;

const allowedPlatforms = ['AUV', 'Towfish', 'Hull-Mounted', 'ASV'];
let missionIssues = [];
JalVedhMockData.mockMissions.forEach(m => {
    if (!allowedPlatforms.includes(m.platform)) {
        missionIssues.push(`Mission ${m.id} uses invalid platform '${m.platform}' (must be one of: ${allowedPlatforms.join(', ')})`);
    }
    if (!m.programme) {
        missionIssues.push(`Mission ${m.id} missing programme tag`);
    }
    if (!m.vessel) {
        missionIssues.push(`Mission ${m.id} missing vessel`);
    }
    if (typeof m.lat !== 'number' || typeof m.lng !== 'number') {
        missionIssues.push(`Mission ${m.id} has invalid coordinates (${m.lat}, ${m.lng})`);
    }
});
console.log(`Missions count: ${JalVedhMockData.mockMissions.length}. Mission issues count: ${missionIssues.length}`);
if (missionIssues.length > 0) console.log(missionIssues);

// 4. Check Detections
console.log('\n--- 4. DETECTIONS & GEOTAGGING ---');
let detIssues = [];
const missionIds = JalVedhMockData.mockMissions.map(m => m.id);
JalVedhMockData.mockDetections.forEach(d => {
    if (!missionIds.includes(d.missionId)) {
        detIssues.push(`Detection ${d.id} is bound to non-existent missionId '${d.missionId}'`);
    }
    if (typeof d.lat !== 'number' || typeof d.lng !== 'number') {
        detIssues.push(`Detection ${d.id} has invalid coordinates (${d.lat}, ${d.lng})`);
    }
    if (d.confidence < 0 || d.confidence > 100) {
        detIssues.push(`Detection ${d.id} confidence out of range: ${d.confidence}`);
    }
    if (d.SURE < 0 || d.SURE > 100) {
        detIssues.push(`Detection ${d.id} SURE score out of range: ${d.SURE}`);
    }
    if (d.hazardScore < 0 || d.hazardScore > 100) {
        detIssues.push(`Detection ${d.id} hazardScore out of range: ${d.hazardScore}`);
    }
});
console.log(`Detections count: ${JalVedhMockData.mockDetections.length}. Detection issues count: ${detIssues.length}`);
if (detIssues.length > 0) console.log(detIssues);

// 5. Exporters Check
console.log('\n--- 5. EXPORTERS CHECK ---');
const exporters = [
    'exportJSON', 'exportGeoJSON', 'exportCSV', 'exportNMEA', 'exportKML', 'exportPrintablePDF', 'exportEvidenceBundle'
];
let exporterIssues = [];
exporters.forEach(exp => {
    if (typeof JalVedhMockData[exp] !== 'function') {
        exporterIssues.push(`MockApi missing exporter function: ${exp}`);
    }
});
console.log(`Exporter functions verified: ${exporters.length}. Issues: ${exporterIssues.length}`);
if (exporterIssues.length > 0) console.log(exporterIssues);

// 6. Check DOM Elements in app-dashboard.js
console.log('\n--- 6. DOM IDS ACCESSED IN JS BUT MISSING IN MARKUP ---');
const getElementByIdMatches = jsCode.matchAll(/document\.getElementById\(['"]([a-zA-Z0-9_-]+)['"]\)/g);
let accessedIds = new Set();
for (const match of getElementByIdMatches) {
    accessedIds.add(match[1]);
}

let missingIds = [];
for (const id of accessedIds) {
    const inJsMarkup = jsCode.includes(`id="${id}"`) || jsCode.includes(`id='${id}'`);
    const inAppHtml = appHtml.includes(`id="${id}"`) || appHtml.includes(`id='${id}'`);
    const inIndexHtml = indexHtml.includes(`id="${id}"`) || indexHtml.includes(`id='${id}'`);
    if (!inJsMarkup && !inAppHtml && !inIndexHtml) {
        missingIds.push(id);
    }
}
console.log(`Total getElementById queries: ${accessedIds.size}. Missing DOM IDs: ${missingIds.length}`);
if (missingIds.length > 0) {
    console.log('Missing IDs:', missingIds);
}

console.log('\n========================================================');
console.log('AUDIT COMPLETED');
console.log('========================================================');
