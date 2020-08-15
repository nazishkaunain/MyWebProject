const path = require("path");

// const bcrypt = require("bcryptjs");

// const crypto = require("crypto"); //inbuilt library provided by node.js

// const nodemailer = require("nodemailer");

// const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require(path.join(__dirname, "..", "models", "user.js"));

const Course = require(path.join(__dirname, "..", "models", "course.js"));

const Instructor = require(path.join(
    __dirname,
    "..",
    "models",
    "instructor.js"
));

// const transporter = nodemailer.createTransport(
//     sendgridTransport({
//         auth: {
//             api_key: process.env.API_KEY,
//         },
//     })
// );

// exports.getLogin = (req, res, next) => {
//     let message = req.flash("error");
//     if (message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }
//     res.render("admin/login", {
//         pageTitle: "Login Admin",
//         path: "/admin/login",
//         errorMessage: message,
//     });
// };

// exports.postLogin = (req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;

//     Admin.findOne({ email: email })
//         .then((user) => {
//             if (!user) {
//                 req.flash("error", "Invalid email!");
//                 return res.redirect("/admin/login");
//             }
//             return bcrypt
//                 .compare(password, user.password)
//                 .then((result) => {
//                     if (result) {
//                         req.session.isLoggedIn = true;
//                         req.session.user = user;
//                         //normally you don't need to call .save() but you can call it if you need
//                         //the guarantee that it redirects to "/" only after the session has been saved
//                         return req.session.save((err) => {
//                             if (!err) {
//                                 console.log("Successfully logged in as the admin");
//                                 res.redirect("/index");
//                             } else console.log(err);
//                         });
//                     }
//                     req.flash("error", "Invalid password!");
//                     res.redirect("/admin/login");
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                     res.redirect("/admin/login");
//                 });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// };

// exports.getSignup = (req, res, next) => {
//     let message = req.flash("error");
//     if (message.length > 0) {
//         message = message[0];
//     } else {
//         message = null;
//     }

//     res.render("admin/signup", {
//         pageTitle: "Signup as Admin",
//         errorMessage: message,
//         path: "/admin/signup",
//     });
// };

// exports.postSignup = (req, res, next) => {
//     const secretKey = req.body.secretKey;
//     const name = req.body.name;
//     const email = req.body.email;
//     const password = req.body.password;
//     const confirmPassword = req.body.confirm - password;

//     Admin.findOne({ email: email })
//         .then((user) => {
//             if (user) {
//                 req.flash("error", "This email is already used!");
//                 return res.redirect("/admin/signup");
//             }
//             if (secretKey === process.env.ADMIN_SECRET) {
//                 // it is important chain the bcrypt whole things because when the user with the email already exists
//                 //it will return only the "/signup" page,
//                 //.then behaves like a whole function
//                 //ref: Adding a Tiny Code Improvement
//                 //module: Authentication
//                 return bcrypt
//                     .hash(password, 12)
//                     .then((hashedPassword) => {
//                         const newUser = new User({
//                             name: name,
//                             email: email,
//                             password: hashedPassword,
//                         });
//                         return newUser.save();
//                     })
//                     .then((result) => {
//                         res.redirect("/admin/login");
//                         //to send the confirmation mail
//                         return transporter.sendMail({
//                             ///you can alse return transporter.sendMail.... if you want to redirect to the login
//                             // only after the mail has been sent
//                             to: email,
//                             from: "kaunainnazish@gmail.com",
//                             subject: "Signup succeeded",
//                             //html contains the message you wanna send
//                             html: "<h1>You successfully signed up as the admin!!</h1>",
//                         });
//                     })
//                     .catch((err) => {
//                         console.log(err);
//                     });

