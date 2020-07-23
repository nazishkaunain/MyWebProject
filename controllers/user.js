
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

