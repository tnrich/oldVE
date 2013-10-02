module.exports = function(app, express){

  var adminRestrict = app.auth.adminRestrict;

  app.get('/admin/dashboard', adminRestrict, function(req, res){

    req.query.results = 20;
    if(!req.query.page) req.query.page = 0;
    else req.query.page = parseInt(req.query.page);

    var User = app.db.model("User");

    User.find().count().exec(function(err,countUsers){


      var dbpages = [], arrows = {};
      for(var i = 0 ; i < countUsers/req.query.results ; i++)
      {
        dbpages.push({
          pageNumber: i,
          current: (req.query.page === i) ? true : false,
          link: '/admin/dashboard?page='+i
        })
      }

      arrows.left = {
        link: '/admin/dashboard?page='+(req.query.page-1)
      };
      arrows.right = {
        link: '/admin/dashboard?page='+(req.query.page+1)
      };

      User.find().select("firstName lastName email username").sort({dateCreated: -1}).skip(req.query.results*req.query.page).limit(req.query.results).exec(function(err,dbusers){
        if(err) return res.json(err)
        res.render('application',{users:dbusers,pages:dbpages,"arrows":arrows});
      });

    });

  });

  app.get('/admin/edituser', adminRestrict, function(req,res){
    var User = app.db.model("User");
    User.findById(req.query.id,function(err,dbuser){
      res.render('edituser',{"user":dbuser});
    });
  });


};