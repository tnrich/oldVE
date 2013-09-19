module.exports = function(app) {

    var User = app.db.model("User");
    var UserManager = require("../manager/UserManager")();
    var userManager = new UserManager(app.db);
    var restrict = app.auth.restrict;
    var sendRegisteredMail = function(user)
    {
        var html = app.constants.activationResponseEmailText;
        html = html.replace("<username>", user.firstName);

      var mailOptions = {
        from: "Teselagen <teselagen.testing@gmail.com>",
        to: user.email,
        subject: "Welcome!",
        html: html
      }

      app.mailer.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
          }else{
              console.log("Message sent: " + response.message);
          }
      });
    }
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
