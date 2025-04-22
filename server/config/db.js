const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Create a new Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/database.sqlite'),
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true,
    underscored: false
  },
  // Enable foreign keys in SQLite
  dialectOptions: {
    // SQLite only
    pragmas: {
      'foreign_keys': 1
    }
  }
});

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connection has been established successfully.');

    // Sync all models
    // Note: In production, you should use migrations instead of sync
    if (process.env.NODE_ENV === 'development') {
      // Force: true will drop the table if it already exists
      // Only use this during development
      await sequelize.sync({ force: true });
      console.log('All models were synchronized successfully.');
    }

    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
