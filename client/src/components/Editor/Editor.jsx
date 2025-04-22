import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { getSocket, initSocket } from '../../services/socket';
import Navbar from '../Common/Navbar';
import Toolbar from './Toolbar';
import Collaborators from './Collaborators';
import styled from 'styled-components';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.snow.css';

// Register Quill modules
Quill.register('modules/cursors', QuillCursors);

const EditorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const EditorContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const TitleInput = styled.input`
  font-size: 1.5rem;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid transparent;
  background-color: transparent;
  padding: 5px 0;
  outline: none;
  transition: border-color 0.3s;
  width: 100%;

  &:focus {
    border-bottom-color: #1a73e8;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const EditorWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;

  .ql-container {
    flex: 1;
    overflow-y: auto;
    font-size: 16px;
    border: none;
  }

  .ql-editor {
    min-height: 500px;
    padding: 20px;
    line-height: 1.6;
  }
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e8eaed;
  font-size: 0.9rem;
  color: #5f6368;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    padding: 10px;
    font-size: 0.8rem;
  }
`;

const SaveStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => (props.saved ? '#34a853' : '#fbbc04')};
  }
`;

const Editor = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const [cursorPositions, setCursorPositions] = useState({});

  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const socketRef = useRef(null);
  const cursorsRef = useRef(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Initialize editor
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: false,
          cursors: {
            transformOnTextChange: true
          }
        },
        placeholder: 'Start typing here...'
      });

      cursorsRef.current = quillRef.current.getModule('cursors');

      // Disable editor until document is loaded
      quillRef.current.disable();

      // Handle text changes
      quillRef.current.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
          setSaved(false);

          // Send changes to server
          if (socketRef.current) {
            socketRef.current.emit('document-change', {
              documentId: id,
              content: quillRef.current.root.innerHTML,
              delta
            });
          }
        }
      });

      // Handle selection changes for cursor tracking
      quillRef.current.on('selection-change', (range) => {
        if (range && socketRef.current) {
          socketRef.current.emit('cursor-position', {
            documentId: id,
            position: range
          });
        }
      });
    }

    return () => {
      // Clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  // Fetch document and set up socket connection
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/documents/${id}`);
        setDocument(response.data.document);
        setTitle(response.data.document.title);

        // Initialize socket connection
        socketRef.current = initSocket();

        if (socketRef.current) {
          // Join document room
          socketRef.current.emit('join-document', { documentId: id });

          // Listen for document changes
          socketRef.current.on('load-document', ({ content, title }) => {
            if (quillRef.current) {
              quillRef.current.enable();
              quillRef.current.root.innerHTML = content;
              setTitle(title);
            }
          });

          socketRef.current.on('document-change', ({ content, delta, user }) => {
            if (quillRef.current && user.id !== currentUser.id) {
              // Temporarily disable text-change listener to prevent infinite loop
              quillRef.current.off('text-change');
              quillRef.current.updateContents(delta);
              quillRef.current.on('text-change', (delta, oldDelta, source) => {
                if (source === 'user') {
                  setSaved(false);

                  // Send changes to server
                  if (socketRef.current) {
                    socketRef.current.emit('document-change', {
                      documentId: id,
                      content: quillRef.current.root.innerHTML,
                      delta
                    });
                  }
                }
              });
            }
          });

          socketRef.current.on('title-change', ({ title }) => {
            setTitle(title);
          });

          socketRef.current.on('active-users', ({ users }) => {
            setActiveUsers(users);
          });

          socketRef.current.on('cursor-position', ({ id, username, position, color }) => {
            if (cursorsRef.current) {
              cursorsRef.current.createCursor(id, username, color);
              cursorsRef.current.moveCursor(id, position);

              setCursorPositions(prev => ({
                ...prev,
                [id]: { username, position, color }
              }));
            }
          });

          socketRef.current.on('error', ({ message }) => {
            setError(message);
          });
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Failed to load document. Please try again.');
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();

    // Set up autosave
    const autosaveInterval = setInterval(() => {
      if (quillRef.current && !saved) {
        handleSave();
      }
    }, 5000);

    return () => {
      clearInterval(autosaveInterval);
      if (socketRef.current) {
        socketRef.current.off('load-document');
        socketRef.current.off('document-change');
        socketRef.current.off('title-change');
        socketRef.current.off('active-users');
        socketRef.current.off('cursor-position');
        socketRef.current.off('error');
      }
    };
  }, [id, currentUser, navigate]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setSaved(false);

    // Emit title change to server
    if (socketRef.current) {
      socketRef.current.emit('title-change', {
        documentId: id,
        title: e.target.value
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!quillRef.current) return;

      await api.put(`/api/documents/${id}`, {
        title,
        content: quillRef.current.root.innerHTML
      });

      setSaved(true);
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  if (loading) {
    return (
      <EditorContainer>
        <Navbar />
        <EditorContent>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading document...</p>
          </div>
        </EditorContent>
      </EditorContainer>
    );
  }

  if (error) {
    return (
      <EditorContainer>
        <Navbar />
        <EditorContent>
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')}>Back to Dashboard</button>
          </div>
        </EditorContent>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer>
      <Navbar />
      <EditorContent>
        <EditorHeader>
          <TitleInput
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled Document"
          />
          <Collaborators activeUsers={activeUsers} />
        </EditorHeader>

        <Toolbar quill={quillRef.current} />

        <EditorWrapper>
          <div ref={editorRef} />
          <StatusBar>
            <SaveStatus saved={saved}>
              <div className="status-dot"></div>
              {saved ? 'All changes saved' : 'Saving...'}
            </SaveStatus>
            <div>
              Last modified: {formatDate(document?.lastModified)}
            </div>
          </StatusBar>
        </EditorWrapper>
      </EditorContent>
    </EditorContainer>
  );
};

export default Editor;
