exports.viewCart = (req, res) => {
    const cart = req.session.cart|| [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.render('cart', { title: 'Your Cart', cart, total });
};

exports.addToCart = (req, res) => {
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
};

exports.removeFromCart = (req, res) => {
    const { name } = req.body;
    req.session.cart = (req.session.cart || []).filter(item => item.name !== name);
    res.sendStatus(200);
};

exports.increaseQuantity = (req, res) => {
    const { name } = req.body;
    const item = req.session.cart.find(i => i.name === name);
    if (item) item.quantity++;
    res.sendStatus(200);
};

exports.decreaseQuantity = (req, res) => {
    const { name } = req.body;
    const item = req.session.cart.find(i => i.name === name);
    if (item) {
        item.quantity--;
    if (item.quantity < 1) {
      req.session.cart = req.session.cart.filter(i => i.name !== name);
    }
  }
  res.sendStatus(200);
};

exports.confirmOrder = (req, res) => {
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
};