import Coupon from '../models/Coupon.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) return res.status(404).json({ message: 'Invalid or expired coupon code' });
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (orderAmount < coupon.minOrderAmount)
      return res.status(400).json({ message: `Min order ₹${coupon.minOrderAmount} required` });

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else {
      discount = coupon.discountValue;
    }

    coupon.usedCount += 1;
    await coupon.save();
    res.json({ success: true, discount: Math.round(discount), coupon: { code: coupon.code, description: coupon.description, discountType: coupon.discountType, discountValue: coupon.discountValue } });
  } catch (error) { next(error); }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) { next(error); }
};

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) { next(error); }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) { next(error); }
};
