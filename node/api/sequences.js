var async = require('async');
var mongoose = require('mongoose');

module.exports = function(app) {
    var constants = require('../routes/constants');

    var Sequence = app.db.model("sequence");
    var Part = app.db.model("part");
    var Project = app.db.model("project");
    var User = app.db.model("User");


    var saveSequence = function(newSequence,req,res,cb){
        var nameChanged = false;
        var hashChanged = false;

        // Set the nameChanged flag. If true, we need to update the partSource
        // field on parts associated with this sequence.
        if(req.body.name !== newSequence.name) {
            nameChanged = true;
        }

        // If the hash has changed, we need to update the hash on parts
        // associated with this sequence.
        if(req.body.hash !== newSequence.hash) {
            hashChanged = true;
        }

        for (var prop in req.body) {
            if(prop!="user_id") newSequence[prop] = req.body[prop];
        }
        newSequence.dateModified = new Date();

        newSequence.FQDN = req.user.FQDN+'.'+req.body.name;
        newSequence.save(function(err){
            if(err)
            {
                if(err.code===11000)
                {
                    // Duplicated Sequence
                    Sequence.findOne({"FQDN":newSequence.FQDN}).exec(function(err,sequence){
                        return res.json({'sequences': sequence,"duplicated":true});
                    });
                }
                else
                {
                    return res.json(500,{"error":err});
                }
            }
            else
            {
                if(nameChanged || hashChanged) {
                    // Update associated parts' partSource fields.
                    Part.find({
                        "sequencefile_id": newSequence._id
                    }, function(err, parts) {
                        async.forEach(parts, function(part, next) {
                            if(nameChanged && hashChanged) {
                                partSource = newSequence.name;
                                Part.generateDefinitionHash(req.user, part, function(hash) {
                                    newPart.definitionHash = hash;
                                    newPart.save(next);
                                });
                            } else if(nameChanged) {
                                partSource = newSequence.name;
                                next();
                            } else if(hashChanged) {
                                Part.generateDefinitionHash(req.user, part, function(hash) {
                                    part.definitionHash = hash;
                                    part.save(next);
                                });
                            }
                        }, function(err) {
                            if(err) {
                                console.log('Error generating new hash for part.');
                                console.log(err);
                            }

                            if (typeof(cb) == 'function') cb(newSequence);
                            return res.json({'sequences': newSequence,"duplicated":false,"err":err});
                        });
                    });
                } else {
                    if (typeof(cb) == 'function') cb(newSequence);
                    return res.json({'sequences': newSequence,"duplicated":false,"err":err});
                }
            }
        });
    };

    return {
        /**
         * POST Sequence
         * @memberof module:./routes/api
         * @method POST '/sequences'
         */
        post: function(req, res) {
            var newSequence = new Sequence();
            newSequence.user_id = req.user._id;
            req.body.dateCreated = new Date();
            saveSequence(newSequence,req,res,function(savedSequence){
                User.findById(req.user._id).populate('sequences').exec(function(err, user) {
                    if(!user) return res.json(500,{"error":"User not found!"});
                    user.sequences.push(savedSequence);
                    user.save();
                });
            });
        },

        /**
         * PUT Sequence
         * @memberof module:./routes/api
         * @method PUT '/sequences'
         */
        put: function(req, res) {
            Sequence.findById(req.params.sequence_id, function(err, newSequence) {
                if(err) return res.json(500,{"error":err});
                if(!newSequence) return res.json(500,{"error":"Sequence not found!"});
                saveSequence(newSequence,req,res);
            });
        },

        /**
         * GET SEQUENCES BY ID
         * @memberof module:./routes/api
         * @method GET '/sequences'
         */
        get: function(req, res) {
            var Sequence = app.db.model("sequence");
            if(req.params.sequence_id) {
                Sequence.findById(req.params.sequence_id).exec(function(err, sequence) {
                    if (err) console.log("There was a problem with GET sequence");
                    res.json({
                        "sequences": sequence
                    });
                });
            } else {
                var filter = "";
                var totalCount = 0;
                var sortOpts = {};

                if(req.query.filter)
                {
                    var filterOptions = JSON.parse(req.query.filter); 
                    if(filterOptions[0] && filterOptions[0].property==="name")
                    {
                        filter = new RegExp(filterOptions[0].value, "i");
                    }
                }

                if(req.query.sort)
                {
                    var sortOptions = JSON.parse(req.query.sort); 
                    if(sortOptions[0] && sortOptions[0].property==="name")
                    {
                        sortOpts[sortOptions[0].property] = (sortOptions[0].direction==="DESC") ? 1 : -1 ;
                    }
                    if(sortOptions[0] && sortOptions[0].property==="dateModified")
                    {
                        sortOpts[sortOptions[0].property] = (sortOptions[0].direction==="DESC") ? -1 : +1 ;
                    }
                    if(sortOptions[0] && sortOptions[0].property==="size")
                    {
                        sortOpts[sortOptions[0].property] = (sortOptions[0].direction==="DESC") ? 1 : -1 ;
                    }
                    if(sortOptions[0] && sortOptions[0].property==="dateCreated")
                    {
                        sortOpts[sortOptions[0].property] = (sortOptions[0].direction==="DESC") ? -1 : +1 ;
                    }
                }

                if(!Object.keys(sortOpts).length) {
                    sortOpts = {
                        name: 1
                    }; // Sorted by name by default
                }

                if(filter) {
                    User.findById(req.user._id).populate({
                            path: 'sequences',
                            match: {
                                name: {
                                    $regex: filter
                                }
                            }
                        }).exec(function(err, user) {
                        totalCount = user.sequences.length;

                        User.populate(user, {
                            path: 'sequences',
                            match: {
                                name: {
                                    $regex: filter
                                }
                            },
                            options: {
                                sort: sortOpts,
                                limit: req.query.limit,
                                skip: req.query.start
                            }
                        }, function(err, user) {
                            res.json({
                                success: true,
                                sequences: user.sequences,
                                results: user.sequences.length,
                                total: totalCount
                            });
                        });
                    });
                } else {
                    User.findById(req.user._id).exec(function(err, user) {
                        totalCount = user.sequences.length;

                        User.populate(user, {
                            path: 'sequences',
                            options: {
                                sort: sortOpts,
                                limit: req.query.limit,
                                skip: req.query.start
                            }
                        }, function(err, user) {
                            res.json({
                                success: true,
                                sequences: user.sequences,
                                results: user.sequences.length,
                                total: totalCount
                            });
                        });
                    });
                }
            }
        },

        /**
         * DELETE Sequence
         * @memberof module:./routes/api
         * @method DELETE 'sequences'
         */
        del: function(req, res) {
            var seqId = req.params.sequence_id;
            var Sequence = app.db.model("sequence");
            var Part = app.db.model("part");
            var Design = app.db.model("devicedesign");

            Sequence.findOne({
                _id: new mongoose.Types.ObjectId(seqId)
            }, function(err, seq) {
                if(err) {
                    return errorHandler(err, req, res);
                } else {
                    console.log('removing seq ' + seq.name);
                    seq.remove();
                    return res.json({});
                }
            });
        }
    };
};
