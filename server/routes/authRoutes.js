import express from 'express';
import { register, login, googleLogin, getProfile, updateProfile, addAddress, deleteAddress, toggleWishlist } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);

export default router;
