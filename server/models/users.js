const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: { 
    type: Boolean, 
    default: false 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: { 
    type: String, 
    default: 'user' 
  },  // Default role is 'user'
  subscriptionStatus: {
    status: { type: String, default: 'trial' },
    plan: { type: String, default: 'free' },
    productLimit: { type: Number, default: 5 },
    enhanceLimit: { type: Number, default: 5 },
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  verificationTokenExpire: Date,

});

module.exports = mongoose.model('User', UserSchema);
