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

function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.status(403).render("error", {
    title: "Access Denied",
    message: "You do not have permission to access this page.",
  });
}

module.exports = {
  injectUserAndCart,
  ensureAuthenticated,
  isAdmin,
  isLoggedIn
};
