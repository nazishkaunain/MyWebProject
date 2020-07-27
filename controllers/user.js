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
            console.log(courses);
            res.render("user/courses", {
                pageTitle: "courses",
                path: "/get-courses",
                courses: courses
            })
        })
    
}

exports.getInstructors = (req, res, next) => {
 
    Instructor.find()
        .populate("courses")
        .exec()
        .then((instructors) => {
            console.log(instructors);
            res.render("user/instructors", {
                pageTitle: "Instructors",
                path: "/get-instructors",
                instructors: instructors
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.followCourses = (req, res, next) => {
    //console.log(req.body);
    //console.log(req.user);

    req.user.courses.push(req.body.courseId);
    req.user.save()
        .then(result => {
            Course.findById(req.body.courseId)
                .then(course => {
                    course.users.push(req.user._id);
                    return course.save();
                })
            return res.redirect("/get-my-courses");
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getMyCourses = (req, res, next) => {
    //req.user just behaves like User but you don't need to use findById here
    req.user
        .populate({ path: "courses", populate: { path: "instructor" } })
        .execPopulate()   //when you are not using find() (or related functions) you use execPopulate() and not exec()
        .then(user => {
            return res.render("user/my-courses", {
                pageTitle: "My Courses",
                path: "/get-my-courses",
                courses: user.courses
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.unfollowCourse = (req, res, next) => {
    console.log(req.body.courseId);
    req.user
        .populate("courses")
        .execPopulate()
        .then(user => {
            const updatedCourses = user.courses.filter(course => {
                return course._id.toString() !== req.body.courseId;   //because the req.body.courseId is a string
            });
            user.courses = updatedCourses;
            return user.save();
        })
        .then(result => {
            return res.redirect("/get-my-courses");
        })
        .catch(err => {
            console.log(err);
        });
};



