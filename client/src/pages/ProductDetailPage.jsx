import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiMinus, FiPlus, FiStar } from 'react-icons/fi';
import useProductStore from '../stores/useProductStore';
import useCartStore from '../stores/useCartStore';
import useAuthStore from '../stores/useAuthStore';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/getImageUrl';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading, fetchProduct, products, fetchProducts } = useProductStore();
  const { addItem, openCart } = useCartStore();
  const { user, isInWishlist, toggleWishlist } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchProduct(id); setQuantity(1); loadReviews(); }, [id]);
  useEffect(() => { if (product) fetchProducts({ category: product.category, limit: 4 }); }, [product?._id]);

  const loadReviews = async () => {
    try { const { data } = await api.get(`/reviews/product/${id}`); setReviews(data.reviews); } catch {}
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    openCart();
    toast.success('Added to cart!', { icon: '🛒' });
  };

  const handleWishlist = async () => {
    if (!user) return toast.error('Please login first');
    try { await toggleWishlist(product._id); } catch { toast.error('Failed'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    setSubmitting(true);
    try {
      await api.post('/reviews', { product: id, ...reviewForm });
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      loadReviews();
      fetchProduct(id);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };

  if (loading || !product) return <div className="pt-24"><Loader /></div>;

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const related = products.filter(p => p._id !== product._id).slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 page-enter">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
              <img src={getImageUrl(product.images?.[0] || '/images/cake.png')} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isBestseller && <span className="badge-bestseller">⭐ Bestseller</span>}
              {product.isEggless && <span className="badge-eggless">🥚 Eggless</span>}
              {product.isVeg && <span className="badge-veg">🌿 Veg</span>}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <span className="text-sm text-primary-400 font-medium capitalize mb-2">{product.category}</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-accent-600 mb-4">{product.name}</h1>

            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={Math.round(product.ratings)} readonly />
                <span className="text-sm text-mocha">({product.numReviews} reviews)</span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-accent-600">₹{price}</span>
              {product.discountPrice > 0 && <span className="text-xl text-mocha line-through">₹{product.price}</span>}
              {product.discountPrice > 0 && <span className="badge bg-red-100 text-red-600">Save ₹{product.price - product.discountPrice}</span>}
            </div>

            <p className="text-mocha leading-relaxed mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.weight && <div className="p-3 bg-cream rounded-xl"><p className="text-xs text-mocha">Weight</p><p className="font-semibold text-sm">{product.weight}</p></div>}
              {product.servings && <div className="p-3 bg-cream rounded-xl"><p className="text-xs text-mocha">Servings</p><p className="font-semibold text-sm">{product.servings}</p></div>}
            </div>

            {product.ingredients && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-accent-600 mb-2">Ingredients</h3>
                <p className="text-sm text-mocha">{product.ingredients}</p>
              </div>
            )}

            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-primary-50">
              <div className="flex items-center border border-primary-200 rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-primary-50 rounded-l-xl"><FiMinus size={16} /></button>
                <span className="px-5 font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-primary-50 rounded-r-xl"><FiPlus size={16} /></button>
              </div>
              <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                <FiShoppingBag /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={handleWishlist} className={`p-3 rounded-xl border transition-all ${isInWishlist(product._id) ? 'bg-red-50 border-red-200 text-red-500' : 'border-primary-200 text-mocha hover:text-red-500'}`}>
                <FiHeart size={20} className={isInWishlist(product._id) ? 'fill-current' : ''} />
              </button>
            </div>

            {product.stock > 0 && product.stock <= 5 && <p className="text-xs text-red-500 mt-3">Only {product.stock} left in stock!</p>}
          </motion.div>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="section-heading !text-left mb-8">Reviews ({reviews.length})</h2>
          {user && (
            <form onSubmit={handleReviewSubmit} className="bg-cream rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-accent-600 mb-3">Write a Review</h3>
              <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm({ ...reviewForm, rating: r })} size={24} />
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your experience..." className="input-field mt-3 min-h-[100px]" required />
              <button type="submit" disabled={submitting} className="btn-primary mt-3">{submitting ? 'Submitting...' : 'Submit Review'}</button>
            </form>
          )}
          {reviews.length === 0 ? <p className="text-mocha text-center py-8">No reviews yet. Be the first!</p> : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="bg-white rounded-xl p-5 shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-500">{r.user?.name?.charAt(0)}</div>
                    <div>
                      <p className="font-semibold text-sm text-accent-600">{r.user?.name}</p>
                      <p className="text-xs text-mocha">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="ml-auto"><StarRating rating={r.rating} readonly size={14} /></div>
                  </div>
                  <p className="text-sm text-mocha">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="section-heading !text-left mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{related.map(p => <ProductCard key={p._id} product={p} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
