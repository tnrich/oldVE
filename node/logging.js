var configLogging = function(app,express) {
    /*
     * WINSTON LOGGER
     * There are 6 default levels in winston: silly=0(lowest), verbose=1, info=2, warn=3, debug=4, error=5(highest)
    */

    app.logger = new(app.winston.Logger)({
        transports: [
            new(app.winston.transports.Console)({
                json: false,
                colorize: true
            })
        ]
    });

    var winstonStream = {
        write: function(message, encoding){
            app.logger.info(message);
        }
    };

    var logger = express.logger({stream:winstonStream,  format: ':remote-addr - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time' });

    app.use( function(req,res,next){
        if(req.headers["upgrade"]!=="websocket" && req.headers["x-requested-with"]==="XMLHttpRequest") logger(req,res,next);
        else next();
    });
};
exports.configLogging = configLogging;
