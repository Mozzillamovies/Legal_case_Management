import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  updateAccount,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Private routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/account', protect, updateAccount);

export default router;
