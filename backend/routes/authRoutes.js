import express from 'express';
import {
  signup,
  login,
  logout,
  getMe,
  sendOTP,
  verifyOTPLogin,
  forgotPassword,
  resetPassword,
  googleSignup,
  googleLogin
} from '../controllers/authcontroller.js';

import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google-signup', googleSignup);
router.post('/google-login', googleLogin);
router.get('/me', protect, getMe);

export default router;
