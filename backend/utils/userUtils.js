const checkUserStatus = async (user) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  let modified = false;

  // Check Pro Expiry
  if (user.isPro && user.proExpiry && now > user.proExpiry) {
    user.isPro = false;
    modified = true;
  }

  // Daily Reset check
  if (user.lastUsedDate !== today) {
    user.usageCount = 0;
    user.lastUsedDate = today;
    modified = true;
  }

  if (modified) {
    await user.save();
  }
  
  return user;
};

module.exports = { checkUserStatus };
