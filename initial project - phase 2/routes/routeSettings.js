const express = require('express');
const router = express.Router();
const settingsController = require('../controller/settingsController');
const { ensureAuthenticated, isUser } = require('../middleware/auth');

// Settings page routes
router.get('/', ensureAuthenticated, isUser, settingsController.viewSettings);
router.post('/update-phone', ensureAuthenticated, isUser, settingsController.updatePhone);
router.post('/update-password', ensureAuthenticated, isUser,settingsController.updatePassword);
router.post('/update-theme', ensureAuthenticated, isUser, settingsController.updateTheme);
router.post('/update-notifications', ensureAuthenticated, isUser, settingsController.updateNotifications);

module.exports = router;