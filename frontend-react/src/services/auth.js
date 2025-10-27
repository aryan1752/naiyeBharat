import api from './api';
import { signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth, getGoogleProvider } from './firebase';

export const authService = {
  // Email/Password Signup
  signup: async (userData) => {
    const { data } = await api.post('/auth/signup', userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Email/Password Login
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Google Sign In
  googleSignIn: async () => {
    const auth = getFirebaseAuth();
    const provider = getGoogleProvider();
    
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    
    const { data } = await api.post('/auth/google-login', { idToken });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Get Current User
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};