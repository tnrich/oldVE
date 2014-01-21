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
                            if (typeof(cb) == 'function') {
                                cb(newPart);
                            } else {
                                res.json({'parts': newPart,"duplicated":false,"err":err});
                            }
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
            savePart(req,res,null, function(newPart){
                console.log(req.user.parts);
                req.user.parts.push(mongoose.Types.ObjectId(newPart.id));
                req.user.save(function(err, user) {
                    console.log(user.parts);

                    res.json({
                        "parts": newPart,
                        "duplicated":false,
                        "err":err
                    });
                });
            });
        },

        updateAllPartNames: function(req, res) {
            Part.find().exec(function(err, parts) {
                if(err) {
                    return res.send(err);
                } else {
                    async.forEach(parts, function(part, done) {
                        part.name = part.name.replace(/[^0-9a-zA-Z-_]/g, "_");

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
                }
            });
        },

        updateAllPartSizes: function(req, res) {
            var Sequence = app.db.model('sequence');

            Part.find().exec(function(err, parts) {
                if(err) {
                    return res.send(err);
                } else {
                    async.forEach(parts, function(part, done) {
                        var startBP = Number(part.genbankStartBP);
                        var endBP = Number(part.endBP);
                        var size;

                        Sequence.findById(part.sequencefile_id).exec(function(err, sequence) {
                            if(err) {
                                return done(err);
                            }

                            if(startBP > endBP) {
                                var tSize = Number(sequence.size);
                                size = Math.abs(tSize - (Math.abs(endBP - startBP)) + 1);
                            } else if (startBP==endBP) {
                                size = 1;
                            } else {
                                size = (Math.abs(startBP - endBP) + 1);
                            }

                            part.size = size;

                            console.log(part.name + ': ' + startBP + ' - ' + endBP + ', ' + size + ' bp');

                            Part.generateDefinitionHash(null, part, function(hash) {
                                part.definitionHash = hash;
                                return part.save(done);
                            });
                        });
                    }, function(err) {
                        if(err) {
                            return res.send(err);
                        } else {
                            return res.send('yay');
                        }
                    });
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
            var queryOpts = {};

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

            if(filter) {
                queryOpts = {
                    path: 'parts',
                    match: {
                        name: {
                            $regex: filter
                        }
                    }
                };
            } else {
                queryOpts = {
                    path: 'parts'
                };
            }

            User.populate(req.user, queryOpts, function(err, user) {
                totalCount = user.parts.length;

                queryOpts.sequencefile_id = {
                    $ne: null
                };

                queryOpts.options = {
                    sort: sortOpts,
                    limit: req.query.limit,
                    skip: req.query.start
                };

                User.populate(req.user, queryOpts, function(err, user) {
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
            User.populate(req.user, {
                path: 'parts',
                match: {
                    _id: req.params.part_id
                }
            }, function(err, user) {
                res.json({
                    success: true,
                    parts: user.parts,
                    results: user.parts.length
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
