module.exports = function(app) {

    var restrict = app.auth.restrict;

    app.get('/user/projects/deprojects/j5runs', restrict, function(req, res) {
        var DEProject = app.db.model("deproject");
        var id = JSON.parse(req.query.filter)[0].value;
        DEProject.findById(id).populate('j5runs').exec(function(err, deproject) {
            var j5runs = deproject.j5runs;
            deproject.j5runs.forEach(function(j5run) {
                var j5parameters = j5run.j5Results.j5parameters;
                j5run.j5Input = {};
                j5run.j5Input.j5Parameters = j5parameters;
                //delete j5run.j5Results.j5parameters;
            });
            res.json({
                'j5runs': j5runs
            });
        });
    });
};