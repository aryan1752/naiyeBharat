const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const formTitle = document.getElementById('formTitle');

switchToSignup.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
  formTitle.textContent = 'Sign Up';
});

switchToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  signupForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  formTitle.textContent = 'Login';
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Login submitted!');
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Signup submitted!');
});

// Google Login actions (placeholder)
document.getElementById('googleLogin').addEventListener('click', () => {
  alert('Redirecting to Google Login...');
  // Here you can integrate Firebase / OAuth
});

document.getElementById('googleSignup').addEventListener('click', () => {
  alert('Redirecting to Google Sign Up...');
});
