import express from 'express';
import { signup, login, getMe, logout } from '../controllers/authcontroller.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);

export default router;
