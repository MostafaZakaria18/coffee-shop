const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const connectDb = require("./db");
const app = express();
const PORT = 5500;
const fs = require("fs");
const https = require("https");
const http = require("http");
const Http_port = 50;

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/routeAuth");
const { injectUserAndCart } = require("./middleware/auth");

connectDb();

const options = {
  key: fs.readFileSync(path.join('./key.pem')),
  cert: fs.readFileSync(path.join('./cert.pem')),
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(injectUserAndCart);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cart = req.session.cart || [];
  if (!req.session.cart) req.session.cart = [];
  next();
});

// Route setup
app.use("/", indexRoutes);
app.use("/", authRoutes);

app.use((req, res, next) => {
  res.status(404).render("404");
});

https.createServer(options, app).listen(PORT, () => {
  console.log(`Https server running on https://localhost:${PORT}`);
});

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running: http://localhost:${PORT}`);
// });
