
const path = require('path');

const bcrypt = require("bcryptjs");

const crypto = require('crypto'); //inbuilt library provided by node.js

const nodemailer = require("nodemailer");

const sendgridTransport = require("nodemailer-sendgrid-transport");


const User = require(path.join(__dirname, "..", "models", "user.js"));

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.API_KEY
  }
}));

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
    errorMessage: message,
    path : "/login"

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
            if (result) {
              
              
              req.session.isLoggedIn = true;
              req.session.isAdmin = user.isAdmin;
              req.session.isVerified = user.isVerified;
              req.session.hasBuiltProfile = user.hasBuiltProfile;
              req.session.user = user;
              
              console.log(req.session);
              console.log(user);
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
    errorMessage: message,
    path: "/signup"
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
              isAdmin: false,
              isVerified: false,
              hasBuiltProfile: false
          });
          return newUser.save();
        })
        .then(result => {
          res.redirect("/login");
          //to send the confirmation mail
          return transporter.sendMail({ ///you can alse return transporter.sendMail.... if you want to redirect to the login
            // only after the mail has been sent
            to: email,
            from: "kaunainnazish@gmail.com",
            subject: "Signup succeeded",
            //html contains the message you wanna send
            html: "<h1>You successfully signed up!!</h1>"
          });

        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getReset = (req, res, next) => {

  let message = req.flash("error");
  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
      return res.redirect("/reset");
    }
    //the buffer will be generated
    const token = buffer.toString("hex");  //the buffer is in hexadecimal
    User.findOne({"email": req.body.email})
      .then(user => {
        if(!user) {
          req.flash("error", "No account with that email found!");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;  //today's date plus 1hour in miliseconds
        return user.save();
      })
      .then(result => {
        return transporter.sendMail({ ///you can alse return transporter.sendMail.... if you want to redirect to the login
          // only after the mail has been sent
          to: req.body.email,
          from: "kaunainnazish@gmail.com",
          subject: "Password Reset",
          //html contains the message you wanna send
          //back ticks ` ` is a next gen js which allows you to write a whole bunch of html codes
          //${} is used to inject a variable when using back ticks
          html: `
            <p>You requested a password change</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
            <p>If it was not you, please contact use</p>
          `
        });
      }).
      then(result => {
        return res.redirect("/");
      })
      .catch(err => {
        console.log(err);
      });
  })
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  //only when token matches
  //and the expiration date is greater than now
  User.findOne({"resetToken": token, "resetTokenExpiration":{$gt: Date.now()}})
    .then(user => {
      //also do a check here that if no such token exists , then display an error

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        userId: user._id.toString(), //to convert from objectId  type to normal string
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;


  User.findOne({"resetToken": passwordToken, "resetTokenExpiration": {$gt: Date.now()}, _id: userId})
    .then(user => {
      console.log("into the post request to change password");
      resetUser = user;
      return bcrypt
        .hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;  //deactivating the token after successfull password change
      resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      return res.redirect("/login");
    })
    .catch(err => {
      console.log(err);
    });
};


//to provide the verifyToken when the user clicks on the button to verify himself
exports.postVerify = (req, res, next) => {
  console.log("Into post veriy");
  console.log(req.user);
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
      return res.redirect("/index");
    }
    //the buffer will be generated
    const token = buffer.toString("hex");  //the buffer is in hexadecimal
    User.findById(req.user._id)
      .then(user => {
        user.verifyToken = token;
        user.verifyTokenExpiration = Date.now() + 3600000;  //today's date plus 1hour in miliseconds
        return user.save();
      })
      .then(result => {
        return transporter.sendMail({ ///you can alse return transporter.sendMail.... if you want to redirect to the login
          // only after the mail has been sent
          to: req.user.email,
          from: "kaunainnazish@gmail.com",
          subject: "Verification mail",
          //html contains the message you wanna send
          //back ticks ` ` is a next gen js which allows you to write a whole bunch of html codes
          //${} is used to inject a variable when using back ticks
          html: `
            <p>Verify your email</p>
            <p>Click this <a href="http://localhost:3000/verification/${token}">link</a> to verify yourself</p>
            <p>If it was not you, please contact us</p>
          `
        });
      }).
      then(result => {
        //let the user know that a mail has been sent
        return res.redirect("/");
      })
      .catch(err => {
        console.log(err);
      });
  })
}

//the page to be displayed when the user follows the link to verify
exports.getVerification = (req, res, next) => {
  const token = req.params.token;
  //only when token matches
  //and the expiration date is greater than now
  User.findOne({"verifyToken": token, "verifyTokenExpiration":{$gt: Date.now()}})
    .then(user => {
      //also do a check here that if no such token exists , then display an error

      res.render("auth/verification", {
        path: "/verification",
        pageTitle: "Verify yourself",
        userId: user._id.toString(), //to convert from objectId  type to normal string
        verifyToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postVerification = (req, res, next) => {
  const email = req.body.email;
  const userId = req.body.userId;
  const verifyToken = req.body.verifyToken;


  User.findOne({ "verifyToken": verifyToken, "verifyTokenExpiration": { $gt: Date.now() }, _id: userId, "email": email })
    .then(user => {
      if (!user) {
        //and maybe an alert box to show that your details were wrong
        return res.redirect("/index");
      }
      user.isVerified = true;
      user.verifyToken = undefined;  //deactivating the token after successfull password change
      user.verifyTokenExpiration = undefined;
      return user.save();
    })
    .then(() => {
      //and maybe with a message that you have been successfully verified
      req.session.isVerified = true;
      return req.session.save((err) => {
        if(!err) {
          return res.redirect("/index");
        } else console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });
};