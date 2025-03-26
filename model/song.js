const { DataTypes } = require('sequelize');
const db = require('../database');

const Song = db.sequelize.define('song', {
  title: { type: DataTypes.STRING, allowNull: false },
  artist: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false, unique: true },
  category: { type: DataTypes.STRING, allowNull: true },
  date_listened: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: true, // Enable automatic createdAt and updatedAt columns
});

module.exports = Song;
