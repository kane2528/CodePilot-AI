const dotenv = require('dotenv');
dotenv.config();
const passport = require("./config/passport");
const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars


// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
// Serve static files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.set("trust proxy", 1);
// Enable CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CodePilot AI Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Import and mount routes with better error handling
console.log('\n=== Loading route modules ===\n');

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);


try {
  const profileRoutes = require('./routes/profileRoutes');
  if (typeof profileRoutes === 'function') {
    app.use('/api/profile', profileRoutes);
    console.log('✓ Mounted profile routes');
  } else {
    console.error('✗ profileRoutes is not a function (type:', typeof profileRoutes, ')');
  }
} catch (error) {
  console.error('✗ Failed to load profileRoutes:', error.message);
}

const toolRoutes = require('./routes/toolRoutes');
app.use('/api/tools', toolRoutes);
console.log('✓ Mounted tool routes');

const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resume', resumeRoutes);
console.log('✓ Mounted resume routes');

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);
console.log('✓ Mounted payment routes');

console.log('\n=== Route loading complete ===\n');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});



// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(process.env.MONGO_URI);
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(process.env.MONGO_URI);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
console.log("JWT_SECRET:", process.env.JWT_SECRET);
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
