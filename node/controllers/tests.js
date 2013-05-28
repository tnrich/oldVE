
module.exports = function(app){
    var restrict = app.auth.restrict;

    app.get('/test/getproject', function (req, res) {
        var Project = app.db.model("project");
        var Entry = app.db.model("entry");

        Project.findById('51689c2b099290c8aa000003').populate('entries').exec(function(err,project){
            res.json(project);
        });
    });

    app.get('/test/addproject', restrict , function(req, res) {
        var Project = app.db.model("project");
        var newProject = new Project({"name":"newProject"});
        newProject.save(function(){
            req.user.projects.push(newProject);
            req.user.save(function(){
                res.json({"op":"ok"});
            });
        });
    });

    app.get('/test/adddesign', restrict , function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        var Project = app.db.model("project");
        var newDE = new DeviceDesign({"name":"newDE"});
        newDE.save(function(){

            app.async.parallel([
                function(callback){
                    req.user.designs.push(newDE);
                    req.user.save(callback);
                },
                function(callback){
                    Project.findById('5176a9db8499190000000006',function(err,project){
                        project.designs.push(newDE);
                        project.save(callback);
                    });
                }
            ],
            function(err, results){
                res.json({"op":"ok"});
            });
        });
    });

    app.get('/test/getuser', restrict , function(req, res) {
        req.user.populateProjects(function(err,user){
            res.json(user);
        });
    });


};