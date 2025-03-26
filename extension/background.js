/**
 * YouTube Video Tracker - Background Script
 * 
 * This script runs in the background and monitors tab updates.
 * It helps detect YouTube video page loads and coordinates with the content script.
 */

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // If the tab has completed loading and the URL is a YouTube video URL
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com/watch')) {
        console.log('🎬 YouTube video page detected in tab:', tabId);
        
        // Send a message to the content script to check for videos
        chrome.tabs.sendMessage(tabId, { action: "checkForVideo" }, (response) => {
            // Log any errors with messaging (might happen if content script isn't loaded yet)
            if (chrome.runtime.lastError) {
                console.log('⚠️ Error sending message to content script:', chrome.runtime.lastError);
                // The content script might not be ready yet, try again after a short delay
                setTimeout(() => {
                    chrome.tabs.sendMessage(tabId, { action: "checkForVideo" });
                }, 1000);
            } else if (response) {
                console.log('✅ Content script response:', response);
            }
        });
    }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Message received in background script:', message);
    
    // Handle video data sent from content script
    if (message.action === "sendToServer") {
        console.log('🔄 Received data from content script about video:', message);
        
        // Store the video in extension storage for tracking count
        storeTrackedVideo(message);
    }
});

// Store tracked video in extension storage
function storeTrackedVideo(videoData) {
    chrome.storage.local.get(['trackedVideos'], function(result) {
        let videos = result.trackedVideos || [];
        
        // Check if this video is already tracked (avoid duplicates)
        const exists = videos.some(video => video.videoId === videoData.videoId);
        
        if (!exists) {
            // Add this video to our tracked list
            videos.push({
                videoId: videoData.videoId,
                title: videoData.title || 'Unknown',
                url: videoData.url,
                timestamp: new Date().toISOString()
            });
            
            // Store the updated list
            chrome.storage.local.set({ trackedVideos: videos }, function() {
                console.log('✅ Updated tracked videos count:', videos.length);
            });
        }
    });
}