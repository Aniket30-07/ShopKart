const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Invalid shipping address' });
    }

    const customer = await Customer.findById(req.user._id).populate('cart.product');
    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let item of customer.cart) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.product.name} no longer exists` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      totalAmount += product.price * item.quantity;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    const shopKartOrder = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount
    });

    if (!razorpay) {
      return res.status(500).json({ success: false, message: 'Razorpay keys are missing on the server.' });
    }

    const amountInPaise = Math.round(totalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: shopKartOrder._id.toString()
    });

    shopKartOrder.razorpayOrderId = razorpayOrder.id;
    await shopKartOrder.save();

    res.status(200).json({
      success: true,
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error creating order' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const body = order.razorpayOrderId + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    const customer = await Customer.findById(req.user._id);
    customer.cart = [];
    await customer.save();

    res.status(200).json({ success: true, message: 'Payment verified and order placed successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error verifying payment' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching orders' });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching order' });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getOrder
};
