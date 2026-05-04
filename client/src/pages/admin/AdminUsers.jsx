import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import useAdminStore from '../../stores/useAdminStore';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { users, loading, fetchUsers, deleteUser } = useAdminStore();
  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try { await deleteUser(id); toast.success('User deleted'); } catch { toast.error('Failed'); }
  };

  if (loading && !users.length) return <div className="pt-24"><Loader /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-mocha hover:text-primary-500 mb-2"><FiArrowLeft /> Back</Link>
        <h1 className="section-heading !text-left mb-8">Manage Users ({users.length})</h1>
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-cream/50 border-b border-primary-50">
                <th className="text-left px-4 py-3 font-semibold">User</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Role</th>
                <th className="text-left px-4 py-3 font-semibold">Joined</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr></thead>
              <tbody>{users.map(u => (
                <tr key={u._id} className="border-b border-primary-50/50 hover:bg-cream/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600">{u.name?.charAt(0)?.toUpperCase()}</div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-mocha">{u.email}</td>
                  <td className="px-4 py-3"><span className={`badge text-[10px] ${u.role==='admin'?'bg-primary-100 text-primary-600':'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                  <td className="px-4 py-3 text-mocha text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== 'admin' && (
                      <button onClick={() => handleDelete(u._id, u.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={15} /></button>
                    )}
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
