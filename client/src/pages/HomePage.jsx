import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiAward, FiTruck } from 'react-icons/fi';
import useProductStore from '../stores/useProductStore';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Loader';

const categories = [
  { name: 'Cakes', emoji: '🎂', color: 'from-orange-100 to-amber-50' },
  { name: 'Brownies', emoji: '🍫', color: 'from-amber-100 to-yellow-50' },
  { name: 'Pastries', emoji: '🥐', color: 'from-yellow-100 to-orange-50' },
  { name: 'Cupcakes', emoji: '🧁', color: 'from-orange-50 to-red-50' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function HomePage() {
  const { products, loading, fetchProducts } = useProductStore();

  useEffect(() => { fetchProducts({ isFeatured: true, limit: 8 }); }, []);

  const featured = products.filter(p => p.isFeatured);
  const bestsellers = products.filter(p => p.isBestseller);

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
        {/* Mobile Background Image */}
        <div className="absolute inset-0 z-0 lg:hidden block">
          <img src="/images/storefront-mobile.jpg" alt="Storefront" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]"></div>
        </div>

        {/* Floating Emojis (Desktop Only) */}
        <div className="absolute inset-0 opacity-10 hidden lg:block z-0">
          <div className="absolute top-20 left-10 text-8xl animate-float">🌸</div>
          <div className="absolute bottom-20 right-20 text-6xl animate-float" style={{ animationDelay: '2s' }}>🧁</div>
          <div className="absolute top-40 right-40 text-5xl animate-float" style={{ animationDelay: '4s' }}>🎂</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-6">
              🌸 Freshly Baked Daily
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-accent-600 leading-tight mb-6">
              Handcrafted <br />
              <span className="text-gradient">with Love</span>
            </h1>
            <p className="text-mocha text-lg leading-relaxed mb-8 max-w-lg">
              Premium artisan cakes, brownies, and pastries made fresh every morning with the finest ingredients. Delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/products?category=cakes" className="btn-secondary text-base px-8 py-4">
                Explore Cakes
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-primary-100">
              <div><p className="text-2xl font-bold text-accent-600">500+</p><p className="text-xs text-mocha">Happy Customers</p></div>
              <div><p className="text-2xl font-bold text-accent-600">50+</p><p className="text-xs text-mocha">Unique Recipes</p></div>
              <div><p className="text-2xl font-bold text-accent-600">4.9⭐</p><p className="text-xs text-mocha">Avg Rating</p></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200/40 to-secondary-200/40 rounded-full blur-3xl" />
              <img src="/images/hero-banner.png" alt="Blooming Bakers" className="relative w-full h-full object-cover rounded-3xl shadow-2xl" />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 animate-float">
                <p className="text-sm font-semibold text-accent-600">🎂 Fresh Daily</p>
                <p className="text-xs text-mocha">Baked this morning</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 animate-float" style={{ animationDelay: '3s' }}>
                <p className="text-sm font-semibold text-accent-600">⭐ 4.9 Rating</p>
                <p className="text-xs text-mocha">500+ reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <motion.div key={cat.name} variants={fadeUp}>
                <Link to={`/products?category=${cat.name.toLowerCase()}`} className={`block p-6 rounded-2xl bg-gradient-to-br ${cat.color} text-center group hover:shadow-card transition-all duration-300 hover:-translate-y-1`}>
                  <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</span>
                  <h3 className="font-display font-semibold text-accent-600">{cat.name}</h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="section-heading">Featured Treats</h2>
            <p className="section-subheading">Our most loved creations, baked fresh daily</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />) : featured.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="btn-secondary inline-flex items-center gap-2">View All Products <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-blush to-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
              <h2 className="section-heading">⭐ Bestsellers</h2>
              <p className="section-subheading">The crowd favorites you must try</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="section-heading">Why Blooming Bakers?</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FiClock, title: 'Baked Fresh Daily', desc: 'Every product is baked fresh each morning. No preservatives, no compromises on quality.' },
              { icon: FiAward, title: 'Premium Ingredients', desc: 'We use only the finest Belgian chocolate, French butter, and organic vanilla in our recipes.' },
              { icon: FiTruck, title: 'Swift Local Delivery', desc: 'Get your treats delivered within 2 hours. Free delivery on orders above ₹500.' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center p-8 rounded-2xl bg-white shadow-soft hover:shadow-card transition-all duration-300 group">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <item.icon size={28} className="text-primary-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-accent-600 mb-3">{item.title}</h3>
                <p className="text-mocha text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary-500 to-primary-400 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 left-10 text-6xl">🍰</div>
            <div className="absolute bottom-5 right-10 text-5xl">🧁</div>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 relative z-10">Ready to taste perfection?</h2>
          <p className="text-white/80 mb-8 relative z-10">Use code <span className="font-bold bg-white/20 px-2 py-1 rounded">WELCOME10</span> for 10% off your first order!</p>
          <Link to="/products" className="inline-block px-8 py-4 bg-white text-primary-600 font-bold rounded-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative z-10">Order Now</Link>
        </div>
      </section>
    </div>
  );
}
