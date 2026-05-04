import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useCartStore from '../stores/useCartStore';
import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getDeliveryCharge, getDiscount, getTotal, coupon, applyCoupon, removeCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, orderAmount: getSubtotal() });
      applyCoupon(data.coupon);
      toast.success('Coupon applied!');
      setCouponCode('');
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); }
    setCouponLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4 page-enter">
        <span className="text-7xl mb-6">🧁</span>
        <h1 className="font-display text-3xl font-bold text-accent-600 mb-3">Your cart is empty</h1>
        <p className="text-mocha mb-8">Looks like you haven&apos;t added any treats yet!</p>
        <Link to="/products" className="btn-primary flex items-center gap-2"><FiShoppingBag /> Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="max-w-6xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-mocha hover:text-primary-400 mb-6 text-sm"><FiArrowLeft /> Continue Shopping</Link>
        <h1 className="section-heading !text-left mb-8">Shopping Cart ({items.length})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div key={item._id} layout className="flex gap-4 p-4 bg-white rounded-2xl shadow-soft">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item._id}`} className="font-display font-semibold text-accent-700 hover:text-primary-400 transition-colors">{item.name}</Link>
                  <p className="text-primary-500 font-bold mt-1">₹{item.price} {item.originalPrice > item.price && <span className="text-sm text-mocha line-through font-normal ml-1">₹{item.originalPrice}</span>}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-primary-100 rounded-xl">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2 hover:bg-primary-50 rounded-l-xl"><FiMinus size={14} /></button>
                      <span className="px-4 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2 hover:bg-primary-50 rounded-r-xl"><FiPlus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="text-red-400 hover:text-red-600 transition-colors"><FiTrash2 size={16} /></button>
                  </div>
                </div>
                <p className="font-bold text-accent-600 whitespace-nowrap">₹{item.price * item.quantity}</p>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-soft p-6 h-fit sticky top-24">
            <h3 className="font-display text-lg font-semibold text-accent-600 mb-5">Order Summary</h3>
            {/* Coupon */}
            {coupon ? (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl mb-5">
                <div><p className="text-sm font-semibold text-green-700">🎟 {coupon.code}</p><p className="text-xs text-green-600">{coupon.description}</p></div>
                <button onClick={removeCoupon} className="text-red-400 text-xs font-medium">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2 mb-5">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon code" className="input-field text-sm !py-2.5 flex-1" />
                <button onClick={handleApplyCoupon} disabled={couponLoading} className="btn-secondary !py-2.5 text-sm">{couponLoading ? '...' : 'Apply'}</button>
              </div>
            )}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm"><span className="text-mocha">Subtotal</span><span>₹{getSubtotal()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-mocha">Delivery</span><span>{getDeliveryCharge() === 0 ? <span className="text-sage font-medium">FREE</span> : `₹${getDeliveryCharge()}`}</span></div>
              {getDiscount() > 0 && <div className="flex justify-between text-sm"><span className="text-green-600">Discount</span><span className="text-green-600">-₹{getDiscount()}</span></div>}
              <hr className="border-primary-50" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-accent-600">₹{getTotal()}</span></div>
            </div>
            {getSubtotal() < 500 && <p className="text-xs text-mocha text-center mb-4">Add ₹{500 - getSubtotal()} more for free delivery!</p>}
            <Link to="/checkout" className="btn-primary w-full text-center block">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
