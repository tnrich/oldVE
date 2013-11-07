module.exports = function(app) {
    var Project = app.db.model("project");
    var restrict = app.auth.restrict;

    /**
     * POST Project
     * @memberof module:./routes/api
     * @method POST '/users/:username/projects'
     */
    app.post('/users/:username/projects', restrict, function(req, res) {
        Project.create({
            name: req.body.name,
            user_id: req.user.id,
            dateCreated: req.body.dateCreated,
            dateModified: req.body.dateModified
        }, function(err, project) {
            if (!err) {
                app.db.model("User").findByIdAndUpdate(project.user_id, {
                    $push: {
                        projects: project
                    }
                }, function() {
                    res.json({
                        "projects": project
                    });
                });
            }
            else {
                app.errorHandler(err, req, res);
            }
        });
    });

    /**
     * PUT Project
     * @memberof module:./routes/api
     * @method PUT '/users/:username/projects'
     */
    app.put('/users/:username/projects', restrict, function(req, res) {
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

    /**
     * DELETE Project
     * @memberof module:./routes/api
     * @method DELETE '/users/:username/projects'
     */
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

    /**
     * GET User Projects
     * @memberof module:./routes/api
     * @method GET '/users/:username/projects'
     */
    app.get('/users/:username/projects', restrict, function(req, res) {
        var User = app.db.model("User");
        User.findById(req.user._id).populate('projects').exec(function(err, user) {
                if (user.projects) {
                    user.projects.forEach(function(proj) {
                        proj.deprojects = undefined;
                        proj.veprojects = undefined;
                    });
                }
            res.json({
                "projects": user.projects
            });
        });
    });

};
