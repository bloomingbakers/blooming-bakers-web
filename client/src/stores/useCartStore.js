import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('bb-cart')) || [],
  coupon: JSON.parse(localStorage.getItem('bb-coupon')) || null,
  isCartOpen: false,

  // Open/close cart drawer
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  // Add item to cart
  addItem: (product, quantity = 1) => {
    const items = [...get().items];
    const existingIndex = items.findIndex((item) => item._id === product._id);

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        _id: product._id,
        name: product.name,
        price: product.discountPrice > 0 ? product.discountPrice : product.price,
        originalPrice: product.price,
        image: product.images?.[0] || '/images/cake.png',
        quantity,
        stock: product.stock,
      });
    }

    localStorage.setItem('bb-cart', JSON.stringify(items));
    set({ items });
  },

  // Remove item from cart
  removeItem: (productId) => {
    const items = get().items.filter((item) => item._id !== productId);
    localStorage.setItem('bb-cart', JSON.stringify(items));
    set({ items });
  },

  // Update quantity
  updateQuantity: (productId, quantity) => {
    if (quantity < 1) return;
    const items = get().items.map((item) =>
      item._id === productId ? { ...item, quantity: Math.min(quantity, item.stock) } : item
    );
    localStorage.setItem('bb-cart', JSON.stringify(items));
    set({ items });
  },

  // Apply coupon
  applyCoupon: (couponData) => {
    localStorage.setItem('bb-coupon', JSON.stringify(couponData));
    set({ coupon: couponData });
  },

  // Remove coupon
  removeCoupon: () => {
    localStorage.removeItem('bb-coupon');
    set({ coupon: null });
  },

  // Clear cart
  clearCart: () => {
    localStorage.removeItem('bb-cart');
    localStorage.removeItem('bb-coupon');
    set({ items: [], coupon: null });
  },

  // Computed values
  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getDeliveryCharge: () => {
    const subtotal = get().getSubtotal();
    return subtotal >= 500 ? 0 : 49;
  },

  getDiscount: () => {
    const { coupon } = get();
    if (!coupon) return 0;
    const subtotal = get().getSubtotal();
    if (subtotal < coupon.minOrderAmount) return 0;

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }
    return Math.round(discount);
  },

  getTotal: () => {
    return get().getSubtotal() + get().getDeliveryCharge() - get().getDiscount();
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

export default useCartStore;
