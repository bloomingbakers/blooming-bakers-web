import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiTrendingUp, FiDollarSign, FiBox } from 'react-icons/fi';
import useAdminStore from '../../stores/useAdminStore';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const { stats, loading, fetchStats } = useAdminStore();
  const location = useLocation();

  useEffect(() => { fetchStats(); }, []);

  // If we're on a sub-route, render the Outlet
  if (location.pathname !== '/admin') {
    return <Outlet />;
  }

  if (loading && !stats) return <div className="pt-24"><Loader /></div>;

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: FiDollarSign, color: 'from-green-500 to-emerald-400' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FiShoppingBag, color: 'from-primary-500 to-primary-400' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'from-blue-500 to-cyan-400' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: FiBox, color: 'from-purple-500 to-violet-400' },
  ];

  const navItems = [
    { name: 'Products', path: '/admin/products', icon: FiPackage, desc: 'Add, edit, or remove products' },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag, desc: 'View and manage all orders' },
    { name: 'Users', path: '/admin/users', icon: FiUsers, desc: 'Manage customer accounts' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="section-heading !text-left">Admin Dashboard</h1>
          <p className="text-mocha mt-2">Welcome back, Admin! Here&apos;s your store overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl shadow-soft p-5 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shrink-0`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-600">{stat.value}</p>
                <p className="text-xs text-mocha">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="font-display text-xl font-semibold text-accent-600 mb-5">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                <item.icon size={22} className="text-primary-500" />
              </div>
              <h3 className="font-semibold text-accent-600 mb-1">{item.name}</h3>
              <p className="text-sm text-mocha">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        {stats?.recentOrders && stats.recentOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-accent-600">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-primary-500 font-medium hover:underline">View All</Link>
            </div>
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cream/50 border-b border-primary-50">
                      <th className="text-left px-5 py-3 font-semibold text-accent-600">Order ID</th>
                      <th className="text-left px-5 py-3 font-semibold text-accent-600">Customer</th>
                      <th className="text-left px-5 py-3 font-semibold text-accent-600">Amount</th>
                      <th className="text-left px-5 py-3 font-semibold text-accent-600">Status</th>
                      <th className="text-left px-5 py-3 font-semibold text-accent-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-primary-50/50 hover:bg-cream/30">
                        <td className="px-5 py-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="px-5 py-3">{order.user?.name || 'N/A'}</td>
                        <td className="px-5 py-3 font-semibold">₹{order.totalPrice}</td>
                        <td className="px-5 py-3">
                          <span className={`badge text-[10px] ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{order.status}</span>
                        </td>
                        <td className="px-5 py-3 text-mocha">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
