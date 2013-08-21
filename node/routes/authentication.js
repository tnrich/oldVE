module.exports = function(app) {
    var LocalStrategy = require("passport-local").Strategy;

    app.passport.use(new LocalStrategy(
        function(username, password, done) {
            var User = app.db.model("User");

            if(app.get("env") === "test" || app.get("env") === "development") {
                User.findOne({
                    "username": username,
                    //"password": app.crypto.createHash("md5").update(password).digest("hex")
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
            res.send("Wrong credentials", 401);
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

    app.auth = {};
    app.auth.restrict = restrict;
};
