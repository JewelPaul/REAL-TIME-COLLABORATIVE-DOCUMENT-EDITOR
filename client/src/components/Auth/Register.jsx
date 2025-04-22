import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate form fields on change
  useEffect(() => {
    validateField('confirmPassword', confirmPassword);
  }, [password, confirmPassword]);

  const validateField = (field, value) => {
    let errors = { ...validationErrors };

    switch (field) {
      case 'username':
        errors.username = value.length < 3 ? 'Username must be at least 3 characters' : '';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        errors.email = !emailRegex.test(value) ? 'Please enter a valid email address' : '';
        break;
      case 'password':
        errors.password = value.length < 6 ? 'Password must be at least 6 characters' : '';
        break;
      case 'confirmPassword':
        errors.confirmPassword = value !== password ? 'Passwords do not match' : '';
        break;
      default:
        break;
    }

    setValidationErrors(errors);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Update state based on input id
    switch (id) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    // Validate the field
    validateField(id, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors
    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    if (hasErrors) {
      setError('Please fix the form errors before submitting');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);

      console.log('Submitting registration with:', { username, email, password });

      await register(username, email, password);

      console.log('Registration successful');
      setSuccess(true);

      // Delay navigation to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Registration error in component:', error);

      // More detailed error handling
      if (error.response) {
        console.log('Error response:', error.response);
        setError(
          error.response.data?.message ||
          'Failed to create an account. Please try again.'
        );
      } else if (error.request) {
        console.log('Error request:', error.request);
        setError('No response received from server. Please check your connection.');
      } else {
        console.log('Error message:', error.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-logo">DocCollab</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              className={`form-input ${validationErrors.username ? 'input-error' : ''}`}
              type="text"
              id="username"
              value={username}
              onChange={handleChange}
              required
              minLength={3}
              placeholder="Enter your username"
            />
            {validationErrors.username && (
              <div className="field-error-message">{validationErrors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
            />
            {validationErrors.email && (
              <div className="field-error-message">{validationErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className={`form-input ${validationErrors.password ? 'input-error' : ''}`}
              type="password"
              id="password"
              value={password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Enter your password"
            />
            {validationErrors.password && (
              <div className="field-error-message">{validationErrors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className={`form-input ${validationErrors.confirmPassword ? 'input-error' : ''}`}
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
            {validationErrors.confirmPassword && (
              <div className="field-error-message">{validationErrors.confirmPassword}</div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Account created successfully! Redirecting...</div>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
