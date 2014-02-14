var mongoose = require('mongoose');

module.exports = function(app) {
    var User = app.db.model("User");
    var restrict = app.auth.restrict;

    return {

      beta: function (req, res) {
        if(req.user.debugAccess || true) res.sendfile( require('path').resolve(__dirname,'../resources/unminified/unminified.html'));
        else res.json({error:'Not allowed'});
      },

      stats: function(req, res) {
          if(req.params.code!="2ca2b06cb959ee4dacffeda0fdbda5f9") return res.json({"error":"invalid access code"});
          User.find().select("firstName lastName dateCreated groupType groupName username").sort({dateCreated: 1}).exec(function(err,users){
            res.json({
                "user": users,
                "totalUsers": users.length
            });
          });
      },

      /*
      Resources integrity check
      */
      integrityCheck: function(req, res) {
          var log = {}; log.sequences = []; log.parts = [];
          if(req.params.code!="2ca2b06cb959ee4dacffeda0fdbda5f9") return res.json({"error":"invalid access code"});
          User.find().populate("parts sequences").exec(function(err,users){
            var usersCount = users.length;
            users.forEach(function(user){
              var userFQDN = user.FQDN;
              var partsCount = user.parts.length;
              var sequencesCount = user.sequences.length;
              user.parts.forEach(function(part){
                if(part && part.FQDN) { log.parts.push(part.FQDN); }
                else log.parts.push("Integrity error in part "+part._id+" user "+user.username);
                partsCount--;
              });

              user.sequences.forEach(function(sequence){
                if(sequence && sequence.FQDN) { log.sequences.push(sequence.FQDN); }
                else log.sequences.push("Integrity error in sequence "+sequence._id+" user "+user.username);  
                sequencesCount--;        
              });

              usersCount--;

              if(usersCount === 0 && sequencesCount === 0 && partsCount === 0) res.json(log);


            });
          });
      },

      /**
       * Get user by id stored in session
       * @memberof module:./routes/api
       * @method GET "/users/:username"
       */
      get_user: function(req, res) {
          res.json({
              "user": req.user
          });
      },

      /**
       * Activation url sent to users in an email.
       */
      activate: function(req, res) {
          User.findOne({
              activationCode: req.params.activationCode
          }, function(err, user) {
              if(err) {
                  return res.send("Error finding the user associated with this code.<br>Are you sure this is the correct URL?");
              } else if(user) {
                  if(user.verifiedEmail)
                  {
                    return res.send("Your email is already verified");
                  }
                  user.verifiedEmail = true;
                  //user.activationCode = undefined;
                  //sendRegisteredMail(user);
                  user.save(function(err) {
                      if(err) return res.json(err);
                      if(app.get("env") === "production") {
                          return res.redirect("http://app.teselagen.com");
                      } else {
                          //return res.redirect("http://development.teselagen.com");
                          res.json(user);
                          //return res.send('You email has been verified');
                      }
                  });
              } else {
                  return res.send("Activation code invalid.");
              }
          });
      },

      /**
       * Get user by id stored in session
       * @memberof module:./routes/api
       * @method GET "/users/:username"
       */
      get_unverified_Status: function(req, res) {
          
          function daydiff(first, second) {
              return (second-first)/(1000*60*60*24);
          }

          if(req.isAuthenticated()) {
              var user = req.user;
              if(!user.verifiedEmail)
              {
                return res.json({
                  verifiedEmail: false,
                  daysLeft: daydiff(new Date(),newDate(req.user.dateCreated))
                });
              }
              else
              {
                  return res.json({
                    verifiedEmail: true
                  });
              }
          } else {
              res.send("Not authenticated", 401);
          }
      },

      resendVerificationEmail: function(req, user){
        User.findOne(req.query.id).exec(function(err,user){
          app.auth.sendActivationEmail(user,user.activationCode);
          res.send("Email verification sent!");
        });
      },

      /**
       * Get user by id stored in session
       * @memberof module:./routes/api
       * @method GET "/users/:username"
       */
      get_users: function(req, res) {
          if(req.isAuthenticated()) {
              return res.json({
                  user: req.user
              });
          } else {
              res.send("Not authenticated", 401);
          }
      },

      /**
       * PUT USER
       * @memberof module:./routes/api
       * @method PUT "/users/:username"
       */
      put_user: function(req, res) {
          req.user.preferences = req.body.preferences;
          req.user.userRestrictionEnzymeGroups = req.body.userRestrictionEnzymeGroups;

          req.user.save(function() {
              res.json({});
          });
      },

    post_presets: function(req,res){
        app.db.model('preset').create({
            presetName: req.body.presetName,
            j5parameters: JSON.parse(req.body.j5parameters)
        }, function(err, newPreset) {
            if(err) {
                console.log('Error creating preset.');
                console.log(err);
            }

            req.user.presets.push(newPreset._id);
            req.user.save(function(err) {
                if(err) {
                    console.log('Error saving user.');
                    console.log(err);
                }

                res.json({});
            });
        });

        /*
        var Preset = app.db.model('preset');

        var newPreset = new Preset({
          presetName: req.body.presetName,
          j5parameters: JSON.parse(req.body.j5parameters)
        });

        newPreset.save(function(err, newPreset){
          if(err) {
            console.log('Error saving preset.');
            console.log(err);
          }

          req.user.presets.push(newPreset);
          req.user.save(function(err){
            if(err) {
              console.log('Error saving user.');
              console.log(err);
            }

            res.json({});
          });
        });
        */
      },

      put_presets: function(req,res){

          var Preset = app.db.model('preset');

          Preset.findById(req.body.id,function(err,preset){
            if(err || !preset) return res.json({success:false});
            preset.j5parameters = JSON.parse(req.body.j5parameters);
            preset.save(function(){
              res.json({});
            });
          });
      },

      del_presets: function(req,res){

          var Preset = app.db.model('preset');

          Preset.findByIdAndRemove(req.body.id,function(err){
            if(err) return res.json({success:false});

            User.populate(req.user, 'presets', function(err, user) {
                user.presets.forEach(function(preset,presetKey){
                  if(preset._id == req.body.id) delete user.presets[presetKey];
                });
                req.user.save(function(){
                  res.json({});
                });
            });

          });

      },

      get_presets: function(req,res){
          User.populate(req.user, 'presets', function(err, user) {
            res.json(user.presets);
          });
      }
  };
};


    /*
    Temporal user listing
    */
    /*
    app.get("/calculateDates/:code", function(req, res) {
        if(req.params.code!="2ca2b06cb959ee4dacffeda0fdbda5f9") return res.json({"error":"invalid access code"});
        User.find().exec(function(err,users){
          var usersCount = users.length;
          users.forEach(function(user){
            if(!user.dateCreated) { user.dateCreated = user._id.getTimestamp(); user.save(); }
            usersCount--;
            if(usersCount == 0) res.json({"op":"ok"});
          });
        });
    });
    */

    /*
    Temporal user listing
    */
    /*
    app.get("/fixResources/:code", function(req, res) {
        if(req.params.code!="2ca2b06cb959ee4dacffeda0fdbda5f9") return res.json({"error":"invalid access code"});
        User.find().populate("parts sequences").exec(function(err,users){
          users.forEach(function(user){
            var userFQDN = user.FQDN;
            user.parts.forEach(function(part){
              var candidate = part.FQDN.match(userFQDN+".+");
              if(candidate[0]) { part.FQDN = candidate[0]; part.save();}
              else console.log("error processing part"+part.FQDN);
            });

            user.sequences.forEach(function(sequence){
              var candidate = sequence.FQDN.match(userFQDN+".+");
              if(candidate[0]) { sequence.FQDN = candidate[0]; sequence.save();}
              else console.log("error processing sequence"+sequence.FQDN);              
            });

          });
        });
    });
    */
