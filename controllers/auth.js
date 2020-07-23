
const path = require('path');

const bcrypt = require("bcryptjs");

const User = require(path.join(__dirname,"..","models", "user.js"));

exports.getLogin = (req, res, next) => {

  let message = req.flash("error");
  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  //console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login",
    errorMessage: message

    //path: '/login'
  });
};

exports.postLogin = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({"email": email})
      .then(user => {
        if(!user) {
          req.flash("error","Invalid email!");
          return res.redirect("/login");
        }
        return bcrypt
          .compare(password, user.password)
          .then(result => {
            if(result) {
              req.session.isLoggedIn = true;
              req.session.user= user;
              //normally you don't need to call .save() but you can call it if you need
              //the guarantee that it redirects to "/" only after the session has been saved
              return req.session.save((err) => {
                if(!err) {
                  res.redirect("/index");
                } else console.log(err);
              });
            }
            req.flash("error","Invalid password!");
            res.redirect("/login");
          })
          .catch(err => {
            console.log(err);
            res.redirect("/login");
          })

    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  //it is a function provided by the express-session
  req.session.destroy((err) => {
    if(!err) {
      res.redirect("/");
    } else console.log(err);
  });
};

exports.getSignup = (req, res, next) => {

    let message = req.flash("error");
    if(message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

  res.render("auth/signup", {
    pageTitle: "Signup",
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirm-password;

  User.findOne({"email": email})
    .then(user => {
      if(user) {
        req.flash("error", "This email is already used!");
        return res.redirect("/signup");
      }
      // it is important chain the bcrypt whole things because when the user with the email already exists
      //it will return only the "/signup" page,
      //.then behaves like a whole function
      //ref: Adding a Tiny Code Improvement
      //module: Authentication
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const newUser = new User({
            name: name,  
            email: email,
            password: hashedPassword,
            cart: { items: []} //creating the empty cart
          });
          return newUser.save();
        })
        .then(result => {
          res.redirect("/login");
        });
    })
    .catch(err => {
      console.log(err);
    })
};