const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  referralCode: { type: String },
  referredBy: { type: String },
  cashback: { type: Number, default: 0 },
  successfulReferrals: [
    {
      referredUserEmail: { type: String },
      referredUserName: { type: String },

      cashback: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("authSchema", authSchema);
