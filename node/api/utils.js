module.exports = function(app) {

    var restrict = app.auth.restrict;

    var Part = app.db.model("part");
    var J5Runs = app.db.model("j5run");

    /**
     * Send feedback
     * @memberof module:./routes/api
     * @method POST /sendFeedback
     */
    app.post('/sendFeedback', function(req, res) {
        if (req.body.feedback) {
            app.mailer.sendMail({
                from: "Teselagen <root@localhost>",
                to: "rpavez@gmail.com",
                subject: "Feedback",
                text: req.body.feedback
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
                to: "rpavez@gmail.com",
                subject: "Error",
                text: req.body.error + '\n' + req.body.error_feedback
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
     * GET Result of Check for diplicated part names
     * @memberof module:./routes/api
     * @method POST /partLibrary
     */
    app.get('/checkDuplicatedPartName', restrict, function(req, res) {

        var reqPart = JSON.parse(req.query.part);
        var reqSequence = req.query.sequence;

        var User = app.db.model("User");
        var Part = app.db.model("part");

        User.findById(req.user._id)
        .populate({ path: 'parts'})
        .exec(function(err, user) {
            var FQDN_candidate = req.user.FQDN+'.'+reqPart.name;

            Part.generateDefinitionHash(req.user, reqPart, function(hash_candidate) {
                var duplicatedName = false;
                var identical = false;
                var part;
                var parts = user.parts;
                //Part.find({"user_id": reqPart.user_id}, function(err, parts) {
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
                //});
            });
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
        //var numProjects = req.user.projects.length;    

        var User = app.db.model("User");
        User.findById(req.user._id).populate('projects')
        .exec(function(err, user) {
            var countDesigns=0;
            user.projects.forEach(function(project){
                countDesigns += project.designs.length;
            });
            var countProjects = user.projects.length;
            var countSequences = user.sequences.length;
            var countParts = user.parts.length;
            res.json({"numberProjects":countProjects, "numberDesigns":countDesigns, "numberSequences":countSequences, "numberParts":countParts});
        });
    });
};
