const express = require("express");
const path = require("path");

const router = express.Router();

const adminControllers = require(path.join(__dirname, "..", "controllers", "admin.js"));

const isAuth = require(path.join(__dirname, "..", "middleware", "is-auth.js"));

//It has been arranged according to the alphabetical order of the name of routes

//admin/home => GET
//it will direct the user to the home page for the admin
// router.get("/home", adminControllers.getAdminHome);

// //admin/login => GET
// router.get("/login",getAdminControllers.getLogin);

// //admin/login => POST
// router.post("/login", postAdminControllers.postLogin);

// //admin/users => GET
// router.get("/users",getAdminControllers.getUsers);

router.get("/add-course", isAuth,  adminControllers.getAddCourse);

router.post("/add-course", isAuth, adminControllers.postAddCourse);

router.get("/add-instructor", isAuth, adminControllers.getAddInstructor);

router.post("/add-instructor", isAuth, adminControllers.postAddInstructor);

router.get("/courses", isAuth, adminControllers.getCourses);

router.get("/instructors", isAuth, adminControllers.getInstructors);



module.exports = router;
