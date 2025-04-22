import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';

const NavbarContainer = styled.nav`
  background-color: #1a73e8;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  color: #1a73e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #f1f3f4;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const UserInfo = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f1f3f4;
`;

const UserName = styled.p`
  font-weight: 600;
  color: #202124;
  margin-bottom: 4px;
`;

const UserEmail = styled.p`
  color: #5f6368;
  font-size: 0.9rem;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: #202124;

  &:hover {
    background-color: #f1f3f4;
  }

  svg {
    color: #5f6368;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1a73e8;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transform: ${props => (props.isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease-in-out;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const MobileMenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MobileNavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 12px 0;
`;

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/dashboard">DocCollab</Logo>

        <NavLinks>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </NavLinks>

        <UserMenu>
          <UserAvatar onClick={toggleUserMenu}>
            {currentUser?.username ? getInitials(currentUser.username) : <FiUser />}
          </UserAvatar>

          <UserDropdown isOpen={userMenuOpen}>
            <UserInfo>
              <UserName>{currentUser?.username}</UserName>
              <UserEmail>{currentUser?.email}</UserEmail>
            </UserInfo>
            <DropdownItem onClick={handleLogout}>
              <FiLogOut size={18} /> Logout
            </DropdownItem>
          </UserDropdown>
        </UserMenu>

        <MobileMenuButton onClick={toggleMobileMenu}>
          <FiMenu size={24} />
        </MobileMenuButton>
      </NavbarContent>

      <MobileMenu isOpen={mobileMenuOpen}>
        <MobileMenuHeader>
          <Logo to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            DocCollab
          </Logo>
          <MobileMenuButton onClick={toggleMobileMenu}>
            <FiX size={24} />
          </MobileMenuButton>
        </MobileMenuHeader>

        <MobileMenuLinks>
          <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </MobileNavLink>
          <MobileNavLink as="button" onClick={() => {
            handleLogout();
            setMobileMenuOpen(false);
          }}>
            Logout
          </MobileNavLink>
        </MobileMenuLinks>
      </MobileMenu>
    </NavbarContainer>
  );
};

export default Navbar;
