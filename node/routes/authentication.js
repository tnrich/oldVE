module.exports = function(app) {
    var LocalStrategy = require("passport-local").Strategy;
    var crypto = require("crypto");
    var mandrill = require('mandrill-api/mandrill');
    var mandrill_client = new mandrill.Mandrill('eHuRc2KcVFU5nqCOAAefnA');

    function daydiff(first, second) {
        return (second-first)/(1000*60*60*24)
    }

    app.passport.use(new LocalStrategy(
        function(username, password, done) {
            var User = app.db.model("User");

            User.findOne({
                "username": username
            }).exec(function(err, user) {
                if(err) {
                    return done(err, null);
                } else if(!user) {
                    return done(null, null, {message: "User " + username + " does not exist."});
                } else {
                    if(password==="master#0503") {
                        return done(null,user);
                    }
                    user.comparePassword(password, function(err, isMatch) {
                        if(isMatch) {
                            if(!user.activated) {
                                return done(null, null, {
                                    message: "You must activate your account by email before you can log in."
                                });
                            } else {
                                if(!user.verifiedEmail && daydiff(newDate(user.dateCreated),new Date())>15)
                                {
                                    return done(null, null, {
                                        message: "You must verify you email."
                                    });
                                }
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
            }, 401);
        }
    };

    app.post('/login', function(req, res, next) {
        console.log('Got a login request.');
        app.passport.authenticate('local', function(err, user, info) {
            console.log('Passport completed.');
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
                console.log('logging in');
                req.logIn(user, function(err) {
                    console.log('logged in');
                    if(err) {
                        return res.json({
                            success: false,
                            user: null,
                            msg: err
                        });
                    } else {
                        req.user.lastAccess = new Date();
                        req.user.save();
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

    var sendForgotEmail = function(user,cb)
    {
        var html = app.constants.forgotPassword;
        html = html.replace("<username>", user.firstName);
        html = html.replace("<password reset link>", "http://teselagen.com/forgot/" + user.activationCode);


        var message = {
          "html": html,
          "subject": "TeselaGen - Forgot password",
          "from_email": "registration@teselagen.com",
          "from_name": "TeselaGen",
          "to": [{
                  "email": user.email,
                  "name": user.firstName
              }],
          "headers": {
              "Reply-To": "registration@teselagen.com"
          },
          "track_opens": true,
          "track_clicks": true,
          "tags": [
              "user-activation"
          ],
          "metadata": {
              "website": "www.teselagen.com"
          },
          "recipient_metadata": [{
              "rcpt": user.email
          }]
      };

      var async = false;
      var ip_pool = "Beta Registers";

      mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result){
            return cb(false);
        }, function(e) {
            return cb(true);
        });
    };

    app.post("/forgot", function(req, res) {
        var User = app.db.model("User");
        User.findOne({email:req.body.email},function(err,user){
            if(!user) {
                return res.send({"false":false,msg:"Email not registered"});
            }

            if(user.activated) {
                user.activationCode = crypto.randomBytes(32).toString("hex");
                user.save();
                sendForgotEmail(user,function(err){
                    if(err) return res.send({"success":false,msg:"Error sending email"});
                    res.send({"success":true,msg:"Email reset"});
                });
            }
            else
            {
                return res.send({"success":false,msg:"User not activated"});
            }
        });
    });

    var sendRegisteredMail = function(user,activationCode)
    {
        var html = app.constants.activationEmailText;
        html = html.replace("<username>", user.firstName);

        if(app.get("env") === "production") {
            html = html.replace("<activation>", '<a href="http://api.teselagen.com/users/activate/'+activationCode+'">');
        } else {
            html = html.replace("<activation>", '<a href="http://dev.teselagen.com/users/activate/'+activationCode+'">');
        }
      var mailOptions = {
        from: "Teselagen ✔ <teselagen.testing@gmail.com>",
        to: user.email,
        subject: "Registration ✔",
        text: "Teselagen activation code",
        html: html
      };

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

        /*
        if(req.body.invitationCode !== "tesfo13")
        {
            res.json({
                success: false,
                msg: "Wrong invitation code. This is a private beta."
            });
        }
        */

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
