module.exports = (req, res, next) => {
    if (req.session.isLoggedIn) {
        console.log("into the function");
      return res.redirect("/index");
    }
    next();
  };
  