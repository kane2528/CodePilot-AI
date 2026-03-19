const User = require('../models/User');
const { checkUserStatus } = require('../utils/userUtils');

const usageMiddleware = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Pro expiry and daily reset logic
    user = await checkUserStatus(user);

    // Usage check
    if (!user.isPro && user.usageCount >= 10) {
      return res.status(403).json({
        success: false,
        message: 'Daily limit reached. Pay ₹15 for unlimited access today.',
        upgrade: true
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Usage Middleware error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { usageMiddleware };
