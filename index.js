require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const Song = require('./model/song');
const { getYouTubeVideoDetails, checkVideoCategory } = require('./youtubeService');

const app = express();
const port = process.env.PORT || 5000;

// Set up middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
}));

// Initialize database and sync models
async function initializeApp() {
  try {
    // Initialize database connection
    await db.initializeDb();
    
    // Sync Sequelize models
    await db.sequelize.sync({ force: false });
    console.log('Database & tables created!');
    
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
}

app.post('/api/songs', async (req, res) => {
  const { url } = req.body;

  try {
    const videoInfo = await getYouTubeVideoDetails(url);
    const newSong = await Song.create({
      ...videoInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({ message: 'Song saved successfully', song: newSong });
  } catch (error) {
    console.error('Error saving song:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.findAll();
    res.status(200).json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/track', async (req, res) => {
  const { videoId, title, channelName, viewedAt } = req.body;

  try {
    const isMusicVideo = await checkVideoCategory(videoId);
    if (isMusicVideo) {
      await db.saveVideoDetails({ 
        videoId, 
        title, 
        channelName, 
        viewedAt, 
        category: 'Music',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      res.status(200).json({ message: 'Video details saved successfully' });
    } else {
      res.status(400).json({ message: 'Not a music video' });
    }
  } catch (error) {
    console.error('Error tracking video:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Initialize the application
initializeApp();
