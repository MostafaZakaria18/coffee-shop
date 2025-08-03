const mongoose = require('mongoose');
const Product = require('./model/products');

const products = [
  { name: 'americano', price: 2, image: '/uploads/american.jpg' },
  { name: 'Espresso', price: 3.5, image: '/uploads/espresso.jpg' },
  { name: 'Cappuccino', price: 4.0, image: '/uploads/cappuccino.jpg' },
  { name: 'Latte', price: 4.5, image: '/uploads/latte.jpg' },
  { name: 'Mocha', price: 5.0, image: '/uploads/mocha.jpg' }
];

mongoose.connect('mongodb://localhost:27017/coffe_shop')
  .then(async () => {
    console.log('Connected to DB...');
    
    // Optional: Clear existing products
    await Product.deleteMany({});

    // Insert new products
    await Product.insertMany(products);
    console.log('Products inserted successfully!');
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('DB connection error:', err);
  });
