module.exports = function(app) {
    var LocalStrategy = require("passport-local").Strategy;
    var crypto = require("crypto");

    app.passport.use(new LocalStrategy(
        function(username, password, done) {
            var User = app.db.model("User");

            User.findOne({
                "username": username
            }).exec(function(err, user) {
                if(err) {
                    return done(err, null);
                } else if(!user) {
                    return done(null, null, {message: "User " + username + " does not exist."})
                } else {
                    user.comparePassword(password, function(err, isMatch) {
                        if(isMatch) {
                            if(!user.activated) {
                                return done(null, null, {
                                    message: "You must activate your account by email before you can log in."
                                });
                            } else {
                                return done(null, user);
                            }
                        } else {
                            return done(null, null, {message: "Incorrect password."});
                        }
                    });
                }
            });
        }
    ));

    app.passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    app.passport.deserializeUser(function(id, done) {
        var User = app.db.model("User");

        User.findById(id).exec(function(err, user) {
            done(err, user);
        });
    });

    var restrict = function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            res.send({
                error: true,
                msg: "Wrong credentials."
            }, 200);
        }
    };

    app.post('/login', function(req, res, next) {
        app.passport.authenticate('local', function(err, user, info) {
            if(err) {
                return res.json({
                    success: false,
                    user: null,
                    msg: "Server error. Please try again."
                });
            } else if(!user) {
                return res.json({
                    success: false,
                    user: user,
                    msg: info.message
                });
            } else {
                req.logIn(user, function(err) {
                    if(err) {
                        return res.json({
                            success: false,
                            user: null,
                            msg: err
                        });
                    } else {
                        return res.json({
                            user: req.user,
                            msg: "Welcome, " + req.user.username + "!"
                        });
                    }
                });
            }
        })(req, res, next);
    });

    app.all("/logout", function(req, res) {
        req.logout();
        res.send();
    });


    var sendRegisteredMail = function(user,activationCode)
    {
        var html = app.constants.activationEmailText;
        html = html.replace("<username>", user.firstName);

        if(app.get("env") === "production") {
            html = html.replace("<activation>", '<a href="http://api.teselagen.com/users/activate/'+activationCode+'">');
        } else {
            html = html.replace("<activation>", '<a href="http://dev.teselagen.com/api/users/activate/'+activationCode+'">');
        }
      var mailOptions = {
        from: "Teselagen ✔ <teselagen.testing@gmail.com>",
        to: user.email,
        subject: "Registration ✔",
        text: "Teselagen activation code",
        html: html
      }

      app.mailer.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
          }else{
              console.log("Message sent: " + response.message);
          }
      });
    }

    app.post('/register', function(req, res) {
        var User = app.db.model("User");

        if(req.body.invitationCode !== "tesfo13")
        {
            res.json({
                success: false,
                msg: "Wrong invitation code. This is a private beta."
            });
        }

        User.findOne({
            username: req.body.username
        }, function(err, user) {
            if(err) {
                res.json({
                    success: false,
                    msg: err
                });
            } else if(user) {
                console.log(user);
                res.json({
                    success: false,
                    msg: "User '" + req.body.username + "' already exists."
                });
            } else {
                User.create({
                    username: req.body.username,
                    password: req.body.password,
                    groupType: req.body.orgType,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    activated: false,
                    activationCode: crypto.randomBytes(32).toString("hex")
                }, function(err, user) {
                    if(err) {
                        res.json({
                            success: false,
                            msg: "Error creating user."
                        });
                    } else {
                        sendRegisteredMail(user, user.activationCode);
                        res.json({
                            success: false,
                            msg: "An activation email has been sent to your account.<br>Please click the link in the email to continue."
                        });
                        /*req.logIn(user, function(err) {
                            if(err) {
                                return res.json({
                                    success: false,
                                    msg: "Error logging in as new user."
                                });
                            } else {
                                res.json({
                                    user: user,
                                    success: true,
                                    msg: "Welcome, " + user.username + "!"
                                });
                            }
                        });*/
                    }
                });
            }
        });
    });

    app.auth = {};
    app.auth.restrict = restrict;
};
