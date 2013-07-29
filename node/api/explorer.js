module.exports = function(app) {

    var async = require('async');

    var restrict = app.auth.restrict;

    var Part = app.db.model("part");
    var Sequence = app.db.model("sequence");
    var User = app.db.model("User");
    var Project = app.db.model("project");
    var DeviceDesign = app.db.model("devicedesign");

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
            Project.populate( user.projects, { path: 'designs' },function(err, populatedProjects) {
                
            var projectDesignsPopulateCallbacks = [];

            populatedProjects.forEach(function(populatedProject){
                projectDesignsPopulateCallbacks.push(function(callback){
                    DeviceDesign.populate( populatedProject.designs, { path: 'parts'}, function(err, populatedDeviceDesigns){
                        populatedProject.designs = populatedDeviceDesigns;
                        callback(null, null);
                    });                    
                });
            });

            async.parallel(projectDesignsPopulateCallbacks,
            function(){
                res.json(populatedProjects);
            });


/*
async.parallel([
    function(callback){
        setTimeout(function(){
            callback(null, 'one');
        }, 200);
    },
    function(callback){
        setTimeout(function(){
            callback(null, 'two');
        }, 100);
    }
],
// optional callback
function(err, results){
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
});
*/

                //Part.populate( populatedProjects[0].designs, { path: 'parts'}, function(err, populatedParts){
                //    res.json({"parts":populatedParts});
                //});


        	});
        });



    });

};
