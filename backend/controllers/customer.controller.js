const Customer = require('../models/customer.model');
const generateToken = require('../utils/generateToken');

// @desc    Register a new customer
// @route   POST /customers/register
// @access  Public
const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Validation
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are mandatory' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // Check if customer exists
    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Create customer
    const customer = await Customer.create({
      fullName,
      email,
      password,
      phone
    });

    if (customer) {
      const token = generateToken(customer._id);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
      });

      res.status(201).json({
        success: true,
        message: 'Customer registered successfully',
        customer: {
          _id: customer._id,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid customer data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth customer & get token
// @route   POST /customers/login
// @access  Public
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });

    if (customer && (await customer.matchPassword(password))) {
      const token = generateToken(customer._id);

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        //maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout customer / clear cookie
// @route   POST /customers/logout
// @access  Private (though we don't strictly require auth middleware here per requirements)
const logoutCustomer = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get logged in user profile
// @route   GET /customers/me
// @access  Private
const getProfile = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone
    });
  } else {
    res.status(401).json({ success: false, message: 'User not found' });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getProfile
};
