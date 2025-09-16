// Simple test script to verify API connection
const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function testAPI() {
  try {
    console.log('Testing API connection...');
    console.log('API URL:', API_BASE_URL);
    
    // Test health endpoint
    const healthResponse = await fetch('http://127.0.0.1:8000/health');
    console.log('Health endpoint status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health response:', healthData);
    }
    
    // Test auth endpoint
    const authResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    console.log('Auth endpoint status:', authResponse.status);
    
    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      console.log('Auth error response:', errorData);
    }
    
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAPI();
