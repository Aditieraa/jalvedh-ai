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
        selectedClasses: [], // Empty means all target classes are enabled
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
        // ==================== MISSION 1: MSN-SWQM-2026-GOA (Goa Coastal Shelf - 7 Detections) ====================
        {
            id: "DET-2026-001",
            missionId: "MSN-SWQM-2026-GOA",
            class: "Aircraft Wreckage",
            confidence: 96,
            SURE: 94,
            hazardScore: 94,
            hazardTier: "CRITICAL",
            lat: 15.4298,
            lng: 73.6800,
            boundingDimensions: "24.5 × 28.0 m",
            uncertaintyRadius: "± 0.4 m",
            pingId: "PNG-8824",
            timestamp: "2026-09-28 08:16:05",
            verdict: "Confirmed",
            georeferenceStatus: "GPS/INS Georeferenced (DGPS Calibrated)",
            aiInterpretation: "Submerged commercial airframe wreckage with twin-turbofan acoustic signature, intact wing spars, and extensive fuselage shadow.",
            recommendedAction: "High-priority naval salvage verification; coordinate diver safety zone with Mormugao Port Trust.",
            shadowLength: "18.4 m",
            reliefHeight: "4.8 m",
            backscatterP95: "218 DN",
            depth: "34 m",
            vessel: "CRV Sagar Paschimi (Towfish Rig 01)",
            platform: "Towfish",
            programme: "Sea Water Quality Monitoring (SWQM) — NCCR / MoES",
            frequency: "500 kHz High-Res CHIRP",
            altitude: "6.0 m",
            surveySpeed: "4.1 kn",
            heading: "242° (SSW)",
            rawX: 42,
            rawY: 55,
            rawW: 130,
            rawH: 150,
            xM: -18.5,
            yM: 28.0,
            wM: 24.5,
            hM: 28.0
        },
        {
            id: "DET-2026-002",
            missionId: "MSN-SWQM-2026-GOA",
            class: "Ghost Net",
            confidence: 94,
            SURE: 92,
            hazardScore: 91,
            hazardTier: "CRITICAL",
            lat: 15.4385,
            lng: 73.6872,
            boundingDimensions: "18.2 × 11.5 m",
            uncertaintyRadius: "± 0.8 m",
            pingId: "PNG-8840",
            timestamp: "2026-09-28 08:24:12",
            verdict: "Confirmed",
            georeferenceStatus: "GPS/INS Georeferenced",
            aiInterpretation: "Dense entangled monofilament gillnet cluster draped across submerged rocky ridge with high acoustic backscatter entanglement loops.",
            recommendedAction: "Benthic grapple retrieval dispatch; alert artisanal fishermen within 3 nautical miles.",
            shadowLength: "8.2 m",
            reliefHeight: "2.1 m",
            backscatterP95: "196 DN",
            depth: "31 m",
            vessel: "CRV Sagar Paschimi (Towfish Rig 01)",
            platform: "Towfish",
            programme: "Sea Water Quality Monitoring (SWQM) — NCCR / MoES",
            frequency: "500 kHz High-Res CHIRP",
            altitude: "6.2 m",
            surveySpeed: "4.0 kn",
            heading: "242° (SSW)",
            rawX: 180,
            rawY: 110,
            rawW: 95,
            rawH: 80,
            xM: 14.2,
            yM: 45.0,
            wM: 18.2,
            hM: 11.5
        },
        {
            id: "DET-2026-003",
            missionId: "MSN-SWQM-2026-GOA",
            class: "Pipe",
            confidence: 91,
            SURE: 89,
            hazardScore: 78,
            hazardTier: "HIGH",
            lat: 15.4215,
            lng: 73.6720,
            boundingDimensions: "12.4 × 1.2 m",
            uncertaintyRadius: "± 1.2 m",
            pingId: "PNG-8855",
            timestamp: "2026-09-28 08:35:40",
            verdict: "Confirmed",
            georeferenceStatus: "GPS/INS Georeferenced",
            aiInterpretation: "Exposed linear metallic conduit section exhibiting specular acoustic highlights and distinct ground-range shadow relief.",
            recommendedAction: "Cross-reference with coastal offshore pipeline registry and check for scour undermining.",
            shadowLength: "3.5 m",
            reliefHeight: "1.2 m",
            backscatterP95: "230 DN",
            depth: "36 m",
            vessel: "CRV Sagar Paschimi (Towfish Rig 01)",
            platform: "Towfish",
            programme: "Sea Water Quality Monitoring (SWQM) — NCCR / MoES",
            frequency: "500 kHz High-Res CHIRP",
            altitude: "5.8 m",
            surveySpeed: "4.2 kn",
            heading: "240° (WSW)",
            rawX: 310,
            rawY: 190,
            rawW: 75,
            rawH: 40,
            xM: 22.0,
            yM: 65.0,
            wM: 12.4,
            hM: 1.2
        },
        {
            id: "DET-2026-004",
            missionId: "MSN-SWQM-2026-GOA",
            class: "Entangled Debris Net",
            confidence: 88,
            SURE: 86,
            hazardScore: 85,
            hazardTier: "CRITICAL",
            lat: 15.4450,
            lng: 73.6910,
            boundingDimensions: "14.0 × 9.0 m",
            uncertaintyRadius: "± 1.5 m",
            pingId: "PNG-8862",
            timestamp: "2026-09-28 08:42:19",
            verdict: "Pending",
            georeferenceStatus: "GPS/INS Georeferenced",
            aiInterpretation: "Polypropylene trawl net remnant combined with entangled maritime towline and plastic marine debris.",
            recommendedAction: "Deploy ROV cutting arm or surface retrieval winch during next survey pass.",
            shadowLength: "7.0 m",
            reliefHeight: "1.9 m",
            backscatterP95: "188 DN",
            depth: "29 m",
            vessel: "CRV Sagar Paschimi (Towfish Rig 01)",
            platform: "Towfish",
            programme: "Sea Water Quality Monitoring (SWQM) — NCCR / MoES",
            frequency: "500 kHz High-Res CHIRP",
            altitude: "6.0 m",
            surveySpeed: "4.1 kn",
            heading: "244° (WSW)",
            rawX: 120,
            rawY: 260,
            rawW: 85,
            rawH: 70,
            xM: -10.5,
            yM: 88.0,
            wM: 14.0,
            hM: 9.0
        },
        {
            id: "DET-2026-005",
            missionId: "MSN-SWQM-2026-GOA",
            class: "Cylinder",
            confidence: 85,
            SURE: 84,
            hazardScore: 68,
            hazardTier: "MEDIUM",
            lat: 15.4180,
            lng: 73.6650,
            boundingDimensions: "4.8 × 1.1 m",
            uncertaintyRadius: "± 1.8 m",
            pingId: "PNG-8878",
            timestamp: "2026-09-28 08:51:02",
            verdict: "Pending",
            georeferenceStatus: "GPS/INS Georeferenced",
            aiInterpretation: "Discarded cylindrical industrial container resting upright in fine sand, potential pressurized canister.",
            recommendedAction: "Magnetometer re-sweep on next run to verify ferrous content and wall thickness.",
            shadowLength: "2.2 m",
            reliefHeight: "1.1 m",
            backscatterP95: "212 DN",
            depth: "38 m",
            vessel: "CRV Sagar Paschimi (Towfish Rig 01)",
            platform: "Towfish",
            programme: "Sea Water Quality Monitoring (SWQM) — NCCR / MoES",
            frequency: "500 kHz High-Res CHIRP",
            altitude: "6.1 m",
            surveySpeed: "4.1 kn",
            heading: "240° (WSW)",
            rawX: 240,
            rawY: 310,
            rawW: 50,
            rawH: 35,
            xM: 16.0,
            yM: 104.0,
            wM: 4.8,
            hM: 1.1
        },
        {
            id: "DET-2026-006",
            missionId: "MSN-SWQM-2026-GOA",
            class: "Shipwreck",
            confidence: 97,
            SURE: 95,
            hazardScore: 96,
            hazardTier: "CRITICAL",
            lat: 15.4520,
            lng: 73.7020,
            boundingDimensions: "32.0 × 8.5 m",
            uncertaintyRadius: "± 0.6 m",
            pingId: "PNG-8890",
            timestamp: "2026-09-28 09:05:44",
            verdict: "Confirmed",
            georeferenceStatus: "GPS/INS Georeferenced",
            aiInterpretation: "Intact sunken motorized fishing trawler resting on port hull flank; superstructure, mast, and propeller aperture identifiable.",
            recommendedAction: "Issue Notice to Mariners (NOTMAR) and update hydrographic fairway obstruction overlay.",
            shadowLength: "22.5 m",
            reliefHeight: "6.2 m",
            backscatterP95: "242 DN",
            depth: "26 m",
            vessel: "CRV Sagar Paschimi (Towfish Rig 01)",
            platform: "Towfish",
            programme: "Sea Water Quality Monitoring (SWQM) — NCCR / MoES",
            frequency: "500 kHz High-Res CHIRP",
            altitude: "6.5 m",
            surveySpeed: "3.9 kn",
            heading: "245° (WSW)",
            rawX: 60,
            rawY: 360,
            rawW: 140,
            rawH: 90,
            xM: -22.0,
            yM: 125.0,
            wM: 32.0,
            hM: 8.5
        },
        {
            id: "DET-2026-007",
            missionId: "MSN-SWQM-2026-GOA",
            class: "Cylinder",
            confidence: 82,
            SURE: 80,
            hazardScore: 62,
            hazardTier: "MEDIUM",
            lat: 15.4120,
            lng: 73.6580,
            boundingDimensions: "3.2 × 1.0 m",
            uncertaintyRadius: "± 2.0 m",
            pingId: "PNG-8902",
            timestamp: "2026-09-28 09:18:30",
            verdict: "Pending",
            georeferenceStatus: "GPS/INS Georeferenced",
            aiInterpretation: "Corroded chemical transport drum partially sunken into soft silty seafloor.",
            recommendedAction: "Log coordinates into regional environmental contamination monitoring database.",
            shadowLength: "1.8 m",
            reliefHeight: "0.9 m",
            backscatterP95: "198 DN",
            depth: "41 m",
            vessel: "CRV Sagar Paschimi (Towfish Rig 01)",
            platform: "Towfish",
            programme: "Sea Water Quality Monitoring (SWQM) — NCCR / MoES",
            frequency: "500 kHz High-Res CHIRP",
            altitude: "5.9 m",
            surveySpeed: "4.2 kn",
            heading: "241° (WSW)",
            rawX: 290,
            rawY: 420,
            rawW: 45,
            rawH: 30,
            xM: 18.0,
            yM: 142.0,
            wM: 3.2,
            hM: 1.0
        },

        // ==================== MISSION 2: MSN-PMP-2026-NAG (Poompuhar Archaeological Survey - 4 Detections) ====================
        {
            id: "DET-2026-008",
            missionId: "MSN-PMP-2026-NAG",
            class: "Shipwreck",
            confidence: 95,
            SURE: 93,
            hazardScore: 92,
            hazardTier: "CRITICAL",
            lat: 11.1520,
            lng: 79.8840,
            boundingDimensions: "42.0 × 12.0 m",
            uncertaintyRadius: "± 0.9 m",
            pingId: "PNG-7102",
            timestamp: "2026-09-27 10:14:20",
            verdict: "Confirmed",
            georeferenceStatus: "AUV DVL-INS Georeferenced",
            aiInterpretation: "Submerged ancient wooden hull structure buried under silt with exposed frames, keelson, and stone ballast mounds.",
            recommendedAction: "High-resolution sub-bottom profiler survey and archaeological heritage exclusion zone demarcation.",
            shadowLength: "26.0 m",
            reliefHeight: "5.4 m",
            backscatterP95: "225 DN",
            depth: "28 m",
            vessel: "NIOT Coastal Survey AUV-02",
            platform: "AUV",
            programme: "Poompuhar Archaeological Survey — NIOT / TN Archaeology",
            frequency: "450 kHz Dual-CHIRP",
            altitude: "4.5 m",
            surveySpeed: "2.8 kn",
            heading: "095° (E)",
            rawX: 80,
            rawY: 70,
            rawW: 160,
            rawH: 110,
            xM: -16.0,
            yM: 35.0,
            wM: 42.0,
            hM: 12.0
        },
        {
            id: "DET-2026-009",
            missionId: "MSN-PMP-2026-NAG",
            class: "Cylinder",
            confidence: 89,
            SURE: 88,
            hazardScore: 74,
            hazardTier: "HIGH",
            lat: 11.1460,
            lng: 79.8760,
            boundingDimensions: "6.5 × 1.8 m",
            uncertaintyRadius: "± 1.4 m",
            pingId: "PNG-7115",
            timestamp: "2026-09-27 10:35:10",
            verdict: "Confirmed",
            georeferenceStatus: "AUV DVL-INS Georeferenced",
            aiInterpretation: "Dressed cylindrical granite architectural column lying horizontally on seabed, probable ancient harbour structural relic.",
            recommendedAction: "Notify Tamil Nadu State Archaeology Department for photogrammetric 3D reconstruction pass.",
            shadowLength: "4.2 m",
            reliefHeight: "1.8 m",
            backscatterP95: "235 DN",
            depth: "32 m",
            vessel: "NIOT Coastal Survey AUV-02",
            platform: "AUV",
            programme: "Poompuhar Archaeological Survey — NIOT / TN Archaeology",
            frequency: "450 kHz Dual-CHIRP",
            altitude: "4.2 m",
            surveySpeed: "2.9 kn",
            heading: "095° (E)",
            rawX: 260,
            rawY: 150,
            rawW: 70,
            rawH: 45,
            xM: 14.0,
            yM: 58.0,
            wM: 6.5,
            hM: 1.8
        },
        {
            id: "DET-2026-010",
            missionId: "MSN-PMP-2026-NAG",
            class: "Ghost Net",
            confidence: 92,
            SURE: 90,
            hazardScore: 87,
            hazardTier: "CRITICAL",
            lat: 11.1580,
            lng: 79.8910,
            boundingDimensions: "15.0 × 10.0 m",
            uncertaintyRadius: "± 1.1 m",
            pingId: "PNG-7128",
            timestamp: "2026-09-27 10:52:45",
            verdict: "Pending",
            georeferenceStatus: "AUV DVL-INS Georeferenced",
            aiInterpretation: "Heavy commercial trawl net entangled over ancient stone foundation mound; threatens fragile heritage artifacts.",
            recommendedAction: "Schedule specialized diver disentanglement using ultrasonic shears to prevent stone breakage.",
            shadowLength: "7.8 m",
            reliefHeight: "2.3 m",
            backscatterP95: "192 DN",
            depth: "25 m",
            vessel: "NIOT Coastal Survey AUV-02",
            platform: "AUV",
            programme: "Poompuhar Archaeological Survey — NIOT / TN Archaeology",
            frequency: "450 kHz Dual-CHIRP",
            altitude: "4.6 m",
            surveySpeed: "2.7 kn",
            heading: "098° (E)",
            rawX: 130,
            rawY: 240,
            rawW: 90,
            rawH: 75,
            xM: -8.0,
            yM: 82.0,
            wM: 15.0,
            hM: 10.0
        },
        {
            id: "DET-2026-011",
            missionId: "MSN-PMP-2026-NAG",
            class: "Pipe",
            confidence: 86,
            SURE: 83,
            hazardScore: 69,
            hazardTier: "MEDIUM",
            lat: 11.1410,
            lng: 79.8710,
            boundingDimensions: "9.8 × 1.4 m",
            uncertaintyRadius: "± 1.7 m",
            pingId: "PNG-7140",
            timestamp: "2026-09-27 11:15:30",
            verdict: "Pending",
            georeferenceStatus: "AUV DVL-INS Georeferenced",
            aiInterpretation: "Linear terracotta and stone conduit alignment extending seaward from submerged shoreline contour.",
            recommendedAction: "Trace alignment towards shoreline during next low-tide survey window.",
            shadowLength: "3.1 m",
            reliefHeight: "1.3 m",
            backscatterP95: "210 DN",
            depth: "35 m",
            vessel: "NIOT Coastal Survey AUV-02",
            platform: "AUV",
            programme: "Poompuhar Archaeological Survey — NIOT / TN Archaeology",
            frequency: "450 kHz Dual-CHIRP",
            altitude: "4.4 m",
            surveySpeed: "2.8 kn",
            heading: "096° (E)",
            rawX: 280,
            rawY: 330,
            rawW: 65,
            rawH: 40,
            xM: 19.0,
            yM: 112.0,
            wM: 9.8,
            hM: 1.4
        },

        // ==================== MISSION 3: MSN-NHO-2026-IKK (INS Ikshak Karwar Survey - 4 Detections) ====================
        {
            id: "DET-2026-012",
            missionId: "MSN-NHO-2026-IKK",
            class: "Shipwreck",
            confidence: 98,
            SURE: 96,
            hazardScore: 95,
            hazardTier: "CRITICAL",
            lat: 14.8140,
            lng: 74.0560,
            boundingDimensions: "48.0 × 14.0 m",
            uncertaintyRadius: "± 0.5 m",
            pingId: "PNG-6205",
            timestamp: "2026-09-29 07:45:12",
            verdict: "Confirmed",
            georeferenceStatus: "Hull-Mounted High-Precision DGPS",
            aiInterpretation: "Sunken flat-deck navigation barge sitting upright in naval fairway approach; mast and winches pose severe depth clearance hazard.",
            recommendedAction: "Publish immediate Naval Hydrographic Notice; assign clearance depth at chart lowest astronomical tide.",
            shadowLength: "31.0 m",
            reliefHeight: "7.1 m",
            backscatterP95: "248 DN",
            depth: "42 m",
            vessel: "INS Ikshak (Sandhayak-Class Survey Vessel)",
            platform: "Hull-Mounted",
            programme: "Indian Naval Hydrographic Department (NHO) — INS Ikshak",
            frequency: "500 kHz High-Res",
            altitude: "12.0 m",
            surveySpeed: "5.2 kn",
            heading: "185° (S)",
            rawX: 90,
            rawY: 85,
            rawW: 170,
            rawH: 120,
            xM: -14.0,
            yM: 40.0,
            wM: 48.0,
            hM: 14.0
        },
        {
            id: "DET-2026-013",
            missionId: "MSN-NHO-2026-IKK",
            class: "Cylinder",
            confidence: 88,
            SURE: 85,
            hazardScore: 82,
            hazardTier: "CRITICAL",
            lat: 14.8050,
            lng: 74.0420,
            boundingDimensions: "3.5 × 0.8 m",
            uncertaintyRadius: "± 1.0 m",
            pingId: "PNG-6218",
            timestamp: "2026-09-29 08:12:33",
            verdict: "Confirmed",
            georeferenceStatus: "Hull-Mounted High-Precision DGPS",
            aiInterpretation: "High-density steel cylindrical canister matching legacy underwater ordnance/torpedo casing profile.",
            recommendedAction: "Forward sonar telemetry to Naval Explosive Ordnance Disposal (EOD) unit for clearance protocol.",
            shadowLength: "2.6 m",
            reliefHeight: "0.8 m",
            backscatterP95: "240 DN",
            depth: "45 m",
            vessel: "INS Ikshak (Sandhayak-Class Survey Vessel)",
            platform: "Hull-Mounted",
            programme: "Indian Naval Hydrographic Department (NHO) — INS Ikshak",
            frequency: "500 kHz High-Res",
            altitude: "11.8 m",
            surveySpeed: "5.1 kn",
            heading: "185° (S)",
            rawX: 250,
            rawY: 170,
            rawW: 55,
            rawH: 35,
            xM: 12.0,
            yM: 64.0,
            wM: 3.5,
            hM: 0.8
        },
        {
            id: "DET-2026-014",
            missionId: "MSN-NHO-2026-IKK",
            class: "Pipe",
            confidence: 93,
            SURE: 91,
            hazardScore: 79,
            hazardTier: "HIGH",
            lat: 14.8210,
            lng: 74.0620,
            boundingDimensions: "22.0 × 1.6 m",
            uncertaintyRadius: "± 1.2 m",
            pingId: "PNG-6230",
            timestamp: "2026-09-29 08:34:50",
            verdict: "Pending",
            georeferenceStatus: "Hull-Mounted High-Precision DGPS",
            aiInterpretation: "Subsea heavy-duty fuel bunkering transfer pipeline crossing naval vessel turning basin.",
            recommendedAction: "Verify cathodic protection and burial depth status against naval port facility blueprint.",
            shadowLength: "4.8 m",
            reliefHeight: "1.5 m",
            backscatterP95: "228 DN",
            depth: "38 m",
            vessel: "INS Ikshak (Sandhayak-Class Survey Vessel)",
            platform: "Hull-Mounted",
            programme: "Indian Naval Hydrographic Department (NHO) — INS Ikshak",
            frequency: "500 kHz High-Res",
            altitude: "12.2 m",
            surveySpeed: "5.3 kn",
            heading: "184° (S)",
            rawX: 110,
            rawY: 260,
            rawW: 110,
            rawH: 50,
            xM: -18.0,
            yM: 92.0,
            wM: 22.0,
            hM: 1.6
        },
        {
            id: "DET-2026-015",
            missionId: "MSN-NHO-2026-IKK",
            class: "Ghost Net",
            confidence: 90,
            SURE: 87,
            hazardScore: 86,
            hazardTier: "CRITICAL",
            lat: 14.7990,
            lng: 74.0350,
            boundingDimensions: "16.5 × 12.0 m",
            uncertaintyRadius: "± 1.6 m",
            pingId: "PNG-6244",
            timestamp: "2026-09-29 08:58:20",
            verdict: "Pending",
            georeferenceStatus: "Hull-Mounted High-Precision DGPS",
            aiInterpretation: "Submerged synthetic trawl net wrapped around pinnacle rock; severe snag hazard for naval sonar tows.",
            recommendedAction: "Add cautionary note to ECDIS vector electronic navigation chart ENC IN2002.",
            shadowLength: "8.9 m",
            reliefHeight: "2.4 m",
            backscatterP95: "195 DN",
            depth: "49 m",
            vessel: "INS Ikshak (Sandhayak-Class Survey Vessel)",
            platform: "Hull-Mounted",
            programme: "Indian Naval Hydrographic Department (NHO) — INS Ikshak",
            frequency: "500 kHz High-Res",
            altitude: "12.0 m",
            surveySpeed: "5.0 kn",
            heading: "185° (S)",
            rawX: 270,
            rawY: 350,
            rawW: 90,
            rawH: 75,
            xM: 15.0,
            yM: 120.0,
            wM: 16.5,
            hM: 12.0
        },

        // ==================== MISSION 4: MSN-NMLAP-2026-CHN (Chennai NMLAP ASV Survey - 4 Detections) ====================
        {
            id: "DET-2026-016",
            missionId: "MSN-NMLAP-2026-CHN",
            class: "Ghost Net",
            confidence: 97,
            SURE: 95,
            hazardScore: 96,
            hazardTier: "CRITICAL",
            lat: 13.1840,
            lng: 80.4560,
            boundingDimensions: "26.0 × 18.0 m",
            uncertaintyRadius: "± 0.7 m",
            pingId: "PNG-5401",
            timestamp: "2026-09-26 14:10:05",
            verdict: "Confirmed",
            georeferenceStatus: "ASV RTK-GNSS Georeferenced",
            aiInterpretation: "Massive plastic ghost gear net aggregation draped over coral patch; active fish and turtle mortality threat.",
            recommendedAction: "Dispatch National Marine Litter Action Plan marine retrieval catamaran with crane hoist.",
            shadowLength: "12.0 m",
            reliefHeight: "3.2 m",
            backscatterP95: "190 DN",
            depth: "24 m",
            vessel: "Autonomous Surface Craft ASV-Samudra",
            platform: "ASV",
            programme: "National Marine Litter Action Plan (NMLAP) — NCCR",
            frequency: "600 kHz Ultra-Res",
            altitude: "3.8 m",
            surveySpeed: "3.4 kn",
            heading: "020° (NNE)",
            rawX: 75,
            rawY: 60,
            rawW: 130,
            rawH: 95,
            xM: -15.0,
            yM: 30.0,
            wM: 26.0,
            hM: 18.0
        },
        {
            id: "DET-2026-017",
            missionId: "MSN-NMLAP-2026-CHN",
            class: "Cylinder",
            confidence: 94,
            SURE: 92,
            hazardScore: 89,
            hazardTier: "CRITICAL",
            lat: 13.1760,
            lng: 80.4420,
            boundingDimensions: "12.2 × 2.4 m",
            uncertaintyRadius: "± 0.9 m",
            pingId: "PNG-5415",
            timestamp: "2026-09-26 14:32:18",
            verdict: "Confirmed",
            georeferenceStatus: "ASV RTK-GNSS Georeferenced",
            aiInterpretation: "Submerged 40ft standard intermodal steel shipping container resting askew in Chennai Port approach fairway.",
            recommendedAction: "Alert Chennai Port Trust VTS (Vessel Traffic Service) to enforce 500m ship exclusion buffer.",
            shadowLength: "8.4 m",
            reliefHeight: "2.6 m",
            backscatterP95: "245 DN",
            depth: "27 m",
            vessel: "Autonomous Surface Craft ASV-Samudra",
            platform: "ASV",
            programme: "National Marine Litter Action Plan (NMLAP) — NCCR",
            frequency: "600 kHz Ultra-Res",
            altitude: "3.9 m",
            surveySpeed: "3.5 kn",
            heading: "020° (NNE)",
            rawX: 240,
            rawY: 150,
            rawW: 85,
            rawH: 55,
            xM: 16.0,
            yM: 55.0,
            wM: 12.2,
            hM: 2.4
        },
        {
            id: "DET-2026-018",
            missionId: "MSN-NMLAP-2026-CHN",
            class: "Pipe",
            confidence: 89,
            SURE: 86,
            hazardScore: 76,
            hazardTier: "HIGH",
            lat: 13.1910,
            lng: 80.4630,
            boundingDimensions: "14.5 × 1.5 m",
            uncertaintyRadius: "± 1.3 m",
            pingId: "PNG-5428",
            timestamp: "2026-09-26 14:55:40",
            verdict: "Pending",
            georeferenceStatus: "ASV RTK-GNSS Georeferenced",
            aiInterpretation: "Flanged steel dredge discharge pipe section discarded following harbor channel dredging operations.",
            recommendedAction: "Contractor notification for salvage removal under port environmental compliance covenant.",
            shadowLength: "3.9 m",
            reliefHeight: "1.4 m",
            backscatterP95: "220 DN",
            depth: "21 m",
            vessel: "Autonomous Surface Craft ASV-Samudra",
            platform: "ASV",
            programme: "National Marine Litter Action Plan (NMLAP) — NCCR",
            frequency: "600 kHz Ultra-Res",
            altitude: "3.7 m",
            surveySpeed: "3.6 kn",
            heading: "022° (NNE)",
            rawX: 110,
            rawY: 250,
            rawW: 95,
            rawH: 45,
            xM: -12.0,
            yM: 85.0,
            wM: 14.5,
            hM: 1.5
        },
        {
            id: "DET-2026-019",
            missionId: "MSN-NMLAP-2026-CHN",
            class: "Cylinder",
            confidence: 84,
            SURE: 81,
            hazardScore: 64,
            hazardTier: "MEDIUM",
            lat: 13.1710,
            lng: 80.4350,
            boundingDimensions: "5.0 × 1.8 m",
            uncertaintyRadius: "± 1.8 m",
            pingId: "PNG-5440",
            timestamp: "2026-09-26 15:20:12",
            verdict: "Pending",
            georeferenceStatus: "ASV RTK-GNSS Georeferenced",
            aiInterpretation: "Submerged cylindrical mooring counterweight buoy encrusted with biofouling and attached chain link.",
            recommendedAction: "Verify with port navigational aids log if buoy was reported missing during cyclone season.",
            shadowLength: "2.8 m",
            reliefHeight: "1.6 m",
            backscatterP95: "215 DN",
            depth: "30 m",
            vessel: "Autonomous Surface Craft ASV-Samudra",
            platform: "ASV",
            programme: "National Marine Litter Action Plan (NMLAP) — NCCR",
            frequency: "600 kHz Ultra-Res",
            altitude: "4.0 m",
            surveySpeed: "3.3 kn",
            heading: "019° (NNE)",
            rawX: 270,
            rawY: 340,
            rawW: 60,
            rawH: 40,
            xM: 18.0,
            yM: 115.0,
            wM: 5.0,
            hM: 1.8
        },

        // ==================== MISSION 5: MSN-SSSS-2026-MUM (Mumbai Shelf SSSS Survey - 3 Detections) ====================
        {
            id: "DET-2026-020",
            missionId: "MSN-SSSS-2026-MUM",
            class: "Shipwreck",
            confidence: 98,
            SURE: 96,
            hazardScore: 97,
            hazardTier: "CRITICAL",
            lat: 18.9250,
            lng: 72.7860,
            boundingDimensions: "54.0 × 16.0 m",
            uncertaintyRadius: "± 0.4 m",
            pingId: "PNG-4310",
            timestamp: "2026-09-30 06:22:15",
            verdict: "Confirmed",
            georeferenceStatus: "Towfish DGPS Georeferenced",
            aiInterpretation: "Offshore platform support vessel wreck resting on starboard bilge; major hydrographic shipping hazard in Mumbai High transit corridor.",
            recommendedAction: "Establish immediate wreck marker buoy; broadcast navigational danger warning on VHF Ch 16.",
            shadowLength: "38.0 m",
            reliefHeight: "8.4 m",
            backscatterP95: "250 DN",
            depth: "48 m",
            vessel: "CRV Sagar Tara (Towfish Rig 02)",
            platform: "Towfish",
            programme: "Swachh Sagar, Surakshit Sagar — MoES / NCCR",
            frequency: "500 kHz High-Res",
            altitude: "7.0 m",
            surveySpeed: "4.0 kn",
            heading: "330° (NNW)",
            rawX: 65,
            rawY: 80,
            rawW: 180,
            rawH: 130,
            xM: -20.0,
            yM: 45.0,
            wM: 54.0,
            hM: 16.0
        },
        {
            id: "DET-2026-021",
            missionId: "MSN-SSSS-2026-MUM",
            class: "Pipe",
            confidence: 92,
            SURE: 90,
            hazardScore: 81,
            hazardTier: "HIGH",
            lat: 18.9160,
            lng: 72.7720,
            boundingDimensions: "35.0 × 1.8 m",
            uncertaintyRadius: "± 1.1 m",
            pingId: "PNG-4322",
            timestamp: "2026-09-30 06:48:30",
            verdict: "Confirmed",
            georeferenceStatus: "Towfish DGPS Georeferenced",
            aiInterpretation: "Decommissioned high-diameter crude oil transfer flowline unanchored and shifting on dynamic seafloor sediment.",
            recommendedAction: "Submit bathymetric position update to ONGC offshore asset integrity team for stabilization clamping.",
            shadowLength: "5.2 m",
            reliefHeight: "1.7 m",
            backscatterP95: "232 DN",
            depth: "52 m",
            vessel: "CRV Sagar Tara (Towfish Rig 02)",
            platform: "Towfish",
            programme: "Swachh Sagar, Surakshit Sagar — MoES / NCCR",
            frequency: "500 kHz High-Res",
            altitude: "6.8 m",
            surveySpeed: "4.1 kn",
            heading: "330° (NNW)",
            rawX: 250,
            rawY: 190,
            rawW: 100,
            rawH: 45,
            xM: 15.0,
            yM: 78.0,
            wM: 35.0,
            hM: 1.8
        },
        {
            id: "DET-2026-022",
            missionId: "MSN-SSSS-2026-MUM",
            class: "Ghost Net",
            confidence: 91,
            SURE: 89,
            hazardScore: 88,
            hazardTier: "CRITICAL",
            lat: 18.9310,
            lng: 72.7930,
            boundingDimensions: "21.0 × 14.0 m",
            uncertaintyRadius: "± 1.4 m",
            pingId: "PNG-4335",
            timestamp: "2026-09-30 07:15:05",
            verdict: "Pending",
            georeferenceStatus: "Towfish DGPS Georeferenced",
            aiInterpretation: "Industrial trawler codend and heavy polyethylene netting snagged around legacy subsea wellhead structure.",
            recommendedAction: "Queue for diver clearance or salvage vessel hook-and-tow under Swachh Sagar Mission.",
            shadowLength: "10.5 m",
            reliefHeight: "2.8 m",
            backscatterP95: "194 DN",
            depth: "44 m",
            vessel: "CRV Sagar Tara (Towfish Rig 02)",
            platform: "Towfish",
            programme: "Swachh Sagar, Surakshit Sagar — MoES / NCCR",
            frequency: "500 kHz High-Res",
            altitude: "6.9 m",
            surveySpeed: "3.9 kn",
            heading: "332° (NNW)",
            rawX: 120,
            rawY: 280,
            rawW: 105,
            rawH: 80,
            xM: -10.0,
            yM: 105.0,
            wM: 21.0,
            hM: 14.0
        }
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

    getFilteredDetections: function(missionScopeOverride) {
        const { minConfidence, selectedClasses, hideNatural } = this.filterState;
        const isGlobalRole = ["admin", "engineer", "viewer"].includes(this.currentRole);
        return this.mockDetections.filter(d => {
            if (missionScopeOverride !== undefined) {
                if (missionScopeOverride !== 'all' && d.missionId && d.missionId !== missionScopeOverride) return false;
            } else if (!isGlobalRole && d.missionId && d.missionId !== this.activeMissionId) {
                return false;
            }
            if (d.confidence < minConfidence) return false;
            if (hideNatural && d.class === "Natural (Filtered)") return false;
            if (selectedClasses && selectedClasses.length > 0) {
                const match = selectedClasses.some(c => 
                    d.class.toLowerCase().includes(c.toLowerCase()) || 
                    c.toLowerCase().includes(d.class.toLowerCase())
                );
                if (!match) return false;
            }
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
            totalDetections: 0,
            status: "Active",
            date: new Date().toISOString().slice(0, 10),
            location: profile.location || "Coastal Shelf Sector",
            lat: lat,
            lng: lng
        };

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

    _resolveExportData: function(customData) {
        if (customData && Array.isArray(customData) && customData.length > 0) {
            return customData;
        }
        if (window.activeScanDetections && Array.isArray(window.activeScanDetections) && window.activeScanDetections.length > 0) {
            return window.activeScanDetections;
        }
        const scoped = (this.mockDetections || []).filter(d => !d.missionId || d.missionId === this.activeMissionId);
        if (scoped && scoped.length > 0) {
            return scoped;
        }
        return this.getFilteredDetections(this.activeMissionId);
    },

    exportJSON: function(customData) {
        const data = this._resolveExportData(customData);
        const targetMissionId = (data && data.length > 0 && data[0].missionId) ? data[0].missionId : this.activeMissionId;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `JalVedh_Hazard_Report_${targetMissionId}_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        this.logAudit(`EXPORT: Downloaded JSON Evidence Report for ${targetMissionId}`);
        if (window.showToast) window.showToast(`Hazard Report for ${targetMissionId} (${data.length} target${data.length === 1 ? '' : 's'}) exported as JSON`, "success");
    },

    exportGeoJSON: function(customData) {
        const data = this._resolveExportData(customData);
        const targetMissionId = (data && data.length > 0 && data[0].missionId) ? data[0].missionId : this.activeMissionId;
        const mission = this.mockMissions.find(m => m.id === targetMissionId) || this.mockMissions[0];
        const featureCollection = {
            type: "FeatureCollection",
            name: `JalVedh Hazard Map - ${targetMissionId}`,
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
                    missionId: d.missionId || targetMissionId,
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
        downloadAnchor.setAttribute("download", `JalVedh_Hazard_Map_${targetMissionId}_${new Date().toISOString().slice(0,10)}.geojson`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        this.logAudit(`EXPORT: Downloaded GeoJSON Hazard Map for ${targetMissionId}`);
        if (window.showToast) window.showToast(`Hazard map for ${targetMissionId} (${data.length} target${data.length === 1 ? '' : 's'}) exported as GeoJSON`, "success");
    },

    exportCSV: function(customData) {
        const data = this._resolveExportData(customData);
        const targetMissionId = (data && data.length > 0 && data[0].missionId) ? data[0].missionId : this.activeMissionId;
        let csvContent = "data:text/csv;charset=utf-8,ID,Mission,Class,AIConfidence(%),MARLINSUREReliability(%),HazardSeverityScore(0-100),HazardTier,Latitude,Longitude,Dimensions,PositionUncertainty,Verdict,GeoreferenceStatus,Timestamp\n";
        data.forEach(d => {
            csvContent += `${d.id},${d.missionId || targetMissionId},"${d.class}",${d.confidence},${d.SURE},${d.hazardScore},${d.hazardTier},${d.lat},${d.lng},"${d.boundingDimensions}","${d.uncertaintyRadius}",${d.verdict},"${d.georeferenceStatus || 'GPS/INS Georeferenced'}",${d.timestamp}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", encodedUri);
        downloadAnchor.setAttribute("download", `JalVedh_Hazard_Report_${targetMissionId}_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        this.logAudit(`EXPORT: Downloaded CSV Hazard Report for ${targetMissionId}`);
        if (window.showToast) window.showToast(`Hazard Report for ${targetMissionId} (${data.length} target${data.length === 1 ? '' : 's'}) exported as CSV`, "success");
    },

    exportNMEA: function(customData) {
        const data = this._resolveExportData(customData);
        const targetMissionId = (data && data.length > 0 && data[0].missionId) ? data[0].missionId : this.activeMissionId;
        let nmeaContent = "data:text/plain;charset=utf-8,$JALVEDH_WAYPOINTS\n";
        data.forEach(d => {
            const timeStr = d.timestamp ? d.timestamp.slice(11,19).replace(/:/g,'') : '120000';
            nmeaContent += `$GPGGA,${timeStr},${d.lat}N,${d.lng}E,1,08,0.9,${d.class},M,,M,,\n`;
        });
        const encodedUri = encodeURI(nmeaContent);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", encodedUri);
        downloadAnchor.setAttribute("download", `JalVedh_NMEA_Waypoints_${targetMissionId}_${new Date().toISOString().slice(0,10)}.txt`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        if (window.showToast) window.showToast(`NMEA Waypoints for ${targetMissionId} (${data.length} waypoint${data.length === 1 ? '' : 's'}) exported for ECDIS`, "success");
    },

    exportKML: function(customData) {
        const data = this._resolveExportData(customData);
        const targetMissionId = (data && data.length > 0 && data[0].missionId) ? data[0].missionId : this.activeMissionId;
        let kmlContent = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>JalVedh Hazard Dive Plan - ${targetMissionId}</name>`;
        data.forEach(d => {
            kmlContent += `<Placemark><name>${d.id} - ${d.class} (Hazard Risk: ${d.hazardScore}/100)</name><description>${d.aiInterpretation || d.class} Field Action: ${d.recommendedAction || 'Inspect'}</description><Point><coordinates>${d.lng},${d.lat},0</coordinates></Point></Placemark>`;
        });
        kmlContent += `</Document></kml>`;
        const dataStr = "data:text/xml;charset=utf-8," + encodeURIComponent(kmlContent);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `JalVedh_KML_DivePlan_${targetMissionId}_${new Date().toISOString().slice(0,10)}.kml`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        if (window.showToast) window.showToast(`Google Earth KML Dive Plan for ${targetMissionId} (${data.length} target${data.length === 1 ? '' : 's'}) exported`, "success");
    },

    exportPrintablePDF: function(customData) {
        const data = this._resolveExportData(customData);
        const targetMissionId = (data && data.length > 0 && data[0].missionId) ? data[0].missionId : this.activeMissionId;
        const activeMission = this.mockMissions.find(m => m.id === targetMissionId) || this.mockMissions[0];
        const printWin = window.open('', '_blank');
        
        let canvasDataUrl = '';
        try {
            const canvas = document.getElementById('sonar-waterfall-canvas');
            if (canvas) {
                canvasDataUrl = canvas.toDataURL('image/png');
            }
        } catch (e) {
            console.error("Could not grab canvas image for report:", e);
        }

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>JalVedh AI - Executive Hazard Intelligence Report (${activeMission.id})</title>
            <style>
                @page { size: A4 portrait; margin: 0; }
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20mm 20mm; color: #0b2545; line-height: 1.5; }
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
                Automated side-scan sonar ping analysis for <strong>${activeMission.name} (${activeMission.id})</strong> identified ${data.length} localized benthic anomaly target${data.length === 1 ? '' : 's'}. Dual-frequency acoustic normalization (SONAR-DAPT) combined with SHARP shadow geometry modeling confirmed synthetic hazard features with reliable confidence metrics.
            </div>

            ${canvasDataUrl ? '<div style="margin-bottom:24px;text-align:center;"><h3 style="text-align:left;color:#0b2545;font-size:1.1rem;margin-bottom:10px;">Analyzed Sonar Image Snapshot</h3><img src="' + canvasDataUrl + '" style="max-width:100%;max-height:350px;border:2px solid #12b4c4;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.1);" /></div>' : ''}

            <h3 style="color:#0b2545;font-size:1.1rem;margin-bottom:10px;">Mission Target Manifest & Risk Telemetry Table (${data.length} Target${data.length === 1 ? '' : 's'})</h3>
            <table>
                <thead>
                    <tr>
                        <th>Target ID</th>
                        <th>Class</th>
                        <th>AI Confidence (%)</th>
                        <th>MARLIN SURE (%)</th>
                        <th>Hazard Severity Score</th>
                        <th>Geographic Coordinates</th>
                        <th>Acoustic Relief</th>
                        <th>Position Uncertainty</th>
                        <th>Verdict</th>
                    </tr>
                </thead>
                <tbody>`;
        data.forEach(d => {
            const critStyle = (d.hazardScore || 80) >= 85 ? 'class="badge-crit"' : 'class="badge-high"';
            const shadowStatus = (d.estimatedRelief || "Detected");
            html += `
                <tr>
                    <td><strong>${d.id}</strong></td>
                    <td>${d.class}</td>
                    <td>${d.confidence}%</td>
                    <td>${d.SURE || d.confidence}%</td>
                    <td ${critStyle}>${d.hazardScore || 80}/100 (${d.hazardTier || 'HIGH'})</td>
                    <td>${d.lat}° N, ${d.lng}° E</td>
                    <td>${shadowStatus}</td>
                    <td>${d.uncertaintyRadius || '± 0.4 m'}</td>
                    <td><strong>${d.verdict || 'Pending'}</strong></td>
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
        setTimeout(() => printWin.print(), 800); // Slight delay for image to load
        if (window.showToast) window.showToast(`Publication-Ready PDF Report generated for ${targetMissionId}`, "success");
    },

    exportEvidenceBundle: function(id, customData) {
        let data = customData;
        if (!data || !Array.isArray(data) || data.length === 0) {
            if (id) {
                const single = this.mockDetections.find(d => d.id === id);
                if (single) data = [single];
            } else {
                data = this._resolveExportData();
            }
        }
        const targetMissionId = (data && data.length > 0 && data[0].missionId) ? data[0].missionId : this.activeMissionId;
        const activeMission = this.mockMissions.find(m => m.id === targetMissionId) || this.mockMissions[0];
        const missionId = id ? `${targetMissionId}_${id}` : targetMissionId;

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
