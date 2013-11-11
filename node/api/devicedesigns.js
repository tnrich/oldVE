module.exports = function(app) {

    var restrict = app.auth.restrict;
    var DeviceDesign = app.db.model("devicedesign");

    function prepareDesignWithParts(design,cb){
        DeviceDesign.findById(design._id).populate("j5collection.bins.cells.part").exec(function(err, design) {

            design = design.toObject();
            design.id = design._id;
            delete design.rules;

            return cb(design);
        });
    }

    return {

        /**
         * Create Device Design
         * @memberof module:./routes/api
         * @method POST "/users/:username/projects/:project_id/devicedesigns"
         */
        create_device_design: function(req, res) {

            var Project = app.db.model("project");
            var DeviceDesign = app.db.model("devicedesign");

            var reqDesign = req.body;

            var newDesign = new DeviceDesign(reqDesign);
            newDesign.dateCreated = new Date();

            newDesign.save(function(err) {
                if (err) {
                    app.errorHandler(err);
                }
                else {
                    Project.findById(newDesign.project_id, function(err, project) {
                        project.designs.push(newDesign);
                        project.save(function() {
                            if (err) {console.log(err);}
                            prepareDesignWithParts(newDesign,function(design){
                                res.json({
                                    "designs": design
                                });
                            });
                        });
                    });
                }
            });
        },

        /**
         * Update Device Design
         * @memberof module:./routes/api
         * @method PUT "/users/:username/projects/:project_id/devicedesigns"
         */
        update_device_design: function(req, res) {
            var DeviceDesign = app.db.model("devicedesign");

            //var id = req.body.id;
            var model = req.body;

            //model = fillEmptyParts(model);

            DeviceDesign.findById(req.params.devicedesign_id, function(err, devicedesign) {

                for (var prop in model) {
                    if (model.hasOwnProperty(prop)) {
                        devicedesign[prop] = model[prop];
                    }
                }

                devicedesign.dateModified = new Date();

                devicedesign.save(function(err) {
                    if (err) {console.log(err);}
                    res.json({
                        "designs": req.body
                    });
                });
            });
        },

         /**
         * GET Eugene Rules
         * @memberof module:./routes/api
         * @method GET "/users/:username/projects/:project_id/devicedesigns/:devicedesign_id/eugenerules"
         */
        get_eugene_rules: function(req, res) {
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
        },

        /**
         * GET device design by project_id
         * @memberof module:./routes/api
         * @method GET "/users/:username/projects/:project_id/devicedesigns"
         */
        get_design_by_project_id: function(req, res) {
            var Project = app.db.model("project");
            var project_id = req.params.project_id;
            Project.findById(project_id).populate({path:"designs", select:"name id project_id"}).exec(function(err, project) {
                if(!project) {return res.json(500,{"error":"project not found"});}
                res.json({
                    "designs": project.designs
                });
            });
        },
        
        /**
         * GET device design by id
         * @memberof module:./routes/api
         * @method GET "/users/:username/projects/:project_id/devicedesigns/:devicedesign_id"
         */
        get_device_design_by_id: function(req, res) {
            var DeviceDesign = app.db.model("devicedesign");
            DeviceDesign.findById(req.params.devicedesign_id, function(err) {
                if (err) {
                    app.errorHandler(err, req, res);
                } else {
                    DeviceDesign.findById(req.params.devicedesign_id).populate("parts j5collection.bins.cells.part").exec(function(err, design) {
                        if(!design) {return res.json(500,{"error":"design not found"});}
                        design = design.toObject();
                        design.id = design._id;

                        if(!req.query.includeEugeneRules) {
                          delete design.rules; // Eugene rules to be send on a different request
                        }

                        if (err) {
                            app.errorHandler(err, req, res);
                        } else {
                            res.json({
                                "designs": design
                            });
                        }
                    });
                }
            });
        },

        /**
         * GET device design parts
         * @memberof module:./routes/api
         * @method GET "/users/:username/projects/:project_id/devicedesign/:devicedesign_id/parts"
         */
        get_device_design_parts: function(req, res) {
            var DeviceDesign = app.db.model("devicedesign");
            DeviceDesign.findById(req.params.devicedesign_id).populate("parts").exec(function(err, design) {
                if(!design) {return res.json(500,{"error":"design not found"});}

                var parts = JSON.parse(JSON.stringify(design.parts));
                parts.forEach(function(part){
                    delete part.__v;
                    delete part._id;
                    delete part.definitionHash;
                    delete part.FQDN;
                });

                if (err) {
                    app.errorHandler(err, req, res);
                } else {
                    res.json({
                        "parts": parts
                    });
                }
            });
        },

        
        /**
         * Delete device design
         * @memberof module:./routes/api
         * @method DELETE "/users/:username/projects/:project_id/devicedesign/:devicedesign_id"
         */
        delete_device_design: function(req, res) {
            var DeviceDesign = app.db.model("devicedesign");
            var User = app.db.model("User");
            DeviceDesign.findById(req.params.devicedesign_id).exec(function(err,design) {
                if(err) {return res.json(500,{"error":err});}
                if(!design) {return res.json(500,{"error":"design not found"});}
                var designs_id = design._id;
                design.remove(function(err){
                    if (err) {
                        app.errorHandler(err, req, res);
                    }
                    else {
                        User.findById(req.user._id,function(err,user){
                            user.designs[designs_id] = null;
                            user.save(function(err){
                                    res.json({
                                        "designs": {}
                                    });
                            });
                        });
                        
                    }
                });

            });
        }

    };

};
