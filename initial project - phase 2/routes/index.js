const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");
const cartController = require("../controller/cartController");
const { ensureAuthenticated, isUser } = require("../middleware/auth");

//pages
router.get("/", mainController.home);
router.get("/contact", mainController.contact);
router.get("/unauth", mainController.unauth);
router.get("/menu", mainController.menu);

//cart routes
router.get("/cart", ensureAuthenticated, isUser, cartController.viewCart);
router.post("/cart/add", ensureAuthenticated, isUser, cartController.addToCart);
router.post(
  "/cart/remove",
  ensureAuthenticated,
  isUser,
  cartController.removeFromCart
);
router.post(
  "/cart/increase",
  ensureAuthenticated,
  isUser,
  cartController.increaseQuantity
);
router.post(
  "/cart/decrease",
  ensureAuthenticated,
  isUser,
  cartController.decreaseQuantity
);
router.post(
  "/cart/confirm",
  ensureAuthenticated,
  isUser,
  cartController.confirmOrder
);
router.get("/count", ensureAuthenticated, isUser, cartController.getCartCount);

module.exports = router;
