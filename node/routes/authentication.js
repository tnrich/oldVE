module.exports = function(app){
    var crypto = require("crypto");

    /**
     *  Login Auth Method : Find User in DB
     */
    var authenticate = function(username, pass, fn) {
        var User = app.db.model("User");
        User.findOne({
            "username": username
        }, function(err, user) {
            if (err) {return fn(new Error("cannot find user"));}
            return fn(null, user);
        });
    };

    /**
     * Authentication Restriction.
     * Set current user from user session, otherwise send an error.
     */
    var restrict = function(req, res, next) {
        if (req.session.user) {
            req.user = req.session.user;
            next();
        } else {
            res.send("Wrong credentials", 401);
        }
    };

    /**
     *  Create new entry in DB if User doesn"t exist
     *  or retrieve existing user.
     */
    var getOrCreateUser = function(req, res, username, remember) {
        // Check if user exist on mongoDB
        var User = app.db.model("User");
        User.findOne({
            "username": username
        }, function(err, results) {
            if (results === null) {
                // If user not found create a new one
                var newuser = new User({
                    username: username,
                    groupName: "Teselagen",
                    groupType: "com"
                });
                User.create(newuser, function(err, user) {

                if(remember) {res.cookie("sessionname", username, { signed: true });}
                else { res.clearCookie("sessionname"); }

                    console.log(username + " user created!");
                    req.session.regenerate(function() {
                        req.session.user = user;
                        req.user = user;
                        return res.json({
                            "firstTime": true,
                            "msg": "Welcome back " + username + "!",
                            "user": user,
                            "remember":remember
                        });
                    });
                });
            } else {

                if(remember) {res.cookie("sessionname", username, { signed: true });}
                else { res.clearCookie("sessionname"); }

                console.log("LOGIN: " + username);
                req.session.regenerate(function() {
                    req.session.user = results;
                    req.user = results;
                    return res.json({
                        "firstTime": false,
                        "msg": "Welcome back " + username + "!",
                        "user": results,
                        "remember":remember
                    });
                });
            }
        });
    };

    app.all("/logout", function(req, res) {
        req.session.destroy();
        res.clearCookie("sessionname");
        return res.send();
    });


    app.all("/checkcookies", function(req, res) {
        res.json(req.signedCookies);
    });

    app.all("/login", function(req, res) {

        // Get parameters
        var sessionId = req.body.sessionId;
        var username = req.body.username;
        var password = req.body.password;
        var remember = req.body.remember === "true" ? true : false;
        var query, hash;
        //console.log("sessionId:[%s], username:[%s], password:[%s]",sessionId, username, password);


        if(req.session && req.session.user)
        {
            if(req.session.user.username === username)
            {
                return res.json({
                    "firstTime": false,
                    "msg": "Welcome back " + req.session.user.username + "!",
                    "user": req.session.user,
                    "remember":remember
                });
            }
            else
            {
                return res.json({
                    "msg": "Another user is already logged in, please login as "+req.session.user.username+" and logout."
                }, 403);
            }
        }



        if (app.program.dev || app.program.test) {
            // TESTING AUTH

            if(req.signedCookies.sessionname)
            {
                return getOrCreateUser(req, res, req.signedCookies.sessionname, remember);
            }

            // Login using fake sessionId (For Testing)
            if (username) {getOrCreateUser(req, res, username, remember);}
            else if (sessionId) {getOrCreateUser(req, res, username, remember);}
            else {getOrCreateUser(req, res, "guest", remember);}
        } else {
            // PRODUCTION AUTH

            // Manage errors
            if (!sessionId && (!username || !password)) {return res.json({
                "msg": "Credentials not sent"
                }, 401);
            }

            // Happy path of Login
            if (username && password) {
                hash = crypto.createHash("md5").update(password).digest("hex");
                query = "select * from j5sessions,tbl_users where j5sessions.user_id=tbl_users.id and tbl_users.password='" + hash +
                    "' order by j5sessions.id desc limit 1;";
            }
            else {
                query = "select * from j5sessions,tbl_users where j5sessions.user_id=tbl_users.id and j5sessions.session_id='" + sessionId + "';";
            }

            app.mysql.query(query, function(err, rows) {
                if (err||!rows) {
                    return res.json({
                        "msg": "Invalid session"
                    }, 401);
                }
                if (rows[0]) {
                    // For now only let beta users through
                    if (rows[0].beta) {
                        getOrCreateUser(req, res, rows[0].username, remember);
                    }
                    else {
                        return res.json({"msg":"For now only beta users are authorized"}, 403);
                    }
                }
                else {
                    return res.json({
                        "msg": "Username or password invalid"
                    }, 401);
                }
            });
        }
    });

    app.auth = {};
    app.auth.restrict = restrict;
    app.auth.authenticate = authenticate;

};