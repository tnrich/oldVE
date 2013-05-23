module.exports = function(app) {

    var restrict = app.auth.restrict;

   // Add new Project to Current User
    app.post('/users/:username/projects', restrict, function(req, res) {
        var Project = app.db.model("project");
        var newProject = new Project({
            name: req.body.name,
            user_id: req.user,
            dateCreated: req.body.dateCreated,
            dateModified: req.body.dateModified
        });
        newProject.save(function() {
            req.user.projects.push(newProject);
            req.user.save(function() {
                console.log("New project Saved");
                res.json({
                    "projects": newProject
                });
            });
        });
    });

    // Update Project to Current User
    app.put('/users/:username/projects', restrict, function(req, res) {
        var Project = app.db.model("project");
        Project.findById(req.body.id, function(err, proj) {
            if (err || !proj) return res.json({
                'fault': err
            }, 500);
            proj.name = req.body.name;
            proj.dateCreated = req.body.dateCreated;
            proj.dateModified = req.body.dateModified;
            proj.save(function() {
                res.json(proj);
            });
        });
    });

    // Delete Project
    app.delete('/users/:username/projects', restrict, function(req, res) {
        var Project = app.db.model("project");
        if (req.body.id) {
            Project.findById(req.body.id, function(err, proj) {
                proj.remove(function() {
                    res.json({});
                });
            });
        } else {
            Project.remove({
                user_id: req.user._id
            }, function(err) {
                if (err) {
                    errorHandler(err, req, res);
                } else {
                    res.json({});
                }
            });
        }
    });

    // Get User Projects
    app.get('/users/:username/projects', restrict, function(req, res) {
        var User = app.db.model("User");
        User.findById(req.user._id).populate('projects')
            .exec(function(err, user) {
            user.projects.forEach(function(proj) {
                proj.deprojects = undefined;
                proj.veprojects = undefined;
            });
            //console.log("Returning "+user.projects.length+" projects");
            res.json({
                "projects": user.projects
            });
        });
    });

};