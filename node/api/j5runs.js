module.exports = function(app) {

    var restrict = app.auth.restrict;

    /**
     * GET J5 RUNS
     * @memberof module:./routes/api
     * @method GET ''/users/:username/devicedesigns/:devicedesign_id/j5runs'
     */
    app.get('/users/:username/devicedesigns/:devicedesign_id/j5runs', restrict, function(req, res) {
        var j5Runs = app.db.model("j5run");


        j5Runs.find({devicedesign_id:req.params.devicedesign_id}).sort({date:1}).exec(function(err,j5runs){
            res.json({
                'j5runs': j5runs
            });
        });
    });

};