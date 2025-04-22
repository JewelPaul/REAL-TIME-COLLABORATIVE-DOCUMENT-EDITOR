import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEdit, FaUsers, FaLock, FaMobileAlt, FaCloudUploadAlt } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <LandingContainer>
      <HeroSection>
        <HeroContent>
          <Logo>DocCollab</Logo>
          <HeroTitle>Real-Time Collaborative Document Editing</HeroTitle>
          <HeroSubtitle>
            Create, edit, and collaborate on documents in real-time with your team.
          </HeroSubtitle>
          <ButtonGroup>
            <PrimaryButton as={Link} to="/login">
              Sign In
            </PrimaryButton>
            <SecondaryButton as={Link} to="/register">
              Create Account
            </SecondaryButton>
          </ButtonGroup>
        </HeroContent>
        <HeroImage src="/hero-image.svg" alt="Document Collaboration" />
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

      <CTASection>
        <CTAContent>
          <CTATitle>Ready to get started?</CTATitle>
          <CTADescription>
            Join thousands of teams who use DocCollab to collaborate on documents.
          </CTADescription>
          <PrimaryButton as={Link} to="/register">
            Create Free Account
          </PrimaryButton>
        </CTAContent>
      </CTASection>

      <Footer>
        <FooterContent>
          <FooterLogo>DocCollab</FooterLogo>
          <FooterLinks>
            <FooterLink as={Link} to="/login">Sign In</FooterLink>
            <FooterLink as={Link} to="/register">Register</FooterLink>
            <FooterLink as="a" href="#">Privacy Policy</FooterLink>
            <FooterLink as="a" href="#">Terms of Service</FooterLink>
          </FooterLinks>
          <FooterCopyright>
            &copy; {new Date().getFullYear()} DocCollab. All rights reserved.
          </FooterCopyright>
        </FooterContent>
      </Footer>
    </LandingContainer>
  );
};

// Styled Components
const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 100px 60px;
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

  @media (max-width: 1200px) {
    padding: 80px 40px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 60px 20px;
    text-align: center;
    min-height: auto;
  }
`;

const HeroContent = styled.div`
  max-width: 550px;
  position: relative;
  z-index: 1;
  animation: fadeIn 1s ease-in-out;
  padding-right: 20px;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1200px) {
    max-width: 500px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 50px;
    padding-right: 0;
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
    left: 0;
    width: 60px;
    height: 4px;
    background-color: white;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const HeroTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1.2s ease-in-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;

  @media (max-width: 1200px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 90%;
  animation: fadeIn 1.4s ease-in-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 100%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  animation: fadeIn 1.6s ease-in-out;
  animation-delay: 0.6s;
  animation-fill-mode: both;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PrimaryButton = styled.button`
  background-color: white;
  color: #1a73e8;
  border: none;
  border-radius: 30px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    text-decoration: none;

    &:before {
      left: 100%;
    }
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 30px;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
    text-decoration: none;
  }
`;

const HeroImage = styled.img`
  max-width: 550px;
  width: 100%;
  height: auto;
  position: relative;
  z-index: 1;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1.8s ease-in-out;
  animation-delay: 0.8s;
  animation-fill-mode: both;
  transition: transform 0.5s ease;

  &:hover {
    transform: translateY(-10px);
  }

  @media (max-width: 1200px) {
    max-width: 500px;
  }

  @media (max-width: 992px) {
    max-width: 450px;
  }

  @media (max-width: 768px) {
    max-width: 90%;
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

const CTASection = styled.section`
  background: linear-gradient(135deg, #1a73e8 0%, #6c5ce7 100%);
  padding: 100px 40px;
  position: relative;
  overflow: hidden;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
  }

  &::before {
    top: -150px;
    right: -50px;
  }

  &::after {
    bottom: -150px;
    left: -50px;
    width: 400px;
    height: 400px;
  }

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: fadeIn 1s ease-in-out;
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 25px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background-color: white;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 50px;
  line-height: 1.7;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 1.2s ease-in-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 100%;
  }
`;

const Footer = styled.footer`
  background-color: #1a1a2e;
  padding: 80px 40px 60px;
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
    padding: 60px 20px 40px;
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
  margin-bottom: 30px;
  position: relative;
  display: inline-block;
  background: linear-gradient(90deg, #1a73e8, #6c5ce7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s;
  position: relative;
  padding: 5px 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #1a73e8;
    transition: width 0.3s ease;
  }

  &:hover {
    color: white;
    text-decoration: none;
    transform: translateY(-2px);

    &::after {
      width: 100%;
    }
  }
`;

const FooterCopyright = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
`;

export default LandingPage;
