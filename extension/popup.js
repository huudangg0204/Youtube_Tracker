/**
 * YouTube Video Tracker - Popup Script
 * 
 * This script handles the functionality of the extension popup.
 */

// Track count of videos in storage
let trackedCount = 0;

// Initialize the popup
document.addEventListener('DOMContentLoaded', function() {
    // Load the tracked count from storage
    chrome.storage.local.get(['trackedVideos'], function(result) {
        if (result.trackedVideos) {
            trackedCount = result.trackedVideos.length;
            document.getElementById('counter').textContent = trackedCount;
        }
    });
    
    // Set up the view history button
    document.getElementById('viewHistory').addEventListener('click', function() {
        // Open a new tab to view the history using your server's endpoint
        window.open('http://localhost:5000/api/songs', '_blank');
    });
});