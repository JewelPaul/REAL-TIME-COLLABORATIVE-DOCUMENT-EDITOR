const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const { User, Document, Collaborator, DocumentHistory } = require('../models');
require('dotenv').config();

// Seed data
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Connected to PostgreSQL database');

    // Clear existing data
    await DocumentHistory.destroy({ where: {} });
    await Collaborator.destroy({ where: {} });
    await Document.destroy({ where: {} });
    await User.destroy({ where: {} });

    console.log('Database cleared');

    // Create a demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = await User.create({
      username: 'demo',
      email: 'demo@example.com',
      password: hashedPassword,
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=1a73e8&color=fff'
    });

    console.log('Demo user created');

    // Create a second user
    const secondUser = await User.create({
      username: 'user2',
      email: 'user2@example.com',
      password: hashedPassword,
      avatar: 'https://ui-avatars.com/api/?name=User+Two&background=34a853&color=fff'
    });

    console.log('Second user created');

    // Create a third user
    const thirdUser = await User.create({
      username: 'user3',
      email: 'user3@example.com',
      password: hashedPassword,
      avatar: 'https://ui-avatars.com/api/?name=User+Three&background=ea4335&color=fff'
    });

    console.log('Third user created');

    // Create a welcome document
    const welcomeDoc = await Document.create({
      title: 'Welcome to DocCollab',
      content: '<h1>Welcome to DocCollab!</h1><p>This is a collaborative document editor where you can create and edit documents in real-time with your team.</p><p>Try it out by making some changes to this document!</p><h2>Key Features</h2><ul><li>Real-time collaboration</li><li>Rich text editing</li><li>Document sharing</li><li>Version history</li></ul><p>Get started by creating your own document or inviting collaborators to this one.</p>',
      ownerId: demoUser.id,
      isPublic: true,
      lastModified: new Date(),
      version: 1
    });

    console.log('Welcome document created');

    // Create a project document
    const projectDoc = await Document.create({
      title: 'Project Plan 2024',
      content: '<h1>Project Plan 2024</h1><h2>Objectives</h2><p>This document outlines our key objectives for the upcoming year.</p><h2>Timeline</h2><ul><li><strong>Q1:</strong> Research and planning</li><li><strong>Q2:</strong> Development phase</li><li><strong>Q3:</strong> Testing and refinement</li><li><strong>Q4:</strong> Launch and marketing</li></ul><h2>Team Members</h2><ul><li>Project Manager: Demo User</li><li>Developer: User Two</li><li>Designer: User Three</li></ul>',
      ownerId: demoUser.id,
      lastModified: new Date(),
      version: 1
    });

    // Add collaborators to project document
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

    console.log('Project document created with collaborators');

    // Create a meeting notes document
    const meetingDoc = await Document.create({
      title: 'Meeting Notes - July 2024',
      content: '<h1>Meeting Notes - July 2024</h1><h2>Attendees</h2><ul><li>Demo User</li><li>User Two</li><li>User Three</li></ul><h2>Agenda</h2><ol><li>Project status update</li><li>Budget review</li><li>Timeline adjustments</li><li>Next steps</li></ol><h2>Action Items</h2><ul><li>Demo User: Update project documentation</li><li>User Two: Complete backend implementation</li><li>User Three: Finalize design mockups</li></ul>',
      ownerId: secondUser.id,
      lastModified: new Date(),
      version: 1
    });

    // Add collaborator to meeting notes document
    await Collaborator.create({
      documentId: meetingDoc.id,
      userId: demoUser.id,
      permission: 'write'
    });

    console.log('Meeting notes document created');

    // Create a personal document
    const personalDoc = await Document.create({
      title: 'Personal Notes',
      content: '<h1>Personal Notes</h1><p>This is a private document only visible to me.</p><h2>Ideas</h2><ul><li>Implement new feature X</li><li>Research technology Y</li><li>Schedule meeting with team</li></ul><p>Remember to update the project timeline by Friday.</p>',
      ownerId: demoUser.id,
      isPublic: false,
      lastModified: new Date(),
      version: 1
    });

    console.log('Personal document created');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
