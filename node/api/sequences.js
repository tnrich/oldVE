module.exports = function(app) {

    var restrict = app.auth.restrict;
    var constants = require('../routes/constants');

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

    //CREATE
    // Create a new sequence
    app.post('/sequences', restrict, function(req, res) {
        var sequence = req.body;
        //var VEProject = app.db.model("veproject");
        var Sequence = app.db.model("sequence");

        autoReassignDuplicatedSequence(res, sequence, function(duplicated, duplicatedSequence) {

            if (duplicated) {
                res.json({
                    "sequence": duplicatedSequence,
                    "info": "duplicated"
                });
            } else {

                var newSequence = new Sequence();

                for (var prop in sequence) {
                    if(prop!="project_id") { newSequence[prop] = sequence[prop]; }
                }
                if(sequence.project_id)
                {
                    if(sequence.project_id!="") newSequence.project_id = sequence.project_id;
                }

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

            }
        });
    });

    //PUT
    app.put('/sequences', restrict,  function(req, res) {
        var sequence = req.body;
        var Sequence = app.db.model("sequence");

        checkForDuplicatedSequence(res, sequence, function() {
            Sequence.findById(req.body.id, function(err, sequence) {
                for (var prop in req.body) {
                    sequence[prop] = req.body[prop];
                }
                sequence.save(function(pErr) {
                    res.json({
                        "sequence": sequence
                    });
                });
            });
        });
    });

    //READ
    app.get('/sequences', restrict, function(req, res) {

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