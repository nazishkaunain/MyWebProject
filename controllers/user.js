
exports.getHome = (req, res, next) => {
    res.render("user/home", {
        pageTitle: "Home Page",
        path : "/"
    });
};

exports.getIndex = (req, res, next) => {
    res.render("user/index", {
        pageTitle: "Index Page",
        path: "/index"
    });
};

// exports.getBuildProfile = (req, res, next) => {
//     res.render("user/build-profile", { pageTitle: "Build Profile" });
// };

