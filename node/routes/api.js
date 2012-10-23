/**
 * API - VEDE EXT Platform
 * -----------------------
 */

module.exports = function (app) {


  // Login Auth Method : Find User in DB


  function authenticate(username, pass, fn) {
    var User = app.db.model("User");
    User.findOne({
      'username': username
    }, function (err, user) {
      if(err) return fn(new Error('cannot find user'));
      return fn(null, user);
    });
  };


  // Authentication Restriction
  /*
   * If user session is active then find the user in DB.
   * If no testing is enabled no option to use Guest User then Wrong Credential.
   */

  function restrict(req, res, next) {
    if(req.session.user) {
      var User = app.db.model("User");
      User.findOne({
        'username': req.session.user.username
      }, function (err, user) {
        req.user = user;
        next();
      });
    } else {
      if(!app.testing.enabled) {
        res.send('Wrong credentials');
      } else {
        /*
        console.log("Logged as Guest user");
        authenticate("Guest", "", function (err, user) {
          req.session.regenerate(function () {
            req.session.user = user;
            req.user = user;
            next();
          });

        });
        */
        res.send("Wrong credentials", 405);
      }
    }
  };

  // Root Path
  app.get('/', function (req, res) {
    res.send('', 200)
  })

  app.all('/login', function (req, res) {

    // Get parameters
    var sessionId = req.body.sessionId;
    var username = req.body.username;
    var password = req.body.password;

    // getOrCreateUser : Create new entry in DB if User doesn't exist


    function getOrCreateUser(username) {
      // Check if user exist on mongoDB
      var User = app.db.model("User");
      User.findOne({
        'username': username
      }, function (err, results) {
        if(results == null) {
          // If user not found generate a new one
          var newuser = new User({
            username: username
          });
          User.create(newuser, function (err, user) {
            console.log(username + ' user created!');
            req.session.regenerate(function () {
              req.session.user = user;
              req.user = user;
              res.json({
                'firstTime': true,
                'msg': 'Welcome back ' + username + '!'
              });
            });
          });
        } else {
          console.log("LOGIN: " + username);
          req.session.regenerate(function () {
            req.session.user = results;
            req.user = results;
            res.json({
              'firstTime': false,
              'msg': 'Welcome back ' + username + '!'
            });
          });
        }
      });
    }

    // Manage errors (Only in production)
    if(!sessionId && (!username || !password) && app.program.prod) return res.json({
      'msg': 'Credentials not sended'
    }, 405);

    // Login using fake sessionId (For Testing)
    if(sessionId == '111') return getOrCreateUser('rpavez');

    // Login using fake sessionId (For Testing)
    if(sessionId == '000') return res.json({
      'firstTime': true,
      'msg': 'Welcome back Guest !'
    });

    // Loggin using just username (for Testing)
    if(username && password != undefined && !app.program.prod) {
      getOrCreateUser(username);
    }

    // Happy path of Login
    if(username && password && app.production) {

      var crypto = require('crypto');
      var hash = crypto.createHash('md5').update(password).digest("hex");

      // Check the user in Mysql
      var query = 'select * from j5sessions,tbl_users where j5sessions.user_id=tbl_users.id and tbl_users.password="' + hash + '" order by j5sessions.id desc limit 1;';

      app.mysql.query(query, function (err, rows, fields) {
        if(err) res.json({
          'msg': 'Invalid session'
        }, 405);
        if(rows[0]) getOrCreateUser(rows[0].username)
        else return res.json({
          'msg': 'Username or password invalid'
        }, 405);
      });
    }

    // Login using sessionId
    if(sessionId) {
      var query = 'select * from j5sessions,tbl_users where j5sessions.user_id=tbl_users.id and j5sessions.session_id="' + sessionId + '";';
      app.mysql.query(query, function (err, rows, fields) {
        if(err) res.json({
          'msg': 'Invalid session'
        }, 405);
        getOrCreateUser(rows[0].username)
      });
    }

  });

  // Dummy method
  app.all('/getUser', restrict, function (req, res) {
    
    var User = app.db.model("User");
    User.findById(req.user._id).populate('projects')
    .exec(function (err, user) {
      res.json({"user":user});
    });

    /*
    res.json({
      "user": req.session.user
    });
    */
  });


  // Dummy method
  app.all('/getProjects', restrict, function (req, res) {

    var User = app.db.model("User");
    User.findById(req.user._id).populate('projects')
    .exec(function (err, user) {
      res.json({"projects":user.projects});
    });

  });

  app.all('/getDeviceDesign', restrict, function (req, res) {
    var DEProject = app.db.model("deproject");
    DEProject.findById(req.query.id, function (err, project) {
      res.json({"design":project.design});
    });
  
  });


  app.all('/getExampleModel', restrict, function (req, res) {
    var ExamplesModel = app.db.model("Examples");
    ExamplesModel.findById(req.body._id, function (err, example) {
      res.json(example);
    });
  });


};