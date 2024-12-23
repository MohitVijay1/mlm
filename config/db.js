const mongoose = require("mongoose");

const dbURI =
  "mongodb+srv://admin:admin@mlm.yldup.mongodb.net/?retryWrites=true&w=majority&appName=mlm";
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
