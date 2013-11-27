var async = require('async');
var mongoose = require('mongoose');

module.exports = function(app) {

    var restrict = app.auth.restrict;

    var Part = app.db.model("part");
    var J5Runs = app.db.model("j5run");

    app.post('/error', function(req, res) {
        throw new Error("OH NOOO");
    });

    /**
     * Send feedback
     * @memberof module:./routes/api
     * @method POST /sendFeedback
     */
    app.post('/sendFeedback', restrict, function(req, res) {

        variables = "{type:Feedback,user:"+req.user.username+"}";

        if (req.body.feedback) {
            app.mailer.sendMail({
                from: "Teselagen <root@localhost>",
                to: "tickets@teselagen.uservoice.com",
                subject: "Feedback",
                text: req.body.feedback + variables
            }, function(error, response) {
                if (error) {
                    console.log(error);
                } else {
                    res.send();
                }
            });
        } else if (req.body.error) {
            app.mailer.sendMail({
                from: "Teselagen <root@localhost>",
                to: "tickets@teselagen.uservoice.com",
                subject: "Error",
                text: req.body.error + '\n' + req.body.error_feedback + variables
            }, function(error, response) {
                if (error) {
                    console.log(error);
                } else {
                    res.send();
                }
            });
        }
        res.send();
    });

    /**
     * GET Part library items
     * @memberof module:./routes/api
     * @method POST /partLibrary
     */
    app.get('/partLibrary', restrict, function(req, res) {

        Part.find({
            name: {
                $ne: ""
            }
        }).sort({
            'name': 1
        }).exec(function(err, parts) {
            res.json({
                'parts': parts
            });
        });
    });

    /**
     * GET Result of Check for duplicated part names
     * @memberof module:./routes/api
     * @method POST /partLibrary
     */
    app.get('/checkDuplicatedPartName', restrict, function(req, res) {

        var reqPart = JSON.parse(req.query.part);
        var reqSequence = req.query.sequence;

        var User = app.db.model("User");
        var Part = app.db.model("part");

        User.findById(req.user._id)
        .populate({ path: 'parts', match: {sequencefile_id: {$ne: null}}})
        .exec(function(err, user) {
            var FQDN_candidate = req.user.FQDN+'.'+reqPart.name;

            Part.generateDefinitionHash(req.user, reqPart, function(hash_candidate) {
                var duplicatedName = false;
                var identical = false;
                var part;
                var parts = user.parts;
                counter = parts.length;
                for(var i = 0; i < parts.length; i++) {
                    part = parts[i];

                    if (part.FQDN === FQDN_candidate) {
                        duplicatedName = true;
                    }

                    if (part.definitionHash === hash_candidate) {
                        identical = true;
                    }
                }

                if (duplicatedName && !identical) {
                    return res.json({
                        'msg': 'Duplicated part name.',
                        'type': 'warning'
                    });
                } else if (duplicatedName && identical) {
                    return res.json({
                        'msg': 'The part already exist.',
                        'type': 'error'
                    });
                } else {
                    return res.json({
                        'type': 'success'
                    });
                }
            });
        });
    });

    /**
     * GET all designs that contain a given part.
     * @memberof module:./routes/api
     */
    app.get('/getDesignsWithPart', restrict, function(req, res) {
        var reqPart = JSON.parse(req.query.part);
        var Design = app.db.model("devicedesign");

        Design.find({
            parts: mongoose.Types.ObjectId(reqPart.id)
        }).exec(function(err, designs) {
            if(err) {
                console.log('Error getting designs by part.');
                console.log(err);

                return res.json({
                    type: 'error',
                    msg: err
                });
            } else {
                return res.json({
                    designs: designs
                });
            }
        });
    });

    /**
     * GET all parts that have a given sequence as a source.
     * @memberof module:./routes/api
     */
    app.get('/getPartsAndDesignsBySequence', restrict, function(req, res) {
        var sequenceId = JSON.parse(req.query.sequenceId);
        var Part = app.db.model("part");
        var Design = app.db.model("devicedesign");

        Part.find({
            sequencefile_id: mongoose.Types.ObjectId(sequenceId)
        }).lean().exec(function(err, parts) {
            if(err) {
                console.log('Error getting parts by sequence.');
                console.log(err);

                return res.json({
                    type: 'error',
                    msg: err
                });
            } else {
                async.map(parts, function(part, done) {
                    Design.find({
                        parts: mongoose.Types.ObjectId(part.id)
                    }).exec(function(err, designs) {
                        part.designs = designs;
                        done(null, part);
                    });
                }, function(err, partsWithDesigns) {
                    if(err) {
                        return res.json({
                            type: 'error',
                            msg: err
                        });
                    } else {
                        return res.json({
                            parts: partsWithDesigns
                        });
                    }
                });
            }
        });
    });

    /**
     * Monitor server Tasks
     * @memberof module:./routes/api
     * @method POST /sendFeedback
     */
    app.get('/monitorTasks', restrict, function(req, res) {
        J5Runs
            .find({
                user_id : req.user._id
            })
            .select('status devicedesign_id project_id devicedesign_name date')
            .exec(function(err,j5runs){
                return res.json({
                    j5runs: j5runs
                });
            });
    });

    app.get('/getStats', restrict, function(req, res) {
        var User = app.db.model("User");
        User.findById(req.user._id)
        .populate('projects')
        .populate('parts')
        .exec(function(err, user) {
            var countDesigns = 0;
            user.projects.forEach(function(project){
                countDesigns += project.designs.length;
            });
            var countProjects = user.projects.length;
            var countSequences = user.sequences.length;
            var countParts = 0;
            for(var i = 0; i < user.parts.length; i++) {
                if(user.parts[i].sequencefile_id) {
                    countParts += 1;
                }
            }
            res.json({"numberProjects":countProjects, "numberDesigns":countDesigns, "numberSequences":countSequences, "numberParts":countParts});
        });
    });
};
