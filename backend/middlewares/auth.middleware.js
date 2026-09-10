const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');

const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to req.user
      req.user = await Customer.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
