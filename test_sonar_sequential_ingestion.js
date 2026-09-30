const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log('🚀 Starting Sonar Sequential Ingestion & Verification Test...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    page.on('console', msg => {
        if (msg.type() === 'error') console.log(`[Browser ERROR] ${msg.text()}`);
    });

    await page.goto('http://localhost:8000/app.html', { waitUntil: 'networkidle' });
    console.log('✅ Dashboard app.html loaded.');

    // Navigate to Sonar Workspace
    await page.click('#tab-btn-sonar-ingestion');
    await page.waitForTimeout(600);

    // 1. Verify Initial Awaiting State
    const awaitingStatus = await page.evaluate(() => {
        const pipelineStatusBox = document.getElementById('pipeline-status-box');
        const railList = document.getElementById('rail-detections-list');
        const isPipelineHidden = !pipelineStatusBox || pipelineStatusBox.style.display === 'none';
        const isRailAwaiting = railList && railList.innerText.includes('Awaiting Sonar Ingestion');
        return {
            isPipelineHidden,
            isRailAwaiting,
            railText: railList ? railList.innerText.trim() : ''
        };
    });

    console.log('1. Initial Workspace State:', awaitingStatus);
    if (!awaitingStatus.isPipelineHidden) {
        throw new Error('Pipeline status box should be hidden initially!');
    } else {
        console.log('✅ Pipeline status box is hidden initially.');
    }

    if (!awaitingStatus.isRailAwaiting) {
        throw new Error('Rail list should show awaiting message!');
    } else {
        console.log('✅ Rail list shows awaiting ingestion message.');
    }

    // Capture initial awaiting state screenshot
    await page.screenshot({ path: 'C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8/verified_sonar_initial_awaiting_state.png' });
    console.log('📸 Captured verified_sonar_initial_awaiting_state.png');

    // 2. Trigger Ingestion via Curated Sample
    console.log('2. Triggering curated sample ingestion (Goa Coastal Shelf Log)...');
    await page.locator('button:has-text("Goa Coastal Shelf Log")').click();

    // Wait a brief moment to catch the pipeline in progress
    await page.waitForTimeout(300);
    const pipelineDuring = await page.evaluate(() => {
        const pipelineStatusBox = document.getElementById('pipeline-status-box');
        const progressFill = document.getElementById('pipeline-bar');
        const stepName = document.getElementById('pipeline-step-name');
        return {
            display: pipelineStatusBox ? pipelineStatusBox.style.display : 'none',
            progressWidth: progressFill ? progressFill.style.width : '0%',
            stepText: stepName ? stepName.innerText : ''
        };
    });
    console.log('Pipeline active state check:', pipelineDuring);

    // Wait for the pipeline to finish (1.2s total duration + buffer)
    await page.waitForTimeout(2000);

    // 3. Verify Post-Ingestion State
    const postIngestion = await page.evaluate(() => {
        const pipelineStatusBox = document.getElementById('pipeline-status-box');
        const railCards = document.querySelectorAll('#rail-detections-list .sonar-det-card');
        return {
            pipelineDisplay: pipelineStatusBox ? pipelineStatusBox.style.display : '',
            railCardCount: railCards.length
        };
    });
    console.log('3. Post-Ingestion State:', postIngestion);
    if (postIngestion.pipelineDisplay === 'none' && postIngestion.railCardCount > 0) {
        console.log(`✅ Pipeline completed and hid itself. Detections loaded: ${postIngestion.railCardCount} cards.`);
    } else {
        throw new Error('Ingestion post-state invalid: ' + JSON.stringify(postIngestion));
    }

    await page.screenshot({ path: 'C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8/verified_sonar_ingested_detections_state.png' });
    console.log('📸 Captured verified_sonar_ingested_detections_state.png');

    // 4. Test Clear Log Reset
    console.log('4. Testing Clear Log...');
    await page.click('button:has-text("Clear Log")');
    await page.waitForTimeout(400);

    const clearedState = await page.evaluate(() => {
        const railList = document.getElementById('rail-detections-list');
        return {
            isRailAwaiting: railList && railList.innerText.includes('Awaiting Sonar Ingestion')
        };
    });
    console.log('Clear Log State:', clearedState);
    if (clearedState.isRailAwaiting) {
        console.log('✅ Clear Log successfully reset state back to Awaiting Ingestion.');
    } else {
        throw new Error('Clear Log failed to reset state.');
    }

    // 5. Test Real Image File Upload Ingestion
    console.log('5. Testing Real Image Upload...');
    const testImgDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVGCoAABbIAgGvYmUAAAAAAElFTkSuQmCC';
    
    await page.evaluate(async (dataUrl) => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], "sonar_field_sample_01.png", { type: "image/png" });
        window.handleRealSonarFileUpload(file);
    }, testImgDataUrl);

    // simulateFileUpload takes 2400ms
    await page.waitForTimeout(3000);

    const imageIngestionState = await page.evaluate(() => {
        const railCards = document.querySelectorAll('#rail-detections-list .sonar-det-card');
        const filenameDisplay = document.getElementById('loaded-filename');
        return {
            railCardCount: railCards.length,
            filenameText: filenameDisplay ? filenameDisplay.innerText : ''
        };
    });
    console.log('Real Image Ingestion State:', imageIngestionState);
    if (imageIngestionState.railCardCount > 0 && imageIngestionState.filenameText.includes('sonar_field_sample_01.png')) {
        console.log('✅ Real Image Upload processed through pipeline and rendered detections properly.');
    } else {
        throw new Error('Real Image Upload failed: ' + JSON.stringify(imageIngestionState));
    }

    await page.screenshot({ path: 'C:/Users/aditi/.gemini/antigravity/brain/d071ea8f-892b-4c67-a6ab-cb8f9bc7f9e8/verified_sonar_image_upload_state.png' });
    console.log('📸 Captured verified_sonar_image_upload_state.png');

    await browser.close();
    console.log('🎉 All Sonar Sequential Ingestion Tests Finished Successfully!');
})();
