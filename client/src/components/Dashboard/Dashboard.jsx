import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import DocumentList from './DocumentList';
import Navbar from '../Common/Navbar';
import styled from 'styled-components';
import { FiPlus, FiSearch } from 'react-icons/fi';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  color: #202124;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 24px;
  padding: 8px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 1;
  max-width: 400px;

  svg {
    color: #5f6368;
    margin-right: 8px;
  }

  input {
    border: none;
    outline: none;
    font-size: 16px;
    width: 100%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1557b0;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  h2 {
    margin-bottom: 16px;
    color: #202124;
  }

  p {
    margin-bottom: 24px;
    color: #5f6368;
    max-width: 500px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/documents');
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    try {
      const response = await api.post('/api/documents', {
        title: 'Untitled Document',
        content: '<p>Start typing here...</p>'
      });

      navigate(`/documents/${response.data.document._id}`);
    } catch (error) {
      console.error('Error creating document:', error);
      setError('Failed to create document. Please try again.');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardContainer>
      <Navbar />
      <DashboardContent>
        <DashboardHeader>
          <DashboardTitle>My Documents</DashboardTitle>
          <SearchBar>
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          <CreateButton onClick={handleCreateDocument}>
            <FiPlus size={18} />
            New Document
          </CreateButton>
        </DashboardHeader>

        {loading ? (
          <LoadingContainer>
            <div className="loading-spinner"></div>
          </LoadingContainer>
        ) : error ? (
          <EmptyState>
            <h2>Error Loading Documents</h2>
            <p>{error}</p>
            <CreateButton onClick={fetchDocuments}>Try Again</CreateButton>
          </EmptyState>
        ) : documents.length === 0 ? (
          <EmptyState>
            <h2>No Documents Yet</h2>
            <p>Create your first document to get started with real-time collaborative editing.</p>
            <CreateButton onClick={handleCreateDocument}>
              <FiPlus size={18} />
              Create Your First Document
            </CreateButton>
          </EmptyState>
        ) : (
          <DocumentList
            documents={filteredDocuments}
            onRefresh={fetchDocuments}
          />
        )}
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;
