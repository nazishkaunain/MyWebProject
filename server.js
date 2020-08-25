require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require("connect-flash");
const multer = require("multer");
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const userRoutes = require(path.join(__dirname, "routes", "user"));
const adminRoutes = require(path.join(__dirname, "routes", "admin"));
const authRoutes = require(path.join(__dirname, "routes", "auth"));

const User = require(path.join(__dirname, "models", "user"));

const app = express();

const store = new mongoDBStore({
  uri: "mongodb://localhost:27017/projectDB",
  //uri: process.env.DATABASE_API,  //remove retryWrites at the end when using online mongoose
  collection: "sessions"
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else cb(null, false);
}

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage , fileFilter: fileFilter }).single("document"));  //document is the name of the field in the form which accepts the file
app.use(express.static("public"));
app.use("/images", express.static("images"));  //for storing the uploaded images
app.use("/compressedImages", express.static("compressedImages"));

app.use(session({
  secret: process.env.SECRET, //put it in .env file
  resave: false,
  saveUninitialized: false,
  store: store //it connects session to mongdb store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  //if the user is not logged in
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });

});

//it will always render the two variables isAuthenticated and csrfToken in every veiw
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.csrfToken = req.csrfToken();
  res.locals.isVerified = req.session.isVerified;
  res.locals.hasBuiltProfile = req.session.hasBuiltProfile;
  next();
});

app.use(authRoutes);
app.use(userRoutes);
app.use("/admin",adminRoutes);

app.use("/", (req, res, next) => {
  //render Error page
  res.status("404").render("user/404", { pageTitle: "Oops! Error!" });
});

mongoose
  .connect("mongodb://localhost:27017/projectDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  // .connect(process.env.DATABASE_API, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useFindAndModify: false
  // })
  .then(result => {
    app.listen(process.env.PORT || "3000");
  })
  .catch(err => {
    console.log(err);
  });
