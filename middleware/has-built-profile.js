module.exports = (req, res, next) => {
    if(req.session.hasBuiltProfile) {
      return res.redirect("/index");
    }
    next();
  };