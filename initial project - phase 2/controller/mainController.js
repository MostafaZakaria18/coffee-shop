const product = require('../model/products');

exports.home = (req, res) => res.render('index', { title: 'Home Page'});
exports.contact  = (req, res) => res.render('contact ', { title: 'Contact'});
exports.unauth = (req, res) => res.render('unauth');

exports.menu = async (req, res) => {
    const products = await product.find();
    res.render('menu',{
        title: 'Menu',
        menuItems: products,
        userLoggedIn: !!req.session.user
    });
};