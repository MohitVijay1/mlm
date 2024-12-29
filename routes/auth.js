const express = require("express");
const router = express.Router();
const authSchema = require("../models/Auth");
const crypto = require("crypto");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await authSchema
    .findOne({ email, password })
    .select("-password");
  if (existingUser) {
    res.status(201).json({
      message: "user logIn succesfully",
      status: "success",
      response: existingUser,
    });
  } else res.status(404).json({ message: "User not found", status: "failed" });
  console.log(existingUser);
});

router.post("/sign-in", async (req, res) => {
  const { fullName, email, password, referralCode } = req.body;
  try {
    const randomPart = crypto.randomBytes(3).toString("hex");
    const newReferralCode = `${fullName.split(" ").join("")}_${randomPart}`;
    const newUser = new authSchema({
      fullName,
      email,
      password,
      referralCode: newReferralCode,
      referredBy: referralCode || null,
      cashback: 100,
    });
    const response = await newUser.save();
    if (referralCode) {
      // Find the user associated with the referral code
      let referralCodeUser = await authSchema.findOne({ referralCode });

      if (referralCodeUser) {
        // Add the new referral to the successfulReferrals array
        referralCodeUser.successfulReferrals.push({
          referredUserEmail: email,
          cashback: 100,
          referredUserName: fullName,
        });

        // Save the updated user document
        await referralCodeUser.save();
        console.log("Referral successfully added:", referralCodeUser);
      } else {
        console.log("Referral code is invalid.");
      }
    }

    res.status(201).json({
      message: "User created successfully",
      status: "Success",
      data: response,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.post("/userProfile", async (req, res) => {
  const { email } = req.body;

  try {
    const profile = await authSchema.find({ email });
    res
      .status(200) // Changed to 200 for successful fetching, 201 is typically used for resource creation.
      .json({
        message: "User profile fetched successfully",
        data: profile,
      });
  } catch (err) {
    console.error("Error in userProfile:", err.message); // Updated for better readability
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: err.message });
  }
});

module.exports = router;
