module.exports = function(app) {
    var LocalStrategy = require("passport-local").Strategy;

    app.passport.use(new LocalStrategy(
        function(username, password, done) {
            var User = app.db.model("User");

            if(app.get("env") === "development") {
                User.findOne({
                    "username": username,
                    "password": app.crypto.createHash("md5").update(password).digest("hex")
                }, function(err, user) {
                    if (err) {return done(new Error("cannot find user"));}
                    if(!user) {
                        User.create({
                            username: username,
                            //password: "",
                            groupName: "Teselagen",
                            groupType: "com"
                        }, function(err, user) {
                            if(err) {
                                return done(err, null);
                            }

                            return done(null, user);
                        });
                    } else {
                        return done(null, user);
                    }
                });
            } else {
                User.findOne({
                    "username": username,
                    //"password": app.crypto.createHash("md5").update(password).digest("hex")
                }, function(err, user) {
                    if (err) {return done(new Error("cannot find user"));}
                    return done(null, user);
                });
            }
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

    app.post('/login',
        app.passport.authenticate('local'),
        function(req, res) {
            res.json({
                user: req.user,
                msg: "Welcome back " + req.user.username + "!"
            });
        }
    );

    app.all("/logout", function(req, res) {
        req.logout();
        res.send();
    });

    app.post('/register', function(req, res) {
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
                    email: req.body.email
                }, function(err, user) {
                    if(err) {
                        res.json({
                            success: false,
                            msg: "Error creating user."
                        });
                    } else {
                        req.logIn(user, function(err) {
                            if(err) {
                                return res.json({
                                    success: false,
                                    msg: "Error logging in as new user."
                                });
                            } else {
                                res.json({
                                    user: user,
                                    success: true,
                                    msg: "Welcome... To the wooooorrrrrllllld of tomorrrrroooooowwwww"
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    app.auth = {};
    app.auth.restrict = restrict;
};
