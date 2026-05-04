import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiTruck } from 'react-icons/fi';
import useCartStore from '../stores/useCartStore';
import useOrderStore from '../stores/useOrderStore';
import useAuthStore from '../stores/useAuthStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getDeliveryCharge, getDiscount, getTotal, coupon, clearCart } = useCartStore();
  const { createOrder, updateOrderPayment } = useOrderStore();
  const { user } = useAuthStore();

  const [address, setAddress] = useState({ fullName: user?.name || '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart is empty');
    const { fullName, phone, addressLine1, city, state, pincode } = address;
    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) return toast.error('Fill all address fields');
    setLoading(true);

    try {
      const orderItems = items.map(item => ({ product: item._id, name: item.name, image: item.image, price: item.price, quantity: item.quantity }));
      const orderData = { items: orderItems, shippingAddress: address, paymentMethod, couponCode: coupon?.code || '', discount: getDiscount() };

      if (paymentMethod === 'cod') {
        const data = await createOrder(orderData);
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/orders`);
      } else {
        // Razorpay flow
        const { data: paymentData } = await api.post('/payment/create-order', { amount: getTotal() });
        const options = {
          key: paymentData.key,
          amount: paymentData.order.amount,
          currency: 'INR',
          name: 'Blooming Bakers',
          description: 'Order Payment',
          order_id: paymentData.order.id,
          handler: async (response) => {
            try {
              await api.post('/payment/verify', response);
              const data = await createOrder({ ...orderData, paymentMethod: 'razorpay' });
              await updateOrderPayment(data.order._id, response);
              clearCart();
              toast.success('Payment successful! Order placed!');
              navigate('/orders');
            } catch { toast.error('Payment verification failed'); }
          },
          prefill: { name: address.fullName, contact: address.phone, email: user?.email },
          theme: { color: '#E8907E' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) { toast.error(err.message || 'Failed to place order'); }
    setLoading(false);
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="max-w-5xl mx-auto">
        <h1 className="section-heading !text-left mb-8">Checkout</h1>
        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="font-display text-lg font-semibold text-accent-600 mb-5 flex items-center gap-2"><FiTruck /> Delivery Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input name="fullName" value={address.fullName} onChange={handleInputChange} placeholder="Full Name *" className="input-field" required />
                  <input name="phone" value={address.phone} onChange={handleInputChange} placeholder="Phone Number *" className="input-field" required />
                  <input name="addressLine1" value={address.addressLine1} onChange={handleInputChange} placeholder="Address Line 1 *" className="input-field sm:col-span-2" required />
                  <input name="addressLine2" value={address.addressLine2} onChange={handleInputChange} placeholder="Address Line 2" className="input-field sm:col-span-2" />
                  <input name="city" value={address.city} onChange={handleInputChange} placeholder="City *" className="input-field" required />
                  <input name="state" value={address.state} onChange={handleInputChange} placeholder="State *" className="input-field" required />
                  <input name="pincode" value={address.pincode} onChange={handleInputChange} placeholder="Pincode *" className="input-field" required />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="font-display text-lg font-semibold text-accent-600 mb-5 flex items-center gap-2"><FiCreditCard /> Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-primary-400 bg-primary-50' : 'border-primary-100 hover:border-primary-200'}`}>
                    <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="text-primary-400 focus:ring-primary-300" />
                    <div>
                      <p className="font-semibold text-accent-600">Pay Online (Razorpay)</p>
                      <p className="text-xs text-mocha">UPI, Cards, Net Banking, Wallets</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary-400 bg-primary-50' : 'border-primary-100 hover:border-primary-200'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-primary-400 focus:ring-primary-300" />
                    <div>
                      <p className="font-semibold text-accent-600">Cash on Delivery</p>
                      <p className="text-xs text-mocha">Pay when your order arrives</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-soft p-6 h-fit sticky top-24">
              <h3 className="font-display text-lg font-semibold text-accent-600 mb-5">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-mocha truncate mr-2">{item.name} × {item.quantity}</span>
                    <span className="font-medium whitespace-nowrap">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="border-primary-50 mb-3" />
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm"><span className="text-mocha">Subtotal</span><span>₹{getSubtotal()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-mocha">Delivery</span><span>{getDeliveryCharge() === 0 ? <span className="text-sage">FREE</span> : `₹${getDeliveryCharge()}`}</span></div>
                {getDiscount() > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-₹{getDiscount()}</span></div>}
              </div>
              <hr className="border-primary-50 mb-3" />
              <div className="flex justify-between text-xl font-bold mb-6"><span>Total</span><span className="text-accent-600">₹{getTotal()}</span></div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${getTotal()}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
