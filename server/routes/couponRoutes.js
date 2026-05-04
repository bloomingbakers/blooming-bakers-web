import express from 'express';
import { validateCoupon, createCoupon, getAllCoupons, deleteCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.post('/', protect, admin, createCoupon);
router.get('/', protect, admin, getAllCoupons);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;
