import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEdit, FaUsers, FaLock, FaMobileAlt, FaCloudUploadAlt } from 'react-icons/fa';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [isCreating, setIsCreating] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    // Store email in localStorage
    localStorage.setItem('userEmail', email);
    
    if (isCreating) {
      // Create a new document and redirect to it
      const newDocId = 'doc_' + Date.now();
      navigate(`/editor/${newDocId}`);
    } else {
      // Join existing document
      if (!documentId) {
        alert('Please enter a document ID');
        return;
      }
      navigate(`/editor/${documentId}`);
    }
  };

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <Logo>DocCollab</Logo>
          <HeroTitle>Real-Time Collaborative Document Editing</HeroTitle>
          <HeroSubtitle>
            Create, edit, and collaborate on documents in real-time with your team.
          </HeroSubtitle>
          
          <FormContainer>
            <FormTabs>
              <FormTab 
                active={isCreating} 
                onClick={() => setIsCreating(true)}
              >
                Create Document
              </FormTab>
              <FormTab 
                active={!isCreating} 
                onClick={() => setIsCreating(false)}
              >
                Join Document
              </FormTab>
            </FormTabs>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="email">Your Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormGroup>
              
              {!isCreating && (
                <FormGroup>
                  <Label htmlFor="documentId">Document ID</Label>
                  <Input
                    type="text"
                    id="documentId"
                    placeholder="Enter document ID"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    required={!isCreating}
                  />
                </FormGroup>
              )}
              
              <SubmitButton type="submit">
                {isCreating ? 'Create New Document' : 'Join Document'}
              </SubmitButton>
            </Form>
          </FormContainer>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Key Features</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FaEdit />
            </FeatureIcon>
            <FeatureTitle>Real-Time Editing</FeatureTitle>
            <FeatureDescription>
              See changes as they happen with real-time collaborative editing.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaUsers />
            </FeatureIcon>
            <FeatureTitle>Team Collaboration</FeatureTitle>
            <FeatureDescription>
              Invite team members to view or edit your documents.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaLock />
            </FeatureIcon>
            <FeatureTitle>Secure Access</FeatureTitle>
            <FeatureDescription>
              Control who can view or edit your documents with permission settings.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaMobileAlt />
            </FeatureIcon>
            <FeatureTitle>Mobile Friendly</FeatureTitle>
            <FeatureDescription>
              Access and edit your documents from any device, anywhere.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaCloudUploadAlt />
            </FeatureIcon>
            <FeatureTitle>Cloud Storage</FeatureTitle>
            <FeatureDescription>
              Your documents are securely stored in the cloud and accessible anytime.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <Footer>
        <FooterContent>
          <FooterLogo>DocCollab</FooterLogo>
          <FooterCopyright>
            &copy; {new Date().getFullYear()} DocCollab. All rights reserved.
          </FooterCopyright>
        </FooterContent>
      </Footer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  background: linear-gradient(135deg, #1a73e8 0%, #6c5ce7 100%);
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 600px;

  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -100px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 60px 20px;
    min-height: auto;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  position: relative;
  z-index: 1;
  animation: fadeIn 1s ease-in-out;
  text-align: center;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background-color: white;
    border-radius: 2px;
  }
`;

const HeroTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1.2s ease-in-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 90%;
  margin: 0 auto 40px;
  animation: fadeIn 1.4s ease-in-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 30px;
  max-width: 500px;
  margin: 0 auto;
  animation: fadeIn 1.6s ease-in-out;
  animation-delay: 0.6s;
  animation-fill-mode: both;
`;

const FormTabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e8eaed;
`;

const FormTab = styled.button`
  flex: 1;
  background: none;
  border: none;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.active ? '#1a73e8' : '#5f6368'};
  cursor: pointer;
  position: relative;
  transition: all 0.3s;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.active ? '#1a73e8' : 'transparent'};
    transition: all 0.3s;
  }

  &:hover {
    color: #1a73e8;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #202124;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #e8eaed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
  }

  &::placeholder {
    color: #9aa0a6;
  }
`;

const SubmitButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;

  &:hover {
    background-color: #1557b0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FeaturesSection = styled.section`
  padding: 100px 40px;
  background-color: white;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -80px;
    left: 0;
    right: 0;
    height: 80px;
    background: white;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  }

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  color: #202124;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: #1a73e8;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 40px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  border-bottom: 4px solid transparent;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background-color: #1a73e8;
    transition: height 0.4s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
    border-bottom: 4px solid #1a73e8;

    &::before {
      height: 100%;
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: #1a73e8;
  margin-bottom: 25px;
  background-color: rgba(26, 115, 232, 0.1);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  ${FeatureCard}:hover & {
    background-color: #1a73e8;
    color: white;
    transform: scale(1.1);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #202124;
  transition: color 0.3s ease;

  ${FeatureCard}:hover & {
    color: #1a73e8;
  }
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #5f6368;
  line-height: 1.7;
  transition: color 0.3s ease;

  ${FeatureCard}:hover & {
    color: #202124;
  }
`;

const Footer = styled.footer`
  background-color: #1a1a2e;
  padding: 60px 40px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #1a73e8, #6c5ce7, #1a73e8);
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterLogo = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  background: linear-gradient(90deg, #1a73e8, #6c5ce7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FooterCopyright = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
`;

export default HomePage;
