module.exports = function(app){

    // REST API HEADERS CONFIG
    /*
     * Middleware that 
     */

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

}