const express = require('express');
const { registerCustomer, loginCustomer, logoutCustomer, getProfile } = require('../controllers/customer.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/logout', logoutCustomer);
router.get('/me', protect, getProfile);

module.exports = router;
