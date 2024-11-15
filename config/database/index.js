const Sequelize = require('sequelize');
require('dotenv').config();

const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST


const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: 'mysql',
    logging: false,
    pool: {
      maxConnections: 100,
      minConnections: 0,
      maxIdleTime: 10000
    }
});




module.exports = {
  sequelize
}
