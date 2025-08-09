const Product = require("../model/products");
const User = require("../model/user");

// Dashboard
exports.getDashboard = async (req, res) => {
  const productCount = await Product.countDocuments();
  const userCount = await User.countDocuments();
  res.render("admin/dashboard", { productCount, userCount });
};

//Menu
exports.getMenu = async (req, res) => {
  const products = await Product.find();
  console.log("Products found:", products.length);

  res.render("admin/menu", { products, userLoggedIn: !!req.session.user });
};

exports.getAddMenuForm = (req, res) => {
  res.render("admin/addProduct", { error: null });
};

exports.addMenu = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!req.file) {
      return res.status(400).render("admin/addProduct", {
        error: "Image is required.",
        name,
        price,
      });
    }

    const product = new Product({
      name,
      price,
      image: `/uploads/${req.file.filename}`,
    });

    await product.save();
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).render("admin/addProduct", {
      error: "Error adding menu item.",
      name: req.body.name,
      price: req.body.price,
    });
  }
};

exports.getEditMenuForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/editProduct", { product, error: null });
};

exports.editMenu = async (req, res) => {
  try {
    const { name, price } = req.body;
    const updateData = { name, price };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    const product = await Product.findById(req.params.id);
    res.status(500).render("admin/editProduct", {
      product,
      error: "Error updating menu item.",
    });
  }
};

exports.deleteMenu = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
};

//User Management
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.render("admin/User", { users });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
};
