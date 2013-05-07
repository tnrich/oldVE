module.exports = function(app){

    /**
     *  Login Auth Method : Find User in DB
     */
    var authenticate = function(username, pass, fn) {
        var User = app.db.model("User");
        User.findOne({
            'username': username
        }, function(err, user) {
            if (err) return fn(new Error('cannot find user'));
            return fn(null, user);
        });
    }

    /**
     * Authentication Restriction.
     * If user session is active then find the user in DB.
     * If no testing is enabled no option to use Guest User then Wrong Credential.
     */
    var restrict = function(req, res, next) {
        if (req.session.user) {
            var User = app.db.model("User");
            User.findOne({
                'username': req.session.user.username
            }, function(err, user) {
                req.user = user;
                next();
            });
        } else {
            res.send("Wrong credentials", 401);
        }
    };

    var AuthRouting = function(app){
        app.all('/logout', function(req, res) {
            req.session.destroy();
            res.send();
        });

        app.all('/login', function(req, res) {

            // Get parameters
            var sessionId = req.body.sessionId;
            var username = req.body.username;
            var password = req.body.password;
            //console.log("sessionId:[%s], username:[%s], password:[%s]",sessionId, username, password);

            /**
             *  Create new entry in DB if User doesn't exist
             */

            function getOrCreateUser(username) {
                // Check if user exist on mongoDB
                var User = app.db.model("User");
                User.findOne({
                    'username': username
                }, function(err, results) {
                    if (results === null) {
                        // If user not found create a new one
                        var newuser = new User({
                            username: username
                        });
                        User.create(newuser, function(err, user) {
                            console.log(username + ' user created!');
                            req.session.regenerate(function() {
                                req.session.user = user;
                                req.user = user;
                                return res.json({
                                    'firstTime': true,
                                    'msg': 'Welcome back ' + username + '!'
                                });
                            });
                        });
                    } else {
                        console.log("LOGIN: " + username);
                        req.session.regenerate(function() {
                            req.session.user = results;
                            req.user = results;
                            return res.json({
                                'firstTime': false,
                                'msg': 'Welcome back ' + username + '!'
                            });
                        });
                    }
                });
            }

            if (!app.program.prod) {
                // TESTING AUTH

                // Login using fake sessionId (For Testing)
                if (username) getOrCreateUser(username);
                else if (sessionId) getOrCreateUser(username);
                else getOrCreateUser('guest');
            }

            if (app.program.prod) {
                // PRODUCTION AUTH

                // Manage errors
                if (!sessionId && (!username || !password)) return res.json({
                    'msg': 'Credentials not sended'
                }, 405);

                // Happy path of Login
                if (username && password) {

                    var crypto = require('crypto');
                    var hash = crypto.createHash('md5').update(password).digest("hex");

                    // Check the user in Mysql
                    query = 'select * from j5sessions,tbl_users where j5sessions.user_id=tbl_users.id and tbl_users.password="' + hash + '" order by j5sessions.id desc limit 1;';

                    app.mysql.query(query, function(err, rows, fields) {
                        if (err) res.json({
                            'msg': 'Invalid session'
                        }, 405);
                        if (rows[0]) getOrCreateUser(rows[0].username);
                        else return res.json({
                            'msg': 'Username or password invalid'
                        }, 405);
                    });
                }

                // Login using sessionID
                if (sessionId && app.prod) {

                    query = 'select * from j5sessions,tbl_users where j5sessions.user_id=tbl_users.id and j5sessions.session_id="' + sessionId + '";';

                    if (app.mysql) {
                        app.mysql.query(query, function(err, rows, fields) {
                            if (err) res.json({
                                'msg': 'Invalid session'
                            }, 405);
                            getOrCreateUser(rows[0].username);
                        });
                    } else res.json({
                        'msg': 'Unexpected error.'
                    }, 405);
                }
                debugger;
            }
        });
    };

    app.auth = {};
    app.auth.restrict = restrict;
    app.auth.authenticate = authenticate;

    AuthRouting(app);
}