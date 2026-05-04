import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your email'); return; }
    setSubscribing(true);
    try {
      const { data } = await api.post('/subscribe', { email });
      toast.success(data.message || 'Subscribed! 🎉');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
    }
    setSubscribing(false);
  };

  return (
    <footer className="bg-accent-600 text-white/90 mt-20">
      {/* Newsletter strip */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-white">Stay in the sweet loop 🍰</h3>
            <p className="text-white/80 text-sm mt-1">Get exclusive offers, new arrivals & baker&apos;s specials</p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2.5 rounded-full bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30 w-full md:w-72 text-sm"
              required
            />
            <button disabled={subscribing} className="px-6 py-2.5 bg-white text-primary-500 font-semibold rounded-full hover:bg-cream transition-colors text-sm whitespace-nowrap disabled:opacity-60">
              {subscribing ? 'Sending...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-white p-1.5 shadow-md shrink-0">
                <img src="/images/logo.png" alt="Blooming Bakers" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-none">Blooming</h3>
                <p className="text-[9px] tracking-[0.25em] text-white/60 uppercase">Bakers</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Handcrafted with love and the finest ingredients. Every bite tells a story of passion,
              quality, and the art of baking.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://www.instagram.com/bloomingbakersvns?igsh=MTF5N250aHowNjZkeQ==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FiInstagram size={16} />
              </a>
              <a href="https://www.facebook.com/share/1LUYquYd3G/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FiFacebook size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Quick Links</h4>
            <div className="space-y-2.5">
              {[
                { name: 'Shop All', path: '/products' },
                { name: 'Cakes', path: '/products?category=cakes' },
                { name: 'Brownies', path: '/products?category=brownies' },
                { name: 'Pastries', path: '/products?category=pastries' },
                { name: 'Cupcakes', path: '/products?category=cupcakes' },
              ].map((link) => (
                <Link key={link.name} to={link.path} className="block text-sm text-white/60 hover:text-primary-300 transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Help</h4>
            <div className="space-y-2.5">
              {[
                { name: 'My Orders', path: '/orders' },
                { name: 'Track Order', path: '/orders' },
                { name: 'Delivery Info', path: '#' },
                { name: 'Return Policy', path: '#' },
                { name: 'FAQs', path: '#' },
              ].map((item) => (
                <Link key={item.name} to={item.path} className="block text-sm text-white/60 hover:text-primary-300 transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-white/60">
                <FiMapPin size={16} className="mt-0.5 shrink-0 text-primary-300" />
                <span>Gilat Bazar, Varanasi, Uttar Pradesh 221002</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <FiMail size={16} className="shrink-0 text-primary-300" />
                <a href="mailto:thebloomingbakers@gmail.com" className="hover:text-primary-300 transition-colors">thebloomingbakers@gmail.com</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <FiInstagram size={16} className="shrink-0 text-primary-300" />
                <a href="https://www.instagram.com/bloomingbakersvns?igsh=MTF5N250aHowNjZkeQ==" target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 transition-colors">@bloomingbakersvns</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Blooming Bakers. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
