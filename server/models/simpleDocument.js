const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class SimpleDocument extends Model {}

SimpleDocument.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: 'Untitled Document'
  },
  content: {
    type: DataTypes.TEXT,
    defaultValue: '<p>Start typing your document here...</p>'
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  collaborators: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  sequelize,
  modelName: 'SimpleDocument',
  timestamps: true
});

module.exports = SimpleDocument;
