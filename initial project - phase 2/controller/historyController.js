const Order = require("../model/order");

exports.viewHistory = async (req, res) => {
  try {
    // Find all orders for the current user, sorted by newest first
    const orders = await Order.find({ user: req.session.user.id }).sort({
      placedAt: -1,
    });


    res.render("history", {
      title: "Order History",
      orders: orders || [],
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).render("error", {
      message: "Unable to load order history",
      error: error,
    });
  }
};
