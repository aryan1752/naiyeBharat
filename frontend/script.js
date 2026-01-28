// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Initialize Firebase (fetch config from backend)
let auth;
let googleProvider;

async function initializeFirebase() {
  try {
    const response = await fetch('/api/config/firebase');
    const firebaseConfig = await response.json();
    
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    console.log('✅ Firebase initialized');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
}

// Initialize Firebase before anything else
await initializeFirebase();

// API Base URL
const API_URL = '/api';

// Get form elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const otpLoginForm = document.getElementById('otpLoginForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const formTitle = document.getElementById('formTitle');

// Helper function to show error/success messages
function showMessage(message, formElement, type = 'error') {
  const existingMsg = formElement.querySelector('.message');
  if (existingMsg) existingMsg.remove();
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}-message`;
  msgDiv.style.padding = '10px';
  msgDiv.style.marginTop = '10px';
  msgDiv.style.borderRadius = '5px';
  msgDiv.style.color = type === 'error' ? 'red' : 'green';
  msgDiv.style.backgroundColor = type === 'error' ? '#ffe6e6' : '#e6ffe6';
  msgDiv.textContent = message;
  formElement.appendChild(msgDiv);
  
  setTimeout(() => msgDiv.remove(), 5000);
}

// Hide all forms
function hideAllForms() {
  [loginForm, signupForm, otpLoginForm, forgotPasswordForm].forEach(form => {
    if (form) form.classList.add('hidden');
  });
}

// Google Sign-In Handler
async function handleGoogleSignIn(isSignup = false) {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log('Google Sign-In Success');
    
    // Get Firebase ID token
    const idToken = await user.getIdToken();
    
    // Send to backend
    const endpoint = isSignup ? '/google-signup' : '/google-login';
    const response = await fetch(`${API_URL}/auth${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUID: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        idToken: idToken
      }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login successful!');
      window.location.href = 'index.html';
    } else {
      alert(data.message || 'Authentication failed');
    }
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    
    if (error.code === 'auth/popup-closed-by-user') {
      alert('Sign-in popup was closed');
    } else if (error.code === 'auth/cancelled-popup-request') {
      alert('Sign-in cancelled');
    } else {
      alert('Google Sign-In failed: ' + error.message);
    }
  }
}

// Switch to Sign Up form
document.getElementById('switchToSignup')?.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllForms();
  signupForm.classList.remove('hidden');
  formTitle.textContent = 'Sign Up';
});

// Switch to Login form
document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllForms();
  loginForm.classList.remove('hidden');
  formTitle.textContent = 'Login';
});

// Switch to OTP Login
document.getElementById('otpLoginBtn')?.addEventListener('click', () => {
  hideAllForms();
  otpLoginForm.classList.remove('hidden');
  formTitle.textContent = 'Login with OTP';
});

// Back to Login from OTP
document.getElementById('backToLogin')?.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllForms();
  loginForm.classList.remove('hidden');
  formTitle.textContent = 'Login';
});

// Switch to Forgot Password
document.getElementById('forgotPassword')?.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllForms();
  forgotPasswordForm.classList.remove('hidden');
  formTitle.textContent = 'Reset Password';
});

// Back to Login from Reset
document.getElementById('backToLoginFromReset')?.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllForms();
  loginForm.classList.remove('hidden');
  formTitle.textContent = 'Login';
});

// Google Login Buttons
document.getElementById('googleLogin')?.addEventListener('click', () => {
  handleGoogleSignIn(false);
});

document.getElementById('googleSignup')?.addEventListener('click', () => {
  handleGoogleSignIn(true);
});

// Handle Regular Login
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showMessage('Please fill in all fields', loginForm);
    return;
  }

  const submitBtn = loginForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'index.html';
    } else {
      showMessage(data.message || 'Login failed', loginForm);
    }
  } catch (error) {
    showMessage('Cannot connect to server', loginForm);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }
});

