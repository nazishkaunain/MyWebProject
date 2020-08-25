const express = require("express");
const path = require("path");
const { isatty } = require("tty");

const userControllers = require(path.join(__dirname, "..", "controllers", "user.js"));

const isAuth = require(path.join(__dirname, "..", "middleware", "is-auth.js"));

const isVerified = require(path.join(__dirname, "..", "middleware", "is-verified"));

const hasBuiltProfile = require(path.join(__dirname, '..', "middleware", "has-built-profile"));

const hasNotBuiltProfile = require(path.join(__dirname, '..', "middleware", "has-not-built-profile"));


const router = express.Router();

//It has been arranged according to the alphabetical order of the name of the routes


//it opens the home page where the details of the web application is given
//like what can you do in the web-site
//how it is helpful for the students
router.get("/", userControllers.getHome);

//it opens the index page where user actually gets to use the web application
//with all the functionalities available
router.get("/index", isAuth,  userControllers.getIndex);

router.get("/build-profile", isAuth, isVerified, hasNotBuiltProfile, userControllers.getBuildProfile);

router.post("/build-profile", isAuth, isVerified, hasNotBuiltProfile, userControllers.postBuildProfile);

router.get("/edit-profile/:userId", isAuth, hasBuiltProfile, isVerified, userControllers.getEditProfile);

router.post("/edit-profile", isAuth, hasBuiltProfile, isVerified, userControllers.postEditProfile);

router.get("/my-profile", isAuth, hasBuiltProfile, userControllers.getProfile);

router.get("/get-courses", isAuth, userControllers.getCourses);

router.get("/get-instructors", isAuth, userControllers.getInstructors);

router.post("/follow-courses", isAuth, hasBuiltProfile, isVerified, userControllers.followCourses);

router.get("/get-my-courses", isAuth, hasBuiltProfile, isVerified, userControllers.getMyCourses);

router.post("/unfollow-course", isAuth, hasBuiltProfile, isVerified, userControllers.unfollowCourse);

router.get("/courses/:courseId", isAuth, userControllers.getCourse);

router.get("/instructors/:instructorId", isAuth, userControllers.getInstructor);

router.post("/post/add-comment", isAuth, hasBuiltProfile, isVerified, userControllers.postAddComment);

module.exports = router;
