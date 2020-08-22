
const express = require('express');

const path = require('path');

const router = express.Router();

const authController = require(path.join(__dirname, "..", "controllers", "auth.js"));

const isAuth = require(path.join(__dirname, "..", "middleware", "is-auth.js"));

const isNotAuth = require(path.join(__dirname, "..", "middleware", "is-not-auth"));

//It has been arranged according to the alphabetical order of the name of routes

router.get("/login", isNotAuth, authController.getLogin);

router.post("/login", isNotAuth, authController.postLogin);

router.post("/logout", isAuth, authController.postLogout);

router.get("/signup", isNotAuth, authController.getSignup);

router.post("/signup", isNotAuth, authController.postSignup);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

router.post("/verify", isAuth, authController.postVerify);

router.get("/verification/:token",isAuth, authController.getVerification);

router.post("/verification", isAuth, authController.postVerification);

module.exports = router;
