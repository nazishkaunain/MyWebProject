const express = require("express");
const path = require("path");

const router = express.Router();

const adminControllers = require(path.join(__dirname, "..", "controllers", "admin.js"));

//It has been arranged according to the alphabetical order of the name of routes

//admin/home => GET
//it will direct the user to the home page for the admin
router.get("/home", adminControllers.getAdminHome);

//admin/login => GET
router.get("/login",getAdminControllers.getLogin);

//admin/login => POST
router.post("/login", postAdminControllers.postLogin);

//admin/users => GET
router.get("/users",getAdminControllers.getUsers);

module.exports = router;
