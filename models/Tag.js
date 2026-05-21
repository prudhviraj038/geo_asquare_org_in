
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Tag = sequelize.define('Tag', {
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  image_extension: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Tag;
