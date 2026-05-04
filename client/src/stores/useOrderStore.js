import { create } from 'zustand';
import api from '../utils/api';

const useOrderStore = create((set) => ({
  orders: [],
  order: null,
  loading: false,
  error: null,

  // Create order
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/orders', orderData);
      set({ order: data.order, loading: false });
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create order';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  // Get my orders
  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/orders/myorders');
      set({ orders: data.orders, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch orders', loading: false });
    }
  },

  // Get order by ID
  fetchOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/orders/${id}`);
      set({ order: data.order, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Order not found', loading: false });
    }
  },

  // Update order payment
  updateOrderPayment: async (orderId, paymentData) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/pay`, paymentData);
      set({ order: data.order });
      return data;
    } catch (error) {
      throw error;
    }
  },

  clearOrder: () => set({ order: null }),
}));

export default useOrderStore;
