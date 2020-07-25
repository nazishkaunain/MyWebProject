const path = require("path");

//const mongoose = require("mongoose");

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
    Instructor.find()
        .then(instructors => {
            return res.render("admin/add-course", {
                pageTitle: "Add Course",
                path: "/admin/add-course",
                instructors: instructors
            });
        })
        .catch(err => {
            console.log(err);
        });
    
};
 
exports.postAddCourse = (req, res, next) => {
    const name = req.body.name;
    const courseCode = req.body.courseCode;

    //console.log(req.body.instructor);
    const instructor = req.body.instructor; //getting the id of the instructor
    //{...product.productId._doc}

    

    // console.log(typeof instruct); // it is a string
    // console.log("instructor", instructor);
    // console.log("name",instructor.name);
    


    const course = new Course({
        name: name,
        courseCode: courseCode,
        instructor: instructor
    });

    course.save()
        .then(result => {
            Instructor.findById(instructor)
                .then(instructor => {
                    instructor.courses.push(course._id);
                    return instructor.save();
                })
                .catch(err => {
                    console.log(err);
                }); 
        })
        .then(() => {
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
        //_id: new mongoose.Types.ObjectId(),
        name: name,
        opinion: opinion,
        courses: []
    });
    instructor.save()
        .then(result => {
            return res.redirect("/index");
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getCourses = (req, res, next) => {

    // Course.
    //     find({}).
    //     populate('instructor').
    //     exec((err, courses) => {
    //         if (err) return console.log(err);
    //         else {
    //             console.log(courses);
    //             courses.map(course => {
    //                 console.log(course.instructor.courses);
    //             });
    //             //console.log(story.instructor.courses);
    //             //console.log('The author is %s', story.author.name);
    //         }
    //         // prints "The author is Ian Fleming"
    //     });
    
    Course.
        find({}).
        populate('instructor').
        exec().
        then(courses => {
            console.log(courses);
        })
        .catch(err => {
            console.log(err);
        })

    // Course.find()
    //     .then(courses => {
    //         courses.map(course => {
    //             console.log(course);
    //             Instructor.findById(course.instructor)
    //                 .then(instructor => {
    //                     console.log(instructor);
    //                 })
    //                 .catch(err => {
    //                     console.log(err);
    //                 })
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
};
exports.getInstructors = (req, res, next) => {
    // Instructor.findOne().populate('courses').exec((err, instructors) => {
    //     console.log(instructors.courses);
    // });
    Instructor
        .find()
        .populate('courses')
        .exec()
        .then(instructors => {
            console.log(instructors);
        })
        .catch(err => {
            console.log(err);
        })
}
