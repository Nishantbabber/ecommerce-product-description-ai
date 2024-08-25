const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// Register User
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: 'User already exists with this email or username' });
    }
    
    user = new User({ username, email, password, isEmailVerified: false, role: 'user' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    res.json({ msg: 'User created successfully. Please verify your email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Email Verification
router.post('/verify-email', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ msg: 'Email is already verified' });
    }
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.verificationToken = hashedVerificationToken; // Ensure this field name matches
    user.verificationTokenExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

    console.log("Verification token saved:", hashedVerificationToken);

    // Save the token to the user
    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD, // Ensure to use an app-specific password or correct credentials
      },
    });

    await transporter.sendMail({
      from: {
        name: 'AIProductWriter',
        address: process.env.EMAIL_USER,
      },
      to: user.email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: 
      ${process.env.FRONTEND_URL}/verify/${verificationToken}`,
    });

    res.json({ msg: 'Verification email sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Verify Email Route
router.post('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex'); // Hash the token for comparison

    const user = await User.findOne({ 
      verificationToken: hashedToken,
      verificationTokenExpire: { $gt: Date.now() }  // Check if the token is still valid
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired verification token' });
    }

    // Verify and update the user
    user.isEmailVerified = true;
    user.verificationToken = null; // Clear the token after verification
    user.verificationTokenExpire = null; // Clear the token expiration time
    
    await user.save();
    res.status(200).json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Login User
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    let user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or username' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }
    const payload = { 
      user: { 
        id: user.id,     
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        createdAt: user.createdAt
      } 
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email isEmailVerified role subscriptionStatus createdAt'); // Include fields you need
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

//request password reset
router.post('/forgot-password', async (req, res) => {
  const { identifier } = req.body;

  try {
      // Find user by email or username
      const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      // Generate reset token using crypto
      const resetToken = crypto.randomBytes(32).toString('hex');

      // Hash the token and set expiration
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

      await user.save();

      // Send email
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      const message = `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`;

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
          },

      });

      await transporter.sendMail({
          from: {
            name: 'AIProductWriter',
            address: process.env.EMAIL_USER, // Sender's email address
          },
          to: user.email,
          subject: 'Password Reset Request',
          text: message,
      });

      res.status(200).json({ msg: 'Password Reset Request' });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
  }
});

// reset password

router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;

  try {
      // Hash the token again
      const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      // Find user by the token and check if it hasn't expired
      const user = await User.findOne({
          resetPasswordToken: hashedToken,
          resetPasswordExpire: { $gt: Date.now() }  // Check if the token is still valid
      });

      if (!user) {
          return res.status(400).json({ msg: 'Invalid or expired token' });
      }

      // Hash the new password with bcrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Clear reset token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
  }
});

// Update User Profile
router.put('/profile', [auth], async (req, res) => {
  const { currentPassword, newPassword} = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Handle password update
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    
    await user.save();

    res.json({ msg: 'Profile updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all users (admin route)
router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete user by ID (admin route)
router.delete('/admin/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


module.exports = router;
