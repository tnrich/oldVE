module.exports = function(app) {

    var User = app.db.model("User");
    var UserManager = require("../manager/UserManager")();
    var userManager = new UserManager(app.db);
    var restrict = app.auth.restrict;

    var mandrill = require('mandrill-api/mandrill');
    var mandrill_client = new mandrill.Mandrill('eHuRc2KcVFU5nqCOAAefnA');
    
    var sendRegisteredMail = function(user)
    {
        var html = app.constants.activationResponseEmailText;
        html = html.replace("<username>", user.firstName);

        var message = {
          "html": html,
          "subject": "TeselaGen Beta Access",
          "from_email": "registration@teselagen.com",
          "from_name": "TeselaGen",
          "to": [{
                  "email": user.email,
                  "name": user.firstName
              }],
          "headers": {
              "Reply-To": "registration@teselagen.com"
          },
          "track_opens": true,
          "track_clicks": true,
          "tags": [
              "user-activation"
          ],
          "metadata": {
              "website": "www.teselagen.com"
          },
          "recipient_metadata": [{
              "rcpt": user.email
          }]
      };

      var async = false;
      var ip_pool = "Beta Registers";

      mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result){
            console.log(result);
        }, function(e) {
            console.log(error);
        });
    }

    /*
    Temporal user listing
    */
    app.get("/userStats/:code", function(req, res) {
        if(req.params.code!="2ca2b06cb959ee4dacffeda0fdbda5f9") return res.json({"error":"invalid access code"});
        User.find().select("firstName lastName dateCreated groupType groupName username affiliationName affiliationType").exec(function(err,users){
          res.json({
              "user": users,
              "totalUsers": users.length
          });
        });
    });



    /*
    Temporal user listing
    */
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


    /*
    Resources integrity check
    */
    app.get("/integrity/:code", function(req, res) {
        if(req.params.code!="2ca2b06cb959ee4dacffeda0fdbda5f9") return res.json({"error":"invalid access code"});
        User.find().populate("parts sequences").exec(function(err,users){
          users.forEach(function(user){
            var userFQDN = user.FQDN;
            user.parts.forEach(function(part){
              if(part && part.FQDN) {}
              else console.log("Integrity error in part "+part._id+" user "+user.username);
            });

            user.sequences.forEach(function(sequence){
              if(sequence && sequence.FQDN) {}
              else console.log("Integrity error in sequence "+sequence._id+" user "+user.username);          
            });

          });
        });
    });

    /**
     * Get user by id stored in session
     * @memberof module:./routes/api
     * @method GET "/users/:username"
     */
    app.get("/users/:username", restrict, function(req, res) {
        res.json({
            "user": req.user
        });
    });

    /**
     * Activation url sent to users in an email.
     */
    app.get("/users/activate/:activationCode", function(req, res) {
        User.findOne({
            activationCode: req.params.activationCode
        }, function(err, user) {
            if(err) {
                return res.send("Error finding the user associated with this code.<br>Are you sure this is the correct URL?");
            } else if(user) {
                user.activated = true;
                sendRegisteredMail(user);
                user.save(function(err) {
                    if(app.get("env") === "production") {
                        return res.redirect("http://app.teselagen.com");
                    } else {
                        return res.redirect("http://dev.teselagen.com");
                    }
                });
            } else {
                return res.send("Activation code invalid.");
            }
        });
    });

    /**
     * Get user by id stored in session
     * @memberof module:./routes/api
     * @method GET "/users/:username"
     */
    app.get("/users", restrict, function(req, res) {
        if(req.isAuthenticated()) {
            return res.json({
                user: req.user
            });
        } else {
            res.send("Not authenticated", 401);
        }
    });

    /**
     * PUT USER
     * @memberof module:./routes/api
     * @method PUT "/users/:username"
     */
    app.put("/users/:username", restrict, function(req, res) {
        req.user.username = req.body.username;
        req.user.preferences = req.body.preferences;
        req.user.userRestrictionEnzymeGroups = req.body.userRestrictionEnzymeGroups;

        userManager.update(req.user, function(err, pUser) {
            if (err) {
                app.errorHandler(err, req, res);
            } else {
                req.session.user = pUser;
                res.json({});
            }
        });
    });
};
