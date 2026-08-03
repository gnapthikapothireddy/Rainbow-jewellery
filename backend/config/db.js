const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

const useMySQL = process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER;

if (useMySQL) {
  console.log('Attempting to connect to MySQL database...');
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  console.log('MySQL environment variables not fully configured. Falling back to local SQLite database...');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connected to database successfully using ${sequelize.getDialect()}!`);
    
    // Sync models
    await sequelize.sync();
    console.log('Database tables synchronized successfully.');
  } catch (error) {
    if (useMySQL) {
      console.error('MySQL connection failed. Falling back to SQLite to ensure application functionality...', error.message);
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../database.sqlite'),
        logging: false
      });
      try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connected to SQLite fallback database successfully!');
      } catch (sqliteErr) {
        console.error('SQLite fallback connection also failed:', sqliteErr.message);
      }
    } else {
      console.error('Database connection and initialization failed:', error.message);
    }
  }
};

module.exports = { sequelize, connectDB };
