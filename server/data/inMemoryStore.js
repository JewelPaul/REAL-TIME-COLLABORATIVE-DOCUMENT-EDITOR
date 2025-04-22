// In-memory data store for development
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// In-memory data stores
const users = new Map();
const documents = new Map();
const sessions = new Map();

// Helper functions
const generateId = () => crypto.randomBytes(16).toString('hex');
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Initialize with some sample data
const initializeStore = async () => {
  // Create a sample user
  const userId = generateId();
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  users.set(userId, {
    _id: userId,
    username: 'demo',
    email: 'demo@example.com',
    password: hashedPassword,
    avatar: '',
    createdAt: new Date()
  });
  
  // Create a sample document
  const documentId = generateId();
  documents.set(documentId, {
    _id: documentId,
    title: 'Welcome to DocCollab',
    content: '<h1>Welcome to DocCollab!</h1><p>This is a collaborative document editor where you can create and edit documents in real-time with your team.</p><p>Try it out by making some changes to this document!</p>',
    owner: userId,
    collaborators: [],
    isPublic: true,
    lastModified: new Date(),
    createdAt: new Date(),
    version: 1,
    history: []
  });
  
  console.log('In-memory store initialized with sample data');
};

// User methods
const findUserById = (id) => {
  return users.get(id) || null;
};

const findUserByEmail = (email) => {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

const createUser = async (userData) => {
  const id = generateId();
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const newUser = {
    _id: id,
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    avatar: userData.avatar || '',
    createdAt: new Date()
  };
  
  users.set(id, newUser);
  return newUser;
};

const comparePassword = async (user, candidatePassword) => {
  return await bcrypt.compare(candidatePassword, user.password);
};

// Document methods
const findDocumentById = (id) => {
  return documents.get(id) || null;
};

const findDocumentsByUser = (userId) => {
  const userDocuments = [];
  
  for (const doc of documents.values()) {
    if (doc.owner === userId || doc.collaborators.some(c => c.user === userId)) {
      userDocuments.push(doc);
    }
  }
  
  return userDocuments;
};

const createDocument = (documentData) => {
  const id = generateId();
  
  const newDocument = {
    _id: id,
    title: documentData.title,
    content: documentData.content || '<p>Start typing here...</p>',
    owner: documentData.owner,
    collaborators: documentData.collaborators || [],
    isPublic: documentData.isPublic || false,
    lastModified: new Date(),
    createdAt: new Date(),
    version: 1,
    history: []
  };
  
  documents.set(id, newDocument);
  return newDocument;
};

const updateDocument = (id, documentData) => {
  const document = documents.get(id);
  
  if (!document) {
    return null;
  }
  
  // Add current version to history if content has changed
  if (documentData.content && documentData.content !== document.content) {
    document.history.push({
      content: document.content,
      modifiedBy: documentData.modifiedBy || document.owner,
      modifiedAt: new Date()
    });
    document.version += 1;
  }
  
  // Update document
  const updatedDocument = {
    ...document,
    title: documentData.title || document.title,
    content: documentData.content || document.content,
    isPublic: documentData.isPublic !== undefined ? documentData.isPublic : document.isPublic,
    lastModified: new Date()
  };
  
  documents.set(id, updatedDocument);
  return updatedDocument;
};

const deleteDocument = (id) => {
  if (!documents.has(id)) {
    return false;
  }
  
  documents.delete(id);
  return true;
};

const addCollaborator = (documentId, userId, permission) => {
  const document = documents.get(documentId);
  
  if (!document) {
    return null;
  }
  
  // Check if user is already a collaborator
  const existingCollaborator = document.collaborators.findIndex(c => c.user === userId);
  
  if (existingCollaborator !== -1) {
    document.collaborators[existingCollaborator].permission = permission;
  } else {
    document.collaborators.push({
      user: userId,
      permission
    });
  }
  
  documents.set(documentId, document);
  return document;
};

const removeCollaborator = (documentId, userId) => {
  const document = documents.get(documentId);
  
  if (!document) {
    return null;
  }
  
  document.collaborators = document.collaborators.filter(c => c.user !== userId);
  documents.set(documentId, document);
  return document;
};

// Session methods
const createSession = (userId) => {
  const token = generateToken();
  sessions.set(token, {
    userId,
    createdAt: new Date()
  });
  return token;
};

const findSessionByToken = (token) => {
  return sessions.get(token) || null;
};

const deleteSession = (token) => {
  if (!sessions.has(token)) {
    return false;
  }
  
  sessions.delete(token);
  return true;
};

// Document permission check
const canEditDocument = (document, userId) => {
  // Owner always has edit permission
  if (document.owner === userId) {
    return true;
  }
  
  // Check collaborators
  const collaborator = document.collaborators.find(c => c.user === userId);
  return collaborator && ['write', 'admin'].includes(collaborator.permission);
};

module.exports = {
  initializeStore,
  findUserById,
  findUserByEmail,
  createUser,
  comparePassword,
  findDocumentById,
  findDocumentsByUser,
  createDocument,
  updateDocument,
  deleteDocument,
  addCollaborator,
  removeCollaborator,
  createSession,
  findSessionByToken,
  deleteSession,
  canEditDocument
};
