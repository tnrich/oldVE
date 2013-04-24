/**
 * TeselaGen API
 * @module ./routes/api
 */
module.exports = function (app, express) {
  var errorHandler = express.errorHandler();
  var apiManager = new app.ApiManager();

  var emptyGenbank = '"LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//"';



  /**
   *  Login Auth Method : Find User in DB
   */
  function authenticate(username, pass, fn) {
    var User = app.db.model("User");
    User.findOne({
      'username': username
    }, function (err, user) {
      if(err) return fn(new Error('cannot find user'));
      return fn(null, user);
    });
  }

  /**
   * Authentication Restriction.
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
        res.send("Wrong credentials",401);
    }
  };

  /**
   * Send feedback
   * @memberof module:./routes/api
   * @method POST /sendFeedback
   */
  app.post('/sendFeedback', function (req, res) {
    if(req.body.feedback)
    {
      app.mailer.sendMail(
        {
            from: "Teselagen <root@localhost>",
            to: "rpavez@gmail.com",
            subject: "Feedback",
            text: req.body.feedback
        }
        , function(error, response){
          if(error){
              console.log(error);
          } else {
              res.send();
          }
      });
    }
    else if(req.body.error)
    {
      app.mailer.sendMail(
        {
            from: "Teselagen <root@localhost>",
            to: "rpavez@gmail.com",
            subject: "Error",
            text: req.body.error+'\n'+req.body.error_feedback
        }
        , function(error, response){
          if(error){
              console.log(error);
          } else {
              res.send();
          }
      });
    }
    res.send();
  })

  app.all('/logout', function (req, res) {
    req.session.destroy();
    res.send();
  });

  app.all('/login', function (req, res) {

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
      }, function (err, results) {
        if(results === null) {
          // If user not found create a new one
          var newuser = new User({
            username: username
          });
          User.create(newuser, function (err, user) {
            console.log(username + ' user created!');
            req.session.regenerate(function () {
              req.session.user = user;
              req.user = user;
              return res.json({
                'firstTime': true,
                'msg': 'Welcome back ' + username + '!'
              });});
          });
        } else {
          console.log("LOGIN: " + username);
          req.session.regenerate(function () {
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

    if(!app.program.prod)
    {
      // TESTING AUTH

      // Login using fake sessionId (For Testing)
      if(username) getOrCreateUser(username);
      else if(sessionId) getOrCreateUser(username);
      else getOrCreateUser('guest');
    }

    if(app.program.prod)
    {
      // PRODUCTION AUTH
      
      // Manage errors
      if(!sessionId && (!username || !password)) return res.json({'msg': 'Credentials not sended'}, 405);

      // Happy path of Login
      if(username && password) {

        var crypto = require('crypto');
        var hash = crypto.createHash('md5').update(password).digest("hex");

        // Check the user in Mysql
        query = 'select * from j5sessions,tbl_users where j5sessions.user_id=tbl_users.id and tbl_users.password="' + hash + '" order by j5sessions.id desc limit 1;';

        app.mysql.query(query, function (err, rows, fields) {
          if(err) res.json({
            'msg': 'Invalid session'
          }, 405);
          if(rows[0]) getOrCreateUser(rows[0].username);
          else return res.json({
            'msg': 'Username or password invalid'
          }, 405);
        });
      }

      // Login using sessionID
      if(sessionId&&app.prod) {

        query = 'select * from j5sessions,tbl_users where j5sessions.user_id=tbl_users.id and j5sessions.session_id="' + sessionId + '";';
        
        if(app.mysql)
        {
          app.mysql.query(query, function (err, rows, fields) {
            if(err) res.json({
              'msg': 'Invalid session'
            }, 405);
            getOrCreateUser(rows[0].username);
          });
        }
        else res.json({'msg': 'Unexpected error.'}, 405);
      }
      debugger;
    }
  });

  // Get DEProjects
  app.get('/deprojects', restrict, function (req, res) {
    var DEProject = app.db.model("deproject");
    DEProject.find(function(err, projs) {
        if (err) {
            errorHandler(err, req, res);
        }
        else {
            res.json({"projects": projs});
        }
    });
  });

  // Delete DEProjects
  app.delete('/deprojects', restrict, function (req, res) {
    var DEProject = app.db.model("deproject");
    DEProject.remove(function(err) {
        if (err) {
            errorHandler(err, req, res);
        }
        else {
            res.json({});
        }
    });
  });

  // Get Parts
  app.get('/parts', restrict, function (pReq, pRes) {
    var Part = app.db.model("part");
    Part.find(function(pErr, pDocs) {
        if (pErr) {
            errorHandler(pErr, pReq, pRes);
        }
        else {
            pRes.json({"parts": pDocs});
        }
    });
  });  

  // Delete Parts
  app.delete('/parts', restrict, function (pReq, pRes) {
    var Part = app.db.model("part");
    Part.remove(function(pErr, pDocs) {
        if (pErr) {
            errorHandler(pErr, pReq, pRes);
        }
        else {
            pRes.json({});
        }
    });
  });  

  // Get Projects
  app.get('/projects', restrict, function (req, res) {
    var Project = app.db.model("project");
    Project.find(function(err, projs) {
        if (err) {
            errorHandler(err, req, res);
        }
        else {
            res.json({"projects": projs});
        }
    });
  });  

  // Delete Projects
  app.delete('/projects', restrict, function (req, res) {
    var Project = app.db.model("project");
    Project.remove(function(err) {
        if (err) {
            errorHandler(err, req, res);
        }
        else {
            res.json({});
        }
    });
  });  

  // Get Project
  app.get('/projects/:project', restrict, function (req, res) {
      var Project = app.db.model("project");
      Project.findById(req.params.project, function (err, proj) {
          if (err) {
              errorHandler(err, req, res);
          }
          else {
              res.json({"projects": proj});
          }
      });
  });

  // Reset database
  app.get('/resetdb', restrict, function (pReq, pRes) {
      apiManager.resetdb(function(pErr) {
        if (pErr) {
            errorHandler(pErr, pReq, pRes);
        }
        else {
            pRes.json({});
        }
    });
  });  

  // Get Sequences
  app.get('/sequences', restrict, function (pReq, pRes) {
    var Sequence = app.db.model("sequence");
    Sequence.find(function(pErr, pDocs) {
        if (pErr) {
            errorHandler(pErr, pReq, pRes);
        }
        else {
            pRes.json({"sequence": pDocs});
        }
    });
  });  

  // Delete Sequences
  app.delete('/sequences', restrict, function (pReq, pRes) {
    var Sequence = app.db.model("sequence");
    Sequence.remove(function(pErr, pDocs) {
        if (pErr) {
            errorHandler(pErr, pReq, pRes);
        }
        else {
            pRes.json({});
        }
    });
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

  // Update user
  app.put('/user', restrict, function (req, res) {
    res.json({});
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
    if (req.body.id) {
        Project.findById(req.body.id,function(err,proj){
            proj.remove(function(){
                res.json({});
            });
        });
    }
    else {
        Project.remove({user_id:req.user._id}, function(err) {
            if (err) {
                errorHandler(err, req, res);
            }
            else {
                res.json({});
            }
        });
    }
  });  

  // Get User Projects
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
        deproj.j5runs = undefined;
      });
      //console.log("Returning "+proj.deprojects.length+" deprojects");
      res.json({"projects":proj.deprojects});
    });
  });

  // DELETE
  app.delete('/user/projects/deprojects', restrict, function (req, res) {
    var Project = app.db.model("project");
    var DEProjects = app.db.model("deproject");
    DEProjects.findById(req.body.id,function(err,proj){
      if(!proj) return res.json({'fault':'project not found'},500);
      proj.remove(function(err){
        if(err) return res.json({'fault':' new deproj not saved'},500);
        res.json({"projects":{}});
      });
    });
  });

  //CREATE
  app.post('/user/projects/deprojects/devicedesign', function (req, res) {

    var Project = app.db.model("project");
    var DeviceDesign = app.db.model("devicedesign");
    var Part = app.db.model("part");
    
    var newDesign = new DeviceDesign(req.body);

    newDesign.j5collection.bins.forEach(function(bin,binKey){
      bin.parts.forEach(function(part,partKey){
        var partId = newDesign.j5collection.bins[binKey].parts[partKey];
        if(partId) newDesign.j5collection.bins[binKey].parts[partKey] = app.mongoose.Types.ObjectId(partId.toString());
      });
    });

    newDesign.save(function(err){

      Project.findById(newDesign.project_id,function(err,project){
        project.designs.push(newDesign);
        project.save(function(){
          if(err) console.log(err);
          res.json({"design":newDesign}); 
        });
      });
    });
  });

  //UPDATE/CREATE
  app.put('/user/projects/deprojects/devicedesign', function (req, res) {
    var DeviceDesign = app.db.model("devicedesign");
    var Part = app.db.model("part");

    var id = req.body.id;
    var model = req.body;
    
    DeviceDesign.findById(id,function(err,devicedesign){

      for(var prop in model) {
        devicedesign[prop] = model[prop];
      }

      devicedesign.j5collection.bins.forEach(function(bin,binKey){
        bin.parts.forEach(function(part,partKey){
          var partId = devicedesign.j5collection.bins[binKey].parts[partKey];
          if(partId)
          {
            partId = partId.toString();
            delete devicedesign.j5collection.bins[binKey].parts[partKey];
            console.log(partId);
            devicedesign.j5collection.bins[binKey].parts[partKey] = app.mongoose.Types.ObjectId(partId);
          }
        });
      });
      devicedesign.save(function(err){
        if(err) console.log(err);
        res.json({"design":req.body});
      });
    });
  });

  //READ EUGENE RULES
  app.get('/user/projects/deprojects/devicedesign/eugenerules', restrict, function (req, res) {
    var DeviceDesign = app.db.model("devicedesign");
    DeviceDesign.findById(req.query.id).exec(function (err, design) {
        if (err) {
            errorHandler(err, req, res);
        }
        else {
            res.json({"rules":design.rules});
        }
    });
  });

  //READ
  app.get('/user/projects/deprojects/devicedesign', restrict, function (req, res) {
    var DeviceDesign = app.db.model("devicedesign");
    var Project = app.db.model("project");

    if(req.query.id)
    {
      DeviceDesign.findById(req.query.id).populate('design.j5collection.bins.parts').exec(function (err, project) {
          // Eugene rules to be send on a different request
          delete project.design.rules;
          
          if (err) {
              errorHandler(err, req, res);
          }
          else {
              res.json({"design":project.design});
          }
      });
    }
    else if(req.query.filter)
    {
      var project_id = JSON.parse(req.query.filter)[0].value;
      Project.findById(project_id).populate('designs').exec(function (err, project) {
          res.json({"design":project.designs});
      });
    }

  });

  // CREATE
  app.post('/user/projects/veprojects', restrict, function (req, res) {
    var Project = app.db.model("project");
    var VEProject = app.db.model("veproject");
    Project.findById(req.body.project_id,function(err,proj){
      if(err) res.json({"fault":"project not found"},500);
      var newProj = new VEProject({
        name : req.body.name,
        project_id: proj,
        parts : req.body.parts
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

  function autoReassignDuplicatedSequence(res,sequence,cb){
    if(sequence.sequenceFileContent!=emptyGenbank)
    {
      var sequences = app.db.model("sequence");
      sequences.findOne({_id:{$ne : sequence.id},hash:sequence.hash},function(err,seq){
        if(seq) return cb(true,seq);
        else return cb(false);
      });
    }
    else return cb(false);
  }

  function checkForDuplicatedSequence(res,sequence,cb){
    if(sequence.sequenceFileContent!=emptyGenbank)
    {
      var sequences = app.db.model("sequence");
      sequences.findOne({_id:{$ne : sequence.id},hash:sequence.hash},function(err,seq){
        if(seq) return res.json({"fault":"Duplicated sequence","pairId":seq._id},500);
        else return cb(false);
      });
    }
    else return cb(false);
  }

  // Return associated VE Project
  function getAssociatedVEProject(sequence,cb)
  {
    if(sequence.veproject_id)
    {
      VEProject = app.db.model("veproject");
      VEProject.findById(sequence.veproject_id,function(err,veproject){
        if(err||!veproject) return res.json({"fault":"VEProject not found"},500);
        else return cb(veproject);
      });
    }
    else return cb(null);
  }

  //CREATE
  // Create a new sequence
  app.post('/user/projects/veprojects/sequences', function (req, res) {
    var sequence = req.body;
    var VEProject = app.db.model("veproject");
    var Sequence = app.db.model("sequence");

    autoReassignDuplicatedSequence(res,sequence,function(duplicated,duplicatedSequence){

      if(duplicated) {
        res.json({"sequence":duplicatedSequence,"info":"duplicated"});
      }
      else
      {
        getAssociatedVEProject(sequence,function(veproject){
          var newSequence = new Sequence();

          for(var prop in sequence) {
            newSequence[prop] = sequence[prop];
          }

          newSequence.save(function(){
            if(veproject)
            {
              veproject.sequencefile_id = newSequence._id;
              veproject.save(function(err){
                if(err) console.log(err);
                res.json({"sequence":newSequence});
              });
            }
            else res.json({"sequence":newSequence});
          });
        });
      }
    });
  });

  //PUT
  app.put('/user/projects/veprojects/sequences', function (req, res) {
    var sequence = req.body;
    var Sequence = app.db.model("sequence");
    var VEProject = app.db.model("veproject");

    checkForDuplicatedSequence(res,sequence,function(){
      Sequence.findById(req.body.id,function(err, sequence){
        VEProject.findOne({sequencefile_id:sequence.id},function(err, veproject){
          for(var prop in req.body) {
              sequence[prop] = req.body[prop];
          }
          sequence.save(function(pErr){
            res.json({"sequence":sequence,"veproject":veproject});
          });
        });
      });
    });
  });

  //READ
  app.get('/user/projects/veprojects/sequences', restrict, function (req, res) {
    var Sequence = app.db.model("sequence");
    Sequence.findById(req.query.id, function (err, sequence) {
      if(err) console.log("There was a problem!/");
      res.json({"sequence":sequence});
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
      res.json({'parts':newPart});
    });
  });

  //PUT
  app.put('/user/projects/deprojects/parts', function (req, res) {

    var Part = app.db.model("part");
    Part.findById(req.body.id,function(err,part){
      for(var prop in req.body) {
        part[prop] = req.body[prop];
      }
      part.save(function(){
        res.json({'parts':part});
      });
    });
  });

  //GET
  app.get('/user/projects/deprojects/parts', function (req, res) {

    if(req.query.filter)
    {
      var veproject_id = JSON.parse(req.query.filter)[0].value;

      var VEProject = app.db.model("veproject");

      VEProject.findById(veproject_id).populate("parts").exec(function(err,veproject){
        if (!veproject || err) return res.json({"fault":"Unexpected error"},500);
        res.send({"parts":veproject.parts});
      });
    }
    else if(req.query.id)
    {
      var Part = app.db.model("part");
      Part.findById(req.body.id,function(err,part){
          res.json({'parts':part});
      });
    }
  });

  //GET
  app.all('/getExampleModel', restrict, function (req, res) {
    var ExamplesModel = app.db.model("Examples");
    ExamplesModel.findById(req.body._id, function (err, example) {
      res.json(example);
    });
  });

  //READ
  app.get('/user/projects/deprojects/j5runs', restrict, function (req, res) {
    var DEProject = app.db.model("deproject");
    var id = JSON.parse(req.query.filter)[0].value;
    DEProject.findById(id).populate('j5runs').exec(function (err, deproject) {
      var j5runs = deproject.j5runs;
      deproject.j5runs.forEach(function(j5run){
        var j5parameters = j5run.j5Results.j5parameters;
        j5run.j5Input = {};
        j5run.j5Input.j5Parameters = j5parameters;
        //delete j5run.j5Results.j5parameters;
      });
      res.json({'j5runs':j5runs});
    });
  });

  //GetTree
  app.get('/user/tree', restrict, function (req, res) {
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

  // Get VEProjects
  app.get('/veprojects', restrict, function (req, res) {
    var VEProject = app.db.model("veproject");
    VEProject.find(function(err, projs) {
        if (err) {
            errorHandler(err, req, res);
        }
        else {
            res.json({"projects": projs});
        }
    });
  });  

  // Delete VEProjects
  app.delete('/veprojects', restrict, function (req, res) {
    var VEProject = app.db.model("veproject");
    VEProject.remove(function(err) {
        if (err) {
            errorHandler(err, req, res);
        }
        else {
            res.json({});
        }
    });
  });  

  //Get Part Library
  app.get('/partLibrary', restrict, function (req, res) {
    var Part = app.db.model("part");
    Part.find({ name : { $ne: "" } }).sort({'name':1}).exec(function(err,parts){
      res.json({'parts':parts});
    });
  });

  //Check for duplicated names
  app.get('/checkDuplicatedPartName', restrict, function (req, res) {

    var reqPart = JSON.parse(req.query.part);
    console.log(reqPart);
    var reqSequence = req.query.sequence;

    var Part = app.db.model("part");

    var duplicatedName = false;
    var identical = false;

    Part.find(function(err,parts){
      counter = parts.length;
      parts.forEach(function(part,key){

        if( part.name===reqPart.name ) duplicatedName = true;

        if(
            part.genbankStartBP===reqPart.genbankStartBP.toString() &&
            part.endBP===reqPart.endBP.toString() &&
            part.revComp===reqPart.revComp.toString() &&
            part.fas===reqPart.fas.toString() &&
            part.directionForward===reqPart.directionForward.toString()
          ) { identical = true; }

        if(duplicatedName && !identical) { res.json({'msg': 'Duplicated part name.','type':'warning'}, 500); }
        else if(duplicatedName && identical) { res.json({'msg': 'The part already exist.','type':'error'}, 500); }
        else {counter--;}
        if(counter===0) res.json({});
      });
      if(counter===0) res.json({});
    });


  });

};
