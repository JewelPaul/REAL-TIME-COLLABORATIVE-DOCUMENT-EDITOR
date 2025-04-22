const { sequelize } = require('../config/db');
const { User, Document, Collaborator } = require('../models');
require('dotenv').config();

// Seed data
const seedDatabase = async () => {
  try {
    // Force sync all models (this will drop tables if they exist)
    console.log('Syncing database...');
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    // Create demo users
    console.log('Creating demo users...');
    const demoUser = await User.create({
      username: 'demo',
      email: 'demo@example.com',
      password: 'password123',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=1a73e8&color=fff'
    });

    const secondUser = await User.create({
      username: 'user2',
      email: 'user2@example.com',
      password: 'password123',
      avatar: 'https://ui-avatars.com/api/?name=User+Two&background=34a853&color=fff'
    });

    const thirdUser = await User.create({
      username: 'user3',
      email: 'user3@example.com',
      password: 'password123',
      avatar: 'https://ui-avatars.com/api/?name=User+Three&background=fbbc04&color=fff'
    });

    console.log('Users created successfully');

    // Create documents
    console.log('Creating documents...');
    const welcomeDoc = await Document.create({
      title: 'Welcome to DocCollab',
      content: '<h1>Welcome to DocCollab!</h1><p>This is a collaborative document editor where you can create and edit documents in real-time with your team.</p><p>Try it out by making some changes to this document!</p><h2>Key Features</h2><ul><li>Real-time collaboration</li><li>Rich text editing</li><li>Document sharing</li><li>Version history</li></ul><p>Get started by creating your own document or inviting collaborators to this one.</p>',
      ownerId: demoUser.id,
      isPublic: true
    });

    const projectDoc = await Document.create({
      title: 'Project Plan 2024',
      content: '<h1>Project Plan 2024</h1><h2>Objectives</h2><p>This document outlines our key objectives for the upcoming year.</p><h2>Timeline</h2><ul><li><strong>Q1:</strong> Research and planning</li><li><strong>Q2:</strong> Development phase</li><li><strong>Q3:</strong> Testing and refinement</li><li><strong>Q4:</strong> Launch and marketing</li></ul><h2>Team Members</h2><ul><li>Project Manager: Demo User</li><li>Developer: User Two</li><li>Designer: User Three</li></ul>',
      ownerId: demoUser.id,
      isPublic: false
    });

    const meetingDoc = await Document.create({
      title: 'Meeting Notes - Team Sync',
      content: '<h1>Team Sync Meeting - Notes</h1><p><em>Date: January 15, 2024</em></p><h2>Agenda</h2><ol><li>Project status updates</li><li>Blockers and challenges</li><li>Next steps</li></ol><h2>Discussion Points</h2><p>The team discussed the current progress on the main project. Several key features have been completed ahead of schedule.</p><h2>Action Items</h2><ul><li>Demo: Finalize the documentation</li><li>User2: Complete the backend integration</li><li>User3: Prepare design assets</li></ul><p>Next meeting scheduled for January 22, 2024.</p>',
      ownerId: secondUser.id,
      isPublic: false
    });

    const personalDoc = await Document.create({
      title: 'Personal Notes',
      content: '<h1>Personal Notes</h1><p>This is a private document only visible to me.</p><h2>Ideas</h2><ul><li>Implement new feature X</li><li>Research technology Y</li><li>Schedule meeting with team</li></ul><p>Remember to update the project timeline by Friday.</p>',
      ownerId: demoUser.id,
      isPublic: false
    });

    console.log('Documents created successfully');

    // Add collaborators
    console.log('Adding collaborators...');
    await Collaborator.create({
      documentId: projectDoc.id,
      userId: secondUser.id,
      permission: 'write'
    });

    await Collaborator.create({
      documentId: projectDoc.id,
      userId: thirdUser.id,
      permission: 'read'
    });

    await Collaborator.create({
      documentId: meetingDoc.id,
      userId: demoUser.id,
      permission: 'write'
    });

    console.log('Collaborators added successfully');
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
