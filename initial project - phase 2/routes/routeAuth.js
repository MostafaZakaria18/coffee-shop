const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// Signup routes
router.get('/signup',authController.getSignupForm);
router.post('/signup',authController.signup);

// Login routes 
router.get('/login', authController.getLoginForm);
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
