const express = require('express');
const {
  createDocument,
  getMyDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  addCollaborator,
  removeCollaborator
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Document routes
router.route('/')
  .get(getMyDocuments)
  .post(createDocument);

router.route('/:id')
  .get(getDocument)
  .put(updateDocument)
  .delete(deleteDocument);

// Collaborator routes
router.route('/:id/collaborators')
  .post(addCollaborator);

router.route('/:id/collaborators/:userId')
  .delete(removeCollaborator);

module.exports = router;
