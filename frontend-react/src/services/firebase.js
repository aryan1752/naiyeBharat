import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import api from './api';

let firebaseApp = null;
let auth = null;
let googleProvider = null;

export const initializeFirebase = async () => {
  try {
    const { data: firebaseConfig } = await api.get('/config/firebase');
    
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    googleProvider = new GoogleAuthProvider();
    
    return { auth, googleProvider };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

export const getFirebaseAuth = () => auth;
export const getGoogleProvider = () => googleProvider;
