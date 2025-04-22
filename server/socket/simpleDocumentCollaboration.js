const { SimpleDocument } = require('../models');

// Map to store active documents and their collaborators
const activeDocuments = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Get document ID and user email from query parameters
    const { documentId, userEmail } = socket.handshake.query;

    // Store these values in the socket object for later use
    socket.documentId = documentId;
    socket.userEmail = userEmail;

    if (!documentId) {
      console.log('No document ID provided, disconnecting');
      socket.disconnect();
      return;
    }

    // Join document room
    socket.on('join-document', async ({ documentId, userEmail }) => {
      console.log(`User ${userEmail} joining document ${documentId}`);

      // Join the room for this document
      socket.join(documentId);

      // Add user to active collaborators for this document
      if (!activeDocuments.has(documentId)) {
        activeDocuments.set(documentId, new Set());
      }

      if (userEmail) {
        activeDocuments.get(documentId).add(userEmail);
      }

      // Get document from database
      try {
        const [document, created] = await SimpleDocument.findOrCreate({
          where: { id: documentId },
          defaults: {
            title: 'Untitled Document',
            content: '<p>Start typing your document here...</p>',
            createdBy: userEmail || null,
            collaborators: userEmail ? [{ email: userEmail }] : []
          }
        });

        // If user is not in collaborators list, add them
        if (userEmail) {
          const collaborators = document.collaborators || [];
          const exists = collaborators.some(c => c.email === userEmail);

          if (!exists) {
            collaborators.push({ email: userEmail });
            document.collaborators = collaborators;
            await document.save();
          }
        }

        // Send document data to the client
        socket.emit('document-data', {
          title: document.title,
          content: document.content
        });

        // Send list of collaborators to all clients in the room
        const collaborators = Array.from(activeDocuments.get(documentId)).map(email => ({ email }));
        io.to(documentId).emit('collaborators-updated', { collaborators });
      } catch (error) {
        console.error('Error getting document:', error);
      }
    });

    // Handle content changes
    socket.on('content-change', async (data) => {
      try {
        const { documentId, content, sender } = data;

        // Update document in database to ensure persistence
        const document = await SimpleDocument.findByPk(documentId);
        if (document) {
          document.content = content;
          await document.save();
        }

        // Broadcast content change to all clients in the room except the sender
        socket.to(documentId).emit('content-change', data);

        console.log(`Content updated for document ${documentId} by ${sender}`);
      } catch (error) {
        console.error('Error handling content change:', error);
      }
    });

    // Handle title changes
    socket.on('title-change', async (data) => {
      try {
        const { documentId, title, sender } = data;

        // Update document in database to ensure persistence
        const document = await SimpleDocument.findByPk(documentId);
        if (document) {
          document.title = title;
          await document.save();
        }

        // Broadcast title change to all clients in the room except the sender
        socket.to(documentId).emit('title-change', data);

        console.log(`Title updated for document ${documentId} by ${sender}`);
      } catch (error) {
        console.error('Error handling title change:', error);
      }
    });

    // Handle document save
    socket.on('save-document', async (data) => {
      try {
        const { documentId, title, content, userEmail } = data;

        // Find document
        let document = await SimpleDocument.findByPk(documentId);

        if (!document) {
          // Create new document if it doesn't exist
          document = await SimpleDocument.create({
            id: documentId,
            title,
            content,
            createdBy: userEmail,
            collaborators: userEmail ? [{ email: userEmail }] : []
          });
        } else {
          // Update existing document
          document.title = title;
          document.content = content;

          // Add collaborator if not already in the list
          if (userEmail) {
            const collaborators = document.collaborators || [];
            const exists = collaborators.some(c => c.email === userEmail);

            if (!exists) {
              collaborators.push({ email: userEmail });
              document.collaborators = collaborators;
            }
          }

          await document.save();
        }

        // Notify all clients in the room that the document was saved
        io.to(documentId).emit('document-saved');
      } catch (error) {
        console.error('Error saving document:', error);
      }
    });

    // Handle add collaborator
    socket.on('add-collaborator', async (data) => {
      try {
        const { documentId, email } = data;

        if (!email) return;

        // Find document
        const document = await SimpleDocument.findByPk(documentId);

        if (!document) return;

        // Add collaborator if not already in the list
        const collaborators = document.collaborators || [];
        const exists = collaborators.some(c => c.email === email);

        if (!exists) {
          collaborators.push({ email });
          document.collaborators = collaborators;
          await document.save();
        }

        // Send updated list of collaborators to all clients in the room
        io.to(documentId).emit('collaborators-updated', { collaborators });
      } catch (error) {
        console.error('Error adding collaborator:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      const docId = socket.documentId;
      const email = socket.userEmail;

      // Remove user from active collaborators for this document
      if (docId && email && activeDocuments.has(docId)) {
        console.log(`Removing user ${email} from document ${docId}`);
        activeDocuments.get(docId).delete(email);

        // If no more active collaborators, remove document from map
        if (activeDocuments.get(docId).size === 0) {
          activeDocuments.delete(docId);
        } else {
          // Send updated list of collaborators to all clients in the room
          const collaborators = Array.from(activeDocuments.get(docId)).map(email => ({ email }));
          io.to(docId).emit('collaborators-updated', { collaborators });
        }
      }
    });
  });
};
