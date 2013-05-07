module.exports = function(app) {

    var restrict = app.auth.restrict;

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

    //Get Part Library
    app.get('/partLibrary', restrict, function(req, res) {
        var Part = app.db.model("part");
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

    //Check for duplicated names
    app.get('/checkDuplicatedPartName', restrict, function(req, res) {

        var reqPart = JSON.parse(req.query.part);
        console.log(reqPart);
        var reqSequence = req.query.sequence;

        var Part = app.db.model("part");

        var duplicatedName = false;
        var identical = false;

        Part.find(function(err, parts) {
            counter = parts.length;
            parts.forEach(function(part, key) {

                if (part.name === reqPart.name) duplicatedName = true;

                if (
                part.genbankStartBP === reqPart.genbankStartBP.toString() && part.endBP === reqPart.endBP.toString() && part.revComp === reqPart.revComp.toString() && part.fas === reqPart.fas.toString() && part.directionForward === reqPart.directionForward.toString()) {
                    identical = true;
                }

                if (duplicatedName && !identical) {
                    res.json({
                        'msg': 'Duplicated part name.',
                        'type': 'warning'
                    }, 500);
                } else if (duplicatedName && identical) {
                    res.json({
                        'msg': 'The part already exist.',
                        'type': 'error'
                    }, 500);
                } else {
                    counter--;
                }
                if (counter === 0) res.json({});
            });
            if (counter === 0) res.json({});
        });


    });

};