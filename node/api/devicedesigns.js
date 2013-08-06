
module.exports = function(app) {

    var restrict = app.auth.restrict;

     var DeviceDesign = app.db.model("devicedesign");
     var Part = app.db.model("part");

    function prepareDesignWithParts(design,cb){
        DeviceDesign.findById(design._id).populate('j5collection.bins.cells.part').exec(function(err, design) {

            design = design.toObject();
            design.id = design._id;
            delete design.rules;

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

        //var id = req.body.id;
        var model = req.body;

        //model = fillEmptyParts(model);

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
     * @method GET '/users/:username/projects/:project_id/devicedesigns'
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
     * @method GET '/users/:username/projects/:project_id/devicedesigns'
     */
    app.get('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        DeviceDesign.findById(req.params.devicedesign_id, function(err, design) {
            var originalDesign = design.toObject();
            if (err) {
                errorHandler(err, req, res);
            } else {
                DeviceDesign.findById(req.params.devicedesign_id).populate('parts j5collection.bins.cells.part').exec(function(err, design) {
                    if(!design) return res.json(500,{"error":"design not found"});
                    design = design.toObject();
                    design.id = design._id;
                    delete design.rules; // Eugene rules to be send on a different request
    
                    if (err) {
                        errorHandler(err, req, res);
                    } else {
    
                        res.json({
                            "designs": design
                        });
                    }
                });
                
            }
        });
        
    });
    
    /**
     * GET device design by id
     * @memberof module:./routes/api
     * @method GET '/users/:username/projects/:project_id/devicedesigns'
     */
    app.get('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        DeviceDesign.findById(req.params.devicedesign_id, function(err, design) {console.log(design.j5collection.bins[0]);});
        DeviceDesign.findById(req.params.devicedesign_id).populate('j5collection.bins.parts').exec(function(err, design) {
            if(!design) return res.json(500,{"error":"design not found"});
            design = design.toObject();
            design.id = design._id;
            //delete design.rules; // Eugene rules to be send on a different request

            if (err) {
                errorHandler(err, req, res);
            } else {
                res.json({
                    "designs": design
                });
            }
        });
    });
    
    /**
     * GET device design parts
     * @memberof module:./routes/api
     * @method GET '/users/:username/projects/:project_id/devicedesigns'
     */
    app.get('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id/parts', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        DeviceDesign.findById(req.params.devicedesign_id).populate('parts').exec(function(err, design) {
            if(!design) return res.json(500,{"error":"design not found"});

            var parts = JSON.parse(JSON.stringify(design.parts));
            parts.forEach(function(part){
               // part.devicedesign_id = req.params.devicedesign_id;
                delete part.__v;
                delete part._id;
                delete part.definitionHash;
                delete part.FQDN;
            });

            if (err) {
                errorHandler(err, req, res);
            } else {
                res.json({
                    "parts": parts
                });
            }
        });
    });

    
    app.delete('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        DeviceDesign.findById(req.params.devicedesign_id,function(err,devicedesign) {
            if(err||!devicedesign) return res.json(500,{"error":err});
            devicedesign.remove();
            res.json({
                "designs": devicedesign
            });
        });
    });

};