import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheck, FiTruck } from 'react-icons/fi';
import useOrderStore from '../stores/useOrderStore';
import Loader from '../components/Loader';
import { getImageUrl } from '../utils/getImageUrl';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: FiClock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: FiCheck },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-700', icon: FiPackage },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-700', icon: FiTruck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: FiCheck },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: FiPackage },
};

const STEPS = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrdersPage() {
  const { orders, loading, fetchMyOrders } = useOrderStore();

  useEffect(() => { fetchMyOrders(); }, []);

  if (loading) return <div className="pt-24"><Loader /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-heading !text-left mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="font-display text-xl font-semibold text-accent-600 mb-2">No orders yet</h3>
            <p className="text-mocha mb-6">Time to treat yourself!</p>
            <Link to="/products" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = status.icon;
              const currentStep = STEPS.indexOf(order.status);
              return (
                <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                  <div className="p-5 border-b border-primary-50 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-mocha">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-mocha">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <span className={`badge ${status.color} flex items-center gap-1`}><StatusIcon size={14} /> {status.label}</span>
                  </div>
                  {/* Timeline */}
                  {order.status !== 'cancelled' && (
                    <div className="px-5 py-4 bg-cream/50">
                      <div className="flex items-center justify-between">
                        {STEPS.map((step, i) => (
                          <div key={step} className="flex items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i <= currentStep ? 'bg-primary-400 text-white' : 'bg-primary-100 text-mocha'}`}>{i + 1}</div>
                            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${i < currentStep ? 'bg-primary-400' : 'bg-primary-100'}`} />}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-1">
                        {STEPS.map(s => <span key={s} className="text-[10px] text-mocha capitalize">{s.replace('_', ' ')}</span>)}
                      </div>
                    </div>
                  )}
                  {/* Items */}
                  <div className="p-5">
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <img src={getImageUrl(item.image || item.product?.images?.[0] || '/images/cake.png')} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{item.name}</p><p className="text-xs text-mocha">Qty: {item.quantity}</p></div>
                          <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <hr className="my-4 border-primary-50" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-mocha">
                        {order.paymentMethod === 'cod' ? '💵 COD' : '💳 Online'} • {order.isPaid ? <span className="text-sage">Paid</span> : <span className="text-red-400">Unpaid</span>}
                      </div>
                      <p className="text-lg font-bold text-accent-600">₹{order.totalPrice}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
