const path = require("path");
const { useReducer } = require("react");
const User = require(path.join(__dirname, "..", "models", "users.js"));

exports.getLogin = (req, res, next) => {
    res.render("admin/admin-login", { pageTitle: "Login Admin" });
};

exports.postLogin = (req, res, next) => {
    res.redirect("/admin/admin-home");
};

exports.getHome = (req, res, next) => {
    res.render("admin/home", {
        pageTitle: "Admin Home Page"
    });
}

exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.render("admin/users", {
                pageTitle: "Users",
                users: users
            });
        })
        .catch(err => {
            console.log(err);
        });
};