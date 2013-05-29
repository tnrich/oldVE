module.exports = function(app) {

    var restrict = app.auth.restrict;

    /**
     * GET USER PROJECTS
     * @memberof module:./routes/api
     * @method GET '/users/:username'
     */
    app.get('/users/:username', restrict, function(req, res) {
        var User = app.db.model("User");
        User.findById(req.user._id).populate('projects')
            .exec(function(err, user) {
            user.projects.forEach(function(proj) {
                proj.deprojects = undefined;
                proj.veprojects = undefined;
            });
            res.json({
                "user": user
            });
        });
    });



    /**
     * PUT USER DATA
     * @memberof module:./routes/api
     * @method GET '/users/:username'
     */
    app.put('/users/:username', restrict, function(req, res) {
        res.json({});
    });
};