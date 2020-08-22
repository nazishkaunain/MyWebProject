const express = require("express");
const path = require("path");
const { runInContext } = require("vm");

const router = express.Router();

const adminControllers = require(path.join(__dirname, "..", "controllers", "admin.js"));

const isAuth = require(path.join(__dirname, "..", "middleware", "is-auth.js"));

const isAdmin = require(path.join(__dirname, "..", "middleware", "is-admin.js"));

//It has been arranged according to the alphabetical order of the name of routes

//admin/home => GET
//it will direct the user to the home page for the admin
// router.get("/home", adminControllers.getAdminHome);
router.get("/get-users", isAuth, isAdmin, adminControllers.getUsers);

router.get("/add-course", isAuth, isAdmin, adminControllers.getAddCourse);

router.post("/add-course", isAuth, isAdmin, adminControllers.postAddCourse);

router.get("/add-instructor", isAuth, isAdmin, adminControllers.getAddInstructor);

router.post("/add-instructor", isAuth, isAdmin, adminControllers.postAddInstructor);

router.get("/edit-course/:courseId", isAuth, isAdmin, adminControllers.getEditCourse);

router.post("/edit-course", isAuth, isAdmin, adminControllers.postEditCourse);

router.get("/edit-instructor/:instructorId", isAuth, isAdmin, adminControllers.getEditInstructor);

router.post("/edit-instructor", isAuth, isAdmin, adminControllers.postEditInstructor);

router.post("/instructor/add-opinion", isAuth, isAdmin, adminControllers.postAddOpinion);

router.post("/course/add-post", isAuth, isAdmin, adminControllers.postAddPost);



module.exports = router;
