module.exports = (req, res, next) => {
    if(!req.session.isVerified) {
      return res.redirect("/index");
    }
    next();
  };