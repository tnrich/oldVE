
module.exports = function(app) {

    // Get DEProjects
    app.get('/deprojects', restrict, function(req, res) {
        var DEProject = app.db.model("deproject");
        DEProject.find(function(err, projs) {
            if (err) {
                errorHandler(err, req, res);
            } else {
                res.json({
                    "projects": projs
                });
            }
        });
    });

    // Delete DEProjects
    app.delete('/deprojects', restrict, function(req, res) {
        var DEProject = app.db.model("deproject");
        DEProject.remove(function(err) {
            if (err) {
                errorHandler(err, req, res);
            } else {
                res.json({});
            }
        });
    });



    // CREATE
    app.post('/user/projects/deprojects', restrict, function(req, res) {
        var Project = app.db.model("project");
        var DEProject = app.db.model("deproject");
        Project.findById(req.body.project_id, function(err, proj) {
            if (!proj) return res.json({
                'fault': 'project not found'
            }, 500);
            var newProj = new DEProject({
                name: req.body.name,
                project_id: proj,
                dateCreated: req.body.dateCreated,
                dateModified: req.body.dateModified
            });
            newProj.save(function(err) {
                if (err) return res.json({
                    'fault': ' new deproj not saved'
                }, 500);
                proj.deprojects.push(newProj);
                proj.save(function(err) {
                    if (err) return res.json({
                        'fault': ' proj not updated'
                    }, 500);
                    if (!err) console.log("New DE Project Saved!");
                    else console.log("Problem saving DE Proj");
                    res.json({
                        "projects": newProj
                    });
                });
            });
        });
    });

    // PUT
    app.put('/user/projects/deprojects', restrict, function(req, res) {
        var Project = app.db.model("project");
        var DEProjects = app.db.model("deproject");
        DEProjects.findById(req.body.id, function(err, proj) {
            if (!proj) return res.json({
                'fault': 'project not found'
            }, 500);
            proj.name = req.body.name,
            proj.save(function(err) {
                if (err) return res.json({
                    'fault': ' new deproj not saved'
                }, 500);
                res.json({
                    "projects": proj
                });
            });
        });
    });

    // GET
    app.get('/user/projects/deprojects', restrict, function(req, res) {
        var id = JSON.parse(req.query.filter)[0].value;
        var Project = app.db.model("project");
        Project.findById(id).populate('deprojects').exec(function(err, proj) {
            proj.deprojects.forEach(function(deproj) {
                deproj.design = undefined;
                deproj.j5runs = undefined;
            });
            //console.log("Returning "+proj.deprojects.length+" deprojects");
            res.json({
                "projects": proj.deprojects
            });
        });
    });

    // DELETE
    app.delete('/user/projects/deprojects', restrict, function(req, res) {
        var Project = app.db.model("project");
        var DEProjects = app.db.model("deproject");
        DEProjects.findById(req.body.id, function(err, proj) {
            if (!proj) return res.json({
                'fault': 'project not found'
            }, 500);
            proj.remove(function(err) {
                if (err) return res.json({
                    'fault': ' new deproj not saved'
                }, 500);
                res.json({
                    "projects": {}
                });
            });
        });
    });


    // CREATE
    app.post('/user/projects/veprojects', restrict, function(req, res) {
        var Project = app.db.model("project");
        var VEProject = app.db.model("veproject");
        Project.findById(req.body.project_id, function(err, proj) {
            if (err) res.json({
                "fault": "project not found"
            }, 500);
            var newProj = new VEProject({
                name: req.body.name,
                project_id: proj,
                parts: req.body.parts
            });
            newProj.save(function() {
                proj.veprojects.push(newProj);
                proj.save(function() {
                    console.log("New VE Project Saved!");
                    res.json({
                        "projects": newProj
                    });
                });
            });
        });
    });

    // GET
    app.get('/user/projects/veprojects', restrict, function(req, res) {
        var id = JSON.parse(req.query.filter)[0].value;
        var Project = app.db.model("project");
        Project.findById(id).populate('veprojects').exec(function(err, proj) {
            proj.veprojects.forEach(function(veproj) {
                veproj.sequencefile = undefined;
            });
            //console.log("Returning "+proj.veprojects.length+" veprojects");
            res.json({
                "projects": proj.veprojects
            });
        });
    });

    // UPDATE
    app.put('/user/projects/veprojects', restrict, function(req, res) {
        var updatedObj = req.body;
        var VEProject = app.db.model("veproject");
        VEProject.findById(req.body.id, function(err, proj) {
            if (err) res.json({
                "fault": "project not found"
            }, 500);
            for (var prop in req.body) {
                proj[prop] = req.body[prop];
            }
            proj.save(function() {
                res.json({
                    "projects": proj
                });
            });
        });
    });


    // Return associated VE Project

    function getAssociatedVEProject(sequence, cb) {
        if (sequence.veproject_id) {
            VEProject = app.db.model("veproject");
            VEProject.findById(sequence.veproject_id, function(err, veproject) {
                if (err || !veproject) return res.json({
                    "fault": "VEProject not found"
                }, 500);
                else return cb(veproject);
            });
        } else return cb(null);
    }

    //GET
    app.all('/getExampleModel', restrict, function(req, res) {
        var ExamplesModel = app.db.model("Examples");
        ExamplesModel.findById(req.body._id, function(err, example) {
            res.json(example);
        });
    });


    //GetTree
    app.get('/user/tree', restrict, function(req, res) {
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

    // Get VEProjects
    app.get('/veprojects', restrict, function(req, res) {
        var VEProject = app.db.model("veproject");
        VEProject.find(function(err, projs) {
            if (err) {
                errorHandler(err, req, res);
            } else {
                res.json({
                    "projects": projs
                });
            }
        });
    });

    // Delete VEProjects
    app.delete('/veprojects', restrict, function(req, res) {
        var VEProject = app.db.model("veproject");
        VEProject.remove(function(err) {
            if (err) {
                errorHandler(err, req, res);
            } else {
                res.json({});
            }
        });
    });


};