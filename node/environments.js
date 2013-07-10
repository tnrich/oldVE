var readEnvironments = function(app) {
  app.program
    .version('0.0.1')
    .option('-e, --examples', 'Load Examples')
    .option('-g, --guest', 'Create Guest User')
    .option('-d, --dev', 'Run Development environment')
    .option('-t, --test', 'Run Test environment')
    .option('-a, --alpha', 'Run Alpha environment')
    .option('-b, --beta', 'Run Beta environment')
    .option('-p, --prod', 'Run Production environment')
    .option('-r, --port <n>', 'Node port default is 3000', parseInt)
    .option('-q, --quiet', 'Disable logging')
    .parse(process.argv);

  app.set("env", "development");
  app.dbname = "teselagenDev";
  if (app.program.test) {
      app.set("env", "test");
      app.dbname = "teselagenTest";
  }
  else if (app.program.alpha) {
      app.set("env", "alpha");
      app.dbname = "teselagenAlpha";
  }
  else if (app.program.beta) {
      app.set("env", "beta");
      app.dbname = "teselagenBeta";
  }
  else if (app.program.prod) {
      app.set("env", "production");
      app.dbname = "teselagen";
  }
  else {
      app.program.dev = true;
  }
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