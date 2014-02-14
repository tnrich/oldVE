module.exports = function(app, express){

  var adminRestrict = app.auth.adminRestrict;
  
  var User = app.db.model("User");

  app.get('/admin/dashboard', adminRestrict, function(req, res){
    res.render('dashboard');
  });

  app.get('/admin/users',function(req,res){
    User.find({},{firstName:1,lastName:1,email:1,username:1,userType:1,groupType:1,groupName:1,activated:1,userType:1,dateCreated:1,lastAccess:1,debugAccess:true}).exec(function(err,users){
      res.json({users:users});
    });
  });

  app.get('/admin/manage', adminRestrict, function(req, res){

    // req.query.results = 20;
    // if(!req.query.page) req.query.page = 0;
    // else req.query.page = parseInt(req.query.page);

    var User = app.db.model("User");

    User.find().count().exec(function(err,countUsers){

      User.find().select().sort({lastName: 1}).skip(req.query.results*req.query.page).limit(req.query.results).exec(function(err,dbusers){
        if(err) return res.json(err)
        res.render('userlist',{users:dbusers});
      });

    });

  });

  app.get('/admin/stats', adminRestrict, function(req, res){
    app.redis.send_command('keys',['vede://*'],function(err,keys){    
      var stats = [['label','value']];
      stats.push(['users',keys.length]);
      res.render('stats',{data:JSON.stringify(stats)});
    });
  });

  app.get('/admin/mailing', adminRestrict, function(req, res){
    db.users.find({},{email:1})
    User.find({},{email:1,dateCreated:1}).exec(function(err,users){
      var encodedUsers = JSON.stringify(users);
      var emails = "";
      users.forEach(function(user){
        emails+=user.email+",";
      });
      res.render('mailing',{encodedUsers:encodedUsers,emails:emails});
    });
  });

  app.get('/admin/edituser', adminRestrict, function(req,res){
    var User = app.db.model("User");    
    User.findById(req.query.id,function(err,dbuser){
      res.render('edituser',{"user":dbuser});
    });
  });


  app.post('/admin/edituser', adminRestrict, function(req,res){
    var User = app.db.model("User");

    if(req.body.deleteUser && req.body.deleteUser === "Delete") {
      return res.render('user_delete',{user_id:req.body.id,username:req.body.last_name + " "+req.body.id});
    }
    
    User.findById(req.body.id,function(err,user){
      user.firstName = req.body.first_name;
      user.lastName = req.body.last_name;
      user.email = req.body.email;
      user.groupName = req.body.organizationName;
      user.groupType = req.body.organizationType;
      user.activated = req.body.activated;
      user.debugAccess = req.body.debugAccess;
      //user.username = req.body.username;
      user.userType = req.body.userType;
      if(req.body.password!="") user.password = req.body.password;

      user.save(function(err){
        res.redirect('/admin/manage');
      });
    });
  });

  app.post('/admin/deluser',function(req,res){
    var user_id = req.body.id;
    var keepdata = (req.body.keepdata) ? true : false;

    var User = app.db.model("User");

    User.findById(user_id).populate("parts sequences projects").exec(function(err,user){

      var username = user.username;
      
      user.parts.forEach(function(part){
        part.remove(function(){ 
          console.log("Removed part");
        });
      });

      user.sequences.forEach(function(sequence){
        sequence.remove(function(){ 
          console.log("Removed sequence");
        });
      });

      user.projects.forEach(function(projects){
        projects.remove(function(){ 
          console.log("Removed project");
        });
      });

      user.remove(function(){
        res.send(username+" removed <a href='/admin/manage'>Click here to continue</a>");
      });


    });

  });

};