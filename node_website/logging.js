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
            }),
            new app.winston.transports.File({
                filename: '/log/node_debug.log', json: true
            })
    ],
        /*
        exceptionHandlers: [
            new(app.winston.transports.Console)({
                json: false,
                colorize: true
            }),
            new app.winston.transports.File({
                filename: '../log/exceptions.log', json: true
            })],
        exitOnError: false
        */
    });

    var winstonStream = {
        write: function(message, encoding){
            app.logger.info(message);
        }
    };

    app.use( express.logger({stream:winstonStream,  format: ':remote-addr - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time' }) );// Logger
};
exports.configLogging = configLogging;