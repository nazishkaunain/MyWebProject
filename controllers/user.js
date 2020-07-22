exports.getLogin = (req, res, next) => {
    res.render("user/login", { pageTitle: "Login" });
};
exports.getSignUp = (req, res, next) => {
    res.render("user/sign-up", { pageTitle: "Sign up" });
};
exports.getHome = (req, res, next) => {
    res.render("user/home", { pageTitle: "Home Page" });
};

exports.getIndex = (req, res, next) => {
    res.render("user/index", {
        pageTitle: "Index Page"
    });
};

exports.getBuildProfile = (req, res, next) => {
    res.render("user/build-profile", { pageTitle: "Build Profile" });
};

exports.postLogin = (req, res, next) => {
    res.redirect("/index");
};

exports.postSignUp = (req, res, next) => {
    res.redirect("/build-profile");
};
