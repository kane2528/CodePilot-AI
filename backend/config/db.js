const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options help with connection stability
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Force IPv4 (sometimes IPv6 causes issues)
    });
    
    console.log(`
    🍃 MongoDB Connected Successfully!
    📊 Host: ${conn.connection.host}
    📁 Database: ${conn.connection.name}
    `);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please make sure MongoDB is running and MONGO_URI is correct');
    process.exit(1);
  }
};

module.exports = connectDB;