import { useState } from 'react';
import styled from 'styled-components';
import { FiUsers, FiUserPlus, FiX } from 'react-icons/fi';
import api from '../../services/api';

const CollaboratorsContainer = styled.div`
  position: relative;
`;

const CollaboratorsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f1f3f4;
  color: #5f6368;
  border: none;
  border-radius: 24px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e8eaed;
  }
`;

const AvatarGroup = styled.div`
  display: flex;
  margin-right: 8px;
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.color || '#1a73e8'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  margin-left: -8px;
  border: 2px solid white;
  
  &:first-child {
    margin-left: 0;
  }
`;

const CollaboratorsPanel = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 100;
  overflow: hidden;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f1f3f4;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #202124;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #5f6368;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f1f3f4;
  }
`;

const ActiveUsersList = styled.div`
  padding: 16px;
  max-height: 200px;
  overflow-y: auto;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.p`
  margin: 0;
  font-weight: 500;
  color: #202124;
`;

const UserStatus = styled.p`
  margin: 0;
  font-size: 12px;
  color: #5f6368;
`;

const AddCollaboratorForm = styled.form`
  padding: 16px;
  border-top: 1px solid #f1f3f4;
`;

const FormTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #202124;
`;

const FormGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e8eaed;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e8eaed;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

const AddButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #1557b0;
  }
  
  &:disabled {
    background-color: #a8c7fa;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #d93025;
  font-size: 12px;
  margin: 8px 0 0 0;
`;

const Collaborators = ({ activeUsers }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('read');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  
  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter an email address');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Get document ID from URL
      const documentId = window.location.pathname.split('/').pop();
      
      await api.post(`/api/documents/${documentId}/collaborators`, {
        email,
        permission
      });
      
      setEmail('');
      setPermission('read');
    } catch (error) {
      console.error('Error adding collaborator:', error);
      setError(
        error.response?.data?.message || 
        'Failed to add collaborator. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <CollaboratorsContainer>
      <CollaboratorsButton onClick={togglePanel}>
        <AvatarGroup>
          {activeUsers.slice(0, 3).map((user, index) => (
            <Avatar key={user.id} color={getRandomColor(user.id)}>
              {getInitials(user.username)}
            </Avatar>
          ))}
        </AvatarGroup>
        {activeUsers.length} {activeUsers.length === 1 ? 'user' : 'users'} active
      </CollaboratorsButton>
      
      <CollaboratorsPanel isOpen={isPanelOpen}>
        <PanelHeader>
          <PanelTitle>Collaborators</PanelTitle>
          <CloseButton onClick={togglePanel}>
            <FiX size={20} />
          </CloseButton>
        </PanelHeader>
        
        <ActiveUsersList>
          {activeUsers.length === 0 ? (
            <p>No active users</p>
          ) : (
            activeUsers.map(user => (
              <UserItem key={user.id}>
                <Avatar color={getRandomColor(user.id)}>
                  {getInitials(user.username)}
                </Avatar>
                <UserInfo>
                  <Username>{user.username}</Username>
                  <UserStatus>Active now</UserStatus>
                </UserInfo>
              </UserItem>
            ))
          )}
        </ActiveUsersList>
        
        <AddCollaboratorForm onSubmit={handleAddCollaborator}>
          <FormTitle>Add Collaborators</FormTitle>
          <FormGroup>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            >
              <option value="read">Can view</option>
              <option value="write">Can edit</option>
              <option value="admin">Admin</option>
            </Select>
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <AddButton type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </AddButton>
        </AddCollaboratorForm>
      </CollaboratorsPanel>
    </CollaboratorsContainer>
  );
};

// Helper function to generate a consistent color based on user ID
const getRandomColor = (userId) => {
  const colors = [
    '#1a73e8', '#ea4335', '#34a853', '#fbbc04', 
    '#ff6d01', '#46bdc6', '#7baaf7', '#f07b72',
    '#33b679', '#f6c453', '#f8971c', '#0097a7'
  ];
  
  // Simple hash function to get a consistent index
  const hash = userId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return colors[hash % colors.length];
};

export default Collaborators;
