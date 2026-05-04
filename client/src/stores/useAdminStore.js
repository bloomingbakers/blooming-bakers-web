import { create } from 'zustand';
import api from '../utils/api';

const useAdminStore = create((set) => ({
  stats: null,
  users: [],
  orders: [],
  coupons: [],
  loading: false,
  error: null,

  // Dashboard stats
  fetchStats: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/admin/stats');
      set({ stats: data.stats, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  // Users
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/admin/users');
      set({ users: data.users, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  deleteUser: async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      set((state) => ({ users: state.users.filter((u) => u._id !== id) }));
    } catch (error) {
      throw error;
    }
  },

  // Orders
  fetchAllOrders: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/orders', { params });
      set({ orders: data.orders, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      set((state) => ({
        orders: state.orders.map((o) => (o._id === id ? data.order : o)),
      }));
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Products (admin CRUD)
  createProduct: async (productData) => {
    try {
      const { data } = await api.post('/products', productData);
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const { data } = await api.put(`/products/${id}`, productData);
      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Coupons
  fetchCoupons: async () => {
    try {
      const { data } = await api.get('/coupons');
      set({ coupons: data.coupons });
    } catch (error) {
      // Silent
    }
  },

  createCoupon: async (couponData) => {
    try {
      const { data } = await api.post('/coupons', couponData);
      set((state) => ({ coupons: [...state.coupons, data.coupon] }));
      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteCoupon: async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      set((state) => ({ coupons: state.coupons.filter((c) => c._id !== id) }));
    } catch (error) {
      throw error;
    }
  },
}));

export default useAdminStore;
