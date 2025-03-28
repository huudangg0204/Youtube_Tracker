require('dotenv').config();
const { Pool } = require('pg');
const { Sequelize } = require('sequelize');

// PostgreSQL pool for direct queries
const pool = new Pool({
    user: process.env.DB_USER , //  || postgre, là để kiểm tra xem biến môi trường có tồn tại hay không, nếu không thì sẽ sử dụng giá trị mặc định
    // Nếu không có biến môi trường thì sẽ sử dụng giá trị mặc định là postgres
    host: process.env.DB_HOST ,
    database: process.env.DB_NAME ,
    password: process.env.DB_PASSWORD ,
    port: process.env.DB_PORT  ,
});

// Sequelize instance for ORM operations
const sequelize = new Sequelize(
    process.env.DB_NAME || 'List_song', 
    process.env.DB_USER || 'postgres', 
    process.env.DB_PASSWORD || 'emma020402', 
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: false
    }
);

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