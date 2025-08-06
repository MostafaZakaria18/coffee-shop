function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/unauth");
}

function injectUserAndCart(req, res, next) {
  const cart = req.session.cart || [];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  res.locals.cartCount = cartCount;
  res.locals.user = req.session.user || null;
  next();
}

module.exports = {
  injectUserAndCart,
  ensureAuthenticated,
};
