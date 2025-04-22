const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Document extends Model {
  // Method to add a new version to history
  async addToHistory(content, userId) {
    const DocumentHistory = require('./documentHistory');
    await DocumentHistory.create({
      documentId: this.id,
      content,
      modifiedBy: userId,
      version: this.version + 1
    });

    this.version += 1;
    this.lastModified = new Date();
    return this.save();
  }

  // Method to check if a user has permission to edit
  async canEdit(userId) {
    // Owner always has edit permission
    if (this.ownerId === userId) {
      return true;
    }

    // Check collaborators
    const Collaborator = require('./collaborator');
    const collaborator = await Collaborator.findOne({
      where: {
        documentId: this.id,
        userId
      }
    });

    return collaborator && ['write', 'admin'].includes(collaborator.permission);
  }
}

Document.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Document title is required' },
      len: { args: [1, 100], msg: 'Title cannot be more than 100 characters' }
    }
  },
  content: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastModified: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  sequelize,
  modelName: 'Document',
  timestamps: true,
  hooks: {
    beforeUpdate: (document) => {
      document.lastModified = new Date();
    }
  }
});

module.exports = Document;
