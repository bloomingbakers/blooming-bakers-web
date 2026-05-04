import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import useCartStore from '../stores/useCartStore';
import useAuthStore from '../stores/useAuthStore';
import toast from 'react-hot-toast';

import { getImageUrl } from '../utils/getImageUrl';

export default function ProductCard({ product }) {
  const { addItem, openCart } = useCartStore();
  const { user, isInWishlist, toggleWishlist } = useAuthStore();

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return toast.error('Please login first');
    try { await toggleWishlist(product._id); } catch { toast.error('Failed'); }
  };

  const inWishlist = user && isInWishlist(product._id);

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="product-card group">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-primary-50 to-secondary-50">
          <img src={getImageUrl(product.images?.[0])} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isBestseller && <span className="badge-bestseller text-[10px]">⭐ Bestseller</span>}
            {hasDiscount && <span className="badge bg-red-100 text-red-600 text-[10px]">-{discountPercent}%</span>}
            {product.isEggless && <span className="badge-eggless text-[10px]">🥚 Eggless</span>}
          </div>
          <button onClick={handleWishlist} className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/80 text-accent-400 hover:text-red-500'}`}>
            <FiHeart size={16} className={inWishlist ? 'fill-current' : ''} />
          </button>
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <button onClick={handleAddToCart} className="w-full py-2.5 bg-accent-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-accent-700">
              <FiShoppingBag size={15} /> Add to Cart
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1.5">
            {product.isVeg && <span className="w-4 h-4 border border-green-600 rounded-sm flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-green-600" /></span>}
            <span className="text-xs text-mocha capitalize">{product.category}</span>
          </div>
          <h3 className="font-display font-semibold text-accent-700 line-clamp-2 leading-snug mb-2 group-hover:text-primary-500 transition-colors">{product.name}</h3>
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <FiStar size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold">{product.ratings}</span>
              <span className="text-xs text-mocha">({product.numReviews})</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-accent-600">₹{price}</span>
            {hasDiscount && <span className="text-sm text-mocha line-through">₹{product.price}</span>}
          </div>
          {product.weight && <p className="text-xs text-mocha mt-1">{product.weight}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
