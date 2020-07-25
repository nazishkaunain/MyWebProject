const path = require("path");
const course = require("../models/course");

const User = require(path.join(__dirname, "..", "models", "user.js"));

const Course = require(path.join(__dirname, "..", "models", "course.js"));

const Instructor = require(path.join(__dirname, "..", "models", "instructor.js"));

exports.getHome = (req, res, next) => {
    res.render("user/home", {
        pageTitle: "Home Page",
        path : "/"
    });
};

exports.getIndex = (req, res, next) => {
    res.render("user/index", {
        pageTitle: "Index Page",
        path: "/index"
    });
};

exports.getBuildProfile = (req, res, next) => {

    console.log(req.user);
    console.log(req.user._id);
    res.render("user/build-profile", {
        pageTitle: "Build Profile",
        path: "/build-profile"
    });
};

exports.postBuildProfile = (req, res, next) => {
    const degree = req.body.degree;
    const department = req.body.department;
    const yearOfGraduation = req.body.yearOfGraduation;
    const birthday = req.body.birthday;
    const gender = req.body.gender;

  

    User.findById(req.user._id)
        .then(user => {
            user.degree = degree;
            user.department = department;
            user.yearOfGraduation = yearOfGraduation;
            user.birthday = birthday;
            user.gender = gender;

            return user.save();
        })
        .then(result => {
            console.log("Successfully completed profile");
            return res.redirect("/index");
        })
        .catch(err => {
            console.log(err);
        });
    
};

exports.getCourses = (req, res, next) => {
    Course
        .find()
        .populate('instructor')
        .exec()
        .then(courses => {
            res.render("user/courses", {
                pageTitle: "courses",
                path: "/admin/get-courses",
                courses: courses
            })
        })
    
}

exports.followCourses = (req, res, next) => {
    console.log(req.body);
    console.log(req.user);

    req.user.courses.push(req.body.courseId);
    req.user.save()
        .then(result => {
            Course.findById(req.body.courseId)
                .then(course => {
                    course.users.push(req.user._id);
                    return course.save();
                })
            return res.redirect("/get-courses");
        })
        .catch(err => {
            console.log(err);
        });
}

