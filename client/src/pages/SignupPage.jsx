import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import useAuthStore from '../stores/useAuthStore';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    try { await register(name, email, password); toast.success('Account created!'); navigate('/'); } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <img src="/images/logo.png" alt="Blooming Bakers" className="h-14 w-14 object-contain" />
            <span className="font-display font-bold text-2xl text-accent-600">Blooming Bakers</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-accent-600 mb-2">Create Account</h1>
          <p className="text-mocha">Join the sweetest community</p>
        </div>
        <div className="bg-white rounded-3xl shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="input-field !pl-11" required />
            </div>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-field !pl-11" required />
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha" />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" className="input-field !pl-11 !pr-11" required minLength={6} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-mocha">
                {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <div className="relative my-6"><hr className="border-primary-50" /><span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-mocha">or</span></div>
          <button className="w-full flex items-center justify-center gap-3 py-3 border-2 border-primary-100 rounded-full hover:bg-primary-50 transition-colors font-medium text-accent-600">
            <FcGoogle size={20} /> Continue with Google
          </button>
          <p className="text-center text-sm text-mocha mt-6">
            Already have an account? <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
