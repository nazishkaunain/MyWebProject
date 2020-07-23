const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require("connect-flash");

//const userRoutes = require(path.join(__dirname, "routes", "user"));
//const adminRoutes = require(path.join(__dirname, "routes", "admin"));
const authRoutes = require(path.join(__dirname, "routes", "auth"));

const User = require(path.join(__dirname, "models", "user"));

const app = express();

const store = new mongoDBStore({
  uri: "mongodb://localhost:27017/projectDB",  //remove retryWrites at the end when using online mongoose
  collection: "sessions"
});

const csrfProtection = csrf();


mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "mySecret", //put it in .env file
  resave: false,
  saveUninitialised: false,
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
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(authRoutes);
//app.use(userRoutes);
//app.use("/admin",adminRoutes);

app.use("/", (req, res, next) => {
  //render Error page
  res.status("404").render("user/404", { pageTitle: "Oops! Error!" });
});

mongoose
  .connect("mongodb://localhost:27017/projectDB")
  .then(result => {
    app.listen("3000");
  })
  .catch(err => {
    console.log(err);
  });

