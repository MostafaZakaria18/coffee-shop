const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5500;

const indexRoutes = require('./routes/index');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cart = req.session.cart || [];
  if (!req.session.cart) req.session.cart = [];
  next();
});

// Route setup
app.use('/', indexRoutes);

app.use((req, res, next) => {
  res.status(404).render("404");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
