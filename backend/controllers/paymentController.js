const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: 1500, // ₹15 in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order_id: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ success: false, message: 'Payment initiation failed' });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified
      const user = await User.findById(req.user._id);
      
      const extensionTime = 24 * 60 * 60 * 1000; // 24 hours
      const now = new Date();

      if (user.isPro && user.proExpiry && user.proExpiry > now) {
        // Extend existing pro expiry
        user.proExpiry = new Date(user.proExpiry.getTime() + extensionTime);
      } else {
        // New pro session
        user.isPro = true;
        user.proExpiry = new Date(now.getTime() + extensionTime);
      }
      
      await user.save();

      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
