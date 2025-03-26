require('dotenv').config();
const { Pool } = require('pg');
const { Sequelize } = require('sequelize');

// PostgreSQL pool for direct queries
const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'List_song',
    password: 'emma020402',
    port: 5432,
});

// Sequelize instance for ORM operations
const sequelize = new Sequelize('List_song', 'postgres', 'emma020402', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false
});

async function saveVideoDetails({ videoId, title, channelName, viewedAt, category, createdAt, updatedAt }) {
    const query = `
        INSERT INTO songs (title, artist, url, category, date_listened, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
    const values = [
        title, 
        channelName, 
        `https://www.youtube.com/watch?v=${videoId}`, 
        category, 
        viewedAt,
        createdAt || new Date(),
        updatedAt || new Date()
    ];

    await pool.query(query, values);
}

// Initialize database connection
async function initializeDb() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        // Sync Sequelize models
        await sequelize.sync({ force: false });
        console.log('Database & tables created!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Fix the exports to be a single object with all necessary properties
module.exports = {
    query: (text, params) => pool.query(text, params),
    sequelize,
    saveVideoDetails,
    initializeDb
};