const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration API...');
    const response = await axios.post('http://localhost:5002/api/auth/register', {
      username: 'testuser3',
      email: 'test3@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful!');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration failed!');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

async function testLogin() {
  try {
    console.log('Testing login API...');
    const response = await axios.post('http://localhost:5002/api/auth/login', {
      email: 'test3@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed!');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

async function runTests() {
  try {
    // Test registration
    await testRegistration();
    
    // Test login
    await testLogin();
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Tests failed!');
  }
}

runTests();
