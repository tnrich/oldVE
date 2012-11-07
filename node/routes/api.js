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
        res.send("Wrong credentials",401);
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

  app.put('/user', restrict, function (req, res) {
    res.json({});
  });

  // Dummy method
  app.get('/user', restrict, function (req, res) {
    var User = app.db.model("User");
    User.findById(req.user._id).populate('projects')
    .exec(function (err, user) {
      user.projects.forEach(function(proj){
        proj.deprojects = undefined;
        proj.veprojects = undefined;
      });
      res.json({"user":user});
    });
  });


  // Add new Project to Current User
  app.post('/user/projects', restrict, function (req, res) {
    var Project = app.db.model("project");
    var newProject = new Project({
      name: req.body.name,
      user_id : req.user,
      DateCreated: req.body.DateCreated,
      DateModified: req.body.DateModified
    });
    newProject.save(function(){
      req.user.projects.push(newProject);
      req.user.save(function(){
        console.log("New project Saved");
        res.json({"projects":newProject});
      });
    });
  });

  // Update Project to Current User
  app.put('/user/projects', restrict, function (req, res) {
    var Project = app.db.model("project");
    Project.findById(req.body.id,function(err,proj){
      proj.name = req.body.name;
      proj.DateCreated = req.body.DateCreated;
      proj.DateModified = req.body.DateModified;
      var projects = de.body.deprojects;
      //projec
    });
  });
  

  app.get('/user/projects', restrict, function (req, res) {
    var User = app.db.model("User");
    User.findById(req.user._id).populate('projects')
    .exec(function (err, user) {
      user.projects.forEach(function(proj){
        proj.deprojects = undefined;
        proj.veprojects = undefined;
      });
      console.log("Returning "+user.projects.length+" projects");
      res.json({"projects":user.projects});
    });
  });


  // CREATE
  app.post('/user/projects/deprojects', restrict, function (req, res) {
    var Project = app.db.model("project");
    var DEProject = app.db.model("deproject");
    Project.findById(req.body.project_id,function(err,proj){
      var newProj = new DEProject({
        name : req.body.name,
        project_id: proj
      });
      newProj.save(function(){
        proj.deprojects.push(newProj);
        proj.save(function(){
          console.log("New DE Project Saved!");
          res.json({"projects":newProj});
        });
      });
    });
  });

  // GET
  app.get('/user/projects/deprojects', restrict, function (req, res) {
    var id = JSON.parse(req.query.filter)[0].value;
    var Project = app.db.model("project");
    Project.findById(id).populate('deprojects').exec(function(err,proj){
      proj.deprojects.forEach(function(deproj){
        deproj.design = undefined;
      });
      console.log("Returning "+proj.deprojects.length+" deprojects");
      res.json({"projects":proj.deprojects});
    });
  });

  //CREATE
  app.post('/user/projects/deprojects/devicedesign', function (req, res) {
    var id = req.body["deproject_id"];
    var model = req.body;
    var DEProject = app.db.model("deproject");

    DEProject.findByIdAndUpdate(id, { design: model }, {}, function(err){
        if(err) console.log("There was a problem!/");
        console.log(err);
        console.log("New Design Saved!");
        res.json({"design":req.body});
      });

  });

  //READ
  app.get('/user/projects/deprojects/devicedesign', restrict, function (req, res) {
    var DEProject = app.db.model("deproject");
    DEProject.findById(req.query.id, function (err, project) {
      //delete project.design.rules;
      /*
      project.design.j5collection.bins.forEach(function(bin){
        bin.parts.forEach(function(part){
          delete part.id;
        });
      });
      */
      res.json({"design":project.design});
    });
    
  });
  
  // CREATE
  app.post('/user/projects/veprojects', restrict, function (req, res) {
    var Project = app.db.model("project");
    var VEProject = app.db.model("veproject");
    Project.findById(req.body.project_id,function(err,proj){
      if(err) res.json({"fault":"project not found"},500);
      var newProj = new VEProject({
        name : req.body.name,
        project_id: proj
      });
      newProj.save(function(){
        proj.veprojects.push(newProj);
        proj.save(function(){
          console.log("New VE Project Saved!");
          res.json({"projects":newProj});
        });
      });
    });
  });

  // GET
  app.get('/user/projects/veprojects', restrict, function (req, res) {
    var id = JSON.parse(req.query.filter)[0].value;
    var Project = app.db.model("project");
    Project.findById(id).populate('veprojects').exec(function(err,proj){
      proj.veprojects.forEach(function(veproj){
        veproj.sequencefile = undefined;
      });
      console.log("Returning "+proj.veprojects.length+" veprojects");
      res.json({"projects":proj.veprojects});
    });
  });

  // UPDATE
  app.put('/user/projects/veprojects', restrict, function (req, res) {
    var updatedObj = req.body;
    var VEProject = app.db.model("veproject");
    VEProject.findById(req.body.id,function(err,proj){
      if(err) res.json({"fault":"project not found"},500);
      for(var prop in req.body)
      {
        proj[prop] = req.body[prop];
      }
      proj.save(function(){
        res.json({"projects":proj});
      });
    });
  });

  //CREATE
  app.post('/user/projects/veprojects/sequencefile', function (req, res) {
    var id = req.body["veproject_id"];
    var sequence = req.body;
    delete sequence.id;
    var VEProject = app.db.model("veproject");

    VEProject.findByIdAndUpdate(id, { sequencefile: sequence }, {}, function(err){
        if(err) console.log("There was a problem!/");
        console.log(err);
        console.log("New Sequence Saved!");
        res.json({"sequence":req.body});
      });

  });

  //READ
  app.get('/user/projects/veprojects/sequencefile', restrict, function (req, res) {
    var VEProject = app.db.model("veproject");
    VEProject.findById(req.query.id, function (err, project) {
      if(err) console.log("There was a problem!/");
      //console.log(project);
      res.json({"sequence":project.sequencefile});
    });
    
  });

  app.all('/getExampleModel', restrict, function (req, res) {
    var ExamplesModel = app.db.model("Examples");
    ExamplesModel.findById(req.body._id, function (err, example) {
      res.json(example);
    });
  });

};