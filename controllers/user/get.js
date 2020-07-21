exports.getLogin = (req, res, next) => {
    //render the signup page
    res.render("user/login", { pageTitle: "Login" });
};
exports.getSignUp = (req, res, next) => {
    res.render("user/sign-up", { pageTitle: "Sign up" });
};
exports.getHome =  (req, res, next) => {
    res.render("user/home",{pageTitle: "Home Page"});
}
exports.getBuildProfile = (req, res, next) => {
    res.render("user/build-profile", { pageTitle: "Build Profile" });
};
