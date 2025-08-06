const Order = require("../model/order");

exports.viewCart = (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("cart", { title: "Your Cart", cart, total });
};

exports.addToCart = (req, res) => {
  const { name, price } = req.body;
  const priceNum = parseFloat(price);
  if (!name || !price) return res.status(400).send("Missing item data");

  if (isNaN(priceNum)) return res.status(400).send("Invalid price");

  if (!req.session.cart) req.session.cart = [];

  const existing = req.session.cart.find((i) => i.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({ name, price: priceNum, quantity: 1 });
  }
  const totalItems = req.session.cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  res.json({
    success: true,
    totalItems,
    updatedItemQty: existing ? existing.quantity : 1,
  });
};

exports.removeFromCart = (req, res) => {
  const { name } = req.body;
  req.session.cart = (req.session.cart || []).filter(
    (item) => item.name !== name
  );
  res.sendStatus(200);
};

exports.increaseQuantity = (req, res) => {
  const { name } = req.body;
  const item = req.session.cart.find((i) => i.name === name);
  if (item) item.quantity++;

  const updatedQty = item ? Math.max(0, item.quantity) : 0;
  const totalItems = req.session.cart.reduce((sum, i) => sum + i.quantity, 0);

  res.json({ updatedItemQty: updatedQty, totalItems });
};

exports.decreaseQuantity = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("inavlid item name");

  const cart = req.session.cart || [];
  const item = cart.find((i) => i.name === name);

  if (!item) return res.status(404).send("Item not found");

  item.quantity--;

  if (item.quantity <= 0) {
    req.session.cart = cart.filter((i) => i.name !== name);
  }
  const updatedQty = item ? Math.max(0, item.quantity) : 0;
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  res.json({ updatedItemQty: updatedQty, totalItems });
};

exports.confirmOrder = async (req, res) => {
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.status(400).send("Cart is empty");
  }
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  try {
    const newOrder = new Order({
      items: cart,
      total: totalPrice,
      placedAt: new Date(),
      user: req.session.userId,
    });

    await newOrder.save();

    console.log("order saved", newOrder);
    req.session.cart = [];
    res.status(200).send("Order confirmed");
  } catch (err) {
    console.error("Error saving order:", error.message);
    res.status(500).send("Failed to confirm order");
  }
};

exports.getCartCount = (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  res.json({ total });
};
