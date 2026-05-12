
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('geo_tag', 'geo_tag_user', 'f8$8BWSOapBo', {
  host: '103.93.16.46',
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: false, // Disable logging SQL queries for production
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the MySQL database:', error);
  }
}

testConnection();

module.exports = sequelize;
