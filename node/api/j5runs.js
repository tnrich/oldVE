module.exports = function(app) {

    var restrict = app.auth.restrict;

    /**
     * GET J5 RUNS
     * @memberof module:./routes/api
     * @method GET ''/users/:username/devicedesigns/:devicedesign_id/j5runs'
     */
     /*
    app.get('/users/:username/devicedesigns/:devicedesign_id/j5runs', restrict, function(req, res) {
        var DeviceDesign = app.db.model("devicedesign");
        //var id = JSON.parse(req.query.filter)[0].value;
        DeviceDesign.findById(req.params.devicedesign_id).populate('j5runs').exec(function(err, devicedesign) {
            var j5runs = devicedesign.j5runs;
            devicedesign.j5runs.forEach(function(j5run) {
                var j5parameters = j5run.j5Results.j5parameters;
                j5run.j5Input = {};
                j5run.j5Input.j5Parameters = j5parameters;
                //delete j5run.j5Results.j5parameters;
            });
            //console.log( JSON.stringify(j5runs) );
            res.json({
                'j5runs': j5runs
            });
        });
    });
    */

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