const path = require("path");
const course = require("../models/course");
const { render } = require("ejs");
const { populate } = require("../models/course");
const { deleteFile } = require("../util/file");

const User = require(path.join(__dirname, "..", "models", "user.js"));

const Course = require(path.join(__dirname, "..", "models", "course.js"));

const Instructor = require(path.join(__dirname, "..", "models", "instructor.js"));

const Post = require(path.join(__dirname, "..", "models", "post"));

const fileHelper = require(path.join(__dirname, "..", "util", "file"));

const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

exports.getHome = (req, res, next) => {
    res.render("user/home", {
        pageTitle: "Home Page",
        path: "/"
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
        path: "/build-profile",
        editMode: false,
        name: req.user.name
    });
};

exports.postBuildProfile = (req, res, next) => {
    const profilePic = req.file
    const degree = req.body.degree;
    const department = req.body.department;
    const yearOfGraduation = req.body.yearOfGraduation;
    const birthday = req.body.birthday;
    const gender = req.body.gender;
    const name = req.body.name;

    //const profilePicUrl = profilePic.path;
    let profilePicUrl;

    if (profilePic) {
        (async () => {
            const files = await imagemin(['images/' + profilePic.filename], {
                destination: 'compressedImages',
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({
                        quality: [0.5, 0.6]
                    })
                ]
            });

            console.log(files);
            //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
            profilePicUrl = files[0].destinationPath;
            fileHelper.deleteFile(profilePic.path); //deleting the original uploaded image

            User.findById(req.user._id)
                .then(user => {
                    user.degree = degree;
                    user.department = department;
                    user.yearOfGraduation = yearOfGraduation;
                    user.birthday = birthday;
                    user.gender = gender;
                    user.name = name;
                    user.hasBuiltProfile = true;
                    user.profilePic = profilePicUrl;

                    return user.save();
                })
                .then(result => {
                    console.log("Successfully completed profile");
                    req.session.hasBuiltProfile = true;
                    return req.session.save((err) => {
                        if (!err) {
                            return res.redirect("/index");
                        } else console.log(err);
                    });
                })
                .catch(err => {
                    console.log(err);
                });

        })();
    } else {
        User.findById(req.user._id)
            .then(user => {
                user.degree = degree;
                user.department = department;
                user.yearOfGraduation = yearOfGraduation;
                user.birthday = birthday;
                user.gender = gender;
                user.name = name;
                user.hasBuiltProfile = true;

                return user.save();
            })
            .then(result => {
                console.log("Successfully completed profile");
                req.session.hasBuiltProfile = true;
                return req.session.save((err) => {
                    if (!err) {
                        return res.redirect("/index");
                    } else console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
    }




};

exports.getProfile = (req, res, next) => {
    req.user
        .populate({ path: "courses", populate: { path: "instructor" } })
        .execPopulate()
        .then(user => {
            return res.render("user/my-profile", {
                pageTitle: "My Profile",
                path: "/my-profile",
                user: user,
                courses: user.courses
            })
        })
}

exports.getEditProfile = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        console.log("You do not have the permission to edit your profile");
        res.redirect("/index");
    }
    const userId = req.params.userId;
    return res.render("user/build-profile", {
        pageTitle: "Edit Profile",
        path: "/edit-profile",
        editMode: editMode,
        user: req.user
    })

}

//also you have to delete the previous image or store somewhere
exports.postEditProfile = (req, res, next) => {
    const updatedProfilePic = req.file
    const updatedDegree = req.body.degree;
    const updatedDepartment = req.body.department;
    const updatedYearOfGraduation = req.body.yearOfGraduation;
    const updatedBirthday = req.body.birthday;
    const updatedGender = req.body.gender;
    const updatedName = req.body.name;

    let updatedProfilePicUrl;

    if (updatedProfilePic) {

        console.log("filename: ", updatedProfilePic.filename);

        (async () => {
            const files = await imagemin(['images/' + updatedProfilePic.filename], {
                destination: 'compressedImages',
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({
                        quality: [0.5, 0.6]
                    })
                ]
            });

            //documentUrl = files[0].destinationPath;

            console.log(files);
            //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]

            updatedProfilePicUrl = files[0].destinationPath;
            fileHelper.deleteFile(updatedProfilePic.path); //deleting the original uploaded image

            User.findById(req.user._id)
                .then(user => {
                    user.degree = updatedDegree;
                    user.department = updatedDepartment;
                    user.yearOfGraduation = updatedYearOfGraduation;
                    user.birthday = updatedBirthday;
                    user.gender = updatedGender;
                    user.name = updatedName;


                    if (user.profilePic) {
                        fileHelper.deleteFile(user.profilePic);
                    }
                    user.profilePic = updatedProfilePicUrl;


                    return user.save();
                })
                .then(result => {
                    console.log("Successfully updated profile");

                    return req.session.save((err) => {
                        if (!err) {
                            return res.redirect("/index");
                        } else console.log(err);
                    });
                })
                .catch(err => {
                    console.log(err);
                });


        })();


    }
    else {
        User.findById(req.user._id)
            .then(user => {
                user.degree = updatedDegree;
                user.department = updatedDepartment;
                user.yearOfGraduation = updatedYearOfGraduation;
                user.birthday = updatedBirthday;
                user.gender = updatedGender;
                user.name = updatedName;

                return user.save();
            })
            .then(result => {
                console.log("Successfully updated profile");

                return req.session.save((err) => {
                    if (!err) {
                        return res.redirect("/index");
                    } else console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
    }



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
                courses: courses,
                userCourses: req.user.courses
            });
        })
        .catch(err => {
            console.log(err);
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

exports.getCourse = (req, res, next) => {
    const courseId = req.params.courseId;

    Course.findById(courseId)
        .populate("instructor")
        .populate({ path: "posts", populate: { path: "comments.user" } })
        .exec()
        .then(course => {
            //the course.posts returned is a a javascript array of JSON
            //so first convert into JSON string
            //and then parse the JSON to convert it into a javascript array of javascript objects
            //let arrayPosts = JSON.stringify(course.posts);
            //arrayPosts = JSON.parse(arrayPosts);
            //console.log(arrayPosts);
            //console.log(course.posts);
            return res.render("user/course", {
                pageTitle: course.name,
                path: "/courses/" + courseId,
                course: course,
                instructor: course.instructor,
                posts: course.posts
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getInstructor = (req, res, next) => {
    const instructorId = req.params.instructorId;

    Instructor.findById(instructorId)
        .populate("courses")
        .exec()
        .then(instructor => {
            return res.render("user/instructor", {
                pageTitle: instructor.name,
                path: "/instructors/" + instructorId,
                instructor: instructor,
                courses: instructor.courses,
                opinions: instructor.opinions
            })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postAddComment = (req, res, next) => {
    const user = req.user._id;
    const postId = req.body.postId;
    const courseId = req.body.courseId;
    const comment = req.body.comment;
    console.log(postId);

    Post.findById(postId)
        .then(post => {
            post.comments.push({ comment: comment, user: user });
            return post.save();
        })
        .then(() => {
            return res.redirect("/courses/" + courseId);
        })
        .catch(err => {
            console.log(err);
        });
};



