// 1. Initialize Default State on Install
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({hidingEnabled: true});
    updateIconState(true);
});

// 2. Listen for the extension icon click
chrome.action.onClicked.addListener(async (tab) => {
    // Get current state
    const result = await chrome.storage.local.get(['hidingEnabled']);
    const isEnabled = result.hidingEnabled !== undefined ? result.hidingEnabled : true;
    const newState = !isEnabled;

    // Save new state
    await chrome.storage.local.set({hidingEnabled: newState});

    // Update the visual (Icon Badge)
    updateIconState(newState);

    // Send message to the current tab to apply changes immediately
    if (tab.id && tab.url.includes("linkedin.com")) {
        chrome.tabs.sendMessage(tab.id, {
            action: "toggleHiding",
            value: newState
        }).catch(() => {
            // Ignore errors if the user clicks the button on a non-LinkedIn page
        });
    }
});

// Helper: Updates the badge text and color
function updateIconState(isEnabled) {
    if (isEnabled) {
        chrome.action.setBadgeText({text: "ON"});
        chrome.action.setBadgeBackgroundColor({color: "#0a66c2"}); // LinkedIn Blue
        // Optional: If you have a specific icon for ON, use:
        // chrome.action.setIcon({ path: "icons/icon48.png" });
    } else {
        chrome.action.setBadgeText({text: "OFF"});
        chrome.action.setBadgeBackgroundColor({color: "#555555"}); // Grey
        // Optional: If you have a specific icon for OFF, use:
        // chrome.action.setIcon({ path: "icons/icon_off.png" });
    }
}