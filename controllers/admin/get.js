const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "..", "data", "users.json");

exports.getLogin = (req, res, next) => {
    res.render("admin/admin-login", { pageTitle: "Login Admin" });
};
exports.getUsers = (req, res, next) => {
    fs.readFile(p, (err, fileContent) => {
        let users = [];
        if (!err) {
            users = JSON.parse(fileContent);
        }
        res.render("admin/users", { pageTitle: "Users", users: users });
    });
};