const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const User = require("../models/Auth");
const Order = require("../models/Order");
router.post("/placeOrder", async (req, res) => {
  const { items, userEmail } = req.body;

  // Validate request
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Items are required to place an order." });
  }
  //   if (!userEmail) {
  //     return res.status(400).json({ error: "User email is required." });
  //   }

  try {
    let totalAmount = 0;

    // Verify each item and calculate total amount
    for (const item of items) {
      const dbItem = await Item.findOne({ id: item.itemId });

      if (!dbItem) {
        return res
          .status(404)
          .json({ error: `Item with ID ${item.itemId} not found.` });
      }

      //   if (dbItem.stock_quantity < item.quantity) {
      //     return res
      //       .status(400)
      //       .json({ error: `Insufficient stock for item ID ${item.itemId}.` });
      //   }
      totalAmount += dbItem.price * item.quantity;
    }

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}`;

    // Create a new order
    const newOrder = new Order({
      orderId,
      items,
      totalAmount,
      userEmail: userEmail,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Update stock quantities for ordered items
    // for (const item of items) {
    //   await Item.updateOne(
    //     { id: item.itemId },
    //     { $inc: { stock_quantity: -item.quantity } }
    //   );
    // }

    // Fetch the user placing the order

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check referral and order value for cashback
    if (totalAmount > 1250 && user.referredBy) {
      // Fetch the referring user
      user.cashback += 1250;
      await user.save();

      const referringUser = await User.findOne({
        referralCode: user.referredBy,
      });

      if (referringUser) {
        referringUser.cashback += 50;

        referringUser.successfulReferrals.map((user, index) => {
          if (user.referredUserEmail === userEmail) {
            user.cashback += 50;
            return user;
          } else return user;
        });

        await referringUser.save();
      }
    }

    res
      .status(201)
      .json({ message: "Order placed successfully!", data: savedOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to place order.", details: error });
  }
});

module.exports = router;
