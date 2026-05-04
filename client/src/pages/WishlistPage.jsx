import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import useAuthStore from '../stores/useAuthStore';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function WishlistPage() {
  const { user, getProfile, loading } = useAuthStore();

  useEffect(() => { getProfile(); }, []);

  const wishlist = user?.wishlist || [];
  const products = wishlist.filter((item) => typeof item === 'object' && item._id);

  if (loading) return <div className="pt-24"><Loader /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="max-w-7xl mx-auto">
        <h1 className="section-heading !text-left mb-2 flex items-center gap-3">
          <FiHeart className="text-red-400" /> My Wishlist
        </h1>
        <p className="text-mocha mb-8">{products.length} items saved</p>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">💝</span>
            <h3 className="font-display text-xl font-semibold text-accent-600 mb-2">Your wishlist is empty</h3>
            <p className="text-mocha mb-6">Save items you love for later!</p>
            <Link to="/products" className="btn-primary flex items-center gap-2 w-fit mx-auto">
              <FiShoppingBag /> Browse Products
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
