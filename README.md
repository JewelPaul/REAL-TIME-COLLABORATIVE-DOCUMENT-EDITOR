# REAL-TIME COLLABORATIVE DOCUMENT EDITOR

COMPANY: CODTECH IT SOLUTIONS

NAME: JEWEL GABRIEL PAUL

INTERN ID: CT04WR20

DOMAIN: FULL STACK WEB DEVELOPMENT

DURATION: 4 WEEEKS

MENTOR: NEELA SANTOSH

# 📝 DocCollab: Real-Time Collaborative Document Editor

## 🚀 Project Overview
**DocCollab** is a professional real-time collaborative document editing platform designed to enable multiple users to work on the same document simultaneously. Built with modern web technologies, this application provides a streamlined, intuitive interface for creating, editing, and sharing documents in real-time.

---

## ✨ Key Features

### 🔄 Real-Time Collaboration
- **Synchronized Editing**: Changes made by any user are instantly visible to all collaborators  
- **Cursor Position Preservation**: Editor maintains cursor position during updates to prevent disruption  
- **Debounced Updates**: Optimized to prevent overwhelming the server with rapid changes  
- **Reliable Connections**: Automatic reconnection handling if network issues occur  

### 📄 Document Management
- **Simple Document Creation**: Create new documents with a single click  
- **Document Joining**: Join existing documents by entering the document ID  
- **Email-Based Identification**: Users identify themselves with email addresses for collaboration  
- **Document Persistence**: All documents are saved to a database for future access  

### 🖋️ Editor Functionality
- **Rich Text Formatting**: Support for text styling (bold, italic, etc.)  
- **Text Alignment**: Left, center, right, and justify alignment options  
- **Lists**: Ordered and unordered list support  
- **Media Support**: Insert and display images and other media  
- **Code Blocks**: Special formatting for code snippets  
- **Tables**: Create and edit tables within documents  

### 👥 Collaboration Features
- **Collaborator Sidebar**: See who is currently viewing or editing the document  
- **Email Invitations**: Send Gmail invitations to potential collaborators with pre-filled document links  
- **Connection Status**: Visual indicator showing connection status to the server  
- **Last Saved Indicator**: Shows when the document was last saved  

### 💻 User Interface
- **Clean, Modern Design**: Professional appearance with intuitive controls  
- **Responsive Layout**: Adapts to different screen sizes and devices  
- **Visual Feedback**: Clear indicators for actions like saving and connection status  
- **Modal Dialogs**: Clean interface for actions like inviting collaborators  

---

## 🧱 Technology Stack

### 🌐 Frontend
- **React 18**: Component-based UI development with the latest React features  
- **Styled Components**: CSS-in-JS for component-scoped styling  
- **React Router 6**: Client-side routing for single-page application navigation  
- **TinyMCE 6**: Professional-grade WYSIWYG editor with extensive formatting options  
- **Socket.IO Client**: Real-time bidirectional event-based communication  
- **React Icons**: Comprehensive icon library for enhanced UI elements  

### 🔧 Backend
- **Node.js**: JavaScript runtime for server-side code  
- **Express**: Web framework for handling HTTP requests and API endpoints  
- **Socket.IO**: Server implementation for real-time communication  
- **Sequelize**: ORM for database interactions with PostgreSQL  
- **Morgan**: HTTP request logger for debugging and monitoring  
- **CORS**: Cross-Origin Resource Sharing support for secure client-server communication  

### 🗄️ Database
- **PostgreSQL**: Relational database for document storage  
- **SQLite**: Used for development and testing environments  

---

## ⚙️ Implementation Details

### 🔁 Document Synchronization
The application uses a robust synchronization mechanism:
- Changes are debounced on the client side to optimize performance  
- Socket.IO events transmit changes to the server  
- The server broadcasts changes to all connected clients  
- Changes are persisted to the database for durability  
- Clients receive updates and apply them while preserving cursor position  

### 🧩 Data Model
- **SimpleDocument**: Stores document content, title, creator information, and collaborator list  
- **Collaborators**: Tracked as an array of email addresses within each document  

---

## 📡 API Endpoints
- `GET /api/documents/:id` → Retrieve a document by ID  
- `POST /api/documents/:id` → Save changes to a document  
- `POST /api/documents/:id/collaborators` → Add a collaborator to a document  

---

## 🔌 Socket Events
- `join-document` → Connect a user to a specific document's editing session  
- `content-change` → Broadcast content changes to all connected users  
- `title-change` → Broadcast title changes to all connected users  
- `collaborators-updated` → Notify all users when the collaborator list changes  
- `document-saved` → Confirm when a document has been successfully saved  

---

# OUTPUT
![Screenshot 2025-04-22 at 6 16 35 PM](https://github.com/user-attachments/assets/7a7e9752-c681-49ff-9b88-cd9360bc0573)

![Screenshot 2025-04-22 at 6 16 47 PM](https://github.com/user-attachments/assets/a5c0e906-c407-4dfe-a233-1c747d47b497)

![Screenshot 2025-04-22 at 6 19 04 PM](https://github.com/user-attachments/assets/c07a657a-11d2-4e7b-8874-34f02a2f5586)


DEVELOPED BY-

JEWEL GABRIEL PAUL
