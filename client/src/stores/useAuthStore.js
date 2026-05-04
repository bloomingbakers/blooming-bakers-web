import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('bb-user')) || null,
  token: localStorage.getItem('bb-token') || null,
  loading: false,
  error: null,

  // Register
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('bb-token', data.token);
      localStorage.setItem('bb-user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('bb-token', data.token);
      localStorage.setItem('bb-user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  // Google Login
  googleLogin: async (googleData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/google', googleData);
      localStorage.setItem('bb-token', data.token);
      localStorage.setItem('bb-user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Google login failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('bb-token');
    localStorage.removeItem('bb-user');
    set({ user: null, token: null });
  },

  // Get profile
  getProfile: async () => {
    try {
      const { data } = await api.get('/auth/profile');
      localStorage.setItem('bb-user', JSON.stringify(data.user));
      set({ user: data.user });
    } catch (error) {
      // Silent fail — user may not be logged in
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    set({ loading: true });
    try {
      const { data } = await api.put('/auth/profile', updates);
      localStorage.setItem('bb-user', JSON.stringify(data.user));
      set({ user: data.user, loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Toggle wishlist
  toggleWishlist: async (productId) => {
    try {
      const { data } = await api.post(`/auth/wishlist/${productId}`);
      const user = { ...get().user, wishlist: data.wishlist };
      localStorage.setItem('bb-user', JSON.stringify(user));
      set({ user });
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Check if product is in wishlist
  isInWishlist: (productId) => {
    const { user } = get();
    if (!user || !user.wishlist) return false;
    return user.wishlist.some((item) =>
      typeof item === 'string' ? item === productId : item._id === productId
    );
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
