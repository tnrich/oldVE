module.exports = function(app, express) {
    var LocalStrategy = require("passport-local").Strategy;
    var crypto = require("crypto");
    var flash = require('connect-flash');

    app.passport.use(new LocalStrategy(
        function(username, password, done) {
            var User = app.db.model("User");

            User.findOne({
                "username": username
            }, function(err, user) {
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

        User.findById(id, function(err, user) {
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

    var adminRestrict = function(req, res, next) {
        if(req.isAuthenticated() && req.user.userType && req.user.userType === "Admin") {
            return next();
        } else {
            res.redirect('/admin');
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
        res.redirect('/admin');
    });

    app.get('/forgot/:token', function(req, res){
        res.render('forgot',{token:req.params.token});
    });

    app.get('/forgot', function(req, res){
        res.render('forgot_question');
    });

    app.post('/forgot', function(req, res){
        var User = app.db.model("User");
        if(!req.body.token || req.body.token === "") return res.render('forgot_success',{msg:"Invalid token"});
        var token = req.body.token;
        User.findOne({activationCode:token},function(err,user){
          if(!user) return res.render('forgot_success',{msg:"Invalid token"});
          user.password = req.body.password;
          user.activationCode = undefined;
          user.save(function(){
            return res.render('forgot_success',{msg:"Password has been changed."});
          });
        });
    });


    var sendActivationMail = function(user,activationCode)
    {
        var html = app.constants.activationEmailText;
        html = html.replace("<firstName>", user.firstName);
        html = html.replace("<lastName>", user.lastName);
        html = html.replace("<email>", user.email);
        html = html.replace("<organizationName>", user.groupName);
        html = html.replace("<organizationType>", user.groupType);
        html = html.replace("<username>", user.username);


        if(app.get("env") === "production") {
            html = html.replace("<activation>", '<a href="http://app.teselagen.com/users/activate/'+activationCode+'">');
        } else {
            html = html.replace("<activation>", '<a href="http://dev.teselagen.com/users/activate/'+activationCode+'">');
        }

        var message = {
            "html": html,
            "subject": "New Registered User",
            "from_email": "registration@teselagen.com",
            "from_name": "TeselaGen",
            "to": [{
                    "email": "mike.fero@teselagen.com",
                }],
            "headers": {
                "Reply-To": "registration@teselagen.com"
            },
            "bcc_address": "njhillson@teselagen.com",
            "track_opens": true,
            "track_clicks": true,
            "tags": [
                "user-activation"
            ],
            "metadata": {
                "website": "www.teselagen.com"
            },
            "recipient_metadata": [{
                "rcpt": "mike.fero@teselagen.com"
            }]
        };

        var async = false;
        var ip_pool = "Beta Registers";

        app.mailer.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result){
            console.log(result);
        }, function(e) {
            console.log(error);
        });
    }

    var sendRegisteredMail = function(user)
    {
        var html = app.constants.registrationEmailText;
        html = html.replace("<username>", user.firstName);

        var message = {
            "html": html,
            "subject": "Welcome!",
            "from_email": "registration@teselagen.com",
            "from_name": "TeselaGen Biotechnology",
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
                "user-registration"
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

        app.mailer.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result){
            console.log(result);
        }, function(e) {
            console.log(error);
        });
    }

    app.post('/registerUser', function(req, res) {
        var User = app.db.model("User");
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
                    redirect: "/loginUser",
                    msg: "User '" + req.body.username + "' already exists."
                });
            } else {
                User.create({
                    username: req.body.username,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email:    req.body.email,
                    activated: false,
                    activationCode: crypto.randomBytes(32).toString("hex"),
                    groupName: req.body.organizationName,
                    groupType: req.body.organizationType,
                    dateCreated: new Date()
                }, function(err, user) {
                    if(err) {
                        res.json({
                            success: false,
                            msg: "Error creating user."
                        });
                    } else {
                        sendActivationMail(user, user.activationCode);
                        sendRegisteredMail(user);
                        res.json({
                            success: false,
                            redirect: '/thanks',
                            msg: "An activation email has been sent to your account.<br>Please click the link in the email to continue."
                        });
                    }
                });
            }
        });
    });

    app.auth = {};
    app.auth.restrict = restrict;
    app.auth.adminRestrict = adminRestrict;
};
