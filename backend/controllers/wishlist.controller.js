const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

// Add to wishlist
// POST /wishlist/:productId
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    // Ensure wishlist exists
    if (!customer.wishlist) customer.wishlist = [];

    // Check if already in wishlist
    const isAlreadySaved = customer.wishlist.some(id => id.toString() === productId);
    if (isAlreadySaved) {
      return res.status(409).json({ success: false, message: 'Product already in wishlist' });
    }

    customer.wishlist.push(productId);
    await customer.save();

    res.status(200).json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get wishlist
// GET /wishlist
const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name price category image stock'
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const wishlist = customer.wishlist || [];

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist: wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Remove from wishlist
// DELETE /wishlist/:productId
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (!customer.wishlist) customer.wishlist = [];

    const isSaved = customer.wishlist.some(id => id.toString() === productId);
    if (!isSaved) {
      return res.status(404).json({ success: false, message: 'Product not in wishlist' });
    }

    customer.wishlist = customer.wishlist.filter(id => id.toString() !== productId);
    await customer.save();

    res.status(200).json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Toggle wishlist (Bonus)
// PATCH /wishlist/:productId/toggle
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(req.user._id);
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (!customer.wishlist) customer.wishlist = [];

    const isSaved = customer.wishlist.some(id => id.toString() === productId);

    if (isSaved) {
      customer.wishlist = customer.wishlist.filter(id => id.toString() !== productId);
      await customer.save();
      return res.status(200).json({ success: true, saved: false, message: 'Product removed from wishlist' });
    } else {
      customer.wishlist.push(productId);
      await customer.save();
      return res.status(200).json({ success: true, saved: true, message: 'Product added to wishlist' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist
};
