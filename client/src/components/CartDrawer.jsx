import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useCartStore from '../stores/useCartStore';
import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, getSubtotal, getDeliveryCharge, getDiscount, getTotal, coupon, applyCoupon, removeCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, orderAmount: getSubtotal() });
      applyCoupon(data.coupon);
      toast.success(`Coupon applied! ${data.coupon.description}`);
      setCouponCode('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
    }
    setCouponLoading(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} className="fixed inset-0 bg-black/40 z-50" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-primary-50">
              <h2 className="font-display text-xl font-bold text-accent-600 flex items-center gap-2">
                <FiShoppingBag /> Your Cart ({items.length})
              </h2>
              <button onClick={closeCart} className="p-2 hover:bg-primary-50 rounded-full transition-colors"><FiX size={20} /></button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <span className="text-6xl mb-4">🧁</span>
                <h3 className="font-display text-lg font-semibold text-accent-600 mb-2">Your cart is empty</h3>
                <p className="text-mocha text-sm mb-6">Time to add some sweet treats!</p>
                <Link to="/products" onClick={closeCart} className="btn-primary">Browse Products</Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {items.map((item) => (
                    <motion.div key={item._id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex gap-4 p-3 bg-cream rounded-xl">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-accent-700 truncate">{item.name}</h4>
                        <p className="text-primary-500 font-bold mt-1">₹{item.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-primary-100 rounded-lg">
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1.5 hover:bg-primary-50 rounded-l-lg"><FiMinus size={14} /></button>
                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1.5 hover:bg-primary-50 rounded-r-lg"><FiPlus size={14} /></button>
                          </div>
                          <button onClick={() => removeItem(item._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={14} /></button>
                        </div>
                      </div>
                      <p className="font-bold text-accent-600 text-sm whitespace-nowrap">₹{item.price * item.quantity}</p>
                    </motion.div>
                  ))}

                  {/* Coupon */}
                  <div className="pt-2">
                    {coupon ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-green-700">🎟 {coupon.code}</p>
                          <p className="text-xs text-green-600">{coupon.description}</p>
                        </div>
                        <button onClick={removeCoupon} className="text-red-400 hover:text-red-600 text-sm font-medium">Remove</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon code" className="input-field text-sm !py-2.5 flex-1" />
                        <button onClick={handleApplyCoupon} disabled={couponLoading} className="btn-secondary !py-2.5 text-sm whitespace-nowrap">{couponLoading ? '...' : 'Apply'}</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-primary-50 bg-cream/50 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-mocha">Subtotal</span><span className="font-medium">₹{getSubtotal()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-mocha">Delivery</span><span className="font-medium">{getDeliveryCharge() === 0 ? <span className="text-sage">FREE</span> : `₹${getDeliveryCharge()}`}</span></div>
                  {getDiscount() > 0 && <div className="flex justify-between text-sm"><span className="text-green-600">Discount</span><span className="font-medium text-green-600">-₹{getDiscount()}</span></div>}
                  <hr className="border-primary-100" />
                  <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-accent-600">₹{getTotal()}</span></div>
                  {getSubtotal() < 500 && getSubtotal() > 0 && <p className="text-xs text-mocha text-center">Add ₹{500 - getSubtotal()} more for free delivery!</p>}
                  <Link to="/checkout" onClick={closeCart} className="btn-primary w-full text-center block mt-3">Proceed to Checkout</Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
