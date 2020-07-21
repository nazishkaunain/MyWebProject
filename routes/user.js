const express = require("express");
const path = require("path");

const getUserControllers = require(path.join(__dirname, "..", "controllers", "user", "get.js"));
const postUserControllers = require(path.join(__dirname, "..", "controllers", "user", "post.js"));

const router = express.Router();


//the route page opens the login page
router.get("/",getUserControllers.getLogin );

router.get("/sign-up",getUserControllers.getSignUp );

router.post("/sign-up", postUserControllers.postSignUp);

router.post("/login", postUserControllers.postLogin);

router.get("/home",getUserControllers.getHome);

router.get("/build-profile",getUserControllers.getBuildProfile);

module.exports = router;
