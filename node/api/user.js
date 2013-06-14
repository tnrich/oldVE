module.exports = function(app) {

    var UserManager = require("../manager/UserManager")();
    var userManager = new UserManager(app.db);
    var restrict = app.auth.restrict;

    /**
     * Delete all users
     * @memberof module:./routes/api
     * @method DELETE "/users/:username"
     */
    app.delete("/users", restrict, function(req, res) {
        userManager.deleteAll(function(err) {
            if (err) {
                app.errorHandler(err, req, res);
            } else {
                res.json({});
            }
        });
    });

    /**
     * GET USER
     * @memberof module:./routes/api
     * @method GET "/users/:username"
     */
    app.get("/users/:username", restrict, function(req, res) {
        userManager.getUserById(req.user._id, function(err, user) {
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
        if (!app._.isUndefined(req.body.username)) {
            req.user.username = req.body.username;
        }
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