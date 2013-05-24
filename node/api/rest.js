module.exports = function(app){

    // REST API HEADERS CONFIG
    /*
     * Middleware that 
     */

    app.use(function(req, res, next) {
        if (req.method === 'OPTIONS') {
            var headers = {};
            headers["Access-Control-Allow-Origin"] = req.headers.origin;
            headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
            headers["Access-Control-Allow-Credentials"] = true;
            headers["Access-Control-Max-Age"] = '86400'; // 24 hours
            headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
            res.writeHead(200, headers);
            res.end();
        } else {
            res.header("Access-Control-Allow-Origin", req.headers.origin);
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Credentials", 'true');
            next();
        }
    });

}