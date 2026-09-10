const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const customerRoutes = require('./routes/customer.routes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('server started');
});
app.use('/customers', customerRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
