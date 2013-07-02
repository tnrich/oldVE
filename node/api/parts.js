module.exports = function(app) {

    var restrict = app.auth.restrict;

    var Part = app.db.model("part");
    var Project = app.db.model("project");

    /**
     * POST Parts
     * @memberof module:./routes/api
     * @method POST 'parts'
     */

    /*
     * When a part is created a Fully quilified domain name (FQDN) should be generated.
     * <company/institution>.<group>.<subgroup>.<user>.<project>.<design>.<part>
     */

    app.get('/fqdn', restrict,  function(req, res) {
        console.log(req.user.FQDN);
        return res.json(req.user)
    });


    var savePart = function(req,res,existingPart){
        var newPart = existingPart;
        var saveToProject = false;
        if(!existingPart) { newPart = new Part(); saveToProject = true; }
        for (var prop in req.body) {
            if(prop!=="project_id") newPart[prop] = req.body[prop];
        }

        if(req.body.project_id!=="") newPart.project_id = req.body.project_id;

        Project.findById(req.body.project_id,function(err,project){
            if(err) return res.json(500,{"error":err,"info":"invalid project_id"});
            if(!project) return res.json(500,{"error":"project not found"});
            
            newPart.FQDN = req.user.FQDN+'.'+project.name+'.'+req.body.name;
            Part.generateDefinitionHash(req.user, project, newPart, function(hash){
                newPart.definitionHash = hash;

                newPart.save(function(err){
                    if(err)
                    {
                        if(err.code===11000)
                        {
                            // Duplicated Part
                            Part.findOne({"FQDN":newPart.FQDN, "definitionHash": newPart.definitionHash}).exec(function(err,part){
                                res.json({'parts': part,"duplicated":true});
                            });
                        }
                        else
                        {
                            return res.json(500,{"error":err});
                        }
                    }
                    else 
                        {
                            if(saveToProject) {
                                project.parts.push(newPart);
                                project.save();
                            }
                            res.json({'parts': newPart,"duplicated":false,"err":err});
                        }
                });
            });
        });
    };


    app.post('/parts', restrict,  function(req, res) {
        if( req.body.name === "" || req.body.phantom ) return res.json({parts:app.constants.defaultEmptyPart});
        savePart(req,res);
    });

    /**
     * PUT Parts
     * @memberof module:./routes/api
     * @method PUT 'parts'
     */
    app.put('/parts', restrict,  function(req, res) {

        if(req.body.name===""||req.body.phantom) { return res.json({parts:app.constants.defaultEmptyPart}); }
        else if(!req.body.id) { savePart(req,res); }
        else
        {
            Part.findById(req.body.id, function(err, newPart) {
                if(err) return res.json(500,{"error":err});
                if(!newPart) return res.json(500,{"error":"Part not found!"});
                savePart(req,res,newPart);
            });
        }
    });

    /**
     * GET Parts
     * @memberof module:./routes/api
     * @method GET 'parts'
     */
    app.get('/parts', restrict,  function(req, res) {

        if (req.query.filter) {
            var veproject_id = JSON.parse(req.query.filter)[0].value;

            var VEProject = app.db.model("veproject");

            VEProject.findById(veproject_id).populate("parts").exec(function(err, veproject) {
                if (!veproject || err) return res.json({
                    "fault": "Unexpected error"
                }, 500);
                res.send({
                    "parts": veproject.parts
                });
            });
        } else if (req.query.id) {
            var Part = app.db.model("part");
            Part.findById(req.body.id, function(err, part) {
                res.json({
                    'parts': part
                });
            });
        }
    });


    /**
     * DELETE Parts
     * @memberof module:./routes/api
     * @method DELETE 'parts'
     */
    app.delete('/parts', restrict, function(pReq, pRes) {
        var Part = app.db.model("part");
        Part.remove(function(pErr, pDocs) {
            if (pErr) {
                errorHandler(pErr, pReq, pRes);
            } else {
                pRes.json({});
            }
        });
    });

};
