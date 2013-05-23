module.exports = function(app) {

    var restrict = app.auth.restrict;

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



    // Update user
    app.put('/users/:username', restrict, function(req, res) {
        res.json({});
    });
};