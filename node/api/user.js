module.exports = function(app) {

    var UserManager = require("../manager/UserManager")();
    var userManager = new UserManager(app.db);
    var restrict = app.auth.restrict;

    /**
     * Get user by id stored in session
     * @memberof module:./routes/api
     * @method GET "/users/:username"
     */
    app.get("/users/:username", restrict, function(req, res) {
        userManager.getById(req.user._id, function(err, user) {
            if (err) {
                app.errorHandler(err, req, res);
            } else {
                res.json({
                    "user": user
                });
            }
        });
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