// Configuration
const TARGET_CLASS = ".job-card-container__footer-item.job-card-container__footer-job-state";
// We look for the closest parent container that represents the whole card
const CARD_SELECTOR = ".job-card-container";

let isHidingEnabled = true;

// 1. Initialize: Load settings from storage
chrome.storage.local.get(['hidingEnabled'], (result) => {
    // Default to true if undefined
    isHidingEnabled = result.hidingEnabled !== undefined ? result.hidingEnabled : true;

    if (isHidingEnabled) {
        hideViewedJobs();
    }
});

// 2. The Main Logic
function hideViewedJobs() {
    if (!isHidingEnabled) {
        return;
    }

    // Find all elements matching the "Viewed" text class
    const footerItems = document.querySelectorAll(TARGET_CLASS);

    footerItems.forEach((item) => {
        // Check strict text match (trimming whitespace)
        if (item.innerText.trim() === "Viewed" || item.innerText.trim() === "Applied") {
            // Traverse up to find the main job card container
            const jobCard = item.closest(CARD_SELECTOR);

            if (jobCard) {
                // Apply hiding style
                jobCard.style.visibility = "hidden";
            }
        }
    });
}

// 3. Logic to show jobs again (if user toggles off)
function showAllJobs() {
    const footerItems = document.querySelectorAll(TARGET_CLASS);
    footerItems.forEach((item) => {
        const jobCard = item.closest(CARD_SELECTOR);
        if (jobCard) {
            jobCard.style.visibility = "visible";
        }
    });
}

// 4. MutationObserver for Dynamic Content (Infinite Scroll)
const observer = new MutationObserver((mutations) => {
    if (!isHidingEnabled) {
        return;
    }

    const hasAddedNodes = mutations.some(m => m.addedNodes.length > 0);
    if (hasAddedNodes) {
        hideViewedJobs();
    }
});

// Start observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });

// 5. Listen for messages from the popup (Toggle switch)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleHiding") {
        isHidingEnabled = request.value;
        if (isHidingEnabled) {
            hideViewedJobs();
        } else {
            showAllJobs();
        }
    }
});