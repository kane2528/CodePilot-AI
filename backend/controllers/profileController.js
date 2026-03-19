const User = require('../models/User');
const { checkUserStatus } = require('../utils/userUtils');

// @desc    Get current user profile
// @route   GET /api/profile/me
const getProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    
    if (user) {
      user = await checkUserStatus(user);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/update
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Fields to update
    const updateFields = [
      'firstName', 'lastName', 'role', 'profile',
      'skills', 'languages', 'github', 'linkedin', 'portfolio',
      'university', 'degree', 'cgpa', 'graduationYear',
      'company', 'position', 'experienceYears'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'profile') {
          // If updating profile obj, preserve existing avatar so it isn't overwritten
          const oldAvatar = user.profile?.avatar;
          user.profile = { ...user.profile, ...req.body.profile };
          if (oldAvatar && !req.body.profile.avatar) {
             user.profile.avatar = oldAvatar;
          }
        } else {
          user[field] = req.body[field];
        }
      }
    });

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update user profile image
// @route   POST /api/profile/upload-image
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Construct the public URL for the newly uploaded file
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const imageUrl = `${baseUrl}/uploads/profiles/${req.file.filename}`;

    // Save image URL to user profile
    if (!user.profile) user.profile = {};
    user.profile.avatar = imageUrl;
    
    // Explicit mark modified if mongoose doesn't catch nested obj change automatically
    user.markModified('profile'); 
    await user.save();

    res.json({
      success: true,
      data: {
        avatarUrl: imageUrl
      }
    });

  } catch (error) {
    console.error("Local upload error:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image' 
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfileImage
};