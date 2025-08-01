const express = require('express');
const router = express.Router();


 
// Dummy menu items
const productsList = [
  { id: 1, name: 'Espresso', price: 3.5, image: '/uploads/espresso.jpg' },
  { id: 2, name: 'Cappuccino', price: 4.0, image: '/uploads/cappuccino.jpg' },
  { id: 3, name: 'Latte', price: 4.5, image: '/uploads/latte.jpg' },
  { id: 4, name: 'Mocha', price: 5.0, image: '/uploads/mocha.jpg' }
];

router.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
});

router.get('/contact', (req, res) => res.render('contact', { title: 'Contact' }));
router.get("/unauth", (req, res) => {
  res.render("unauth"); 
});

function ensureAuthenticated(req, res, next) {
  // const user = req.session?.user || JSON.parse(req.headers['user'] || null) || null;
  if (req.session && req.session.user) {
    return next(); 
  } else {
      return res.redirect('/unauth');
    }
}

// const ensureAuthenticated = require('/middleware/unauth');

router.get('/unauth', (req, res) => {
  res.render('unauth');
});



// Menu page
router.get('/menu', (req, res) => {
  res.render('menu', {
    title: 'Menu',
    menuItems: productsList,
    userLoggedIn: !!req.session.user
  });
});

// View cart
router.get('/cart', ensureAuthenticated, (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('cart', { title: 'Your Cart', cart, total });
});

// Add item to cart
router.post('/cart/add', ensureAuthenticated ,(req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).send('Missing item data');

  if (!req.session.cart) req.session.cart = [];

  const existing = req.session.cart.find(i => i.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({ name, price: parseFloat(price), quantity: 1 });
  }

  res.json({ success: true });
});

// Remove item
router.post('/cart/remove', ensureAuthenticated,(req, res) => {
  const { name } = req.body;
  req.session.cart = (req.session.cart || []).filter(item => item.name !== name);
  res.sendStatus(200);
});

// Increase quantity
router.post('/cart/increase', ensureAuthenticated ,(req, res) => {
  const { name } = req.body;
  const item = req.session.cart.find(i => i.name === name);
  if (item) item.quantity++;
  res.sendStatus(200);
});

// Decrease quantity
router.post('/cart/decrease', ensureAuthenticated,(req, res) => {
  const { name } = req.body;
  const item = req.session.cart.find(i => i.name === name);
  if (item) {
    item.quantity--;
    if (item.quantity < 1) {
      req.session.cart = req.session.cart.filter(i => i.name !== name);
    }
  }
  res.sendStatus(200);
});

// Confirm order
router.post('/cart/confirm', ensureAuthenticated, (req, res) => {
  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.status(400).send("Cart is empty");
  }
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);


  const order = {
    items: cart,
    total: totalPrice,
    placedAt: new Date(),
  };

  console.log("Order confirmed:", order);

  req.session.cart = [];

  res.status(200).send("Order confirmed");
});


module.exports = router;
