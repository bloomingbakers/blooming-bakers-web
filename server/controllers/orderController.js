import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create a new order
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, discount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Calculate prices
    let itemsPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock` });
      }
      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      itemsPrice += price * item.quantity;

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    const deliveryCharge = itemsPrice >= 500 ? 0 : 49;
    const totalPrice = itemsPrice + deliveryCharge - (discount || 0);

    // Set estimated delivery (2 hours from now for local delivery)
    const estimatedDelivery = new Date();
    estimatedDelivery.setHours(estimatedDelivery.getHours() + 2);

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      deliveryCharge,
      discount: discount || 0,
      couponCode: couponCode || '',
      totalPrice,
      isPaid: paymentMethod === 'cod' ? false : false,
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      estimatedDelivery,
    });

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

    res.status(201).json({ success: true, order: populatedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow user to see their own orders or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order payment (after Razorpay success)
// @route   PUT /api/orders/:id/pay
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'confirmed';
    order.paymentResult = {
      razorpay_order_id: req.body.razorpay_order_id,
      razorpay_payment_id: req.body.razorpay_payment_id,
      razorpay_signature: req.body.razorpay_signature,
      status: 'completed',
    };

    const updatedOrder = await order.save();
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status;
    if (req.body.status === 'delivered') {
      order.deliveredAt = Date.now();
      if (order.paymentMethod === 'cod') {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }

    if (req.body.status === 'cancelled') {
      // Restore stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    const updatedOrder = await order.save();
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      orders,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};
