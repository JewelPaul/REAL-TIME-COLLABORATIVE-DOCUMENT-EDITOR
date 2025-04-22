const { SimpleDocument } = require('../models');

// Get document by ID
exports.getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find document or create if it doesn't exist
    const [document, created] = await SimpleDocument.findOrCreate({
      where: { id },
      defaults: {
        title: 'Untitled Document',
        content: '<p>Start typing your document here...</p>',
        createdBy: req.query.email || null,
        collaborators: req.query.email ? [{ email: req.query.email }] : []
      }
    });
    
    res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Save document
exports.saveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, email } = req.body;
    
    // Find document
    let document = await SimpleDocument.findByPk(id);
    
    if (!document) {
      // Create new document if it doesn't exist
      document = await SimpleDocument.create({
        id,
        title,
        content,
        createdBy: email,
        collaborators: email ? [{ email }] : []
      });
    } else {
      // Update existing document
      document.title = title;
      document.content = content;
      
      // Add collaborator if not already in the list
      if (email) {
        const collaborators = document.collaborators || [];
        const exists = collaborators.some(c => c.email === email);
        
        if (!exists) {
          collaborators.push({ email });
          document.collaborators = collaborators;
        }
      }
      
      await document.save();
    }
    
    res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add collaborator to document
exports.addCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Find document
    const document = await SimpleDocument.findByPk(id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Add collaborator if not already in the list
    const collaborators = document.collaborators || [];
    const exists = collaborators.some(c => c.email === email);
    
    if (!exists) {
      collaborators.push({ email });
      document.collaborators = collaborators;
      await document.save();
    }
    
    res.status(200).json({
      success: true,
      collaborators: document.collaborators
    });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
