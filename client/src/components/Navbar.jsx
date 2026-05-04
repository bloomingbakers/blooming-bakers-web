import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import useAuthStore from '../stores/useAuthStore';
import useCartStore from '../stores/useCartStore';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/products' },
  { name: 'Cakes', path: '/products?category=cakes' },
  { name: 'Brownies', path: '/products?category=brownies' },
  { name: 'Pastries', path: '/products?category=pastries' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout } = useAuthStore();
  const { openCart, getItemCount } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-soft py-1'
            : 'bg-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img src="/images/logo.png" alt="Blooming Bakers" className="h-12 w-12 object-contain" />
              <div className="hidden sm:block">
                <h1 className="font-display font-bold text-lg text-accent-600 leading-none group-hover:text-primary-500 transition-colors">
                  Blooming
                </h1>
                <p className="text-[10px] tracking-[0.25em] text-mocha font-medium uppercase">Bakers</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-primary-500 ${
                    location.pathname === link.path ? 'text-primary-500' : 'text-accent-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-accent-600 hover:text-primary-500 transition-colors"
                id="nav-search-btn"
              >
                <FiSearch size={20} />
              </button>

              {/* Wishlist */}
              {user && (
                <Link
                  to="/wishlist"
                  className="p-2 text-accent-600 hover:text-primary-500 transition-colors hidden sm:block"
                  id="nav-wishlist-btn"
                >
                  <FiHeart size={20} />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className="p-2 text-accent-600 hover:text-primary-500 transition-colors relative"
                id="nav-cart-btn"
              >
                <FiShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 text-accent-600 hover:text-primary-500 transition-colors"
                    id="nav-user-btn"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-600">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-primary-50 overflow-hidden z-50"
                      >
                        <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-primary-100">
                          <p className="font-semibold text-accent-600">{user.name}</p>
                          <p className="text-xs text-mocha mt-0.5">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-accent-600 hover:bg-primary-50 transition-colors">
                            <FiPackage size={16} /> My Orders
                          </Link>
                          <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-accent-600 hover:bg-primary-50 transition-colors">
                            <FiHeart size={16} /> Wishlist
                          </Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-500 font-medium hover:bg-primary-50 transition-colors">
                              <FiSettings size={16} /> Admin Panel
                            </Link>
                          )}
                          <hr className="my-1 border-primary-50" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                          >
                            <FiLogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex btn-primary text-sm !py-2 !px-5"
                  id="nav-login-btn"
                >
                  Login
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-accent-600 md:hidden"
              >
                {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-primary-50 overflow-hidden"
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-3">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for cakes, brownies, pastries..."
                    className="input-field !pl-11 !pr-24"
                    autoFocus
                    id="search-input"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-1.5 !px-4 text-sm">
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-xl md:hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                  <img src="/images/logo.png" alt="Blooming Bakers" className="h-10 w-10 object-contain" />
                  <span className="font-display font-bold text-lg text-accent-600">Blooming Bakers</span>
                </div>
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="block py-3 px-4 text-accent-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  {/* Logged in mobile links */}
                  {user ? (
                    <>
                      <hr className="my-2 border-primary-50" />
                      <div className="px-4 py-2 mb-2 bg-primary-50/50 rounded-lg">
                        <p className="text-xs text-mocha">Logged in as</p>
                        <p className="font-semibold text-accent-600 truncate">{user.email}</p>
                      </div>
                      <Link to="/orders" className="flex items-center gap-3 py-3 px-4 text-accent-600 hover:bg-primary-50 rounded-lg transition-colors font-medium">
                        <FiPackage size={18} /> My Orders
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-3 py-3 px-4 text-accent-600 hover:bg-primary-50 rounded-lg transition-colors font-medium">
                        <FiHeart size={18} /> Wishlist
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 py-3 px-4 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors font-bold">
                          <FiSettings size={18} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex items-center gap-3 py-3 px-4 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium w-full mt-2">
                        <FiLogOut size={18} /> Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block py-3 px-4 text-primary-500 font-semibold hover:bg-primary-50 rounded-lg transition-colors mt-4"
                    >
                      Login / Sign Up
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside handler for user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}
