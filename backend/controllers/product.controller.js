const Product = require('../models/product.model');

// POST /products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || !price || !category || !image || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required field' });
    }

    if (price <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid price' });
    }

    if (stock < 0) {
      return res.status(400).json({ success: false, message: 'Invalid stock' });
    }

    const newProduct = new Product({ name, description, price, category, image, stock });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    if (error.name === 'ValidationError') {
       return res.status(400).json({ success: false, message: error.message });
    }
    console.error('Error in createProduct:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /products
const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All Categories') {
      query.category = category;
    }

    let productQuery = Product.find(query);

    if (sort) {
      if (sort === 'price_asc') {
        productQuery = productQuery.sort({ price: 1 });
      } else if (sort === 'price_desc') {
        productQuery = productQuery.sort({ price: -1 });
      }
    }

    const products = await productQuery;

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a valid Mongoose ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById
};
