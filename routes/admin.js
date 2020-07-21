const express = require("express");
const path = require("path");

const router = express.Router();

const getAdminControllers = require(path.join(__dirname, "..", "controllers", "admin", "get.js"));
const postAdminControllers = require(path.join(__dirname, "..", "controllers", "admin", "post.js"));

//admin/login => GET
router.get("/login",getAdminControllers.getLogin);

//admin/login => POST
router.post("/login", postAdminControllers.postLogin);

//admin/users => GET
router.get("/users",getAdminControllers.getUsers);

module.exports = router;
