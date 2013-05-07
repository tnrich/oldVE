module.exports = function(app) {

    var restrict = app.auth.restrict;

    //CREATE
    app.post('/parts', restrict,  function(req, res) {

        var Part = app.db.model("part");
        var newPart = new Part();

        for (var prop in req.body) {
            newPart[prop] = req.body[prop];
        }

        newPart.save(function() {
            res.json({
                'parts': newPart
            });
        });
    });

    //PUT
    app.put('/parts', restrict,  function(req, res) {

        var Part = app.db.model("part");
        Part.findById(req.body.id, function(err, part) {
            for (var prop in req.body) {
                part[prop] = req.body[prop];
            }
            part.save(function() {
                res.json({
                    'parts': part
                });
            });
        });
    });

    //GET
    app.get('/parts', restrict,  function(req, res) {

        if (req.query.filter) {
            var veproject_id = JSON.parse(req.query.filter)[0].value;

            var VEProject = app.db.model("veproject");

            VEProject.findById(veproject_id).populate("parts").exec(function(err, veproject) {
                if (!veproject || err) return res.json({
                    "fault": "Unexpected error"
                }, 500);
                res.send({
                    "parts": veproject.parts
                });
            });
        } else if (req.query.id) {
            var Part = app.db.model("part");
            Part.findById(req.body.id, function(err, part) {
                res.json({
                    'parts': part
                });
            });
        }
    });


    //DELETE
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