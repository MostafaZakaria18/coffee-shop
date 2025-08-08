const express = require('express');
const router = express.Router();
const settingsController = require('../controller/settingsController');
const { ensureAuthenticated } = require('../middleware/auth');

// Settings page routes
router.get('/', ensureAuthenticated, settingsController.viewSettings);
router.post('/update-phone', ensureAuthenticated, settingsController.updatePhone);
router.post('/update-password', ensureAuthenticated, settingsController.updatePassword);
router.post('/update-theme', ensureAuthenticated, settingsController.updateTheme);
router.post('/update-notifications', ensureAuthenticated, settingsController.updateNotifications);

module.exports = router;