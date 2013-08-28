var readEnvironments = function(app) {
  app.set("env", "development");
  app.dbname = "teselagenDev";
};

var configEnvironments = function(app,express) {
    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    app.configure('test', function() {
        app.use(express.errorHandler());
    });

    app.configure('alpha', function() {
        app.use(express.errorHandler());
    });

    app.configure('beta', function() {
        app.use(express.errorHandler());
    });
};

exports.readEnvironments = readEnvironments;
exports.configEnvironments = configEnvironments;