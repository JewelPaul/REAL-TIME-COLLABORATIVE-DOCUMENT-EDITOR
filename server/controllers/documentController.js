const { Document, User, Collaborator, DocumentHistory } = require('../models');
const { Op } = require('sequelize');

// @desc    Create a new document
// @route   POST /api/documents
// @access  Private
exports.createDocument = async (req, res, next) => {
  try {
    const { title, content, isPublic } = req.body;

    const document = await Document.create({
      title,
      content: content || '<p>Start typing here...</p>',
      ownerId: req.user.id,
      isPublic: isPublic || false
    });

    res.status(201).json({
      success: true,
      document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all documents for current user
// @route   GET /api/documents
// @access  Private
exports.getMyDocuments = async (req, res, next) => {
  try {
    // Find documents where user is owner
    const ownedDocuments = await Document.findAll({
      where: { ownerId: req.user.id },
      order: [['lastModified', 'DESC']]
    });

    // Find documents where user is a collaborator
    const collaboratingDocuments = await Document.findAll({
      include: [{
        model: User,
        as: 'collaboratingUsers',
        where: { id: req.user.id },
        through: { attributes: ['permission'] }
      }],
      order: [['lastModified', 'DESC']]
    });

    // Combine and sort by lastModified
    const documents = [...ownedDocuments, ...collaboratingDocuments]
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    res.status(200).json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'email', 'avatar']
        },
        {
          model: User,
          as: 'collaboratingUsers',
          attributes: ['id', 'username', 'email', 'avatar'],
          through: { attributes: ['permission'] }
        }
      ]
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if user has access to the document
    const isOwner = document.ownerId === req.user.id;
    const isCollaborator = document.collaboratingUsers.some(user => user.id === req.user.id);

    if (!isOwner && !isCollaborator && !document.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document'
      });
    }

    res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private
exports.updateDocument = async (req, res, next) => {
  try {
    let document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if user has permission to edit
    const canEdit = await document.canEdit(req.user.id);
    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this document'
      });
    }

    const { title, content, isPublic } = req.body;

    // If content has changed, add current version to history
    if (content && content !== document.content) {
      await DocumentHistory.create({
        documentId: document.id,
        content: document.content,
        modifiedBy: req.user.id,
        version: document.version + 1
      });
      document.version += 1;
    }

    // Update document
    document.title = title || document.title;
    document.content = content || document.content;
    document.isPublic = isPublic !== undefined ? isPublic : document.isPublic;
    document.lastModified = new Date();

    await document.save();

    res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if user is the owner
    if (document.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this document'
      });
    }

    await document.destroy();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a collaborator to a document
// @route   POST /api/documents/:id/collaborators
// @access  Private
exports.addCollaborator = async (req, res, next) => {
  try {
    const { email, permission } = req.body;

    if (!email || !['read', 'write', 'admin'].includes(permission)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid email and permission'
      });
    }

    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if user is the owner
    if (document.ownerId !== req.user.id) {
      // Check if user is an admin collaborator
      const collaborator = await Collaborator.findOne({
        where: {
          documentId: document.id,
          userId: req.user.id,
          permission: 'admin'
        }
      });

      if (!collaborator) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to add collaborators'
        });
      }
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already a collaborator
    const existingCollaborator = await Collaborator.findOne({
      where: {
        documentId: document.id,
        userId: user.id
      }
    });

    if (existingCollaborator) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator'
      });
    }

    // Add collaborator
    await Collaborator.create({
      documentId: document.id,
      userId: user.id,
      permission
    });

    // Get updated document with collaborators
    const updatedDocument = await Document.findByPk(document.id, {
      include: [
        {
          model: User,
          as: 'collaboratingUsers',
          through: { attributes: ['permission'] }
        }
      ]
    });

    res.status(200).json({
      success: true,
      document: updatedDocument
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a collaborator from a document
// @route   DELETE /api/documents/:id/collaborators/:userId
// @access  Private
exports.removeCollaborator = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if user is the owner
    if (document.ownerId !== req.user.id) {
      // Check if user is an admin collaborator
      const collaborator = await Collaborator.findOne({
        where: {
          documentId: document.id,
          userId: req.user.id,
          permission: 'admin'
        }
      });

      if (!collaborator) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to remove collaborators'
        });
      }
    }

    // Remove collaborator
    await Collaborator.destroy({
      where: {
        documentId: document.id,
        userId: req.params.userId
      }
    });

    // Get updated document with collaborators
    const updatedDocument = await Document.findByPk(document.id, {
      include: [
        {
          model: User,
          as: 'collaboratingUsers',
          through: { attributes: ['permission'] }
        }
      ]
    });

    res.status(200).json({
      success: true,
      document: updatedDocument
    });
  } catch (error) {
    next(error);
  }
};
