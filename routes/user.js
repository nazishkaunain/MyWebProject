const express = require("express");
const path = require("path");

const userControllers = require(path.join(__dirname, "..", "controllers", "user.js"));


const router = express.Router();

//It has been arranged according to the alphabetical order of the name of the routes


//it opens the home page where the details of the web application is given
//like what can you do in the web-site
//how it is helpful for the students
router.get("/", userControllers.getHome);

//it opens the index page where user actually gets to use the web application
//with all the functionalities available
router.get("/index", userControllers.getIndex);

router.get("/build-profile", userControllers.getBuildProfile);

module.exports = router;
