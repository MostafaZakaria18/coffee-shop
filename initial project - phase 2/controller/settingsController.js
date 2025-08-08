const User = require("../model/user");
const bcrypt = require("bcrypt");

exports.viewSettings = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.redirect("/login");
    }

    res.render("settings", {
      title: "Settings",
      user: user,
      success: null,
      error: null,
    });
  } catch (error) {
    console.error("Error loading settings:", error);
    res.status(500).render("error", {
      message: "Unable to load settings",
      error: error,
    });
  }
};

exports.updatePhone = async (req, res) => {
  const { mobile_number } = req.body;

  try {
    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;

    if (!phoneRegex.test(mobile_number)) {
      return res.json({
        success: false,
        message: "Invalid phone number format. Please use Egyptian format.",
      });
    }

    await User.findByIdAndUpdate(req.session.user.id, { mobile_number });

    res.json({
      success: true,
      message: "Phone number updated successfully!",
    });
  } catch (error) {
    console.error("Error updating phone:", error);
    res.json({
      success: false,
      message: "Failed to update phone number.",
    });
  }
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(req.session.user.id);

    if (!user) {
      // Check if it's an AJAX request
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: false,
          message: "User not found. Please login again.",
        });
      }
      return res.redirect("/login");
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      // Check if it's an AJAX request
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: false,
          message: "Current password is incorrect.",
        });
      }
      return res.render("settings", {
        title: "Settings",
        user: user,
        error: "Current password is incorrect.",
        success: null,
      });
    }

    // Use the same password validation as signup
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      // Check if it's an AJAX request
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: false,
          message:
            "Password must include uppercase, lowercase, number, symbol, and be at least 8 characters.",
        });
      }
      return res.render("settings", {
        title: "Settings",
        user: user,
        error:
          "Password must include uppercase, lowercase, number, symbol, and be at least 8 characters.",
        success: null,
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      // Check if it's an AJAX request
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: false,
          message: "New passwords do not match.",
        });
      }
      return res.render("settings", {
        title: "Settings",
        user: user,
        error: "New passwords do not match.",
        success: null,
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.findByIdAndUpdate(req.session.user.id, {
      password: hashedPassword,
    });

    // Check if it's an AJAX request
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({
        success: true,
        message: "Password updated successfully!",
        redirect: true,
      });
    }

    // For non-AJAX requests, redirect to home with session message
    req.session.passwordChanged = true;
    res.redirect("/");
  } catch (error) {
    console.error("Error updating password:", error);

    // Check if it's an AJAX request
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({
        success: false,
        message: "Failed to update password.",
      });
    }

    const user = await User.findById(req.session.user.id);
    res.render("settings", {
      title: "Settings",
      user: user,
      error: "Failed to update password.",
      success: null,
    });
  }
};

exports.updateTheme = async (req, res) => {
  const { theme } = req.body;

  try {
    if (!["light", "dark"].includes(theme)) {
      return res.status(400).json({ success: false, message: "Invalid theme" });
    }

    await User.findByIdAndUpdate(req.session.user.id, { theme });

    // Update session
    req.session.user.theme = theme;

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating theme:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update theme." });
  }
};

exports.updateNotifications = async (req, res) => {
  const { notifications } = req.body;

  try {
    const notificationValue = notifications === "true";

    await User.findByIdAndUpdate(req.session.user.id, {
      notifications: notificationValue,
    });

    res.json({ success: true, message: "Notification preferences updated!" });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update notification preferences.",
      });
  }
};
