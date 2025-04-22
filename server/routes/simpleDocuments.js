const express = require('express');
const { getDocument, saveDocument, addCollaborator } = require('../controllers/simpleDocumentController');

const router = express.Router();

// Get document by ID
router.get('/:id', getDocument);

// Save document
router.post('/:id', saveDocument);

// Add collaborator to document
router.post('/:id/collaborators', addCollaborator);

module.exports = router;
