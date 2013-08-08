module.exports = function(app) {

    var restrict = app.auth.restrict;

    var Part = app.db.model("part");
    var User = app.db.model("User");

    /**
     * POST Parts
     * @memberof module:./routes/api
     * @method POST 'parts'
     */

    /*
     * When a part is created a Fully quilified domain name (FQDN) should be generated.
     * <company/institution>.<group>.<subgroup>.<user>..<design>.<part>
     */

    app.get('/fqdn', restrict,  function(req, res) {
        return res.json(req.user)
    });


    var savePart = function(req,res,existingPart,cb){
        var newPart = existingPart;
        if(!existingPart) { newPart = new Part(); }
        for (var prop in req.body) {
            if(prop!="user_id") newPart[prop] = req.body[prop];
        }
            
            newPart.FQDN = req.user.FQDN + '.' + req.body.name;
            Part.generateDefinitionHash(req.user, newPart, function(hash){
                newPart.definitionHash = hash;
                newPart.user_id = new app.mongo.ObjectID(req.user._id);

                newPart.save(function(err){
                    if(err)
                    {
                        if(err.code===11000)
                        {
                            // Duplicated Part
                            console.log(err);
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
                            if (typeof(cb) == 'function') cb(newPart);
                            res.json({'parts': newPart,"duplicated":false,"err":err});
                        }
                });
            });
    };


    app.post('/parts', restrict,  function(req, res) {
        savePart(req,res,null,function(savedSequence){
            User.findById(req.user._id).populate('parts').exec(function(err, user) {
                user.parts.push(savedSequence);
                user.save();
            });
        });
    });

    /**
     * PUT Parts
     * @memberof module:./routes/api
     * @method PUT 'parts'
     */
    app.put('/parts', restrict,  function(req, res) {
        if(!req.body.id) { savePart(req,res); }
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
        User.findById(req.user._id)
        .populate({ path: 'parts', match: {sequencefile_id: {$ne: null}}})
        .exec(function(err, user) {
            Part.find(user.parts).where('sequencefile_id').ne(null).limit(req.query.limit).skip(req.query.start).exec(function(err,parts) {
                res.json({
                    "success":true,
                    "parts":parts,
                    "results":parts.length,
                    "total": user.parts.length
                });
            });
        });
        
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
