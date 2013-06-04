
module.exports = function(app) {

    var restrict = app.auth.restrict;

     var DeviceDesign = app.db.model("devicedesign");
     var Part = app.db.model("part");

    function fillEmptyParts(design){

        design.j5collection.bins.forEach(function(bin, binKey) {
            bin.parts.forEach(function(part, partKey) {
                var partId = design.j5collection.bins[binKey].parts[partKey];
                if (partId) design.j5collection.bins[binKey].parts[partKey] = app.mongoose.Types.ObjectId(partId.toString());
                else design.j5collection.bins[binKey].parts[partKey] = app.mongoose.Types.ObjectId(app.constants.defaultEmptyPart._id.toString());
            });
        });
        return design;
    };

    function prepareDesignWithParts(design,cb){
        DeviceDesign.findById(design._id).populate('j5collection.bins.parts').exec(function(err, design) {

            design = design.toObject();
            design.id = design._id;
            delete design.rules;

            design.j5collection.bins.forEach(function(bin, i) {
                bin.parts.forEach(function(part, j) {
                    //design.j5collection.bins[i].parts[j] = { name: "blank" };
                });
            });

            return cb(design);
        });
    };

    /**
     * CREATE user
     * @memberof module:./routes/api
     * @method POST '/users/:username/projects/:project_id/devicedesigns'
     */
    app.post('/users/:username/projects/:project_id/devicedesigns', function(req, res) {

        var Project = app.db.model("project");
        var DeviceDesign = app.db.model("devicedesign");
        var Part = app.db.model("part");

        var reqDesign = req.body;

        reqDesign = fillEmptyParts(reqDesign);

        var newDesign = new DeviceDesign(reqDesign);

        newDesign.save(function(err) {

            Project.findById(newDesign.project_id, function(err, project) {
                project.designs.push(newDesign);
                project.save(function() {
                    if (err) console.log(err);
                    prepareDesignWithParts(newDesign,function(design){
                        res.json({
                            "designs": design
                        });
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

        model = fillEmptyParts(model);

        DeviceDesign.findById(req.params.devicedesign_id, function(err, devicedesign) {

            for (var prop in model) {
                devicedesign[prop] = model[prop];
            }

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
        DeviceDesign.findById(req.params.devicedesign_id).populate('j5collection.bins.parts').exec(function(err, design) {
            if(!design) return res.json(500,{"error":"design not found"});
            
            design = design.toObject();
            design.id = design._id;
            delete design.rules; // Eugene rules to be send on a different request

            if (err) {
                errorHandler(err, req, res);
            } else {
                design.j5collection.bins.forEach(function(bin, i) {
                    bin.parts.forEach(function(part, partKey) {
                        part.fas = bin.fases[partKey];
                        if(part.phantom) design.j5collection.bins[i].parts[partKey] = { name: "", phantom: true };
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