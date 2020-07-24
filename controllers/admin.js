const path = require("path");
const instructor = require("../models/instructor");
const User = require(path.join(__dirname, "..", "models", "user.js"));

const Course = require(path.join(__dirname, "..", "models", "course.js"));

const Instructor = require(path.join(__dirname, "..", "models", "instructor.js"));

// exports.getLogin = (req, res, next) => {
//     res.render("admin/admin-login", { pageTitle: "Login Admin" });
// };

// exports.postLogin = (req, res, next) => {
//     res.redirect("/admin/admin-home");
// };

// exports.getHome = (req, res, next) => {
//     res.render("admin/home", {
//         pageTitle: "Admin Home Page"
//     });
// };

// exports.getUsers = (req, res, next) => {
//     User.find()
//         .then(users => {
//             res.render("admin/users", {
//                 pageTitle: "Users",
//                 users: users
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });
// };

exports.getAddCourse = (req, res, next) => {
    res.render("admin/add-course", {
        pageTitle: "Add Course",
        path: "/admin/add-course"
    });
};
 
exports.postAddCourse = (req, res, next) => {
    const name = req.body.name;
    const courseCode = req.body.courseCode;
    const instructor = req.body.instructor;

    const course = new Course({
        name: name,
        courseCode: courseCode,
        instructor: instructor
    });

    course.save()
        .then(result => {
            return res.redirect("/index");
        })
        .catch(err => {
            console.log(err);
        });

};

exports.getAddInstructor = (req, res, next) => {
    res.render("admin/add-instructor", {
        pageTitle: "Add Instructor",
        path: "/admin/add-instructor"
    });
};

exports.postAddInstructor = (req, res, next) => {
    const name = req.body.name;
    const opinion = req.body.opinion;

    const instructor = new Instructor({
        name: name,
        opinion: opinion
    });
    instructor.save()
        .then(result => {
            return res.redirect("/index");
        })
        .catch(err => {
            console.log(err);
        })
}