module.exports = function(app, express){

  var adminRestrict = app.auth.adminRestrict;
  
  app.get('/admin/dashboard', adminRestrict, function(req, res){
    res.render('dashboard');
  });

  app.get('/admin/users',function(req,res){
    var User = app.db.model("User");
    User.find({},{firstName:1,lastName:1,email:1,username:1,groupType:1,groupName:1,activated:1,userType:1,dateCreated:1,lastAccess:1}).exec(function(err,users){
      res.json({users:users});
    });
  });

  app.get('/admin/manage', adminRestrict, function(req, res){

    // req.query.results = 20;
    // if(!req.query.page) req.query.page = 0;
    // else req.query.page = parseInt(req.query.page);

    var User = app.db.model("User");

    User.find().count().exec(function(err,countUsers){


      // var dbpages = [], arrows = {};
      // for(var i = 0 ; i < countUsers/req.query.results ; i++)
      // {
      //   dbpages.push({
      //     pageNumber: i,
      //     current: (req.query.page === i) ? true : false,
      //     link: '/admin/manage?page='+i
      //   })
      // }

      // arrows.left = {
      //   link: '/admin/manage?page='+(req.query.page-1)
      // };
      // arrows.right = {
      //   link: '/admin/manage?page='+(req.query.page+1)
      // };

      //"firstName lastName email username userType"
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

  app.get('/admin/edituser', adminRestrict, function(req,res){
    var User = app.db.model("User");
    User.findById(req.query.id,function(err,dbuser){
      res.render('edituser',{"user":dbuser});
    });
  });


  app.post('/admin/edituser', adminRestrict, function(req,res){
    var User = app.db.model("User");
    User.findById(req.body.id,function(err,user){
      user.firstName = req.body.first_name;
      user.lastName = req.body.last_name;
      user.email = req.body.email;
      user.groupName = req.body.organizationName;
      user.groupType = req.body.organizationType;
      //user.username = req.body.username;
      user.userType = req.body.userType;
      if(req.body.password!="") user.password = req.body.password;

      user.save(function(err){
        res.redirect('/admin/manage');
      });
    });
  });

};