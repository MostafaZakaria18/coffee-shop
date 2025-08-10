const express = require("express");
const router = express.Router();
const historyController = require("../controller/historyController");
const { ensureAuthenticated, isUser } = require("../middleware/auth");

// History page route
router.get("/", ensureAuthenticated, isUser, historyController.viewHistory);

module.exports = router;
