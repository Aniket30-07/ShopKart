const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product.model');

// Load env variables
dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
    price: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    stock: 45
  },
  {
    name: "Minimalist Mechanical Keyboard",
    description: "Tenkeyless mechanical keyboard with tactile switches and customizable RGB backlighting.",
    price: 129.50,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80",
    stock: 20
  },
  {
    name: "Ergonomic Office Chair",
    description: "Fully adjustable ergonomic chair designed for long hours of comfortable working.",
    price: 199.00,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80",
    stock: 15
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your health metrics, workouts, and receive notifications directly on your wrist.",
    price: 149.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    stock: 60
  },
  {
    name: "Ceramic Coffee Mug",
    description: "Handcrafted ceramic mug, perfect for your morning coffee or evening tea.",
    price: 18.50,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80",
    stock: 120
  }
];

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    // Clear existing products
    await Product.deleteMany();
    console.log("Existing products cleared");

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log("Sample products added successfully!");

    // Close the connection
    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
