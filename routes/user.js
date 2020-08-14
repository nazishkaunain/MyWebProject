const express = require("express");
const path = require("path");

const userControllers = require(path.join(__dirname, "..", "controllers", "user.js"));

const isAuth = require(path.join(__dirname, "..", "middleware", "is-auth.js"));


const router = express.Router();

//It has been arranged according to the alphabetical order of the name of the routes


//it opens the home page where the details of the web application is given
//like what can you do in the web-site
//how it is helpful for the students
router.get("/", userControllers.getHome);

//it opens the index page where user actually gets to use the web application
//with all the functionalities available
router.get("/index", isAuth,  userControllers.getIndex);

router.get("/build-profile", isAuth, userControllers.getBuildProfile);

router.post("/build-profile", isAuth, userControllers.postBuildProfile);

router.get("/edit-profile/:userId", isAuth, userControllers.getEditProfile);

//router.post("/edit-profile", isAuth, userControllers.postEditProfile);

router.get("/my-profile", isAuth, userControllers.getProfile);

router.get("/get-courses", isAuth, userControllers.getCourses);

router.get("/get-instructors", isAuth, userControllers.getInstructors);

router.post("/follow-courses", isAuth, userControllers.followCourses);

router.get("/get-my-courses", isAuth, userControllers.getMyCourses);

router.post("/unfollow-course", isAuth, userControllers.unfollowCourse);

module.exports = router;