// Handle Signup
signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !phone || !password) {
    showMessage('Please fill in all fields', signupForm);
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    showMessage('Phone must be 10 digits', signupForm);
    return;
  }

  if (password.length < 6) {
    showMessage('Password must be at least 6 characters', signupForm);
    return;
  }

  const submitBtn = signupForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating account...';

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('Account created! Please login.');
      hideAllForms();
      loginForm.classList.remove('hidden');
      formTitle.textContent = 'Login';
      signupForm.reset();
      document.getElementById('loginEmail').value = email;
    } else {
      showMessage(data.message || 'Signup failed', signupForm);
    }
  } catch (error) {
    showMessage('Cannot connect to server', signupForm);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign Up';
  }
});

// OTP Login - Send OTP
document.getElementById('sendOtpBtn')?.addEventListener('click', async () => {
  const email = document.getElementById('otpEmail').value.trim();
  
  if (!email) {
    showMessage('Please enter your email', otpLoginForm);
    return;
  }

  const btn = document.getElementById('sendOtpBtn');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showMessage('OTP sent to your email!', otpLoginForm, 'success');
      document.getElementById('otpInputGroup').classList.remove('hidden');
      document.getElementById('verifyOtpBtn').classList.remove('hidden');
    } else {
      showMessage(data.message || 'Failed to send OTP', otpLoginForm);
    }
  } catch (error) {
    showMessage('Cannot connect to server', otpLoginForm);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Resend OTP';
  }
});

// OTP Login - Verify OTP
otpLoginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('otpEmail').value.trim();
  const otp = document.getElementById('otpCode').value.trim();

  if (!otp || otp.length !== 6) {
    showMessage('Please enter 6-digit OTP', otpLoginForm);
    return;
  }

  const btn = document.getElementById('verifyOtpBtn');
  btn.disabled = true;
  btn.textContent = 'Verifying...';

  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'index.html';
    } else {
      showMessage(data.message || 'Invalid OTP', otpLoginForm);
    }
  } catch (error) {
    showMessage('Cannot connect to server', otpLoginForm);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Verify OTP';
  }
});

// Forgot Password - Send Reset OTP
document.getElementById('sendResetOtpBtn')?.addEventListener('click', async () => {
  const email = document.getElementById('resetEmail').value.trim();
  
  if (!email) {
    showMessage('Please enter your email', forgotPasswordForm);
    return;
  }

  const btn = document.getElementById('sendResetOtpBtn');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showMessage('Reset OTP sent to your email!', forgotPasswordForm, 'success');
      document.getElementById('resetOtpGroup').classList.remove('hidden');
      document.getElementById('newPasswordGroup').classList.remove('hidden');
      document.getElementById('resetPasswordBtn').classList.remove('hidden');
    } else {
      showMessage(data.message || 'Failed to send reset OTP', forgotPasswordForm);
    }
  } catch (error) {
    showMessage('Cannot connect to server', forgotPasswordForm);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Resend OTP';
  }
});

// Reset Password - Submit
forgotPasswordForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('resetEmail').value.trim();
  const otp = document.getElementById('resetOtpCode').value.trim();
  const newPassword = document.getElementById('newPassword').value;

  if (!otp || otp.length !== 6) {
    showMessage('Please enter 6-digit OTP', forgotPasswordForm);
    return;
  }

  if (newPassword.length < 6) {
    showMessage('Password must be at least 6 characters', forgotPasswordForm);
    return;
  }

  const btn = document.getElementById('resetPasswordBtn');
  btn.disabled = true;
  btn.textContent = 'Resetting...';

  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('Password reset successful! Please login.');
      hideAllForms();
      loginForm.classList.remove('hidden');
      formTitle.textContent = 'Login';
      forgotPasswordForm.reset();
      document.getElementById('loginEmail').value = email;
    } else {
      showMessage(data.message || 'Failed to reset password', forgotPasswordForm);
    }
  } catch (error) {
    showMessage('Cannot connect to server', forgotPasswordForm);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Reset Password';
  }
});

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname;
  
  if (token && currentPage.includes('login.html')) {
    const confirmRedirect = confirm('You are already logged in. Go to home page?');
    if (confirmRedirect) {
      window.location.href = 'index.html';
    }
  }
});