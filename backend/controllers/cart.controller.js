const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    // Validate productId as valid mongoose ObjectId
    if (!productId || productId.length !== 24) {
       return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const customer = await Customer.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cartItemIndex = customer.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      if (customer.cart[cartItemIndex].quantity + 1 > product.stock) {
        return res.status(400).json({ success: false, message: 'Exceeds stock limits' });
      }
      customer.cart[cartItemIndex].quantity += 1;
    } else {
      if (1 > product.stock) {
         return res.status(400).json({ success: false, message: 'Out of stock' });
      }
      customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();
    
    const populatedCustomer = await Customer.findById(customer._id).populate('cart.product');
    res.json({ success: true, message: 'Cart updated', cart: populatedCustomer.cart });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: customer.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Quantity
const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    const customer = await Customer.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cartItemIndex = customer.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: 'Quantity exceeds stock' });
    }

    customer.cart[cartItemIndex].quantity = quantity;
    await customer.save();

    const populatedCustomer = await Customer.findById(customer._id).populate('cart.product');
    res.json({ success: true, cart: populatedCustomer.cart });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const customer = await Customer.findById(req.user._id);
    
    const cartItemIndex = customer.cart.findIndex(item => item.product.toString() === productId);
    
    if (cartItemIndex !== -1) {
      customer.cart.splice(cartItemIndex, 1);
      await customer.save();
    }

    const populatedCustomer = await Customer.findById(customer._id).populate('cart.product');
    res.json({ success: true, message: 'Removed from cart', cart: populatedCustomer.cart });
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addToCart, getCart, updateQuantity, removeFromCart };
