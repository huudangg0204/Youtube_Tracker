const axios = require('axios');

// Use environment variable for API key
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; //|| 'AIzaSyB7EVjKdyJmMBjRgFjCNJItOQxDi4HN4II';

async function getYouTubeVideoDetails(videoUrl) {
  try {
    const videoId = new URL(videoUrl).searchParams.get('v');
    if (!videoId) throw new Error('Invalid YouTube URL');

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: 'snippet',
          id: videoId,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const videoDetails = response.data.items[0];
    if (!videoDetails) throw new Error('Video not found');

    const { title, channelTitle, categoryId } = videoDetails.snippet;
    const currentTimestamp = new Date().toISOString();
    const videoUrlFormatted = `https://www.youtube.com/watch?v=${videoId}`; // Correctly initialize videoUrl
    return {
      title,
      artist: channelTitle,
      url: videoUrlFormatted,
      category: categoryId === '10' ? 'Music' : 'Other',
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp
    };
  } catch (error) {
    console.error('Error fetching video details:', error.message);
    throw error;
  }
}

async function checkVideoCategory(videoId) {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: 'snippet',
                id: videoId,
                key: YOUTUBE_API_KEY
            }
        });

        const data = response.data;
        if (data.items && data.items.length > 0) {
            const categoryId = data.items[0].snippet.categoryId;
            return categoryId === '10'; // Music category
        }

        return false;
    } catch (error) {
        console.error('Error checking video category:', error.message);
        throw error;
    }
}

module.exports = { getYouTubeVideoDetails, checkVideoCategory };
