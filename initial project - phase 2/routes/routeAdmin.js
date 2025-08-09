const express = require("express");
const router = express.Router();
const adminController = require("../controller/AdminController");
const { isAdmin, isLoggedIn } = require("../middleware/auth");
const upload = require("../middleware/upload"); 

// Dashboard
router.get("/", isLoggedIn, isAdmin, adminController.getDashboard);

// Menu 
router.get("/menu", isLoggedIn, isAdmin, adminController.getMenu);
router.get("/menu/add", isLoggedIn, isAdmin, adminController.getAddMenuForm);
router.post("/menu/add", isLoggedIn, isAdmin, upload.single('image'), adminController.addMenu);
router.get("/menu/edit/:id", isLoggedIn, isAdmin, adminController.getEditMenuForm);
router.post("/menu/edit/:id", isLoggedIn, isAdmin, upload.single('image'), adminController.editMenu);
router.get("/menu/delete/:id", isLoggedIn, isAdmin, adminController.deleteMenu);

// User
router.get("/users", isLoggedIn, isAdmin, adminController.getUsers);
router.post("/users/delete/:id", isLoggedIn, isAdmin, adminController.deleteUser);

module.exports = router;
