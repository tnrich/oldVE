
module.exports = function(app) {

    var restrict = app.auth.restrict;

    /**
     * CREATE user
     * @memberof module:./routes/api
     * @method POST '/users/:username/projects/:project_id/devicedesigns'
     */
    app.post('/users/:username/projects/:project_id/devicedesigns', function(req, res) {

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
                        "designs": newDesign
                    });
                });
            });
        });
    });

    /**
     * UPDATE/CREATE user
     * @memberof module:./routes/api
     * @method POST '/users/:username/projects/:project_id/devicedesigns'
     */
    app.put('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id', function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        var Part = app.db.model("part");

        var id = req.body.id;
        var model = req.body;

        DeviceDesign.findById(req.params.devicedesign_id, function(err, devicedesign) {

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
                    "designs": req.body
                });
            });
        });
    });

     /**
     * GET Eugene Rules
     * @memberof module:./routes/api
     * @method POST '/users/:username/projects/:project_id/devicedesigns'
     */
    app.get('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id/eugenerules', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        DeviceDesign.findById(req.params.devicedesign_id).exec(function(err, design) {
            if (err) {
                console.log("Error while reading eugene rules");
            } else {
                res.json({
                    "rules": design.rules
                });
            }
        });
    });

    /**
     * GET device design by project_id
     * @memberof module:./routes/api
     * @method POST '/users/:username/projects/:project_id/devicedesigns'
     */
    app.get('/users/:username/projects/:project_id/devicedesigns', restrict, function(req, res) {
        var Project = app.db.model("project");
        console.log("DE's by project_id");
        var project_id = req.params.project_id;
        Project.findById(project_id).populate({path:'designs', select:'name id project_id'}).exec(function(err, project) {
            res.json({
                "designs": project.designs
            });
        });
    });

    /**
     * GET device design by id
     * @memberof module:./routes/api
     * @method POST '/users/:username/projects/:project_id/devicedesigns'
     */
    app.get('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        console.log("DE by id");
        DeviceDesign.findById(req.params.devicedesign_id).populate('j5collection.bins.parts').exec(function(err, design) {
            if(!design) return res.json(500,{"error":"design not found"});
            // Eugene rules to be send on a different request
            design = design.toObject();
            design.id = design._id;
            delete design.rules;

            if (err) {
                errorHandler(err, req, res);
            } else {
                design.j5collection.bins.forEach(function(bin, i) {
                    bin.parts.forEach(function(part, j) {
                        part.fas = bin.fases[j];
                    });
                });
                res.json({
                    "designs": design
                });
            }
        });
    });

    app.delete('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        DeviceDesign.findByIdAndRemove(req.params.devicedesign_id,function(err,devicedesigns) {
            if(err) return res.json(500,{"error":err});
            res.json({
                "designs": devicedesigns
            });
        });
    });

    // CODE BEING DEPREACTED
    /*
    app.get('/users/:username/devicedesigns', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        var Project = app.db.model("project");

        if (req.query.id) {
            //console.log("DE by id");
            DeviceDesign.findById(req.query.id).populate('j5collection.bins.parts').exec(function(err, design) {
                // Eugene rules to be send on a different request
                delete design.rules;

                if (err) {
                    errorHandler(err, req, res);
                } else {
                    res.json({
                        "designs": design
                    });
                }
            });
        } else if (req.query.filter) {
            //console.log("DE's by project_id");
            var project_id = JSON.parse(req.query.filter)[0].value;
            Project.findById(project_id).populate({path:'designs', select:'name id project_id'}).exec(function(err, project) {
                res.json({
                    "designs": project.designs
                });
                
                DeviceDesign.populate(project.designs,{path:'j5collection.bins.parts'},function(err,designs){
                    res.json({
                        "design": designs
                    });
                });
                
            });
        }

    });
    */

};