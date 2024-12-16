document.getElementById('scrapeTweets').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length > 0) {
            // Optional: Check if the content script is already injected
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                files: ['content.js']
            }, () => {
                // After ensuring the script is injected, send the message
                if (!chrome.runtime.lastError) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "startScraping" }, function(response) {
                        if (chrome.runtime.lastError) {
                            console.error("Error sending message:", chrome.runtime.lastError.message);
                        } else {
                            console.log("Response received:", response);
                        }
                    });
                } else {
                    console.error('Script injection failed:', chrome.runtime.lastError.message);
                }
            });
        } else {
            console.error("No active tab found");
        }
    });
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "updateStatus") {
        document.getElementById('status').textContent = message.status;
    }
});