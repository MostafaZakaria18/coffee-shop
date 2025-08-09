const User = require("../model/user");

async function injectTheme(req, res, next) {
  let userTheme = "light";

  try {
    if (req.session && req.session.user && req.session.user.id) {
      const user = await User.findById(req.session.user.id);
      if (user && user.theme) {
        userTheme = user.theme;
      }
    }

    res.locals.userTheme = userTheme;
    next();
  } catch (error) {
    console.error("Error getting user theme:", error);
    res.locals.userTheme = "light";
    next();
  }
}

module.exports = { injectTheme };
