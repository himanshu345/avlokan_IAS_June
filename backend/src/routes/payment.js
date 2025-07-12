const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const { protect } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log('Loaded payment routes');

// Add a test route for debugging
router.get('/test', (req, res) => res.send('Payment route is working!'));

// Create order
router.post('/create-order', [
  body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive integer'),
  body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
], async (req, res) => { // Uncomment 'protect' if only logged-in users can create orders
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { amount, currency = 'INR' } = req.body;
    
    console.log('Received request to create order:', { amount, currency });
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: 'receipt_' + Date.now(),
    };
    console.log('Creating Razorpay order with options:', options);
    console.log('Razorpay key_id:', process.env.RAZORPAY_KEY_ID);
    console.log('Razorpay key_secret exists:', !!process.env.RAZORPAY_KEY_SECRET);
    
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', order);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error stack:', error.stack);
    if (error && error.error) {
      // Razorpay error object
      console.error('Razorpay error details:', error.error);
      console.error('Razorpay error code:', error.error.code);
      console.error('Razorpay error description:', error.error.description);
      res.status(500).json({ error: 'Error creating order', details: error.error });
    } else {
      res.status(500).json({ error: 'Error creating order', details: error.message || error });
    }
  }
});

// Verify payment
router.post('/verify-payment', protect, [
  body('razorpay_order_id').isString().notEmpty(),
  body('razorpay_payment_id').isString().notEmpty(),
  body('razorpay_signature').isString().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Error verifying payment' });
  }
});

// Activate subscription after payment
router.post('/activate-subscription', [
  body('userId').isString().notEmpty(),
  body('planId').isString().notEmpty(),
  body('durationInMonths').optional().isInt({ min: 1, max: 24 }).withMessage('Duration must be between 1 and 24 months'),
], async (req, res) => {
  console.log('Hit activate-subscription route');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userId, planId, durationInMonths } = req.body;
    const user = await User.findById(userId);
    const plan = await SubscriptionPlan.findById(planId);
    if (!user || !plan) {
      return res.status(404).json({ success: false, message: 'User or plan not found' });
    }
    const now = new Date();
    let expiry = now;
    if (user.subscriptionExpiry && user.subscriptionExpiry > now) {
      // Extend current subscription
      expiry = new Date(user.subscriptionExpiry);
    }
    expiry.setMonth(expiry.getMonth() + (durationInMonths || 1));
    user.subscriptionPlan = plan._id;
    user.subscriptionExpiry = expiry;
    await user.save();
    res.json({ success: true, message: 'Subscription activated', subscriptionExpiry: expiry });
  } catch (error) {
    console.error('Error activating subscription:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add a route to get all subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

module.exports = router; 