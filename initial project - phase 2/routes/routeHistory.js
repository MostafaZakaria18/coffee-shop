const express = require("express");
const router = express.Router();
const historyController = require("../controller/historyController");
const { ensureAuthenticated } = require("../middleware/auth");

// History page route
router.get("/", ensureAuthenticated, historyController.viewHistory);

module.exports = router;
