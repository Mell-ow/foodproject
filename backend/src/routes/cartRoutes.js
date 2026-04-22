const express = require("express");
const { carts, menu } = require("../data/store");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function getUserCart(userId) {
  if (!carts[userId]) {
    carts[userId] = [];
  }

  return carts[userId];
}

router.get("/", requireAuth, (req, res) => {
  const cart = getUserCart(req.user.id);
  return res.json({ cart });
});

router.post("/", requireAuth, (req, res) => {
  const { itemId, quantity = 1 } = req.body;

  if (!itemId) {
    return res.status(400).json({ message: "itemId is required" });
  }

  const menuItem = menu.find((item) => item.id === Number(itemId));

  if (!menuItem) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  const cart = getUserCart(req.user.id);
  const existing = cart.find((item) => item.id === menuItem.id);

  if (existing) {
    existing.quantity += Number(quantity) || 1;
  } else {
    cart.push({ ...menuItem, quantity: Number(quantity) || 1 });
  }

  return res.status(201).json({ message: "Item added", cart });
});

router.patch("/:itemId", requireAuth, (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: "quantity must be an integer >= 1" });
  }

  const cart = getUserCart(req.user.id);
  const item = cart.find((entry) => entry.id === Number(itemId));

  if (!item) {
    return res.status(404).json({ message: "Item not in cart" });
  }

  item.quantity = quantity;
  return res.json({ message: "Quantity updated", cart });
});

router.delete("/:itemId", requireAuth, (req, res) => {
  const { itemId } = req.params;
  const cart = getUserCart(req.user.id);
  const index = cart.findIndex((entry) => entry.id === Number(itemId));

  if (index === -1) {
    return res.status(404).json({ message: "Item not in cart" });
  }

  cart.splice(index, 1);
  return res.json({ message: "Item removed", cart });
});

router.delete("/", requireAuth, (req, res) => {
  carts[req.user.id] = [];
  return res.json({ message: "Cart cleared", cart: [] });
});

module.exports = router;