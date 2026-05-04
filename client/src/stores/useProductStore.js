import { create } from 'zustand';
import api from '../utils/api';

const useProductStore = create((set) => ({
  products: [],
  product: null,
  categories: [],
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  total: 0,

  // Get all products with filters
  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/products', { params });
      set({
        products: data.products,
        page: data.page,
        pages: data.pages,
        total: data.total,
        loading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch products', loading: false });
    }
  },

  // Get single product
  fetchProduct: async (id) => {
    set({ loading: true, error: null, product: null });
    try {
      const { data } = await api.get(`/products/${id}`);
      set({ product: data.product, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Product not found', loading: false });
    }
  },

  // Get categories
  fetchCategories: async () => {
    try {
      const { data } = await api.get('/products/categories');
      set({ categories: data.categories });
    } catch (error) {
      // Silent fail
    }
  },

  clearProduct: () => set({ product: null }),
}));

export default useProductStore;
