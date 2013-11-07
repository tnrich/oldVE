/**
 * TeselaGen API
 * @module ./routes/api
 */
module.exports = function(app) {
    require('./authentication.js')(app);

    var restrict = app.auth.restrict;
    var sequences = require('../api/sequences')(app);

    app.get('/sequences', restrict, sequences.get);
    app.get('/sequences/:sequence_id', restrict, sequences.get);
    app.post('/sequences', restrict, sequences.post);
    app.put('/sequences/:sequence_id', restrict, sequences.put);
    app.del('/sequences/:sequence_id', restrict, sequences.del);

    /*
    app.get('/devicedesigns', restrict, devicedesigns.get);
    app.get('/devicedesigns/:devicedesign_id', restrict, devicedesigns.get);
    app.post('/devicedesigns/:devicedesign_id', restrict, devicedesigns.post);
    app.put('/devicedesigns/:devicedesign_id', restrict, devicedesigns.put);
    app.del('/devicedesigns/:devicedesign_id', restrict, devicedesigns.del);

    app.get('/j5runs', restrict, j5runs.get);
    app.get('/j5runs/:j5run_id', restrict, j5runs.get);
    app.post('/j5runs/:j5run_id', restrict, j5runs.post);
    app.put('/j5runs/:j5run_id', restrict, j5runs.put);
    app.del('/j5runs/:j5run_id', restrict, j5runs.del);

    app.get('/parts', restrict, parts.get);
    app.get('/parts/:part_id', restrict, parts.get);
    app.post('/parts/:part_id', restrict, parts.post);
    app.put('/parts/:part_id', restrict, parts.put);
    app.del('/parts/:part_id', restrict, parts.del);

    app.get('/projects', restrict, projects.get);
    app.get('/projects/:project_id', restrict, projects.get);
    app.post('/projects/:project_id', restrict, projects.post);
    app.put('/projects/:project_id', restrict, projects.put);
    app.del('/projects/:project_id', restrict, projects.del);
    */

    /*
    * Route to check server health and update
    */
    app.all('/', function(req,res) {
        var webpage = app.fs.readFileSync( require('path').resolve(__dirname,"../../","vede-cp") + '/index.html' , "utf8");
        res.send(webpage);
    });

    app.all('/rebase.xml', function(req,res) {
        var webpage = app.fs.readFileSync( require('path').resolve(__dirname,"../","resources") + '/rebase.xml' , "utf8");
        res.send(webpage);
    });

    /*
    * Route to check current version of code
    */
    app.all('/api/v', function(req,res) {
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
    require('../api/user.js')(app);
    require('../api/projects.js')(app);
    require('../api/devicedesigns.js')(app);
    require('../api/parts.js')(app);
    require('../api/j5runs.js')(app);
    require('../api/utils.js')(app);
    require('../api/explorer.js')(app);
};
