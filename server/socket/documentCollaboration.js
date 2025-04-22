const jwt = require('jsonwebtoken');
const { User, Document, DocumentHistory, Collaborator } = require('../models');

// Map to store active users in each document
const documentUsers = new Map();

// Map to store cursor positions
const cursorPositions = new Map();

module.exports = (io) => {
  // Authentication middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      };

      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // Join document room
    socket.on('join-document', async ({ documentId }) => {
      try {
        // Check if user has access to the document
        const document = await Document.findByPk(documentId, {
          include: [{
            model: User,
            as: 'collaboratingUsers',
            where: { id: socket.user.id },
            required: false
          }]
        });

        if (!document) {
          socket.emit('error', { message: 'Document not found' });
          return;
        }

        const hasAccess =
          document.ownerId === socket.user.id ||
          document.collaboratingUsers.length > 0 ||
          document.isPublic;

        if (!hasAccess) {
          socket.emit('error', { message: 'Not authorized to access this document' });
          return;
        }

        // Join the document room
        socket.join(documentId);

        // Add user to active users for this document
        if (!documentUsers.has(documentId)) {
          documentUsers.set(documentId, new Map());
        }

        documentUsers.get(documentId).set(socket.id, {
          id: socket.user.id,
          username: socket.user.username,
          avatar: socket.user.avatar
        });

        // Send current document content to the user
        socket.emit('load-document', {
          content: document.content,
          title: document.title
        });

        // Send list of active users to everyone in the room
        io.to(documentId).emit('active-users', {
          users: Array.from(documentUsers.get(documentId).values())
        });

        // Send existing cursor positions to the new user
        if (cursorPositions.has(documentId)) {
          socket.emit('cursor-positions', {
            positions: Array.from(cursorPositions.get(documentId).values())
          });
        }

        console.log(`${socket.user.username} joined document: ${documentId}`);
      } catch (error) {
        console.error('Error joining document:', error);
        socket.emit('error', { message: 'Server error' });
      }
    });

    // Handle document changes
    socket.on('document-change', async ({ documentId, content, delta }) => {
      try {
        // Check if user has edit permission
        const document = await Document.findByPk(documentId);

        if (!document) {
          socket.emit('error', { message: 'Document not found' });
          return;
        }

        const canEdit = await document.canEdit(socket.user.id);

        if (!canEdit) {
          socket.emit('error', { message: 'Not authorized to edit this document' });
          return;
        }

        // Broadcast changes to other users in the room
        socket.to(documentId).emit('document-change', {
          content,
          delta,
          user: {
            id: socket.user.id,
            username: socket.user.username
          }
        });

        // Update document in database (debounced on the server)
        updateDocumentDebounced(documentId, content, socket.user.id);
      } catch (error) {
        console.error('Error handling document change:', error);
        socket.emit('error', { message: 'Server error' });
      }
    });

    // Handle cursor position updates
    socket.on('cursor-position', ({ documentId, position }) => {
      try {
        if (!cursorPositions.has(documentId)) {
          cursorPositions.set(documentId, new Map());
        }

        cursorPositions.get(documentId).set(socket.id, {
          id: socket.user.id,
          username: socket.user.username,
          position,
          color: getUserColor(socket.user.id)
        });

        // Broadcast cursor position to other users
        socket.to(documentId).emit('cursor-position', {
          id: socket.user.id,
          username: socket.user.username,
          position,
          color: getUserColor(socket.user.id)
        });
      } catch (error) {
        console.error('Error handling cursor position:', error);
      }
    });

    // Handle title changes
    socket.on('title-change', async ({ documentId, title }) => {
      try {
        // Check if user has edit permission
        const document = await Document.findByPk(documentId);

        if (!document) {
          socket.emit('error', { message: 'Document not found' });
          return;
        }

        const canEdit = await document.canEdit(socket.user.id);

        if (!canEdit) {
          socket.emit('error', { message: 'Not authorized to edit this document' });
          return;
        }

        // Update title in database
        document.title = title;
        await document.save();

        // Broadcast title change to other users
        socket.to(documentId).emit('title-change', { title });
      } catch (error) {
        console.error('Error handling title change:', error);
        socket.emit('error', { message: 'Server error' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);

      // Remove user from all document rooms
      for (const [documentId, users] of documentUsers.entries()) {
        if (users.has(socket.id)) {
          users.delete(socket.id);

          // Remove cursor position
          if (cursorPositions.has(documentId)) {
            cursorPositions.get(documentId).delete(socket.id);
          }

          // Notify other users
          io.to(documentId).emit('active-users', {
            users: Array.from(users.values())
          });

          console.log(`${socket.user.username} left document: ${documentId}`);
        }
      }
    });
  });
};

// Debounce function to limit database updates
const debounce = (func, delay) => {
  const debounced = {};
  return function(id, ...args) {
    clearTimeout(debounced[id]);
    debounced[id] = setTimeout(() => {
      func(id, ...args);
      delete debounced[id];
    }, delay);
  };
};

// Debounced function to update document in database
const updateDocumentDebounced = debounce(async (documentId, content, userId) => {
  try {
    const document = await Document.findByPk(documentId);

    if (!document) return;

    // If content has changed, add current version to history
    if (content !== document.content) {
      await DocumentHistory.create({
        documentId: document.id,
        content: document.content,
        modifiedBy: userId,
        version: document.version + 1
      });
      document.version += 1;
    }

    // Update document content
    document.content = content;
    document.lastModified = new Date();
    await document.save();

    console.log(`Document ${documentId} updated by ${userId}`);
  } catch (error) {
    console.error('Error updating document:', error);
  }
}, 2000); // 2 seconds debounce

// Generate a consistent color for a user based on their ID
function getUserColor(userId) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA5A5', '#A5FFD6',
    '#FFC145', '#FF6B8B', '#C04CFD', '#47B8FF', '#FFD166'
  ];

  // Simple hash function to get a consistent index
  const hash = userId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return colors[hash % colors.length];
}
