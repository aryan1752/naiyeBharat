// API Base URL - Make sure this matches your backend port
const API_URL = 'http://localhost:3000/api';

// Get form elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const formTitle = document.getElementById('formTitle');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const googleLogin = document.getElementById('googleLogin');
const googleSignup = document.getElementById('googleSignup');

// Switch to Sign Up form
switchToSignup.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
  formTitle.textContent = 'Sign Up';
});

// Switch to Login form
switchToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  signupForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  formTitle.textContent = 'Login';
});

// Handle Login Form Submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  // Basic validation
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || { name: data.name, email: data.email }));
      
      alert('Login successful!');
      
      // Redirect to home page
      window.location.href = 'index.html';
    } else {
      alert(data.message || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Cannot connect to server. Please make sure the backend is running on port 3000.');
  }
});

// Handle Sign Up Form Submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  // Basic validation
  if (!name || !email || !password) {
    alert('Please fill in all fields');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters long');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Sign up successful! Please login with your credentials.');
      
      // Switch to login form
      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      formTitle.textContent = 'Login';
      
      // Clear signup form
      signupForm.reset();
      
      // Pre-fill login email
      document.getElementById('loginEmail').value = email;
    } else {
      alert(data.message || 'Sign up failed. Please try again.');
    }
  } catch (error) {
    console.error('Sign up error:', error);
    alert('Cannot connect to server. Please make sure the backend is running on port 3000.');
  }
});

// Google Login
googleLogin.addEventListener('click', () => {
  alert('Google login will be implemented with Firebase/Passport.js');
  // TODO: Implement Google OAuth
  // window.location.href = `${API_URL}/auth/google`;
});

// Google Sign Up
googleSignup.addEventListener('click', () => {
  alert('Google sign up will be implemented with Firebase/Passport.js');
  // TODO: Implement Google OAuth
  // window.location.href = `${API_URL}/auth/google`;
});

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname;
  
  // If user is logged in and on login page, redirect to home
  if (token && currentPage.includes('login.html')) {
    const confirmRedirect = confirm('You are already logged in. Go to home page?');
    if (confirmRedirect) {
      window.location.href = 'index.html';
    }
  }
});