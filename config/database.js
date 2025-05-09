const { Sequelize } = require('sequelize');
const { logger } = require('../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Sync database models (in development)
const syncDatabase = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      // Use { force: true } to drop tables and recreate (CAREFUL!)
      // Use { alter: true } to make alterations to existing tables
      await sequelize.sync({ alter: true });
      logger.info('Database synchronized successfully');
    } catch (error) {
      logger.error('Failed to sync database:', error);
    }
  }
};

module.exports = sequelize;
module.exports.testConnection = testConnection;
module.exports.syncDatabase = syncDatabase;
