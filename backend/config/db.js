const mongoose = require("mongoose");
const dns = require("dns");

// Set default DNS servers to Google's public DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const defaultLocalMongoUri = "mongodb://127.0.0.1:27017/SwasthSetu";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || defaultLocalMongoUri;
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(
      "MongoDB connection error. Check backend/.env MONGO_URI or start MongoDB locally."
    );
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;