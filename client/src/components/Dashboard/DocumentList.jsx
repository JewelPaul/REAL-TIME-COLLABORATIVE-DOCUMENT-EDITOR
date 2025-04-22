import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiEdit2, FiTrash2, FiShare2, FiMoreVertical } from 'react-icons/fi';
import api from '../../services/api';

const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    gap: 15px;
  }
`;

const DocumentCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s, transform 0.3s;
  overflow: hidden;
  position: relative;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const DocumentPreview = styled(Link)`
  display: block;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  height: 200px;
`;

const DocumentTitle = styled.h3`
  margin-bottom: 10px;
  color: #202124;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DocumentDate = styled.p`
  color: #5f6368;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const DocumentContent = styled.div`
  color: #5f6368;
  font-size: 0.9rem;
  height: 100px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: linear-gradient(transparent, white);
  }
`;

const DocumentFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid #f1f3f4;
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 15px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #5f6368;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f1f3f4;
    color: #1a73e8;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 10px;
  top: 50px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 15px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f1f3f4;
  }

  svg {
    color: #5f6368;
  }
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const DialogContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const DialogTitle = styled.h3`
  margin-bottom: 15px;
  color: #202124;
`;

const DialogText = styled.p`
  margin-bottom: 20px;
  color: #5f6368;
`;

const DialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelButton = styled.button`
  background-color: #f1f3f4;
  color: #5f6368;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #e8eaed;
  }
`;

const DeleteButton = styled.button`
  background-color: #d93025;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #c5221f;
  }
`;

const DocumentList = ({ documents, onRefresh }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteDialogId, setDeleteDialogId] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteClick = (id) => {
    setOpenMenuId(null);
    setDeleteDialogId(id);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/documents/${deleteDialogId}`);
      setDeleteDialogId(null);
      onRefresh();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogId(null);
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <>
      <DocumentGrid>
        {documents.map((document) => (
          <DocumentCard key={document._id}>
            <DocumentPreview to={`/documents/${document._id}`}>
              <DocumentTitle>{document.title}</DocumentTitle>
              <DocumentDate>
                Last modified: {formatDate(document.lastModified)}
              </DocumentDate>
              <DocumentContent>
                {stripHtml(document.content)}
              </DocumentContent>
            </DocumentPreview>
            <DocumentFooter>
              <DocumentDate>
                Created: {formatDate(document.createdAt)}
              </DocumentDate>
              <DocumentActions>
                <ActionButton
                  onClick={() => handleMenuToggle(document._id)}
                  aria-label="More options"
                >
                  <FiMoreVertical size={18} />
                </ActionButton>
                <DropdownMenu isOpen={openMenuId === document._id}>
                  <DropdownItem as={Link} to={`/documents/${document._id}`}>
                    <FiEdit2 size={16} /> Edit Document
                  </DropdownItem>
                  <DropdownItem onClick={() => handleDeleteClick(document._id)}>
                    <FiTrash2 size={16} /> Delete Document
                  </DropdownItem>
                </DropdownMenu>
              </DocumentActions>
            </DocumentFooter>
          </DocumentCard>
        ))}
      </DocumentGrid>

      {deleteDialogId && (
        <ConfirmDialog>
          <DialogContent>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogText>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogText>
            <DialogButtons>
              <CancelButton onClick={handleDeleteCancel}>Cancel</CancelButton>
              <DeleteButton onClick={handleDeleteConfirm}>Delete</DeleteButton>
            </DialogButtons>
          </DialogContent>
        </ConfirmDialog>
      )}
    </>
  );
};

export default DocumentList;
