const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Collaborator extends Model {}

Collaborator.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  documentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Documents',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  permission: {
    type: DataTypes.ENUM('read', 'write', 'admin'),
    defaultValue: 'read'
  }
}, {
  sequelize,
  modelName: 'Collaborator',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['documentId', 'userId']
    }
  ]
});

module.exports = Collaborator;
