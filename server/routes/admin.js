const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/users');
const Product = require('../models/product');


// Route to delete a user (Admin only)
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Route to fetch paginated users list (Admin only)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments();
    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { username, role } = req.body;

    // Find user and update their details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user details
    if (username) user.username = username;
    if (role) user.role = role;

    await user.save();

    res.json({ success: true, msg: 'User updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Route to fetch total user count (Admin only)
router.get('/users-count', auth, adminAuth, async (req, res) => {
  try {
    console.log('reached');
    const totalUsers = await User.countDocuments();
    res.json({ count: totalUsers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user count' });
  }
});

// Route to fetch total product count (Admin only)
router.get('/products-count', auth, adminAuth, async (req, res) => {
  try {
    console.log('reached');
    const totalProducts = await Product.countDocuments();
    res.json({ count: totalProducts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product count' });
  }
});

// Route to fetch all products (Admin only)
router.get('/products', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments();
    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Route to fetch a single product by ID (Admin only)
router.get('/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Route to delete a product (Admin only)
router.delete('/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Route to edit a product (Admin only)
router.put('/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const { title, description, category, price, imageUrl, targetAudience, features, usageScenarios, tone, keywords, benefits, comparableProducts } = req.body;

    // Find product and update its details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product details
    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = price;
    if (imageUrl) product.imageUrl = imageUrl;
    if (targetAudience) product.targetAudience = targetAudience;
    if (features) product.features = features;
    if (usageScenarios) product.usageScenarios = usageScenarios;
    if (tone) product.tone = tone;
    if (keywords) product.keywords = keywords;
    if (benefits) product.benefits = benefits;
    if (comparableProducts) product.comparableProducts = comparableProducts;

    await product.save();

    res.json({ success: true, msg: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});


module.exports = router;
