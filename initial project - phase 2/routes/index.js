const express = require('express');
const router = express.Router();
const mainController = require('../controller/mainController');
const cartController = require('../controller/cartController');
const { ensureAuthenticated } = require('../middleware/auth');

 
// Dummy menu items
// const productsList = [
//   { id: 1, name: 'Espresso', price: 3.5, image: '/uploads/espresso.jpg' },
//   { id: 2, name: 'Cappuccino', price: 4.0, image: '/uploads/cappuccino.jpg' },
//   { id: 3, name: 'Latte', price: 4.5, image: '/uploads/latte.jpg' },
//   { id: 4, name: 'Mocha', price: 5.0, image: '/uploads/mocha.jpg' }
// ];

//pages
router.get('/', mainController.home);
router.get('/contact', mainController.contact);
router.get('/unauth', mainController.unauth);
router.get('/menu', mainController.menu);


//cart routes
router.get('/cart', ensureAuthenticated, cartController.viewCart);
router.post('/cart/add', ensureAuthenticated, cartController.addToCart);
router.post('/cart/remove', ensureAuthenticated, cartController.removeFromCart);
router.post('/cart/increase', ensureAuthenticated, cartController.increaseQuantity);
router.post('/cart/decrease', ensureAuthenticated, cartController.decreaseQuantity);
router.post('/cart/confirm', ensureAuthenticated, cartController.confirmOrder);


module.exports = router;
