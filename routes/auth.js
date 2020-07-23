
const express = require('express');

const path = require('path');

const router = express.Router();

const authController = require(path.join(__dirname, "..", "controllers", "auth.js"));

//It has been arranged according to the alphabetical order of the name of routes

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

module.exports = router;