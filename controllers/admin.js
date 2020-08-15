const path = require("path");

const User = require(path.join(__dirname, "..", "models", "user.js"));

const Course = require(path.join(__dirname, "..", "models", "course.js"));

const Post = require(path.join(__dirname, "..", "models", "post"));

const Instructor = require(path.join(
    __dirname,
    "..",
    "models",
    "instructor.js"
));

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
        posts: []
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
        opinions: [],
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
};

exports.postAddPost = (req, res, next) => {
    const courseId = req.body.courseId;
    const document = req.body.document;
    const title = req.body.title;
    const admin = req.user._id;

    console.log(document);

    const post = new Post({
        title: title,
        document: document,
        course: courseId,
        admin: admin,
        comments: []
    });
    
    let postId;
    
    post.save()
        .then((post) => {
            console.log(post);
            postId = post._id;
            return Course.findById(courseId);
        })
        .then(course => {
            course.posts.push(postId);
            return course.save();
        })
        .then(() => {
            console.log("Successfully added the document");
            return res.redirect("/courses/" + courseId);
        })
        .catch(err => {
            console.log(err);
        });
};

