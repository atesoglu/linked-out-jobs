document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleHide');

    // 1. Get current state from storage
    chrome.storage.local.get(['hidingEnabled'], (result) => {
        // Default to true if not set
        const isEnabled = result.hidingEnabled !== undefined ? result.hidingEnabled : true;
        toggle.checked = isEnabled;
    });

    // 2. Listen for changes
    toggle.addEventListener('change', () => {
        const newValue = toggle.checked;

        // Save to storage
        chrome.storage.local.set({ hidingEnabled: newValue });

        // Send message to active tab to trigger immediate change
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: "toggleHiding", 
                    value: newValue 
                });
            }
        });
    });
});