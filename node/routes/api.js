/**
 * TeselaGen API
 * @module ./routes/api
 */
module.exports = function(app) {

    /*
    * Route to check server health and update
    */
    app.all('/', function(req,res) {
        res.send(200);
    });

    /*
    * Route to check current version of code
    */
    app.all('/v', function(req,res) {
        require('fs').stat("app.js",function(err, stats){

            var updated = "Server updated: "
            if(!err&&stats&&stats.mtime) updated += stats.mtime;
            else updated += "Error";


            require('child_process').exec("git log -1", function puts(error, stdout, stderr) { 
                var git = stdout;
                return res.send(updated+"<br>"+git,200);
            });
        });
    });

    require('../routes/constants')(app);

    require('./authentication.js')(app);

    require('../api/user.js')(app);
    require('../api/projects.js')(app);
    require('../api/devicedesigns.js')(app);
    require('../api/parts.js')(app);
    require('../api/sequences.js')(app);
    require('../api/j5runs.js')(app);
    require('../api/utils.js')(app);
    require('../api/explorer.js')(app);
};
