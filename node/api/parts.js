var mongoose = require('mongoose');
var async = require('async');

module.exports = function(app) {

    var restrict = app.auth.restrict;

    var Part = app.db.model("part");
    var User = app.db.model("User");
    var Design = app.db.model("devicedesign");


    var savePart = function(req,res,existingPart,cb){
        var newPart = existingPart;
        if(!existingPart) { newPart = new Part(); }
        for (var prop in req.body) {
            if(prop!="user_id") newPart[prop] = req.body[prop];
        }

            newPart.FQDN = req.user.FQDN + '.' + req.body.name;
            Part.generateDefinitionHash(req.user, newPart, function(hash){
                newPart.definitionHash = hash;
                newPart.user_id = req.user._id;
                newPart.dateModified = new Date();
                newPart.save(function(err){
                    if(err)
                    {
                        if(err.code===11000 || err.code === 11001)
                        {
                            // Duplicated Part
                            Part.findOne({"FQDN":newPart.FQDN, "definitionHash": newPart.definitionHash}).exec(function(err,part){
                                if(!part) {
                                    console.log("Duplicated part not found!",newPart.FQDN);
                                    console.log(newPart.definitionHash);
                                }
                                res.json({'parts': part,"duplicated":true,"err":err});
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

    return {
        /*
         * When a part is created a Fully quilified domain name (FQDN) should be generated.
         * <company/institution>.<group>.<subgroup>.<user>..<design>.<part>
         */
        fqdn:  function(req, res) {
            return res.json(req.user)
        },

        /**
         * Create Part
         * @memberof module:./routes/api
         * @method POST 'parts'
         */
        post_parts:  function(req, res) {
            req.body.dateCreated = new Date();
            savePart(req,res,null,function(savedSequence){
                User.findById(req.user._id).populate('parts').exec(function(err, user) {
                    user.parts.push(savedSequence);
                    user.save();
                });
            });
        },

        updateAllPartHashes: function(req, res) {
            Part.find().exec(function(err, parts) {
                if(err) {
                    return res.send(err);
                } else {
                    async.forEach(parts, function(part, done) {
                        Part.generateDefinitionHash(null, part, function(hash) {
                            part.definitionHash = hash;
                            part.save(done);
                        });
                    }, function(err) {
                        if(err) {
                            return res.send(err);
                        } else {
                            return res.send('yay');
                        }
                    });
                    /*async.forEach(parts, function(part, done) {
                        Part.generateDefinitionHash(null, part, function(hash) {
                            part.definitionHash = hash;
                            part.save(function(err) {
                                if(err) {
                                    if(err.code === 11000 || err.code === 11001) {
                                        Part.findOne({
                                            FQDN: part.FQDN,
                                            definitionHash: part.definitionHash
                                        }).exec(function(err, duplicatePart) {
                                            if(err) {
                                                return done(err);
                                            } else {
                                                var oldPartId = mongoose.Types.ObjectId(part.id);
                                                var duplicatePartId = mongoose.Types.ObjectId(duplicatePart.id);
                                                Design.find({
                                                    parts: oldPartId
                                                }).exec(function(err, designs) {
                                                    var design;

                                                    if(err) {
                                                        return done(err);
                                                    } else {
                                                        async.forEach(designs, function(design, innerCallback) {
                                                            design.parts[design.parts.indexOf(oldPartId)] = duplicatePartId;

                                                            for(var j = 0; j < design.bins.length; j++) {
                                                                for(var k = 0; k < design.bins[j].cells.length; k++) {
                                                                    var cell = design.bins[j].cells[k];

                                                                    if(cell.part_id === oldPartId) {
                                                                        cell.part_id === duplicatePartId;
                                                                    }
                                                                }
                                                            }

                                                            design.save(innerCallback);
                                                        }, function(err) {
                                                            if(err) {
                                                                return done(err);
                                                            } else {
                                                                part.remove(done);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        return done(err);
                                    }
                                } else {
                                    return done();
                                }
                            });
                        });
                    }, function(err) {
                        if(err) {
                            return res.send(err);
                        } else {
                            return res.send('Success!');
                        }
                    });*/
                }
            });
        },

        /**
         * PUT Parts
         * @memberof module:./routes/api
         * @method PUT 'parts'
         */
        put_parts:  function(req, res) {
            if(!req.body.id) { savePart(req,res); }
            else
            {
                Part.findById(req.body.id, function(err, newPart) {
                    if(err) return res.json(500,{"error":err});
                    if(!newPart) return res.json(500,{"error":"Part not found!"});
                    savePart(req,res,newPart);
                });
            }
        },

        /**
         * GET Parts
         * @memberof module:./routes/api
         * @method GET 'parts'
         */
        get_parts:  function(req, res) {

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
                    sortOpts[sortOptions[0].property] = (sortOptions[0].direction==="DESC") ? -1 : 1 ;
                }
                if(sortOptions[0] && sortOptions[0].property==="dateCreated")
                {
                    sortOpts[sortOptions[0].property] = (sortOptions[0].direction==="DESC") ? -1 : 1 ;
                }
                if(sortOptions[0] && sortOptions[0].property==="size")
                {
                    sortOpts[sortOptions[0].property] = (sortOptions[0].direction==="DESC") ? 1 : -1 ;
                }
                if(sortOptions[0] && sortOptions[0].property==="partSource")
                {
                    sortOpts[sortOptions[0].property] = (sortOptions[0].direction==="DESC") ? 1 : -1 ;
                }
            }

                if(!Object.keys(sortOpts).length) sortOpts = { name: 1 }; // Sorted by name by default

            User.findById(req.user._id).populate({
                    path: 'parts',
                    match: {name: {$regex: filter}}
                }).exec(function(err, user) {
                totalCount = user.parts.length;

                User.findById(req.user._id).populate({
                    path: 'parts',
                    match: {name: {$regex: filter},
                    sequencefile_id: {$ne: null}},
                    options: { sort: sortOpts, limit: req.query.limit, skip: req.query.start }
                })
                .exec(function(err, user) {
                    res.json({
                        success: true,
                        parts: user.parts,
                        results: user.parts.length,
                        total: totalCount
                    });
                });
            });
        },


        /**
         * GET Parts by id
         * @memberof module:./routes/api
         * @method GET 'parts/:part_id'
         */
        get_part_by_id:  function(req, res) {
            User.findById(req.user._id).populate('parts').exec(function(err, user) {
                User.findById(req.user._id).populate({
                    path: 'parts',
                    match: {_id: req.params.part_id}
                })
                .exec(function(err, user) {
                    res.json({
                        success: true,
                        parts: user.parts,
                        results: user.parts.length
                    });
                });
            });
        },

        /**
         * DELETE Parts
         * @memberof module:./routes/api
         * @method DELETE 'parts'
         */
        delete_parts: function(req, res) {
            var partId = req.params.part_id;
            var Part = app.db.model("part");
            var Design = app.db.model("devicedesign");

            Part.findByIdAndRemove(partId, function(pErr, pDocs) {
                if(pErr) {
                    return errorHandler(pErr, req, res);
                } else {
                    return res.json({});
                }
            });
        }
    };
};
