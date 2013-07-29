module.exports = function(app) {

    var restrict = app.auth.restrict;

    var Part = app.db.model("part");
    var Sequence = app.db.model("sequence");
    var User = app.db.model("User");
    var Project = app.db.model("project");
    var Project = app.db.model("devicedesign");

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


    app.get('/getData', restrict, function(req, res) {
        //var numProjects = req.user.projects.length;    

        User.findById(req.user._id)
        .populate({ path: 'projects' })
        .populate({ path: 'parts', select: 'name' })
        .populate({ path: 'sequences', select: 'name' })
        .exec(function(err, user) {
            Project.populate( user.projects, { path: 'designs designs.parts' },function(err, populatedProjects) {
                res.json({"projects":populatedProjects});
        	});
        });



    });

};
