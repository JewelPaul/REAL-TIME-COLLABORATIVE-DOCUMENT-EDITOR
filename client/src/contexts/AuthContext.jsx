import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Error fetching current user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setError('');
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password
      });

      console.log('Registration response:', response.data);

      // Extract token and user from the response
      const responseData = response.data;
      console.log('Response data structure:', JSON.stringify(responseData));

      // Check if the response has a success property
      let token, user;
      if (responseData.success) {
        token = responseData.token;
        user = responseData.user;
      } else {
        token = responseData.token;
        user = responseData.user;
      }
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);

      // Extract token and user from the response
      const responseData = response.data;
      console.log('Response data structure:', JSON.stringify(responseData));

      // Check if the response has a success property
      let token, user;
      if (responseData.success) {
        token = responseData.token;
        user = responseData.user;
      } else {
        token = responseData.token;
        user = responseData.user;
      }
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
