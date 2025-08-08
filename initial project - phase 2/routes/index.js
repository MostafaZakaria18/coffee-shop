const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");
const cartController = require("../controller/cartController");
const orderController = require("../controller/orderController");
const { ensureAuthenticated } = require("../middleware/auth");

//pages
router.get("/", mainController.home);
router.get("/contact", mainController.contact);
router.get("/unauth", mainController.unauth);
router.get("/menu", mainController.menu);
// router.get("/history", ensureAuthenticated, orderController.viewHistory);

//cart routes
router.get("/cart", ensureAuthenticated, cartController.viewCart);
router.post("/cart/add", ensureAuthenticated, cartController.addToCart);
router.post("/cart/remove", ensureAuthenticated, cartController.removeFromCart);
router.post(
  "/cart/increase",
  ensureAuthenticated,
  cartController.increaseQuantity
);
router.post(
  "/cart/decrease",
  ensureAuthenticated,
  cartController.decreaseQuantity
);
router.post("/cart/confirm", ensureAuthenticated, cartController.confirmOrder);
router.get("/count", ensureAuthenticated, cartController.getCartCount);
// router.post("/reorder", orderController.reorder);

module.exports = router;
