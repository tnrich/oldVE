module.exports = function(app) {

    var UserManager = require("../manager/UserManager")();
    var userManager = new UserManager(app.db);
    var restrict = app.auth.restrict;

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
        res.json({});
    });
};