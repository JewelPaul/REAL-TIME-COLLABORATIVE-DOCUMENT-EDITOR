# DocCollab - Real-Time Collaborative Document Editor

A professional real-time collaborative document editor that allows multiple users to edit documents simultaneously. This application provides a rich text editing experience with features like formatting, commenting, and real-time cursor tracking.

## Features

- **Real-time collaboration**: Multiple users can edit documents simultaneously
- **Rich text editing**: Format text, add images, create lists, and more
- **User presence**: See who's currently viewing and editing the document
- **Cursor tracking**: See where other users are editing in real-time
- **Document history**: Track changes and revert to previous versions
- **User authentication**: Secure login and registration system
- **Access control**: Control who can view and edit your documents
- **Responsive design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Socket.io-client for real-time communication
- Quill.js for rich text editing
- Styled-components for styling
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB for data storage
- Socket.io for real-time communication
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install all dependencies (root, client, and server)
```
npm run install-all
```

Alternatively, you can install dependencies separately:

1. Install backend dependencies
```
cd server
npm install
```

2. Install frontend dependencies
```
cd ../client
npm install
```

3. The `.env` files are already set up with the following configurations:

Server `.env`:
```
PORT=5001
MONGODB_URI=mongodb+srv://doccollab:doccollab123@cluster0.mongodb.net/doc-editor?retryWrites=true&w=majority
JWT_SECRET=doccollab_secret_key_2024
NODE_ENV=development
```

Client `.env`:
```
VITE_API_URL=http://localhost:5001
```

### Running the Application

1. The application is configured to use a MongoDB Atlas cluster, so you don't need to run a local MongoDB instance.

2. Run the pre-submission check to ensure everything is set up correctly
```
npm run check
```

3. Seed the database with sample data
```
npm run seed
```

4. Start both the backend and frontend servers with a single command
```
npm start
```

Alternatively, you can start the servers separately:

- Start the backend server
```
cd server
npm run dev
```

- Start the frontend development server
```
cd client
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Demo Accounts

The seed script creates two demo accounts that you can use to test the application:

1. Demo User:
   - Email: demo@example.com
   - Password: password123

2. Second User:
   - Email: user2@example.com
   - Password: password123

## Usage

1. Register a new account or log in with existing credentials
2. Create a new document or open an existing one
3. Start editing and collaborating in real-time
4. Share the document with others by adding them as collaborators

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Quill.js](https://quilljs.com/) - The rich text editor used in this project
- [Socket.io](https://socket.io/) - For real-time communication
- [MongoDB](https://www.mongodb.com/) - For database storage
- [React](https://reactjs.org/) - For the frontend UI
