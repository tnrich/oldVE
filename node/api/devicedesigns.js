module.exports = function(app) {

    var restrict = app.auth.restrict;

    //CREATE
    app.post('/user/:username/devicedesign', function(req, res) {

        var Project = app.db.model("project");
        var DeviceDesign = app.db.model("devicedesign");
        var Part = app.db.model("part");

        var newDesign = new DeviceDesign(req.body);

        newDesign.j5collection.bins.forEach(function(bin, binKey) {
            bin.parts.forEach(function(part, partKey) {
                var partId = newDesign.j5collection.bins[binKey].parts[partKey];
                if (partId) newDesign.j5collection.bins[binKey].parts[partKey] = app.mongoose.Types.ObjectId(partId.toString());
            });
        });

        newDesign.save(function(err) {

            Project.findById(newDesign.project_id, function(err, project) {
                project.designs.push(newDesign);
                project.save(function() {
                    if (err) console.log(err);
                    res.json({
                        "design": newDesign
                    });
                });
            });
        });
    });

    //UPDATE/CREATE
    app.put('/user/:username/devicedesign', function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        var Part = app.db.model("part");

        var id = req.body.id;
        var model = req.body;

        DeviceDesign.findById(id, function(err, devicedesign) {

            for (var prop in model) {
                devicedesign[prop] = model[prop];
            }

            devicedesign.j5collection.bins.forEach(function(bin, binKey) {
                bin.parts.forEach(function(part, partKey) {
                    var partId = devicedesign.j5collection.bins[binKey].parts[partKey];
                    if (partId) {
                        partId = partId.toString();
                        delete devicedesign.j5collection.bins[binKey].parts[partKey];
                        console.log(partId);
                        devicedesign.j5collection.bins[binKey].parts[partKey] = app.mongoose.Types.ObjectId(partId);
                    }
                });
            });
            devicedesign.save(function(err) {
                if (err) console.log(err);
                res.json({
                    "design": req.body
                });
            });
        });
    });

    //READ EUGENE RULES
    app.get('/user/projects/deprojects/devicedesign/eugenerules', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        DeviceDesign.findById(req.query.id).exec(function(err, design) {
            if (err) {
                errorHandler(err, req, res);
            } else {
                res.json({
                    "rules": design.rules
                });
            }
        });
    });

    // GET DEVICEDESIGNS BY PROJECT_ID
    app.get('/user/:username/project/:project_id/devicedesigns', restrict, function(req, res) {
        var Project = app.db.model("project");
        console.log("DE's by project_id");
        var project_id = req.params.project_id;
        Project.findById(project_id).populate({path:'designs', select:'name id project_id'}).exec(function(err, project) {
            res.json({
                "design": project.designs
            });
        });
    });

    // GET DEVICEDESIGN BY ID
    app.get('/user/:username/project/:project_id/devicedesigns/:devicedesign_id', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        console.log("DE by id");
        DeviceDesign.findById(req.params.devicedesign_id).populate('j5collection.bins.parts').exec(function(err, design) {
            // Eugene rules to be send on a different request
            delete design.rules;

            if (err) {
                errorHandler(err, req, res);
            } else {
                res.json({
                    "design": design
                });
            }
        });
    });

    //READ
    app.get('/user/:username/devicedesign', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        var Project = app.db.model("project");

        if (req.query.id) {
            console.log("DE by id");
            DeviceDesign.findById(req.query.id).populate('j5collection.bins.parts').exec(function(err, design) {
                // Eugene rules to be send on a different request
                delete design.rules;

                if (err) {
                    errorHandler(err, req, res);
                } else {
                    res.json({
                        "design": design
                    });
                }
            });
        } else if (req.query.filter) {
            console.log("DE's by project_id");
            var project_id = JSON.parse(req.query.filter)[0].value;
            Project.findById(project_id).populate({path:'designs', select:'name id project_id'}).exec(function(err, project) {
                res.json({
                    "design": project.designs
                });
                /*
                DeviceDesign.populate(project.designs,{path:'j5collection.bins.parts'},function(err,designs){
                    res.json({
                        "design": designs
                    });
                });
                */
            });
        }

    });

};