//             } else {
//                 req.flash("error", "Looks like you are not autorized to do so!!");
//                 return res.redirect("/admin/signup");
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//         });
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
        .then((instructors) => {
            return res.render("admin/add-course", {
                pageTitle: "Add Course",
                path: "/admin/add-course",
                editMode: false,
                instructors: instructors,
            });
        })
        .catch((err) => {
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
    console.log(name);
    console.log(courseCode);
    console.log(instructor);

    const course = new Course({
        name: name,
        courseCode: courseCode,
        instructor: instructor,
    });

    course
        .save()
        .then((result) => {
            Instructor.findById(instructor)
                .then((instructor) => {
                    instructor.courses.push(course._id);
                    return instructor.save();
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .then(() => {
            return res.redirect("/index");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getAddInstructor = (req, res, next) => {
    res.render("admin/add-instructor", {
        pageTitle: "Add Instructor",
        path: "/admin/add-instructor",
        editMode: false
    });
};

exports.postAddInstructor = (req, res, next) => {
    const name = req.body.name;

    const instructor = new Instructor({
        name: name,
        opinion: opinion,
        courses: [],
    });
    instructor
        .save()
        .then((result) => {
            return res.redirect("/index");
        })
        .catch((err) => {
            console.log(err);
        });
};
exports.getEditCourse = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        console.log("You dont have the access to edit the course");
        return res.redirect("/index");
    }

    const courseId = req.params.courseId;
    Course.findById(courseId)
        .then((course) => {
            if (!course) {
                console.log("No such course exitst");
                return res.redirect("/index");
            }
            Instructor.find().then((instructors) => {
                return res.render("admin/add-course", {
                    pageTitle: "Edit Course",
                    path: "/admin/edit-course", ///dfafaetasf
                    editMode: editMode,
                    course: course,
                    instructors: instructors,
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
exports.postEditCourse = (req, res, next) => {
    const courseId = req.body.courseId;
    const updatedName = req.body.name;
    const updatedCourseCode = req.body.courseCode;
    const updatedInstructor = req.body.instructor;

    console.log(courseId);
    console.log(updatedName);
    console.log(updatedCourseCode);
    console.log(updatedInstructor);
    console.log("abc");


    // Course.findById(courseId)
    //     .then((course) => {
    //         if (course.instructor.toString() !== updatedInstructor.toString()) {
    //             Instructor.findById(course.instructor)
    //                 .then((prevInstructor) => {
    //                     const updatedCourses = prevInstructor.courses.filter(
    //                         (course) => course._id.toString() !== courseId
    //                     );
    //                     prevInstructor.courses = updatedCourses;
    //                     prevInstructor.save();
    //                 })
    //                 .catch((err) => {
    //                     console.log("error1 happened");
    //                     console.log(err);
    //                 });
    //             Instructor.findById(updatedInstructor)
    //                 .then((instructor) => {
    //                     instructor.courses.push(course._id);
    //                     instructor.save();
    //                 })
    //                 .catch((err) => {
    //                     console.log("error2 happended");
    //                     console.log(err);
    //                 });
    //         }
    //     })

    Course.findByIdAndUpdate(courseId, {
            name: updatedName,
            courseCode: updatedCourseCode,
            instructor: updatedInstructor,
        })
        .then((course) => {    //it gives the details of the course without updating
            console.log("The new course details are: ", course);   //it does not give the new details
            if (course.instructor.toString() !== updatedInstructor.toString()) {
                Instructor.findById(course.instructor)
                    .then((prevInstructor) => {
                        const updatedCourses = prevInstructor.courses.filter(
                            (course) => course._id.toString() !== courseId
                        );
                        prevInstructor.courses = updatedCourses;
                        prevInstructor.save();
                    })
                    .catch((err) => {
                        console.log("error1 happened");
                        console.log(err);
                    });
                Instructor.findById(updatedInstructor)
                    .then((instructor) => {
                        instructor.courses.push(course._id);
                        instructor.save();
                    })
                    .catch((err) => {
                        console.log("error2 happended");
                        console.log(err);
                    });
            }
            console.log("Course has been updated");
            return res.redirect("/index");
        })
        .catch((err) => {
            console.log("error3 happened");
            console.log(err);
        });
};

exports.getEditInstructor = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/index");
    }
    const instructorId = req.params.instructorId;

    Instructor.findById(instructorId)
        .then(instructor => {
            if (!instructor) {
                console.log("No such instructor exists");
                return res.redirect("/index");
            }
            return res.render("admin/add-instructor", {
                pageTitle: "Edit Instructor",
                path: "/admin/edit-instructor",
                editMode: editMode,
                instructor: instructor
            });
        })
        .catch(err => {
            console.log("error happended");
            console.log(err);
        });
};

exports.postEditInstructor = (req, res, next) => {
    const instructorId = req.body.instructorId;
    const updatedName = req.body.name;
    const updatedOpinion = req.body.opinion;
    Instructor
        .findByIdAndUpdate(instructorId, {
            name: updatedName,
            opinion: updatedOpinion
        })
        .then((instructor) => {
            console.log("the updated instructor: ", instructor);
            console.log("The instructor has been updated");
            return res.redirect("/index");
        })
        .catch(err => {
            console.log("Error happened");
            console.log(err);
        });
};

exports.postAddOpinion = (req, res, next) => {
    const instructorId = req.body.instructorId;
    const opinion = req.body.opinion;
    const admin = req.user._id;

    console.log(req.user._id);

    Instructor.findById(instructorId)
        .then(instructor => {
            instructor.opinions.push({ opinion: opinion, admin: admin });
            return instructor.save();
        })
        .then(() => {
            return res.redirect("/instructors/" + instructorId);
        })
        .catch(err => {
            console.log(err);
        });
}