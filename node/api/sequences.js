module.exports = function(app) {

    var restrict = app.auth.restrict;
    var constants = require('../routes/constants');

    var Sequence = app.db.model("sequence");
    var Project = app.db.model("project");
    var User = app.db.model("User");

    /*
    function autoReassignDuplicatedSequence(res, sequence, cb) {
        if (sequence.sequenceFileContent != constants.emptyGenbank) {
            var sequences = app.db.model("sequence");
            sequences.findOne({
                _id: {
                    $ne: sequence.id
                },
                hash: sequence.hash
            }, function(err, seq) {
                if (seq) return cb(true, seq);
                else return cb(false);
            });
        } else return cb(false);
    }

    function checkForDuplicatedSequence(res, sequence, cb) {
        if (sequence.sequenceFileContent != constants.emptyGenbank) {
            var sequences = app.db.model("sequence");
            sequences.findOne({
                _id: {
                    $ne: sequence.id
                },
                hash: sequence.hash
            }, function(err, seq) {
                if (seq) return res.json({
                    "fault": "Duplicated sequence",
                    "pairId": seq._id
                }, 500);
                else return cb(false);
            });
        } else return cb(false);
    }
    */

    var saveSequence = function(newSequence,req,res,cb){
        for (var prop in req.body) {
            if(prop!="user_id") newSequence[prop] = req.body[prop];
        }

        //Project.findById(req.body.project_id,function(err,project){
            //if(err) return res.json(500,{"error":err});
            //if(!project) return res.json(500,{"error":"project not found"});

            newSequence.FQDN = req.user.FQDN+'.'+req.body.name;

            //project.sequences.push(newSequence);
            //project.save();
            newSequence.save(function(err){
                if(err)
                {
                    if(err.code===11000)
                    {
                        // Duplicated Sequence
                        Sequence.findOne({"FQDN":newSequence.FQDN}).exec(function(err,sequence){
                            res.json({'sequences': sequence,"duplicated":true});
                        });
                    }
                    else
                    {
                        return res.json(500,{"error":err});
                    }
                }
                else 
                    {
                        if (typeof(cb) == 'function') cb(newSequence);
                        res.json({'sequences': newSequence,"duplicated":false,"err":err});
                    }
            });

        //});

        /*
        newSequence.save(function(err) {
            if(err) { console.log("WARNING: SEQUENCE NOT SAVED!"); console.log(err);}
            else  { console.log("INFO: NEW SEQUENCE SAVED!"); }
            req.user.sequences.push(newSequence);
            req.user.save(function(err) {
                if (err) console.log(err);
                res.json({
                    "sequence": newSequence,
                    "info": "no duplicated"
                });
            });
        });
        */
    };

    /**
     * POST Sequence
     * @memberof module:./routes/api
     * @method POST '/sequences'
     */
    app.post('/sequences', restrict, function(req, res) {
        var newSequence = new Sequence();
        newSequence.user_id = new app.mongo.ObjectID( req.user._id );
        saveSequence(newSequence,req,res,function(savedSequence){
            User.findById(req.user._id).populate('sequences').exec(function(err, user) {
                user.sequences.push(savedSequence);
                user.save();
            });
        });
    });

    /**
     * PUT Sequence
     * @memberof module:./routes/api
     * @method PUT '/sequences'
     */
    app.put('/sequences/:sequence_id', restrict,  function(req, res) {
        Sequence.findById(req.params.sequence_id, function(err, newSequence) {
            if(err) return res.json(500,{"error":err});
            if(!newSequence) return res.json(500,{"error":"Sequence not found!"});
            saveSequence(newSequence,req,res);
        });
    });

    /**
     * GET SEQUENCES
     * @memberof module:./routes/api
     * @method GET '/sequences'
     */
    app.get('/sequences', restrict, function(req, res) {
        
        var filter = "";
        if(req.query.filter)
        {
            if(req.query.filter[0] && req.query.filter[0].property==="name")
            {
                var filterOptions = JSON.parse(req.query.filter);
                filter = filterOptions[0].value;
            }
        }

        User.findById(req.user._id)
                .populate({
                    path: 'sequences'
                })
                .exec(function(err, user) {

                    Sequence.find(user.sequences).limit(req.query.limit).skip(req.query.start).where('name').regex(filter).exec(function(err,sequences){

                        res.json({
                            "success": true,
                            "results": sequences.length,
                            "sequences": sequences,
                            "total": user.sequences.length
                        });

                    });

                });
        }
    );

    /**
     * GET SEQUENCES BY ID
     * @memberof module:./routes/api
     * @method GET '/sequences'
     */
    app.get('/sequences/:sequence_id', restrict, function(req, res) {
            var Sequence = app.db.model("sequence");
            Sequence.findById(req.params.sequence_id).exec(function(err, sequence) {
                if (err) console.log("There was a problem with GET sequence");
                res.json({
                    "sequences": sequence
                });
            });
        }
    );

    //READ
    /*
    app.get('/sequences/:sequence_id', restrict, function(req, res) {

        if(req.query.id) {
            var Sequence = app.db.model("sequence");
            Sequence.findById(req.query.id, function(err, sequence) {
                if (err) console.log("There was a problem with GET sequence");
                res.json({
                    "sequence": sequence
                });
            });
        }
        else if(req.query.filter)
        {
            var project_id = JSON.parse(req.query.filter)[0].value;
            var Sequence = app.db.model("sequence");
            Sequence.find({"project_id":project_id}).exec(function(err, sequences) {
                res.json({
                    "sequence": sequences
                });
            });
        }
    });
    */

/*
    // Get Sequences
    app.get('/sequences', restrict, function(pReq, pRes) {
        var Sequence = app.db.model("sequence");
        Sequence.find(function(pErr, pDocs) {
            if (pErr) {
                errorHandler(pErr, pReq, pRes);
            } else {
                pRes.json({
                    "sequence": pDocs
                });
            }
        });
    });

    // Delete Sequences
    app.delete('/sequences', restrict, function(pReq, pRes) {
        var Sequence = app.db.model("sequence");
        Sequence.remove(function(pErr, pDocs) {
            if (pErr) {
                errorHandler(pErr, pReq, pRes);
            } else {
                pRes.json({});
            }
        });
    });
*/



};