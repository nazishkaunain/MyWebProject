
const express = require('express');

const path = require('path');

const router = express.Router();

const authController = require(path.join(__dirname, "..", "controllers", "auth.js"));

const isAuth = require(path.join(__dirname, "..", "middleware", "is-auth.js"));

//It has been arranged according to the alphabetical order of the name of routes

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.get("/reset", isAuth, authController.getReset);

router.post("/reset", isAuth, authController.postReset);

router.get("/reset/:token", isAuth, authController.getNewPassword);

router.post("/new-password", isAuth, authController.postNewPassword);

module.exports = router;
