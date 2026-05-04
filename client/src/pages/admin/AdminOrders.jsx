import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import useAdminStore from '../../stores/useAdminStore';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const STATUSES = ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'];
const COLORS = { pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-blue-100 text-blue-700', preparing:'bg-orange-100 text-orange-700', out_for_delivery:'bg-purple-100 text-purple-700', delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-700' };

export default function AdminOrders() {
  const { orders, loading, fetchAllOrders, updateOrderStatus } = useAdminStore();
  useEffect(() => { fetchAllOrders({ limit: 50 }); }, []);

  const handleStatus = async (id, s) => {
    try { await updateOrderStatus(id, s); toast.success('Status updated'); } catch { toast.error('Failed'); }
  };

  if (loading && !orders.length) return <div className="pt-24"><Loader /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-mocha hover:text-primary-500 mb-2"><FiArrowLeft /> Back</Link>
        <h1 className="section-heading !text-left mb-8">Manage Orders ({orders.length})</h1>
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-cream/50 border-b border-primary-50">
                <th className="text-left px-4 py-3 font-semibold">Order ID</th>
                <th className="text-left px-4 py-3 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-4 py-3 font-semibold">Payment</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
              </tr></thead>
              <tbody>{orders.map(o => (
                <tr key={o._id} className="border-b border-primary-50/50 hover:bg-cream/30">
                  <td className="px-4 py-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3"><p className="font-medium">{o.user?.name||'N/A'}</p><p className="text-xs text-mocha">{o.user?.email}</p></td>
                  <td className="px-4 py-3 font-semibold">₹{o.totalPrice}</td>
                  <td className="px-4 py-3"><span className="capitalize text-xs">{o.paymentMethod}</span> <span className={`text-[10px] ${o.isPaid?'text-sage':'text-red-400'}`}>{o.isPaid?'✓ Paid':'✗ Unpaid'}</span></td>
                  <td className="px-4 py-3"><select value={o.status} onChange={e=>handleStatus(o._id,e.target.value)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer ${COLORS[o.status]||''}`}>{STATUSES.map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}</select></td>
                  <td className="px-4 py-3 text-mocha text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
