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
      dateCreated: req.body.dateCreated,
      dateModified: req.body.dateModified
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
      if(err||!proj) return res.json({'fault':err},500); 
      proj.name = req.body.name;
      proj.dateCreated = req.body.dateCreated;
      proj.dateModified = req.body.dateModified;
      proj.save(function(){
        res.json(proj);
      });
    });
  });

  // Delete Project
  app.delete('/user/projects', restrict, function (req, res) {
    var Project = app.db.model("project");
    Project.findById(req.body.id,function(err,proj){
      proj.remove(function(){
        res.json({});
      });
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
      //console.log("Returning "+user.projects.length+" projects");
      res.json({"projects":user.projects});
    });
  });


  // CREATE
  app.post('/user/projects/deprojects', restrict, function (req, res) {
    var Project = app.db.model("project");
    var DEProject = app.db.model("deproject");
    Project.findById(req.body.project_id,function(err,proj){
      if(!proj) return res.json({'fault':'project not found'},500);
      var newProj = new DEProject({
        name : req.body.name,
        project_id: proj,
        dateCreated: req.body.dateCreated,
        dateModified: req.body.dateModified
      });
      newProj.save(function(err){
        if(err) return res.json({'fault':' new deproj not saved'},500);
        proj.deprojects.push(newProj);
        proj.save(function(err){
          if(err) return res.json({'fault':' proj not updated'},500);
          if(!err) console.log("New DE Project Saved!");
          else console.log("Problem saving DE Proj");
          res.json({"projects":newProj});
        });
      });
    });
  });

  // PUT
  app.put('/user/projects/deprojects', restrict, function (req, res) {
    var Project = app.db.model("project");
    var DEProjects = app.db.model("deproject");
    DEProjects.findById(req.body.id,function(err,proj){
      if(!proj) return res.json({'fault':'project not found'},500);
      proj.name = req.body.name,
      proj.save(function(err){
        if(err) return res.json({'fault':' new deproj not saved'},500);
        res.json({"projects":proj});
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
      //console.log("Returning "+proj.deprojects.length+" deprojects");
      res.json({"projects":proj.deprojects});
    });
  });

  //CREATE
  app.post('/user/projects/deprojects/devicedesign', function (req, res) {

    var DEProject = app.db.model("deproject");
    var Part = app.db.model("part");

    var id = req.body["deproject_id"];
    var model = req.body;
    
    DEProject.findById(id,function(err,deproject){
      deproject.design = model;

      deproject.design.j5collection.bins.forEach(function(bin,binKey){
        bin.parts.forEach(function(part,partKey){
          var partId = deproject.design.j5collection.bins[binKey].parts[partKey].toString();
          deproject.design.j5collection.bins[binKey].parts[partKey] = app.mongoose.Types.ObjectId(partId);
        });
      });
    
      deproject.save(function(err){
        if(err) console.log(err);
        res.json({"design":req.body});
      });

    });
  });

  //UPDATE/CREATE
  app.put('/user/projects/deprojects/devicedesign', function (req, res) {
    var DEProject = app.db.model("deproject");
    var Part = app.db.model("part");

    var id = req.body["deproject_id"];
    var model = req.body;
    
    DEProject.findById(id,function(err,deproject){
      deproject.design = model;
      deproject.design.j5collection.bins.forEach(function(bin,binKey){
        bin.parts.forEach(function(part,partKey){
          var partId = deproject.design.j5collection.bins[binKey].parts[partKey];
          if(partId)
          {
            partId = partId.toString();
            delete deproject.design.j5collection.bins[binKey].parts[partKey];
            console.log(partId);
            deproject.design.j5collection.bins[binKey].parts[partKey] = app.mongoose.Types.ObjectId(partId);
          }
        });
      });
      deproject.save(function(err){
        if(err) console.log(err);
        res.json({"design":req.body});
      }); 
    });
  });

  //READ
  app.get('/user/projects/deprojects/devicedesign', restrict, function (req, res) {
    var DEProject = app.db.model("deproject");
    DEProject.findById(req.query.id).populate('design.j5collection.bins.parts').exec(function (err, project) {
      project.design.j5collection.bins.forEach(function(bin){
        bin.parts.forEach(function(part){
          part.id = part._id;
        });
      });
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
      //console.log("Returning "+proj.veprojects.length+" veprojects");
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
  app.post('/user/projects/veprojects/sequences', function (req, res) {
    var id = req.body["veproject_id"];
    var sequence = req.body;
    var VEProject = app.db.model("veproject");
    var Sequence = app.db.model("sequence");

    if(id)
    {
      VEProject.findById(id,function(err,veproject){
        if(err||!veproject) return res.json({"fault":"VEProject not found"},500);
        var newSequence = new Sequence();

        for(var prop in sequence) {
          newSequence[prop] = sequence[prop];
        }

        newSequence.save(function(){
          veproject.sequences.push(newSequence);
          veproject.save(function(err){
            if(err) console.log(err);
            console.log("New Sequence Saved!");

            res.json({"sequence":newSequence});
          });
        });
      });
    }
    else
    {
      var newSequence = new Sequence();

      for(var prop in sequence) {
        newSequence[prop] = sequence[prop];
      }

      newSequence.save(function(err){
        if(err) return res.json({"fault":"Sequence not saved"},500);
        res.json({"sequence":newSequence});
      });
    }
  });


  //PUT
  app.put('/user/projects/veprojects/sequences', function (req, res) {
    var id = req.body["veproject_id"];
    var sequence = req.body;
    delete sequence.id;
    var VEProject = app.db.model("veproject");
    var Sequence = app.db.model("sequence");

    VEProject.findById(id,function(err,veproject){
      var newSequence = new Sequence();

      for(var prop in sequence) {
        newSequence[prop] = sequence[prop];
      }

      newSequence.save(function(){
        veproject.sequences.push(newSequence);
        veproject.save(function(err){
          if(err) console.log(err);
          console.log("New Sequence Saved!");

          res.json({"sequence":newSequence});
        });
      });
    });
  });

  //READ
  app.get('/user/projects/veprojects/sequences', restrict, function (req, res) {

    var VEProject = app.db.model("veproject");
    VEProject.findById(req.query.id).populate('sequences').exec(function (err, project) {
      if(err) console.log("There was a problem!/");
      //console.log(project);
      res.json({"sequence":project.sequences});
    });
  });

  //CREATE
  app.post('/user/projects/deprojects/parts', function (req, res) {

    var Part = app.db.model("part");
    var newPart = new Part();

    for(var prop in req.body) {
      newPart[prop] = req.body[prop];
    }

    newPart.save(function(){
      res.json({'parts':newPart})
    });
  });

  //PUT
  app.put('/user/projects/deprojects/parts', function (req, res) {

    var Part = app.db.model("part");
    Part.findById(req.body.id,function(err,Part){
      for(var prop in req.body) {
        Part[prop] = req.body[prop];
      }

      Part.save(function(){
        res.json({'parts':Part})
      });
    });
  });

  //GET
  app.all('/getExampleModel', restrict, function (req, res) {
    var ExamplesModel = app.db.model("Examples");
    ExamplesModel.findById(req.body._id, function (err, example) {
      res.json(example);
    });
  });

  //READ
  app.get('/user/projects/deprojects/j5results', restrict, function (req, res) {
    var DEProject = app.db.model("deproject");
    //var J5Result = app.db.model("j5result");
    DEProject.findById(req.query.id).populate('j5results').exec(function (err, deproject) {
      res.json({'j5results':deproject.j5results});
    });
  });

};