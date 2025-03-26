/**
 * YouTube Video Tracker - Content Script
 * 
 * This script runs on YouTube pages and detects when a video is being watched.
 * It extracts the video URL and sends it to a local server.
 */

// Keep track of the last processed video ID to avoid duplicate submissions
let lastProcessedVideoId = null;

// Function to extract video details from the page
function getVideoDetails() {
    const videoId = new URLSearchParams(window.location.search).get('v');
    
    // If no video ID or already processed this video, exit
    if (!videoId || videoId === lastProcessedVideoId) return null;
    
    // Updated selectors for video title
    const title = document.querySelector('h1.ytd-watch-metadata')?.textContent?.trim() ||
                  document.querySelector('h1.title')?.innerText ||
                  document.querySelector('h1.ytd-video-primary-info-renderer')?.innerText ||
                  document.querySelector('h1[class*="title"]')?.textContent?.trim() ||
                  document.querySelector('h1')?.textContent?.trim() ||
                  "Unknown Title";
    
    // Updated selectors for channel name
    const channelName = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string')?.innerText || 
                        document.querySelector('div#owner-name a')?.innerText ||
                        document.querySelector('a[class*="channel-link"]')?.textContent?.trim() ||
                        document.querySelector('ytd-channel-name a')?.textContent?.trim() ||
                        "Unknown Channel";
    
    // Mark this video as processed
    lastProcessedVideoId = videoId;
    
    // Get current timestamp
    const viewedAt = new Date().toISOString();
    
    console.log(`📹 Detected YouTube video: ${title} by ${channelName}`);
    
    return {
        videoId,
        title,
        channelName,
        viewedAt,
        url: window.location.href
    };
}

// Function to send video details to local server
async function sendToServer(videoDetails) {
    try {
        console.log('🚀 Sending video details to server:', videoDetails);
        
        // First notify background script about this video
        chrome.runtime.sendMessage({ 
            action: "sendToServer", 
            videoId: videoDetails.videoId,
            title: videoDetails.title,
            url: videoDetails.url
        });
        
        // Send to the track endpoint on your server
        const response = await fetch('http://localhost:5000/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                videoId: videoDetails.videoId,
                title: videoDetails.title,
                channelName: videoDetails.channelName,
                viewedAt: videoDetails.viewedAt
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Server response:', data);
        } else {
            // If it's a 400 response, it might be because it's not a music video
            if (response.status === 400) {
                console.log('⚠️ Not tracked: Not a music video');
            } else {
                console.error('❌ Failed to send video details:', await response.text());
            }
        }
    } catch (error) {
        console.error('❌ Error sending video details to server:', error);
    }
}

// Process the current page when the script loads
function processCurrentPage() {
    // Only proceed if we're on a watch page
    if (window.location.pathname === '/watch') {
        console.log('🕒 Waiting 10 seconds for YouTube page to fully load...');
        
        // Wait 10 seconds before processing to ensure the page is fully loaded
        setTimeout(() => {
            console.log('⏱️ 10 seconds passed, now extracting video details');
            const videoDetails = getVideoDetails();
            if (videoDetails) {
                sendToServer(videoDetails);
            }
        }, 10000); // 10 seconds delay
    }
}

// Process the page on initial load
processCurrentPage();

// Use the History API to detect YouTube's SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log('📄 URL changed to:', location.href);
        // Give the page a moment to load
        setTimeout(processCurrentPage, 1500);
    }
}).observe(document, {subtree: true, childList: true});

// Also listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Message received in content script:', message);
    
    if (message.action === "checkForVideo") {
        processCurrentPage();
        sendResponse({status: "checked"});
    }
});
