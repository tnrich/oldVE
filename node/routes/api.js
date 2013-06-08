/**
 * TeselaGen API
 * @module ./routes/api
 */
module.exports = function(app) {

    require('../routes/constants')(app);

    require('../api/rest.js')(app);
    require('./authentication.js')(app);

    require('../api/user.js')(app);
    require('../api/projects.js')(app);
    require('../api/devicedesigns.js')(app);
    require('../api/parts.js')(app);
    require('../api/sequences.js')(app);
    require('../api/j5runs.js')(app);
    require('../api/utils.js')(app);

};