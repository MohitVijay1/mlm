const express = require("express");
const router = express.Router();
const itemSchema = require("../models/Item");
router.post("/addItem", async (req, res) => {
  const { id, name, category, price, stock_quantity, description, img_url } =
    req.body;
  console.log("inapi");

  // Input validation (optional, but recommended)
  if (
    !id ||
    !name ||
    !category ||
    !price ||
    !stock_quantity ||
    !description ||
    !img_url
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Create a new item instance
    const newItem = new itemSchema({
      id,
      name,
      category,
      price,
      stock_quantity,
      description,
      img_url,
    });

    // Save the item to the database
    const savedItem = await newItem.save();
    res
      .status(201)
      .json({ message: "Item added successfully!", data: savedItem });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add item.", details: error.message });
  }
});

router.get("/getAllItems", async (req, res) => {
  try {
    const items = await itemSchema.find(); // Fetch all items from the database
    res
      .status(200)
      .json({ message: "Items retrieved successfully!", data: items });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve items.", details: error.message });
  }
});

// API to Get Item by ID
router.post("/getItem", async (req, res) => {
  const { id } = req.body;

  // Validate request
  if (!id) {
    return res.status(400).json({ error: "Item ID is required." });
  }

  try {
    const item = await itemSchema.findOne({ id }); // Find item by ID

    // If item not found
    if (!item) {
      return res.status(404).json({ error: "Item not found." });
    }

    res
      .status(200)
      .json({ message: "Item retrieved successfully!", data: item });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve item.", details: error.message });
  }
});

module.exports = router;
