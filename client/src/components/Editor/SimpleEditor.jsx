import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaShare, FaUsers, FaSave, FaDownload } from 'react-icons/fa';
import { io } from 'socket.io-client';
import { Editor } from '@tinymce/tinymce-react';

const SimpleEditor = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  const [collaborators, setCollaborators] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const socketRef = useRef(null);
  const editorRef = useRef(null);

  // Initialize user email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/');
      return;
    }
    setUserEmail(email);
  }, [navigate]);

  // Initialize socket connection
  useEffect(() => {
    if (!userEmail) return;

    // Connect to socket server
    socketRef.current = io('http://localhost:5002', {
      query: {
        documentId,
        userEmail
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    });

    // Set up socket event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);

      // Join document room
      socketRef.current.emit('join-document', { documentId, userEmail });
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);

      // Re-join document room after reconnection
      socketRef.current.emit('join-document', { documentId, userEmail });
    });

    socketRef.current.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
    });

    socketRef.current.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    socketRef.current.on('reconnect_failed', () => {
      console.error('Failed to reconnect');
      setIsConnected(false);
    });

    socketRef.current.on('document-data', (data) => {
      if (data.content !== undefined) {
        setContent(data.content);
      }
      if (data.title) {
        setTitle(data.title);
      }
    });

    socketRef.current.on('content-change', (data) => {
      if (data.sender !== userEmail) {
        console.log('Received content change from', data.sender);
        setContent(data.content);

        // Update the editor content if the editor is initialized
        if (editorRef.current && editorRef.current.editor) {
          try {
            // Temporarily remove the change handler to prevent loops
            const editor = editorRef.current.editor;
            const oldContent = editor.getContent();

            // Only update if content is different to avoid cursor jumps
            if (oldContent !== data.content) {
              // Save selection
              const bookmark = editor.selection.getBookmark(2, true, true);

              // Update content
              editor.setContent(data.content);

              // Restore selection if possible
              editor.selection.moveToBookmark(bookmark);
            }
          } catch (error) {
            console.error('Error updating editor content:', error);
            // Fallback to simple update
            editorRef.current.setContent(data.content);
          }
        }
      }
    });

    socketRef.current.on('title-change', (data) => {
      if (data.sender !== userEmail) {
        setTitle(data.title);
      }
    });

    socketRef.current.on('collaborators-updated', (data) => {
      setCollaborators(data.collaborators);
    });

    socketRef.current.on('document-saved', () => {
      setIsSaving(false);
      setLastSaved(new Date());
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [documentId, userEmail, navigate]);

  // Handle content change
  const handleEditorChange = (content) => {
    setContent(content);

    // Emit content change to server
    if (socketRef.current && socketRef.current.connected) {
      // Debounce the emit to avoid overwhelming the server
      if (editorRef.current.editorChangeTimeout) {
        clearTimeout(editorRef.current.editorChangeTimeout);
      }

      editorRef.current.editorChangeTimeout = setTimeout(() => {
        socketRef.current.emit('content-change', {
          documentId,
          content,
          sender: userEmail
        });
      }, 300); // 300ms debounce
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Emit title change to server
    if (socketRef.current && socketRef.current.connected) {
      // Debounce the emit to avoid overwhelming the server
      if (editorRef.current.titleChangeTimeout) {
        clearTimeout(editorRef.current.titleChangeTimeout);
      }

      editorRef.current.titleChangeTimeout = setTimeout(() => {
        socketRef.current.emit('title-change', {
          documentId,
          title: newTitle,
          sender: userEmail
        });
      }, 300); // 300ms debounce
    }
  };

  // Handle save
  const handleSave = () => {
    setIsSaving(true);

    if (socketRef.current) {
      socketRef.current.emit('save-document', {
        documentId,
        title,
        content,
        userEmail
      });
    }
  };

  // Handle invite
  const handleInvite = (e) => {
    e.preventDefault();

    if (!inviteEmail) {
      alert('Please enter an email address');
      return;
    }

    // Create a Gmail compose URL with pre-filled fields
    const subject = encodeURIComponent(`Invitation to collaborate on "${title}"`);
    const body = encodeURIComponent(
      `Hello,\n\nI'd like to invite you to collaborate on a document "${title}" in DocCollab.\n\n` +
      `Click the link below to access the document:\n` +
      `${window.location.origin}/editor/${documentId}\n\n` +
      `Best regards,\n${userEmail}`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${inviteEmail}&su=${subject}&body=${body}`;

    // Open Gmail in a new tab
    window.open(gmailUrl, '_blank');

    // Add collaborator to the list
    if (socketRef.current) {
      socketRef.current.emit('add-collaborator', {
        documentId,
        email: inviteEmail
      });
    }

    // Close modal and reset form
    setIsInviteModalOpen(false);
    setInviteEmail('');
  };

  // Handle download
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `${title}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <HeaderLeft>
          <HomeButton onClick={() => navigate('/')}>
            <FaHome />
          </HomeButton>
          <TitleInput
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled Document"
          />
        </HeaderLeft>

        <HeaderRight>
          <ConnectionStatus connected={isConnected}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </ConnectionStatus>

          <SaveInfo>
            {isSaving ? 'Saving...' : lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : ''}
          </SaveInfo>

          <ActionButton onClick={() => setIsInviteModalOpen(true)}>
            <FaShare /> Share
          </ActionButton>

          <ActionButton onClick={handleSave}>
            <FaSave /> Save
          </ActionButton>

          <ActionButton onClick={handleDownload}>
            <FaDownload /> Download
          </ActionButton>
        </HeaderRight>
      </EditorHeader>

      <EditorContent>
        <EditorSidebar>
          <CollaboratorsSection>
            <SidebarTitle>
              <FaUsers /> Collaborators
            </SidebarTitle>
            <CollaboratorsList>
              <CollaboratorItem>
                <CollaboratorAvatar>
                  {userEmail.charAt(0).toUpperCase()}
                </CollaboratorAvatar>
                <CollaboratorInfo>
                  <CollaboratorName>You</CollaboratorName>
                  <CollaboratorEmail>{userEmail}</CollaboratorEmail>
                </CollaboratorInfo>
              </CollaboratorItem>

              {collaborators.map((collaborator, index) => (
                collaborator.email !== userEmail && (
                  <CollaboratorItem key={index}>
                    <CollaboratorAvatar>
                      {collaborator.email.charAt(0).toUpperCase()}
                    </CollaboratorAvatar>
                    <CollaboratorInfo>
                      <CollaboratorName>
                        {collaborator.email.split('@')[0]}
                      </CollaboratorName>
                      <CollaboratorEmail>{collaborator.email}</CollaboratorEmail>
                    </CollaboratorInfo>
                  </CollaboratorItem>
                )
              ))}
            </CollaboratorsList>
          </CollaboratorsSection>
        </EditorSidebar>

        <EditorWrapper>
          <Editor
            apiKey="62b6q1k38tg0458fpw7l2fipmxrsq7sb6vkp06rnyw9o6l0z"
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={content || "<p>Start typing your document here...</p>"}
            value={content}
            onEditorChange={handleEditorChange}
            init={{
              height: '100%',
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </EditorWrapper>
      </EditorContent>

      {isInviteModalOpen && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <h2>Invite Collaborator</h2>
              <CloseButton onClick={() => setIsInviteModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            <ModalContent>
              <form onSubmit={handleInvite}>
                <FormGroup>
                  <Label htmlFor="inviteEmail">Email Address</Label>
                  <Input
                    type="email"
                    id="inviteEmail"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </FormGroup>
                <ModalActions>
                  <CancelButton type="button" onClick={() => setIsInviteModalOpen(false)}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit">
                    Send Invitation
                  </SubmitButton>
                </ModalActions>
              </form>
            </ModalContent>
          </Modal>
        </ModalOverlay>
      )}
    </EditorContainer>
  );
};

// Styled Components
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
`;

const EditorHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  border-bottom: 1px solid #e8eaed;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const HomeButton = styled.button`
  background: none;
  border: none;
  color: #5f6368;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #1a73e8;
  }
`;

const TitleInput = styled.input`
  font-size: 1.2rem;
  font-weight: 500;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  width: 300px;
  transition: all 0.2s;

  &:hover, &:focus {
    background-color: #f1f3f4;
    outline: none;
  }
`;

const ConnectionStatus = styled.div`
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${props => props.connected ? 'rgba(52, 168, 83, 0.1)' : 'rgba(217, 48, 37, 0.1)'};
  color: ${props => props.connected ? '#34a853' : '#d93025'};
  display: flex;
  align-items: center;
  gap: 5px;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.connected ? '#34a853' : '#d93025'};
  }
`;

const SaveInfo = styled.div`
  font-size: 0.8rem;
  color: #5f6368;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f1f3f4;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #202124;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e8eaed;
  }
`;

const EditorContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const EditorSidebar = styled.div`
  width: 250px;
  background-color: white;
  border-right: 1px solid #e8eaed;
  padding: 20px;
  overflow-y: auto;
`;

const SidebarTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #202124;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CollaboratorsSection = styled.div`
  margin-bottom: 30px;
`;

const CollaboratorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CollaboratorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f3f4;
  }
`;

const CollaboratorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const CollaboratorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CollaboratorName = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #202124;
`;

const CollaboratorEmail = styled.div`
  font-size: 0.8rem;
  color: #5f6368;
`;

const EditorWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e8eaed;

  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #202124;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #5f6368;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

const ModalContent = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #202124;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e8eaed;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #5f6368;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f3f4;
  }
`;

const SubmitButton = styled.button`
  background-color: #1a73e8;
  border: none;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #1557b0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  }
`;

export default SimpleEditor;
