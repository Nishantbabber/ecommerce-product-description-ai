const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/product');
const axios = require('axios');
const User = require('../models/users');
const checkSubscriptionLimits = require('../middleware/checkSubscriptionLimits');


// Create a product

router.post('/', auth, checkSubscriptionLimits, async (req, res) => {
    const { title, description, category, price, imageUrl, targetAudience, features, usageScenarios, tone, keywords, benefits, comparableProducts } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Decrement product limit
        if (user.subscriptionStatus.productLimit > 0) {
            user.subscriptionStatus.productLimit -= 1;
            await user.save();
        } else {
            return res.status(403).json({ msg: 'Product limit reached. Please subscribe to continue.' });
        }

        const newProduct = new Product({
            user: req.user.id,
            title,
            description,
            category,
            price,
            imageUrl,
            targetAudience,
            features,
            usageScenarios,
            tone,
            keywords,
            benefits,
            comparableProducts
        });

        const product = await newProduct.save();

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Get all products

router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete product by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json({ msg: 'Product deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// fetching a single product by its ID
router.get('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Optionally, you can check if the product belongs to the current user
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(product);
    } catch (err) {
        console.error(err.message);

        // Handle the case where the product ID is not valid
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.status(500).send('Server error');
    }
});

// updating a single product by its ID
router.put('/:id', auth, async (req, res) => {
    const { title, description, category, price, imageUrl, targetAudience, features, usageScenarios, tone, keywords, benefits, comparableProducts } = req.body;

    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Ensure the user owns the product
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Update product fields
        product.title = title || product.title;
        product.description = description || product.description;
        product.category = category || product.category;
        product.price = price || product.price;
        product.imageUrl = imageUrl || product.imageUrl;
        product.targetAudience = targetAudience || product.targetAudience;
        product.features = features || product.features;
        product.usageScenarios = usageScenarios || product.usageScenarios;
        product.tone = tone || product.tone;
        product.keywords = keywords || product.keywords;
        product.benefits = benefits || product.benefits;
        product.comparableProducts = comparableProducts || product.comparableProducts;
        product = await product.save();

        res.json({ msg: 'Product updated successfully', product });
    } catch (err) {
        console.error(err.message);

        // Handle the case where the product ID is not valid
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.status(500).send('Server error');
    }
});

const COHERE_API_KEY = '0uCexrdofE3jRMiOuIZytOHk8hKCDfJwvLNTnY5M';

// Product enhance
router.post('/enhance/:id', auth, checkSubscriptionLimits, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (!product.description) {
            return res.status(400).json({ msg: 'Product description is required' });
        }

        // Decrement enhancement limit
        const user = await User.findById(req.user.id);

        if (user.subscriptionStatus.enhanceLimit > 0) {
            user.subscriptionStatus.enhanceLimit -= 1;
            await user.save();
        } else {
            return res.status(403).json({ msg: 'Enhancement limit reached. Please subscribe to continue.' });
        }

        const prompt = `Generate a professional product description for:
        - Product: ${product.title || 'N/A'}
        - Description: ${product.description || 'N/A'}
        ${product.targetAudience ? `- Target Audience: ${product.targetAudience}` : ''}
        ${product.features ? `- Key Features: ${product.features}` : ''}
        ${product.usageScenarios ? `- Usage Scenarios: ${product.usageScenarios}` : ''}
        ${product.tone ? `- Tone: ${product.tone}` : ''}
        ${product.keywords ? `- Keywords: ${product.keywords}` : ''}
        ${product.benefits ? `- Benefits: ${product.benefits}` : ''}
        ${product.comparableProducts ? `- Comparable Products: ${product.comparableProducts}` : ''}
        ${product.price ? `- Price: ${product.price}` : ''}`;

        // Call the Cohere API
        const response = await axios.post(
            'https://api.cohere.com/v1/generate',
            {
                prompt: prompt,
                stream: false
            },
            {
                headers: {
                    Authorization: `Bearer ${COHERE_API_KEY}`,
                    'X-Client-Name': 'my-cool-project',
                    'Content-Type': 'application/json',
                },
            }
        );

        const generatedText = response.data.generations[0]?.text?.trim();

        if (!generatedText) {
            throw new Error('No description returned from API');
        }

        product.description = generatedText;
        await product.save();

        res.json(product);
    } catch (err) {
        console.error('Error in AI enhancement route:', err.message);
        res.status(500).send('Server error');
    }
});


router.post('/preview/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Return the existing enhanced description without generating a new one
        const enhancedDescription = await product.description;
        console.log(enhancedDescription);

        res.json({ enhancedDescription });
    } catch (err) {
        console.error('Error in AI enhancement route:', err.message);
        res.status(500).send('Server error');
    }
});



module.exports = router;
