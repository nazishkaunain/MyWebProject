const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "..", "data", "users.json");

exports.postLogin = (req, res, next) => {

};

exports.postSignUp = (req, res, next) => {
    console.log(req.body);
    fs.readFile(p, (err, fileContent) => {
        let users = [];
        if (!err) {
            users = JSON.parse(fileContent);
        }
        users.push({ email: req.body.email, password: req.body.password });
        fs.writeFile(p, JSON.stringify(users), (err) => {
            if (err) console.log(err);
        });
    });
    res.redirect("/build-profile");
};