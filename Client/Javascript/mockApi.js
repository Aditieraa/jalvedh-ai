/* JalVedh AI - Mock API & Fixtures Layer (Comprehensive Enterprise Suite) */

window.JalVedhMockData = {
    currentRole: "analyst", // Default active role: Marine Analyst
    activeMissionId: "MSN-SWQM-2026-GOA", // Default active survey mission: Sea Water Quality Monitoring (SWQM)
    
    roles: {
        operator: {
            id: "operator",
            name: "Field Operator",
            iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12b4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21h20M4 17l2-7h12l2 7M12 3v7M8 10l4-4 4 4"/></svg>`,
            badge: "Field Operator",
            email: "operator@niot.res.in",
            description: "Upload sonar logs, run live transect feeds, and monitor AUV / Towfish edge status.",
            allowedTabs: ["sonar-ingestion", "missions", "dashboard", "anomaly-map", "edge-fleet"],
            defaultTab: "sonar-ingestion"
        },
        analyst: {
            id: "analyst",
            name: "Marine Analyst",
            iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12b4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h12M12 18v-4M9 14l3-3 3 3M12 11V3M10 3h4"/></svg>`,
            badge: "Marine Analyst",
            email: "analyst@moes.gov.in",
            description: "Review & validate detections, filter seabed clutter, export geotagged hazard reports & dive plans.",
            allowedTabs: ["sonar-ingestion", "missions", "dashboard", "anomaly-map", "reports-export", "high-risk-triage", "marlin-engine", "sonar-dapt", "impact-about"],
            defaultTab: "sonar-ingestion"
        },
        admin: {
            id: "admin",
            name: "System Admin",
            iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12b4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
            badge: "System Admin",
            email: "admin@jalvedh.ai",
            description: "Manage RBAC access, audit logs, security settings, system backups & fleet telemetry.",
            allowedTabs: ["admin-panel", "dashboard", "anomaly-map", "missions", "reports-export", "edge-fleet"],
            defaultTab: "admin-panel" // Global role skips mission picker
        },
        engineer: {
            id: "engineer",
            name: "AI/ML Engineer",
            iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12b4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/></svg>`,
            badge: "AI/ML Engineer",
            email: "engineer@team-yukti.org",
            description: "Inspect MARLIN model metrics (mAP, SURE), trigger OCEAN-LEARN updates, & run SONAR-DAPT domain adaptation.",
            allowedTabs: ["sonar-ingestion", "ocean-learn", "dashboard", "marlin-engine", "sonar-dapt"],
            defaultTab: "sonar-ingestion"
        },
        viewer: {
            id: "viewer",
            name: "MoES / NIOT Viewer",
            iconSvg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12b4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
            badge: "MoES / NIOT Viewer",
            email: "viewer@niot.res.in",
            description: "Read-only executive access to anomaly map, high-risk triage, mission reports, and high-level summaries.",
            allowedTabs: ["dashboard", "anomaly-map", "missions", "reports-export", "high-risk-triage", "impact-about"],
            defaultTab: "dashboard" // Global role skips mission picker
        }
    },

    filterState: {
        minConfidence: 50,
        selectedClasses: ["Ghost Net", "Shipwreck", "Pipe", "Cylinder", "Entangled Debris Net"],
        hideNatural: false
    },

    mockMissions: [
        { id: "MSN-SWQM-2026-GOA", name: "Sea Water Quality Monitoring (SWQM) — Mandovi Shelf Benthic Survey", programme: "Sea Water Quality Monitoring (SWQM) — NCCR / MoES", platform: "Towfish", vessel: "CRV Sagar Paschimi (Towfish Rig 01)", depth: "18 - 55 m", totalDetections: 7, status: "Active", date: "2026-09-28", location: "Goa Coastal Shelf & Mandovi Transect (18 km Offshore)", lat: 15.4298, lng: 73.6800 },
        { id: "MSN-PMP-2026-NAG", name: "Poompuhar Underwater Archaeological Side-Scan Survey", programme: "Poompuhar Archaeological Survey — NIOT / TN Archaeology", platform: "AUV", vessel: "NIOT Coastal Survey AUV-02", depth: "15 - 45 m", totalDetections: 4, status: "Active", date: "2026-09-27", location: "Nagapattinam–Poompuhar Seabed Transect (12 km Offshore)", lat: 11.1500, lng: 79.8800 },
        { id: "MSN-NHO-2026-IKK", name: "INS Ikshak Hydrographic Port Approach & Hazard Clearance", programme: "Indian Naval Hydrographic Department (NHO) — INS Ikshak", platform: "Hull-Mounted", vessel: "INS Ikshak (Sandhayak-Class Survey Vessel)", depth: "20 - 65 m", totalDetections: 4, status: "Planned", date: "2026-09-29", location: "Karwar Port Approaches & Konkan Coast (25 km Offshore)", lat: 14.8100, lng: 74.0500 },
        { id: "MSN-NMLAP-2026-CHN", name: "National Marine Litter Action Plan Fairway Clearance", programme: "National Marine Litter Action Plan (NMLAP) — NCCR", platform: "ASV", vessel: "Autonomous Surface Craft ASV-Samudra", depth: "12 - 32 m", totalDetections: 4, status: "Active", date: "2026-09-26", location: "Chennai Port Approach & Ennore Fairway (14 km Offshore)", lat: 13.1800, lng: 80.4500 },
        { id: "MSN-SSSS-2026-MUM", name: "Swachh Sagar Surakshit Sagar 2026 Coastal Debris Clearance", programme: "Swachh Sagar, Surakshit Sagar — MoES / NCCR", platform: "Towfish", vessel: "CRV Sagar Tara (Towfish Rig 02)", depth: "22 - 58 m", totalDetections: 3, status: "Completed", date: "2026-09-30", location: "Mumbai Offshore Continental Shelf (20 km Offshore)", lat: 18.9200, lng: 72.7800 }
    ],

    mockDetections: [
        // MSN-SWQM-2026-GOA (Goa Coastal Shelf: 15.4298° N, 73.6800° E - Sea Water Quality Monitoring SWQM Towfish)
        { id: "DET-2026-001", missionId: "MSN-SWQM-2026-GOA", class: "Ghost Net", confidence: 96, SURE: 94, hazardScore: 95, hazardTier: "CRITICAL", lat: 15.4298, lng: 73.6800, boundingDimensions: "14.2 × 8.6 m", xM: -25.0, yM: 12.0, wM: 14.2, hM: 8.6, kind: "net", uncertaintyRadius: "± 10.5 m", pingId: "PING-8821", timestamp: "2026-09-28 08:14:22", verdict: "Pending", georeferenceStatus: "GPS/INS Georeferenced", aiInterpretation: "Acoustic shadow geometry indicates a heavy synthetic gillnet cluster entangled over rocky seabed.", recommendedAction: "Deploy retrieval boat and clearance diver team. Priority 1 environmental hazard." },
        { id: "DET-2026-002", missionId: "MSN-SWQM-2026-GOA", class: "Ghost Net", confidence: 91, SURE: 89, hazardScore: 88, hazardTier: "CRITICAL", lat: 15.4345, lng: 73.6830, boundingDimensions: "18.5 × 11.2 m", xM: 18.0, yM: 45.0, wM: 18.5, hM: 11.2, kind: "net", uncertaintyRadius: "± 12.0 m", pingId: "PING-8824", timestamp: "2026-09-28 08:16:05", verdict: "Confirmed", georeferenceStatus: "GPS/INS Georeferenced", aiInterpretation: "High-density trawl webbing detected with floats attached along top line.", recommendedAction: "Schedule salvage dive team for removal." },
        { id: "DET-2026-003", missionId: "MSN-SWQM-2026-GOA", class: "Shipwreck", confidence: 98, SURE: 97, hazardScore: 92, hazardTier: "CRITICAL", lat: 15.4120, lng: 73.6660, boundingDimensions: "38.6 × 14.8 m", xM: 22.0, yM: 26.0, wM: 38.6, hM: 14.8, kind: "wreck", uncertaintyRadius: "± 8.2 m", pingId: "PING-8830", timestamp: "2026-09-28 08:22:18", verdict: "Confirmed", georeferenceStatus: "GPS/INS Georeferenced", aiInterpretation: "Intact metallic hull structure producing strong specular backscatter highlights and continuous shadow.", recommendedAction: "Mark on navigation charts as a submerged navigation hazard." },
        { id: "DET-2026-004", missionId: "MSN-SWQM-2026-GOA", class: "Pipe", confidence: 88, SURE: 85, hazardScore: 68, hazardTier: "MEDIUM", lat: 15.4215, lng: 73.6750, boundingDimensions: "6.4 × 1.2 m", xM: -32.0, yM: 62.0, wM: 6.4, hM: 1.2, kind: "pipe", uncertaintyRadius: "± 14.5 m", pingId: "PING-8835", timestamp: "2026-09-28 08:27:40", verdict: "Pending", georeferenceStatus: "Ping Header GNSS", aiInterpretation: "Linear cylindrical backscatter signature consistent with exposed seabed pipeline section.", recommendedAction: "Notify coastal infrastructure engineering team." },
        { id: "DET-2026-005", missionId: "MSN-SWQM-2026-GOA", class: "Cylinder", confidence: 85, SURE: 82, hazardScore: 62, hazardTier: "MEDIUM", lat: 15.4390, lng: 73.6920, boundingDimensions: "3.1 × 1.0 m", xM: 14.0, yM: 70.0, wM: 3.1, hM: 1.0, kind: "cylinder", uncertaintyRadius: "± 16.0 m", pingId: "PING-8840", timestamp: "2026-09-28 08:31:12", verdict: "Pending", georeferenceStatus: "Ping Header GNSS", aiInterpretation: "Submerged cylindrical container detected lying partially buried in sand.", recommendedAction: "Inspect during next Towfish pass for hazardous material markings." },
        { id: "DET-2026-006", missionId: "MSN-SWQM-2026-GOA", class: "Pipe", confidence: 79, SURE: 76, hazardScore: 58, hazardTier: "MEDIUM", lat: 15.4085, lng: 73.6610, boundingDimensions: "5.5 × 1.1 m", xM: -18.0, yM: 38.0, wM: 5.5, hM: 1.1, kind: "pipe", uncertaintyRadius: "± 18.5 m", pingId: "PING-8845", timestamp: "2026-09-28 08:35:55", verdict: "Rejected", georeferenceStatus: "Nav File Synced", aiInterpretation: "Partially buried linear pipe signature requiring a secondary side-scan review.", recommendedAction: "Low priority survey-line review." },
        { id: "DET-2026-007", missionId: "MSN-SWQM-2026-GOA", class: "Cylinder", confidence: 74, SURE: 92, hazardScore: 25, hazardTier: "LOW", lat: 15.4260, lng: 73.6810, boundingDimensions: "3.8 × 1.2 m", xM: -10.0, yM: 52.0, wM: 3.8, hM: 1.2, kind: "cylinder", uncertaintyRadius: "± 22.0 m", pingId: "PING-8849", timestamp: "2026-09-28 08:39:10", verdict: "Rejected", georeferenceStatus: "GPS/INS Georeferenced", aiInterpretation: "Low-backscatter cylindrical object resolved from a seabed look-alike after review.", recommendedAction: "Retain in the analyst review set; do not dispatch." },

        // MSN-NMLAP-2026-CHN (Chennai Port Approach & Ennore Fairway: 13.1800° N, 80.4500° E - NCCR NMLAP ASV)
        { id: "DET-2026-008", missionId: "MSN-NMLAP-2026-CHN", class: "Ghost Net", confidence: 93, SURE: 91, hazardScore: 90, hazardTier: "CRITICAL", lat: 13.1800, lng: 80.4500, boundingDimensions: "11.0 × 7.4 m", xM: -15.0, yM: 18.0, wM: 11.0, hM: 7.4, kind: "net", uncertaintyRadius: "± 11.2 m", pingId: "PING-8860", timestamp: "2026-09-28 08:50:04", verdict: "Confirmed", georeferenceStatus: "GPS/INS Georeferenced", aiInterpretation: "Abandoned mono-filament gillnet fouling fairway approach off Chennai coast.", recommendedAction: "Deploy recovery hook on autonomous surface vessel." },
        { id: "DET-2026-009", missionId: "MSN-NMLAP-2026-CHN", class: "Pipe", confidence: 89, SURE: 87, hazardScore: 72, hazardTier: "HIGH", lat: 13.1845, lng: 80.4550, boundingDimensions: "8.2 × 1.4 m", xM: 20.0, yM: 35.0, wM: 8.2, hM: 1.4, kind: "pipe", uncertaintyRadius: "± 13.0 m", pingId: "PING-8864", timestamp: "2026-09-28 08:54:18", verdict: "Pending", georeferenceStatus: "Nav File Synced", aiInterpretation: "Exposed seabed communication conduit or industrial discharge pipe.", recommendedAction: "Cross-reference with bathymetric cable charts." },
        { id: "DET-2026-010", missionId: "MSN-NMLAP-2026-CHN", class: "Shipwreck", confidence: 97, SURE: 95, hazardScore: 94, hazardTier: "CRITICAL", lat: 13.1750, lng: 80.4420, boundingDimensions: "42.0 × 16.5 m", xM: -28.0, yM: 55.0, wM: 42.0, hM: 16.5, kind: "wreck", uncertaintyRadius: "± 9.0 m", pingId: "PING-8870", timestamp: "2026-09-28 09:02:10", verdict: "Confirmed", georeferenceStatus: "GPS/INS Georeferenced", aiInterpretation: "Submerged steel barge hull lying upright on muddy seabed.", recommendedAction: "Issue Notice to Mariners." },
        { id: "DET-2026-011", missionId: "MSN-NMLAP-2026-CHN", class: "Cylinder", confidence: 84, SURE: 80, hazardScore: 64, hazardTier: "MEDIUM", lat: 13.1880, lng: 80.4610, boundingDimensions: "2.8 × 1.1 m", xM: 12.0, yM: 68.0, wM: 2.8, hM: 1.1, kind: "cylinder", uncertaintyRadius: "± 15.5 m", pingId: "PING-8875", timestamp: "2026-09-28 09:12:45", verdict: "Pending", georeferenceStatus: "Ping Header GNSS", aiInterpretation: "Submerged gas cylinder or mooring buoy sinker.", recommendedAction: "Inspect during next ASV lawnmower transect." },

        // MSN-PMP-2026-NAG (Nagapattinam–Poompuhar Archaeological Sector: 11.1500° N, 79.8800° E - NIOT AUV)
        { id: "DET-2026-012", missionId: "MSN-PMP-2026-NAG", class: "Ghost Net", confidence: 95, SURE: 93, hazardScore: 89, hazardTier: "CRITICAL", lat: 11.1500, lng: 79.8800, boundingDimensions: "15.0 × 9.0 m", xM: -20.0, yM: 22.0, wM: 15.0, hM: 9.0, kind: "net", uncertaintyRadius: "± 10.8 m", pingId: "PING-8880", timestamp: "2026-09-28 09:20:00", verdict: "Confirmed", georeferenceStatus: "GPS/INS Georeferenced", aiInterpretation: "Derelict trawl net draped across archaeological structure zone off Poompuhar.", recommendedAction: "Archaeological clearance dive team dispatch required." },
        { id: "DET-2026-013", missionId: "MSN-PMP-2026-NAG", class: "Cylinder", confidence: 81, SURE: 78, hazardScore: 55, hazardTier: "MEDIUM", lat: 11.1550, lng: 79.8850, boundingDimensions: "4.0 × 1.3 m", xM: 16.0, yM: 42.0, wM: 4.0, hM: 1.3, kind: "cylinder", uncertaintyRadius: "± 17.0 m", pingId: "PING-8885", timestamp: "2026-09-28 09:25:30", verdict: "Pending", georeferenceStatus: "Nav File Synced", aiInterpretation: "Cylindrical masonry / structural pillar artifact signature near ancient submerged port sector.", recommendedAction: "Secondary optical inspection pass recommended." },
        { id: "DET-2026-014", missionId: "MSN-PMP-2026-NAG", class: "Shipwreck", confidence: 96, SURE: 94, hazardScore: 92, hazardTier: "CRITICAL", lat: 11.1420, lng: 79.8710, boundingDimensions: "28.5 × 9.5 m", xM: -30.0, yM: 58.0, wM: 28.5, hM: 9.5, kind: "wreck", uncertaintyRadius: "± 14.0 m", pingId: "PING-8890", timestamp: "2026-09-28 09:31:15", verdict: "Confirmed", georeferenceStatus: "Ping Header GNSS", aiInterpretation: "Historical wooden sailing vessel hull structure exhibiting regular rib frame backscatter.", recommendedAction: "Archive in TN Archaeology & NIOT maritime heritage repository." },
        { id: "DET-2026-015", missionId: "MSN-PMP-2026-NAG", class: "Pipe", confidence: 72, SURE: 90, hazardScore: 20, hazardTier: "LOW", lat: 11.1580, lng: 79.8900, boundingDimensions: "10.0 × 1.0 m", xM: -8.0, yM: 48.0, wM: 10.0, hM: 1.0, kind: "pipe", uncertaintyRadius: "± 21.0 m", pingId: "PING-8895", timestamp: "2026-09-28 09:38:00", verdict: "Rejected", georeferenceStatus: "GPS/INS Georeferenced", aiInterpretation: "Natural linear ridge rock feature classified and rejected by Nature Gate.", recommendedAction: "Retain in the audit trail; no dispatch required." },

        // MSN-NHO-2026-IKK (Karwar Port & Konkan Continental Shelf: 14.8100° N, 74.0500° E - INS Ikshak Hull SSS)
        { id: "DET-2026-016", missionId: "MSN-NHO-2026-IKK", class: "Ghost Net", confidence: 97, SURE: 96, hazardScore: 93, hazardTier: "CRITICAL", lat: 14.8100, lng: 74.0500, boundingDimensions: "22.4 × 12.0 m", xM: 15.0, yM: 30.0, wM: 22.4, hM: 12.0, kind: "net", uncertaintyRadius: "± 9.5 m", pingId: "PING-8902", timestamp: "2026-09-29 10:15:00", verdict: "Confirmed", georeferenceStatus: "GPS/INS Georeferenced", aiInterpretation: "Heavy commercial purse seine net bundle tangled on rocky navigation approach.", recommendedAction: "Dispatch recovery vessel for heavy winch salvage." },
        { id: "DET-2026-017", missionId: "MSN-NHO-2026-IKK", class: "Shipwreck", confidence: 96, SURE: 95, hazardScore: 91, hazardTier: "CRITICAL", lat: 14.8160, lng: 74.0580, boundingDimensions: "31.0 × 10.5 m", xM: -18.0, yM: 44.0, wM: 31.0, hM: 10.5, kind: "wreck", uncertaintyRadius: "± 8.0 m", pingId: "PING-8910", timestamp: "2026-09-29 10:32:45", verdict: "Confirmed", georeferenceStatus: "GPS/INS Georeferenced", aiInterpretation: "Submerged commercial vessel wreck showing prominent acoustic shadow profile.", recommendedAction: "Publish hazard coordinates to National Hydrographic Office database." },
        { id: "DET-2026-018", missionId: "MSN-NHO-2026-IKK", class: "Cylinder", confidence: 87, SURE: 86, hazardScore: 66, hazardTier: "MEDIUM", lat: 14.8050, lng: 74.0420, boundingDimensions: "4.5 × 1.2 m", xM: 10.0, yM: 60.0, wM: 4.5, hM: 1.2, kind: "cylinder", uncertaintyRadius: "± 14.0 m", pingId: "PING-8918", timestamp: "2026-09-29 10:48:12", verdict: "Pending", georeferenceStatus: "Ping Header GNSS", aiInterpretation: "Discarded pressurized chemical drum submerged on sandy navigation fairway.", recommendedAction: "Environmental inspection on next survey pass." }
    ],

    getThreatTier: function(confidence, className, hazardScore) {
        if (className === "Natural (Filtered)") return "natural";
        if (hazardScore !== undefined) {
            if (hazardScore >= 85) return "critical";
            if (hazardScore >= 70) return "high";
            if (hazardScore >= 50) return "medium";
            return "low";
        }
        if (confidence >= 90) return "critical";
        if (confidence >= 80) return "high";
        if (confidence >= 65) return "medium";
        return "low";
    },

    getFilteredDetections: function() {
        const { minConfidence, selectedClasses, hideNatural } = this.filterState;
        const isGlobalRole = ["admin", "engineer", "viewer"].includes(this.currentRole);
        return this.mockDetections.filter(d => {
            if (!isGlobalRole && d.missionId && d.missionId !== this.activeMissionId) return false;
            if (d.confidence < minConfidence) return false;
            if (hideNatural && d.class === "Natural (Filtered)") return false;
            if (selectedClasses.length > 0 && !selectedClasses.includes(d.class)) return false;
            return true;
        });
    },

    getActiveMissionStats: function() {
        const data = this.getFilteredDetections();
        const nonNatural = data.filter(d => d.class !== "Natural (Filtered)");
        const ghostNets = nonNatural.filter(d => d.class === "Ghost Net").length;
        const totalHazards = nonNatural.length;
        const confirmedVerdicts = nonNatural.filter(d => d.verdict === "Confirmed").length;
        const pendingVerdicts = nonNatural.filter(d => d.verdict === "Pending").length;
        const rejectedVerdicts = data.filter(d => d.verdict === "Rejected" || d.verdict.startsWith("Excluded")).length;
        
        const avgSURE = data.length > 0 ? (data.reduce((acc, d) => acc + d.SURE, 0) / data.length).toFixed(1) : 92.4;
        const avgConf = data.length > 0 ? (data.reduce((acc, d) => acc + d.confidence, 0) / data.length).toFixed(1) : 90.0;

        const isGlobal = ["admin", "engineer", "viewer"].includes(this.currentRole);
        const areaSwept = isGlobal ? "620 km²" : (this.activeMissionId === "MSN-SWQM-2026-GOA" ? "180 km²" : (this.activeMissionId === "MSN-PMP-2026-NAG" ? "140 km²" : (this.activeMissionId === "MSN-NHO-2026-IKK" ? "160 km²" : "120 km²")));

        return {
            ghostNets,
            totalHazards,
            confirmedVerdicts,
            pendingVerdicts,
            rejectedVerdicts,
            avgSURE,
            avgConf,
            areaSwept,
            fpPoolCount: this.falsePositivePoolCount || 142
        };
    },

    falsePositivePoolCount: 142,

    setVerdict: function(id, verdict, reason = "") {
        if (this.currentRole !== 'analyst') {
            if (window.showToast) {
                window.showToast("Permission Denied: Verdict modifications are restricted strictly to Marine Analyst role.", "error");
            }
            return false;
        }
        const item = this.mockDetections.find(d => d.id === id);
        if (item) {
            item.verdict = verdict;
            if (verdict === 'Rejected') {
                item.rejectionReason = reason || "Seabed Natural Outcrop";
                this.falsePositivePoolCount = (this.falsePositivePoolCount || 142) + 1;
                this.logAudit(`REJECT_REASON: Target ${id} rejected (${item.rejectionReason}) -> routed to Nature Gate / OCEAN-LEARN pool (Total FP Pool: ${this.falsePositivePoolCount})`);
            } else {
                this.logAudit(`VERDICT: Updated target ${id} verdict to '${verdict}'`);
            }
            if (window.showToast) {
                const msg = verdict === 'Rejected' ? `Target ${id} rejected (${item.rejectionReason}) & routed to OCEAN-LEARN pool` : `Detection ${id} verdict recorded as: ${verdict}`;
                window.showToast(msg, verdict === 'Confirmed' ? 'success' : 'info');
            }
            return true;
        }
        return false;
    },

    createNewMission: function(profile = {}) {
        if (!['operator', 'analyst', 'admin'].includes(this.currentRole)) {
            if (window.showToast) {
                window.showToast("Permission Denied: Initializing survey missions is restricted to Field Operator, Marine Analyst, or Admin role.", "error");
            }
            return null;
        }
        const idNum = this.mockMissions.length + 1;
        const newId = `MSN-NEW-2026-${String.fromCharCode(64 + idNum)}`;
        const lat = Number.isFinite(parseFloat(profile.lat)) ? parseFloat(profile.lat) : 15.4298;
        const lng = Number.isFinite(parseFloat(profile.lng)) ? parseFloat(profile.lng) : 73.6800;

        const newMission = {
            id: newId,
            name: profile.name || "New Marine Survey Campaign",
            programme: profile.programme || "Sea Water Quality Monitoring (SWQM) — NCCR / MoES",
            platform: profile.platform || "AUV",
            vessel: profile.vessel || "AUV Sagar-03",
            depth: profile.depth || "20 - 60 m",
            lineSpacing: profile.lineSpacing || "25 m",
            frequency: profile.frequency || "500 kHz High-Res",
            swathWidth: profile.swathWidth || "50 m / side",
            navigationSource: profile.navigationSource || "GNSS / INS + DVL",
            plannedDate: profile.plannedDate || new Date().toISOString().slice(0, 10),
            leadScientist: profile.leadScientist || "Dr. Rajesh Sharma (Lead Hydrographer, Acoustic Survey Division)",
            notes: profile.notes || "Operational side-scan survey campaign for benthic ghost gear clearance.",
            totalDetections: 2,
            status: "Active",
            date: new Date().toISOString().slice(0, 10),
            location: profile.location || "Coastal Shelf Sector",
            lat: lat,
            lng: lng
        };

        // Create 2 realistic baseline detections for this newly created mission
        const detId1 = `DET-2026-${String(this.mockDetections.length + 1).padStart(3, '0')}`;
        const detId2 = `DET-2026-${String(this.mockDetections.length + 2).padStart(3, '0')}`;

        this.mockDetections.unshift(
            {
                id: detId1,
                missionId: newId,
                class: "Ghost Net",
                confidence: 95,
                SURE: 93,
                hazardScore: 92,
                hazardTier: "CRITICAL",
                lat: parseFloat((lat + 0.0035).toFixed(4)),
                lng: parseFloat((lng + 0.0028).toFixed(4)),
                boundingDimensions: "15.8 × 9.2 m",
                xM: -22.0,
                yM: 18.0,
                wM: 15.8,
                hM: 9.2,
                kind: "net",
                uncertaintyRadius: "± 10.2 m",
                pingId: `PNG-${Math.floor(8100 + Math.random() * 500)}`,
                timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
                verdict: "Pending",
                georeferenceStatus: "GPS/INS Georeferenced",
                aiInterpretation: `Acoustic shadow highlights dense derelict trawl net webbing draped over seabed in ${newMission.location}.`,
                recommendedAction: "Immediate retrieval boat dispatch. Priority 1 hazard."
            },
            {
                id: detId2,
                missionId: newId,
                class: "Cylinder",
                confidence: 86,
                SURE: 84,
                hazardScore: 65,
                hazardTier: "MEDIUM",
                lat: parseFloat((lat - 0.0024).toFixed(4)),
                lng: parseFloat((lng - 0.0031).toFixed(4)),
                boundingDimensions: "3.4 × 1.2 m",
                xM: 16.0,
                yM: 42.0,
                wM: 3.4,
                hM: 1.2,
                kind: "cylinder",
                uncertaintyRadius: "± 14.0 m",
                pingId: `PNG-${Math.floor(8600 + Math.random() * 500)}`,
                timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
                verdict: "Pending",
                georeferenceStatus: "GPS/INS Georeferenced",
                aiInterpretation: "Submerged metallic cylinder / pressurized tank on seabed substrate.",
                recommendedAction: "Inspect on next autonomous survey pass."
            }
        );

        this.mockMissions.unshift(newMission);
        this.activeMissionId = newId;
        this.logAudit(`MISSION: Initialized [${newMission.programme}] ${newMission.platform} survey '${newId}' (${newMission.name}) on vessel ${newMission.vessel}`);
        return newMission;
    },

    updateMission: function(missionId, profile = {}) {
        const mission = this.mockMissions.find(m => m.id === missionId);
        if (!mission) return null;

        if (profile.name) mission.name = profile.name;
        if (profile.status) mission.status = profile.status;
        if (profile.programme) mission.programme = profile.programme;
        if (profile.platform) mission.platform = profile.platform;
        if (profile.vessel) mission.vessel = profile.vessel;
        if (profile.location) mission.location = profile.location;
        if (Number.isFinite(parseFloat(profile.lat))) mission.lat = parseFloat(profile.lat);
        if (Number.isFinite(parseFloat(profile.lng))) mission.lng = parseFloat(profile.lng);
        if (profile.depth) mission.depth = profile.depth;
        if (profile.lineSpacing) mission.lineSpacing = profile.lineSpacing;
        if (profile.frequency) mission.frequency = profile.frequency;
        if (profile.swathWidth) mission.swathWidth = profile.swathWidth;
        if (profile.navigationSource) mission.navigationSource = profile.navigationSource;
        if (profile.plannedDate) mission.plannedDate = profile.plannedDate;
        if (profile.leadScientist) mission.leadScientist = profile.leadScientist;
        if (profile.notes !== undefined) mission.notes = profile.notes;

        this.logAudit(`MISSION_UPDATE: Updated mission ${missionId} (${mission.name}) · Status Tag: '${mission.status}'`);
        if (window.showToast) {
            window.showToast(`Mission ${missionId} updated! Status: ${mission.status}`, 'success');
        }
        return mission;
    },

    addUploadedDetection: function(fileType) {
        if (!['operator', 'analyst'].includes(this.currentRole)) {
            if (window.showToast) {
                window.showToast("Permission Denied: Uploading sonar detections to survey workspace is restricted to Field Operator or Marine Analyst role.", "error");
            }
            return null;
        }
        const activeMission = this.mockMissions.find(m => m.id === this.activeMissionId) || this.mockMissions[0];
        
        const baseLat = activeMission.lat || 15.4298;
        const baseLng = activeMission.lng || 73.7682;

        const categories = [
            { class: "Shipwreck", confidence: 98, SURE: 95, hazardScore: 94, wM: 38.6, hM: 14.8, xM: -30, yM: 10, kind: "wreck" },
            { class: "Pipe", confidence: 89, SURE: 87, hazardScore: 72, wM: 8.2, hM: 1.4, xM: 20, yM: 30, kind: "pipe" },
            { class: "Cylinder", confidence: 85, SURE: 82, hazardScore: 62, wM: 4.5, hM: 1.2, xM: -15, yM: 50, kind: "cylinder" },
            { class: "Ghost Net", confidence: 96, SURE: 94, hazardScore: 91, wM: 16.4, hM: 9.8, xM: 25, yM: 70, kind: "net" },
            { class: "Entangled Debris Net", confidence: 92, SURE: 89, hazardScore: 88, wM: 12.0, hM: 8.5, xM: -10, yM: 90, kind: "net" }
        ];

        const addedDetections = [];

        categories.forEach((cat, index) => {
            const newId = `DET-2026-${String(this.mockDetections.length + 1).padStart(3, '0')}`;
            const offsetLat = (Math.random() - 0.5) * 0.01;
            const offsetLng = (Math.random() - 0.5) * 0.01;

            const newDetection = {
                id: newId,
                missionId: this.activeMissionId,
                class: cat.class,
                confidence: cat.confidence,
                SURE: cat.SURE,
                hazardScore: cat.hazardScore,
                hazardTier: cat.hazardScore >= 85 ? "CRITICAL" : (cat.hazardScore >= 70 ? "HIGH" : "MEDIUM"),
                lat: parseFloat((baseLat + offsetLat).toFixed(4)),
                lng: parseFloat((baseLng + offsetLng).toFixed(4)),
                boundingDimensions: `${cat.wM} × ${cat.hM} m`,
                uncertaintyRadius: "± 11.5 m",
                pingId: `PNG-${Math.floor(8000 + Math.random() * 1000)}`,
                timestamp: new Date().toISOString().slice(0,19).replace('T', ' '),
                verdict: "Pending",
                georeferenceStatus: "GPS/INS Georeferenced",
                aiInterpretation: `Newly ingested ${fileType} sonar stream ping analyzed by MARLIN. ${cat.class} detected.`,
                recommendedAction: "Review in Triage Queue and schedule a survey-vessel follow-up.",
                xM: cat.xM,
                yM: cat.yM,
                wM: cat.wM,
                hM: cat.hM,
                kind: cat.kind
            };

            this.mockDetections.unshift(newDetection);
            activeMission.totalDetections += 1;
            addedDetections.push(newDetection);
        });

        this.logAudit(`INGESTION: Uploaded sonar file '${fileType}' -> Targets attached to ${this.activeMissionId}`);
        return addedDetections;
    },

    mockUsers: [
        { id: "USR-101", name: "Field Operator", role: "operator", email: "operator@niot-demo.gov.in", status: "Active", lastLogin: "10 mins ago" },
        { id: "USR-102", name: "Marine Analyst", role: "analyst", email: "analyst@moes-sandbox.gov.in", status: "Active", lastLogin: "Just now" },
        { id: "USR-103", name: "System Admin", role: "admin", email: "admin@jalvedh-demo.gov.in", status: "Active", lastLogin: "1 hour ago" },
        { id: "USR-104", name: "AI/ML Engineer", role: "engineer", email: "engineer@team-yukti.org", status: "Active", lastLogin: "4 hours ago" },
        { id: "USR-105", name: "MoES / NIOT Viewer", role: "viewer", email: "viewer@niot-demo.gov.in", status: "Active", lastLogin: "2 days ago" }
    ],

    addUser: function(name, email, role) {
        const newId = `USR-${100 + this.mockUsers.length + 1}`;
        const newUser = {
            id: newId,
            name: name || "New Team Member",
            email: email || "analyst@niot-demo.gov.in",
            role: role || "analyst",
            status: "Active",
            lastLogin: "Just now"
        };
        this.mockUsers.push(newUser);
        this.logAudit(`RBAC: Provisioned new user ${newId} (${name}) with role '${role}'`);
        if (window.showToast) window.showToast(`User ${name} provisioned with role '${role}'`, "success");
        return newUser;
    },

    editUserRole: function(userId, newRole) {
        const user = this.mockUsers.find(u => u.id === userId);
        if (user) {
            user.role = newRole;
            this.logAudit(`RBAC: Assigned new role '${newRole}' to user ${userId}`);
            if (window.showToast) window.showToast(`User ${userId} role set to: ${newRole}`, "info");
        }
    },

    deactivateUser: function(userId) {
        const user = this.mockUsers.find(u => u.id === userId);
        if (user) {
            user.status = user.status === 'Active' ? 'Deactivated' : 'Active';
            this.logAudit(`RBAC: Toggled user ${userId} account status to '${user.status}'`);
            if (window.showToast) window.showToast(`User ${userId} status set to: ${user.status}`, "warning");
        }
    },

    attachedNavFile: null,

    attachNavFile: function(fileName) {
        this.attachedNavFile = {
            fileName: fileName || "GOA_SHELF_NAV_2026.nme",
            parsedLines: 1420,
            georeferenceStatus: "GPS/INS Georeferenced (Nav File Synced)",
            timestamp: new Date().toISOString().slice(0,19).replace('T', ' '),
            preview: [
                "$GPGGA,081422.00,1525.788,N,07340.800,E,1,10,0.8,42.5,M,,M,,*42",
                "$HEHDT,242.4,T*1F",
                "$PRDID,-1.2,0.8,242.4*6B",
                "GNSS Fix: 3D DGPS (RTK Active) · Position Uncertainty: ± 10.5m"
            ]
        };
        this.logAudit(`NAV_FILE: Synced coordinate nav file '${this.attachedNavFile.fileName}' (${this.attachedNavFile.parsedLines} records)`);
        if (window.showToast) window.showToast(`Navigation file '${this.attachedNavFile.fileName}' attached & georeferenced!`, "success");
        return this.attachedNavFile;
    },

    mockEdgeDevices: [
        { id: "AUV-Sagar-01", type: "AUV", status: "Online", battery: "84% (LiFePO4)", storage: "128 GB free", lastSync: "2 mins ago", mode: "Onboard Real-Time Inference (Low Power)", state: "online" },
        { id: "Towfish-Rig-01", type: "Towfish", status: "Online", battery: "Tether Power (380V AC)", storage: "Tether Active", lastSync: "Just now", mode: "SHARP + SURE Dual Pipeline Active · Speed: 4.2 kts · Alt: 8.5m", state: "online" },
        { id: "Hull-Mount-Alpha", type: "Hull-Mounted", status: "Online", battery: "Vessel Main Power", storage: "512 GB free", lastSync: "1 min ago", mode: "High-Speed Swath Sweep · Speed: 6.8 kts · IMU Stabilized", state: "online" },
        { id: "ASV-Samudra-02", type: "ASV", status: "Online", battery: "Solar + 72V Li-ion (92%)", storage: "256 GB free", lastSync: "3 mins ago", mode: "Autonomous Lawnmower Survey Transect · Speed: 3.5 kts", state: "online" }
    ],

    mockAuditLogs: [
        { timestamp: "2026-09-28 08:14:22", user: "Marine Analyst", action: "AUTH: Access Granted to Hazard Report Generator" },
        { timestamp: "2026-09-28 08:22:18", user: "Marine Analyst", action: "VERDICT: Confirmed Target DET-2026-003 (Shipwreck)" },
        { timestamp: "2026-09-28 09:10:04", user: "System Admin", action: "RBAC: Audit Log Policy Export Triggered" }
    ],

    logAudit: function(actionText) {
        const userObj = this.roles[this.currentRole];
        const userName = userObj ? userObj.name : "System User";
        const timeStr = new Date().toISOString().slice(0,19).replace('T', ' ');
        this.mockAuditLogs.unshift({
            timestamp: timeStr,
            user: userName,
            action: actionText
        });
        if (typeof populateAdminUserTable === 'function') {
            populateAdminUserTable();
        }
    },

    exportJSON: function() {
        const data = this.getFilteredDetections();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `JalVedh_Hazard_Report_${this.activeMissionId}_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        this.logAudit(`EXPORT: Downloaded JSON Evidence Report for ${this.activeMissionId}`);
        if (window.showToast) window.showToast(`Hazard Report for ${this.activeMissionId} exported as JSON`, "success");
    },

    exportGeoJSON: function() {
        const data = this.getFilteredDetections();
        const mission = this.mockMissions.find(m => m.id === this.activeMissionId);
        const featureCollection = {
            type: "FeatureCollection",
            name: `JalVedh Hazard Map - ${this.activeMissionId}`,
            mission: mission ? {
                id: mission.id,
                name: mission.name,
                platform: mission.platform || "Towfish / AUV",
                vessel: mission.vessel,
                frequency: mission.frequency || "500 kHz",
                swathWidth: mission.swathWidth || "50 m / side",
                navigationSource: mission.navigationSource || "GNSS / IMU + DVL"
            } : undefined,
            features: data.map(d => ({
                type: "Feature",
                id: d.id,
                geometry: {
                    type: "Point",
                    coordinates: [d.lng, d.lat]
                },
                properties: {
                    missionId: d.missionId,
                    class: d.class,
                    confidence: d.confidence,
                    sureReliability: d.SURE,
                    hazardScore: d.hazardScore,
                    hazardTier: d.hazardTier,
                    dimensions: d.boundingDimensions,
                    uncertaintyRadius: d.uncertaintyRadius,
                    verdict: d.verdict,
                    georeferenceStatus: d.georeferenceStatus,
                    pingId: d.pingId,
                    timestamp: d.timestamp,
                    recommendedAction: d.recommendedAction
                }
            }))
        };
        const dataStr = "data:application/geo+json;charset=utf-8," + encodeURIComponent(JSON.stringify(featureCollection, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `JalVedh_Hazard_Map_${this.activeMissionId}_${new Date().toISOString().slice(0,10)}.geojson`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        this.logAudit(`EXPORT: Downloaded GeoJSON Hazard Map for ${this.activeMissionId}`);
        if (window.showToast) window.showToast(`Hazard map for ${this.activeMissionId} exported as GeoJSON`, "success");
    },

    exportCSV: function() {
        const data = this.getFilteredDetections();
        let csvContent = "data:text/csv;charset=utf-8,ID,Mission,Class,AIConfidence(%),MARLINSUREReliability(%),HazardSeverityScore(0-100),HazardTier,Latitude,Longitude,Dimensions,PositionUncertainty,Verdict,GeoreferenceStatus,Timestamp\n";
        data.forEach(d => {
            csvContent += `${d.id},${d.missionId},"${d.class}",${d.confidence},${d.SURE},${d.hazardScore},${d.hazardTier},${d.lat},${d.lng},"${d.boundingDimensions}","${d.uncertaintyRadius}",${d.verdict},"${d.georeferenceStatus || 'GPS/INS Georeferenced'}",${d.timestamp}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", encodedUri);
        downloadAnchor.setAttribute("download", `JalVedh_Hazard_Report_${this.activeMissionId}_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        this.logAudit(`EXPORT: Downloaded CSV Hazard Report for ${this.activeMissionId}`);
        if (window.showToast) window.showToast(`Hazard Report for ${this.activeMissionId} exported as CSV`, "success");
    },

    exportNMEA: function() {
        const data = this.getFilteredDetections();
        let nmeaContent = "data:text/plain;charset=utf-8,$JALVEDH_WAYPOINTS\n";
        data.forEach(d => {
            nmeaContent += `$GPGGA,${d.timestamp.slice(11,19).replace(/:/g,'')},${d.lat}N,${d.lng}E,1,08,0.9,${d.class},M,,M,,\n`;
        });
        const encodedUri = encodeURI(nmeaContent);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", encodedUri);
        downloadAnchor.setAttribute("download", `JalVedh_NMEA_Waypoints_${this.activeMissionId}_${new Date().toISOString().slice(0,10)}.txt`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        if (window.showToast) window.showToast(`NMEA Waypoints for ${this.activeMissionId} exported for ECDIS`, "success");
    },

    exportKML: function() {
        const data = this.getFilteredDetections();
        let kmlContent = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>JalVedh Hazard Dive Plan - ${this.activeMissionId}</name>`;
        data.forEach(d => {
            kmlContent += `<Placemark><name>${d.id} - ${d.class} (Hazard Risk: ${d.hazardScore}/100)</name><description>${d.aiInterpretation} Field Action: ${d.recommendedAction}</description><Point><coordinates>${d.lng},${d.lat},0</coordinates></Point></Placemark>`;
        });
        kmlContent += `</Document></kml>`;
        const dataStr = "data:text/xml;charset=utf-8," + encodeURIComponent(kmlContent);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `JalVedh_KML_DivePlan_${this.activeMissionId}_${new Date().toISOString().slice(0,10)}.kml`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        if (window.showToast) window.showToast(`Google Earth KML Dive Plan for ${this.activeMissionId} exported`, "success");
    },

    exportPrintablePDF: function() {
        const data = this.getFilteredDetections();
        const activeMission = this.mockMissions.find(m => m.id === this.activeMissionId) || this.mockMissions[0];
        const printWin = window.open('', '_blank');
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>JalVedh AI - Executive Hazard Intelligence Report (${activeMission.id})</title>
            <style>
                @page { size: A4 portrait; margin: 20mm; }
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 24px; color: #0b2545; line-height: 1.5; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #12b4c4; padding-bottom: 14px; margin-bottom: 20px; }
                .brand { font-size: 1.8rem; font-weight: 800; color: #0b2545; }
                .brand span { color: #12b4c4; }
                .report-title { font-size: 1.2rem; text-transform: uppercase; letter-spacing: 1px; color: #5c7a8a; }
                .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: #f4fbfc; padding: 14px; border-radius: 8px; border: 1px solid #d4f0f7; margin-bottom: 20px; font-size: 0.88rem; }
                .primary-badge { background: #ffebe9; color: #f2545b; font-weight: bold; padding: 4px 10px; border-radius: 6px; display: inline-block; }
                .narrative-box { background: #fff; border-left: 4px solid #12b4c4; padding: 12px 16px; margin-bottom: 24px; font-size: 0.92rem; color: #1b3547; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #d4f0f7; padding: 9px 12px; text-align: left; font-size: 0.85rem; }
                th { background: #0b2545; color: #ffffff; font-weight: 700; }
                tr:nth-child(even) { background: #f9fbfd; }
                .badge-crit { color: #f2545b; font-weight: bold; }
                .badge-high { color: #f5a623; font-weight: bold; }
                .footer { margin-top: 30px; text-align: center; font-size: 0.78rem; color: #5c7a8a; border-top: 1px solid #e1f3f6; padding-top: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="brand">JalVedh <span>AI</span></div>
                <div class="report-title">Executive Mission Hazard Report</div>
            </div>

            <div class="meta-grid">
                <div><strong>Mission ID:</strong> ${activeMission.id}</div>
                <div><strong>Campaign Name:</strong> ${activeMission.name}</div>
                <div><strong>Survey Vessel:</strong> ${activeMission.vessel}</div>
                <div><strong>Location:</strong> ${activeMission.location}</div>
                <div><strong>Survey Depth:</strong> ${activeMission.depth}</div>
                <div><strong>Date Issued:</strong> ${new Date().toLocaleDateString()}</div>
            </div>

            <div class="narrative-box">
                <strong>Executive Narrative Technical Assessment:</strong><br>
                Automated side-scan sonar ping analysis for <strong>${activeMission.name} (${activeMission.id})</strong> identified ${data.length} localized benthic anomalies. Dual-frequency acoustic normalization (SONAR-DAPT) combined with SHARP shadow geometry modeling confirmed synthetic ghost net fouling over coral habitats with a maximum Hazard Severity Score of 95/100 (CRITICAL).
            </div>

            <h3>Mission Target Manifest & Risk Telemetry Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>Target ID</th>
                        <th>Class</th>
                        <th>AI Confidence (%)</th>
                        <th>MARLIN SURE (%)</th>
                        <th>Hazard Severity Score</th>
                        <th>Geographic Coordinates</th>
                        <th>Position Uncertainty</th>
                        <th>Verdict</th>
                    </tr>
                </thead>
                <tbody>`;
        data.forEach(d => {
            const critStyle = d.hazardScore >= 85 ? 'class="badge-crit"' : 'class="badge-high"';
            html += `
                <tr>
                    <td><strong>${d.id}</strong></td>
                    <td>${d.class}</td>
                    <td>${d.confidence}%</td>
                    <td>${d.SURE}%</td>
                    <td ${critStyle}>${d.hazardScore}/100 (${d.hazardTier})</td>
                    <td>${d.lat}° N, ${d.lng}° E</td>
                    <td>${d.uncertaintyRadius}</td>
                    <td><strong>${d.verdict}</strong></td>
                </tr>`;
        });
        html += `
                </tbody>
            </table>

            <div class="footer">
                Official Report Generated by JalVedh AI Marine Debris & Anomaly Intelligence Platform · Team Yukti
            </div>
        </body>
        </html>`;
        printWin.document.write(html);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => printWin.print(), 500);
        if (window.showToast) window.showToast(`Publication-Ready PDF Report generated for ${activeMission.id}`, "success");
    },

    exportEvidenceBundle: function(id) {
        const activeMission = this.mockMissions.find(m => m.id === this.activeMissionId) || this.mockMissions[0];
        let data = this.getFilteredDetections();
        if (id) {
            const single = this.mockDetections.find(d => d.id === id);
            if (single) data = [single];
        }

        const missionId = id ? `${this.activeMissionId}_${id}` : this.activeMissionId;

        // 1. Manifest JSON
        const manifestObj = {
            archiveType: "JALVEDH_ACOUSTIC_EVIDENCE_BUNDLE",
            generatedAt: new Date().toISOString(),
            missionContext: {
                id: activeMission.id,
                name: activeMission.name,
                programme: activeMission.programme || "Sea Water Quality Monitoring (SWQM) — NCCR / MoES",
                platform: activeMission.platform || "AUV",
                vessel: activeMission.vessel,
                frequency: activeMission.frequency || "500 kHz High-Res",
                swathWidth: activeMission.swathWidth || "50 m / side",
                depth: activeMission.depth || "20 - 60 m",
                navigationSource: activeMission.navigationSource || "GNSS / INS + DVL"
            },
            recordCount: data.length,
            detections: data
        };
        const manifestStr = JSON.stringify(manifestObj, null, 2);

        // 2. CSV Content
        let csvContent = "ID,Mission,Class,AIConfidence(%),MARLINSUREReliability(%),HazardSeverityScore(0-100),HazardTier,Latitude,Longitude,Dimensions,PositionUncertainty,Verdict,GeoreferenceStatus,Timestamp\n";
        data.forEach(d => {
            csvContent += `${d.id},${d.missionId},"${d.class}",${d.confidence},${d.SURE},${d.hazardScore},${d.hazardTier},${d.lat},${d.lng},"${d.boundingDimensions}","${d.uncertaintyRadius}",${d.verdict},"${d.georeferenceStatus || 'GPS/INS Georeferenced'}",${d.timestamp}\n`;
        });

        // 3. KML Dive Plan
        let kmlContent = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>JalVedh Evidence Dive Plan - ${missionId}</name>`;
        data.forEach(d => {
            kmlContent += `<Placemark><name>${d.id} - ${d.class} (Risk: ${d.hazardScore}/100)</name><description>${d.aiInterpretation} Action: ${d.recommendedAction}</description><Point><coordinates>${d.lng},${d.lat},0</coordinates></Point></Placemark>`;
        });
        kmlContent += `</Document></kml>`;

        // 4. Acoustic Sensor Notes
        const sensorNotes = `JalVedh AI Sonar Ingestion Workspace - Evidence Verification Package
================================================================================
Mission Campaign: ${activeMission.name} (${activeMission.id})
Programme: ${activeMission.programme || 'SWQM - NCCR / MoES'}
Carrier Platform: ${activeMission.platform} · Vessel: ${activeMission.vessel}
Sensor Regime: ${activeMission.frequency} · Swath: ${activeMission.swathWidth}
Navigation Lock: ${activeMission.navigationSource} · Coordinates: ${activeMission.lat}° N, ${activeMission.lng}° E
Total Targets Analyzed in Session: ${data.length}
Evidence Checksum Mode: CRC-32 Verified STORE Compression
================================================================================
Generated via JalVedh AI Acoustic Intelligence Platform.`;

        // Pure JS Binary ZIP Generator
        function buildZipArchive(fileList) {
            const textEncoder = new TextEncoder();
            const crcTable = [];
            for (let n = 0; n < 256; n++) {
                let c = n;
                for (let k = 0; k < 8; k++) {
                    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                }
                crcTable[n] = c;
            }
            function crc32(bytes) {
                let crc = 0 ^ (-1);
                for (let i = 0; i < bytes.length; i++) {
                    crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
                }
                return (crc ^ (-1)) >>> 0;
            }

            const fileEntries = [];
            fileList.forEach(f => {
                const nameBytes = textEncoder.encode(f.name);
                const dataBytes = typeof f.content === 'string' ? textEncoder.encode(f.content) : f.content;
                fileEntries.push({
                    nameBytes,
                    dataBytes,
                    crc: crc32(dataBytes),
                    size: dataBytes.length
                });
            });

            const parts = [];
            const cdEntries = [];
            let offset = 0;

            fileEntries.forEach(entry => {
                const header = new Uint8Array(30 + entry.nameBytes.length);
                const view = new DataView(header.buffer);
                view.setUint32(0, 0x04034b50, true);
                view.setUint16(4, 20, true);
                view.setUint16(6, 0, true);
                view.setUint16(8, 0, true);
                view.setUint16(10, 0, true);
                view.setUint16(12, 0, true);
                view.setUint32(14, entry.crc, true);
                view.setUint32(18, entry.size, true);
                view.setUint32(22, entry.size, true);
                view.setUint16(26, entry.nameBytes.length, true);
                view.setUint16(28, 0, true);
                header.set(entry.nameBytes, 30);

                parts.push(header);
                parts.push(entry.dataBytes);

                const cd = new Uint8Array(46 + entry.nameBytes.length);
                const cdView = new DataView(cd.buffer);
                cdView.setUint32(0, 0x02014b50, true);
                cdView.setUint16(4, 20, true);
                cdView.setUint16(6, 20, true);
                cdView.setUint16(8, 0, true);
                cdView.setUint16(10, 0, true);
                cdView.setUint16(12, 0, true);
                cdView.setUint16(14, 0, true);
                cdView.setUint32(16, entry.crc, true);
                cdView.setUint32(20, entry.size, true);
                cdView.setUint32(24, entry.size, true);
                cdView.setUint16(28, entry.nameBytes.length, true);
                cdView.setUint16(30, 0, true);
                cdView.setUint16(32, 0, true);
                cdView.setUint16(34, 0, true);
                cdView.setUint16(36, 0, true);
                cdView.setUint32(38, 0, true);
                cdView.setUint32(42, offset, true);
                cd.set(entry.nameBytes, 46);

                cdEntries.push(cd);
                offset += header.length + entry.dataBytes.length;
            });

            const cdStart = offset;
            let cdSize = 0;
            cdEntries.forEach(cd => {
                parts.push(cd);
                cdSize += cd.length;
            });

            const eocd = new Uint8Array(22);
            const eocdView = new DataView(eocd.buffer);
            eocdView.setUint32(0, 0x06054b50, true);
            eocdView.setUint16(4, 0, true);
            eocdView.setUint16(6, 0, true);
            eocdView.setUint16(8, fileEntries.length, true);
            eocdView.setUint16(10, fileEntries.length, true);
            eocdView.setUint32(12, cdSize, true);
            eocdView.setUint32(16, cdStart, true);
            eocdView.setUint16(20, 0, true);
            parts.push(eocd);

            const totalLen = parts.reduce((acc, p) => acc + p.length, 0);
            const out = new Uint8Array(totalLen);
            let cur = 0;
            parts.forEach(p => {
                out.set(p, cur);
                cur += p.length;
            });
            return out;
        }

        const zipData = buildZipArchive([
            { name: `manifest_${missionId}.json`, content: manifestStr },
            { name: `detections_${missionId}.csv`, content: csvContent },
            { name: `dive_plan_${missionId}.kml`, content: kmlContent },
            { name: `sensor_notes_${missionId}.txt`, content: sensorNotes }
        ]);

        const blob = new Blob([zipData], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = url;
        downloadAnchor.download = `JalVedh_Evidence_Bundle_${missionId}_${new Date().toISOString().slice(0,10)}.zip`;
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        this.logAudit(`EXPORT: Downloaded Evidence Bundle ZIP (${data.length} records) for ${missionId}`);
        if (window.showToast) {
            window.showToast(`Evidence Bundle ZIP for ${missionId} (${data.length} records) generated & downloaded!`, "success");
        }
    }
};
