
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('prudhvid_geo_tag', 'prudhvid_geouser', 'Swapn@143', {
  host: '127.0.0.1',
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
