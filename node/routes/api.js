/**
 * TeselaGen API
 * @module ./routes/api
 */
module.exports = function(app) {

    require('./authentication.js')(app);
    require('../routes/constants')(app);

    var restrict = app.auth.restrict;
    var sequences = require('../api/sequences')(app);
    var devicedesigns = require('../api/devicedesigns.js')(app);
    var user = require('../api/user.js')(app);
    var projects = require('../api/projects.js')(app);
    var parts = require('../api/parts.js')(app);
    var j5runs = require('../api/j5runs.js')(app);
    var utils = require('../api/utils.js')(app);
    var explorer = require('../api/explorer.js')(app);

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

    app.get('/sequences', restrict, sequences.get);
    app.get('/sequences/:sequence_id', restrict, sequences.get);
    app.post('/sequences', restrict, sequences.post);
    app.put('/sequences/:sequence_id', restrict, sequences.put);
    app.del('/sequences/:sequence_id', restrict, sequences.del);

    app.post('/users/:username/projects/:project_id/devicedesigns', restrict, devicedesigns.create_device_design);
    app.put('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id', restrict, devicedesigns.update_device_design);
    app.get('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id/eugenerules', restrict, devicedesigns.get_eugene_rules);
    app.get('/users/:username/projects/:project_id/devicedesigns', restrict, devicedesigns.get_design_by_project_id);
    app.get('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id', restrict, devicedesigns.get_device_design_by_id);
    app.get('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id/parts', restrict, devicedesigns.get_device_design_parts);
    app.delete('/users/:username/projects/:project_id/devicedesigns/:devicedesign_id', restrict, devicedesigns.delete_device_design);

    app.get('/beta', restrict, user.beta);
    app.get("/userStats/:code", user.stats);
    app.get("/integrity/:code", user.integrityCheck);
    app.get("/users/:username", restrict, user.get_user);
    app.get("/users/activate/:activationCode", user.activate);
    app.get("/users", restrict, user.get_users);
    app.put("/users/:username", restrict, user.put_user);
    app.post('/presets' ,restrict, user.post_presets);
    app.put('/presets' ,restrict, user.put_presets);
    app.delete('/presets' ,restrict, user.del_presets);
    app.get('/presets' ,restrict, user.get_presets);

    app.get('/fqdn', restrict, parts.fqdn);
    app.post('/parts', restrict, parts.post_parts);
    app.get('/updateAllPartHashes', restrict, parts.updateAllPartHashes);
    app.put('/parts', restrict, parts.put_parts);
    app.get('/parts', restrict, parts.get_parts);
    app.get('/parts/:part_id', restrict, parts.get_part_by_id);
    app.delete('/parts/:part_id', restrict, parts.delete_parts);

    app.get('/users/:username/devicedesigns/:devicedesign_id/j5runs', restrict, j5runs.get_j5_runs);

    app.post('/error',utils.post_error);
    app.post('/sendFeedback', restrict, utils.post_send_feedback);
    app.get('/partLibrary', restrict, utils.get_partLibrary);
    app.get('/checkDuplicatedPartName', restrict, utils.checkDuplicatedPartName);
    app.get('/getDesignsWithPart', restrict, utils.get_DesignsWithPart);
    app.get('/getPartsAndDesignsBySequence', restrict, utils.get_PartsAndDesignsBySequence);
    app.get('/monitorTasks', restrict, utils.get_monitorTasks);
    app.get('/getStats', restrict, utils.get_getStats);

    app.get('/partLibrary', restrict, explorer.get_partLibrary);
    app.get('/users/:username/projectExplorer/getData', restrict, explorer.get_explorer_data);
    app.get('/users/:username/projectExplorer/renameProject', restrict, explorer.get_rename_project);


    app.all('/', utils.index_website);
    app.all('/rebase.xml', utils.get_rebase_xml);
    app.all('/api/v', utils.get_api_version);

    app.all('/https',  function (req, res) {
        console.log("Getting here");
        return res.json({protocol:req.protocol,secure:req.secure});
    });

    /*
    app.all('/*',  function (req, res) {
        console.log("Getting here");
        return app.proxy.proxyRequest(req, res, {
            host: 'teselagen.local',
            port: 80
        });
    });
    */
};
