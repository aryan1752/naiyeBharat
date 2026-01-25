// backend/config/firebase.js
import admin from 'firebase-admin';

// For development, you can use the service account key
// For production, use environment variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || "nyaybharat-27853",
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize Firebase Admin
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

console.log('🔥 Firebase Admin initialized');

export { app, auth };