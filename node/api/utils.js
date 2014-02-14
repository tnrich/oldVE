var async = require('async');
var mongoose = require('mongoose');

module.exports = function(app) {

    var restrict = app.auth.restrict;

    var Part = app.db.model("part");
    var J5Runs = app.db.model("j5run");


    var website_html_prod = app.fs.readFileSync( require('path').resolve(__dirname,"../../","vede-cp","build","Vede","production") + '/index.html' , "utf8");
    var website_html_dev = app.fs.readFileSync( require('path').resolve(__dirname,"../../","vede-cp") + '/index.html' , "utf8");


    var cdn_url = 'https://d3k67f84one1m6.cloudfront.net/';
    cdn_url = 'https://s3-us-west-1.amazonaws.com/teselagen/';
    //cdn_url = 'https://s3-us-west-1.amazonaws.com/app.teselagen.com/';
    website_html_prod = website_html_prod.replace(/<link href="/g,'<link href="'+cdn_url);
    website_html_prod = website_html_prod.replace(/<link rel="stylesheet" href="/g,'<link rel="stylesheet" href="'+cdn_url);
    website_html_prod = website_html_prod.replace(/link rel="shortcut icon" href="/g,'link rel="shortcut icon" href="'+cdn_url);
    website_html_prod = website_html_prod.replace(/<script type="text\/javascript" src="/g,'<script type="text/javascript" src="'+cdn_url);
    website_html_prod = website_html_prod.replace(/<script src="/g,'<script src="'+cdn_url);

    return {

        health: function(req,res){

            var stats = {
                currentServer: app.localIP,
                memcache: {
                    activeQueries: app.cache.activeQueries,
                    retries: app.cache.retries,
                    failures: app.cache.failures,
                },
                redis: {
                    connected: app.redisClient.connected,
                    //server_status: app.redisClient.server_info
                }

            }

            app.cache.get("servers",function(err,servers){

                require('child_process').exec('ps aux | grep perl | grep -v grep', function (error, stdout, stderr) {
                    var decoder = new (require('string_decoder').StringDecoder)('utf-8');
                    var output = decoder.write(stdout);

                    app.db.db.stats(function(err, dbstats){
                        dbstats._state = app.db.db._state;
                        stats.db = dbstats;
                        if(!err) stats.servers = servers;
                        stats.perl_processes = output.split('\n');
                        res.json(stats);
                    });

                });

            }

        },

        post_error: function(req, res) {
            throw new Error("OH NOOO");
        },

        /**
         * Send feedback
         * @memberof module:./routes/api
         * @method POST /sendFeedback
         */
        post_send_feedback: function(req, res) {

            variables = "{type:Feedback,user:"+req.user.username+"}";

            if (req.body.feedback) {
                app.mailer.sendMail({
                    from: "Teselagen <root@localhost>",
                    to: "tickets@teselagen.uservoice.com",
                    subject: "Feedback",
                    text: req.body.feedback + '<br>' + variables
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
                    text: req.body.error + '<br>' + req.body.error_feedback + variables
                }, function(error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send();
                    }
                });
            }
            res.send();
        },

        /**
         * GET Part library items
         * @memberof module:./routes/api
         * @method POST /partLibrary
         */
        get_partLibrary: function(req, res) {

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
        },

        /**
         * GET Result of Check for duplicated part names
         * @memberof module:./routes/api
         * @method POST /partLibrary
         */
        checkDuplicatedPartName: function(req, res) {

            var reqPart = JSON.parse(req.query.part);
            var reqSequence = req.query.sequence;

            var User = app.db.model("User");
            var Part = app.db.model("part");

            User.populate(req.user, {
                path: 'parts',
                match: {
                    sequencefile_id: {
                        $ne: null
                    }
                }
            }, function(err, user) {
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
        },

        /**
         * GET all designs that contain a given part.
         * @memberof module:./routes/api
         */
        get_DesignsWithPart: function(req, res) {
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
        },

        /**
         * GET all parts that have a given sequence as a source.
         * @memberof module:./routes/api
         */
        get_PartsAndDesignsBySequence: function(req, res) {
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
        },

        /**
         * Monitor server Tasks
         * @memberof module:./routes/api
         * @method POST /sendFeedback
         */
        get_monitorTasks: function(req, res) {
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
        },

        get_getStats: function(req, res) {
            var User = app.db.model("User");
            User.populate(req.user, 'projects parts', function(err, user) {
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
        },


        /*
        * Route to check current version of code
        */
        get_api_version: function(req,res) {
            require('fs').stat("app.js",function(err, stats){

                var updated = "Server updated: "
                if(!err&&stats&&stats.mtime) updated += stats.mtime;
                else updated += "Error";

                require('child_process').exec("git log -1", function puts(error, stdout, stderr) { 
                    var git = stdout;
                    return res.send(updated+"<br>"+git,200);
                });
            });
        },

        get_rebase_xml: function(req,res) {
            var rebase_xml = app.fs.readFileSync( require('path').resolve(__dirname,"../","resources") + '/rebase.xml' , "utf8");
            
            res.send(rebase_xml);
        },

        index_website: function(req,res) {
            if(app.get('env')==="production") {
                return res.send(website_html_prod);
            } else {
                return res.send(website_html_dev);
            }
        }
    };
};
