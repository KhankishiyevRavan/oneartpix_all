const express = require("express");
const {
  addItem,
  listItems,
  updateItem,
  removeItem,
  feed,
  addMany, // ✅ bulk
} = require("../controllers/sliderItemController");

const router = express.Router();

// ADMIN
router.post("/items", addItem);
router.post("/items/bulk", addMany); // ✅ bulk endpoint
router.get("/items", listItems);
router.patch("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);

// FRONT
router.get("/feed", feed);

module.exports = router;
