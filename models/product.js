const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    targetAudience: {
        type: String,
    },
    features: {
        type: String,
    },
    usageScenarios: {
        type: String,
    },
    tone: {
        type: String,
    },
    keywords: {
        type: String,
    },
    benefits: {
        type: String,
    },
    comparableProducts: {
        type: String,
    }
});

module.exports = mongoose.model('product', ProductSchema);
