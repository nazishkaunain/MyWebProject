const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");

const userRoutes = require(path.join(__dirname, "routes", "user"));
const adminRoutes = require(path.join(__dirname, "routes", "admin"));

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(userRoutes);
app.use("/admin",adminRoutes);

app.use("/", (req, res, next) => {
  //render Error page
  res.status("404").render("user/404", { pageTitle: "Oops! Error!" });
});

app.listen("3000", () => {
  console.log("The website is running live on server 3000");
});
