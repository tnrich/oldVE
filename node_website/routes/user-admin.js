module.exports = function(app, models){

  var checkAuth = function(req,res,next)
  {
    //console.log(req.route.path);
    if(!req.loggedIn) res.redirect('/login#show-login?callback='+req.route.path);
    else next();
  };

  app.get('/status', function(req, res){
    if (req.loggedIn === true)
    res.send({lastAccess:req.session.lastAccess, expires:req.session.cookie._expires});
  });

  app.get('/dashboard', checkAuth, function(req, res){
    res.render('application',{});
  });

  app.post('/editUser', checkAuth, function(req, res){
    var User = app.mongoose.model("User");
    User.findById(req.body.user._id, function(err,user){
      if(err) res.send('error');
      user.firstName = req.body.user.firstName;
      user.lastName = req.body.user.lastName;
      user.email = req.body.user.email;
      user.save();
      res.send(user.firstName+' '+user.lastName+'\'s Account updated!',200);
    });
  });

  app.post('/change-password', checkAuth, function(req, res){
         
      var salt = app.bcrypt.genSaltSync(10);

      app.bcrypt.compare(req.body.oldpass, req.user.hash, function (err, didSucceed) {
        
        if(didSucceed) 
        {
          if(req.body.newpass=="")
          {
            res.send('New Password can\'t be blank',401);
          }
          else
          {
            var hash = app.bcrypt.hashSync(req.body.newpass, salt);
            req.user.hash = hash;
            req.user.save();
            res.send('Password changed!',200);
          }
        }
        else
        {
          res.send('Old Password don\' match!',401);
        }
      
      });
      
  });

  app.get('/getTokens', checkAuth, function(req, res){
    var Tokens = app.mongoose.model("Tokens");
    Tokens.find({}, function(err,dbtokens){
      //console.log(dbtokens);
      res.json({tokens:dbtokens});
    });
  });

  app.get('/manage/getData', checkAuth, function(req, res){
    var User = app.mongoose.model("User");
    User.find({},['email','firstName','lastName'], function(err,dbusers){
      res.json({users:dbusers});
    });
  });

  app.post('/getUserData', checkAuth, function(req, res){
    var User = app.mongoose.model("User");
    User.findById(req.body._id, function(err,dbuser){
      if(err) res.send('error');
        res.json(dbuser);
    });
  });

  app.post('/create-user', checkAuth, function(req, res){
    var salt = app.bcrypt.genSaltSync(10);
    var hash = app.bcrypt.hashSync(req.body.password, salt);
    req.body.user.hash = hash;
    var User = app.mongoose.model("User");

    User.create(req.body.user, function (err, user) {
     if(err) res.send('error');
     res.send('New user created!',201);
     app.mailer.sendRegisteredMail(newUserAttributes.email);
    });
  });

  app.post('/delete-account', checkAuth, function(req, res){
    var User = app.mongoose.model("User");
    User.findById(req.body._id, function(err,dbuser){
      if(err) res.send('error');
        dbuser.remove();
        res.send('Account permanently deleted',200);
    });
  });

  app.post('/getAccountData', checkAuth, function(req, res){
    res.json(req.user);
  });

};