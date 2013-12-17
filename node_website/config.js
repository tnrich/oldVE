
/**
 * /config.js  
 * -------------
 */

module.exports = function(app, express){

  var config = this;

  var options = {
    key: app.fs.readFileSync('/home/teselagen/keys/www.teselagen.com.key', 'utf8'),
    cert: app.fs.readFileSync('/home/teselagen/keys/certificate.pem', 'utf8'),
    ca: [
       app.fs.readFileSync('/home/teselagen/keys/chain1.pem','utf8'),
       app.fs.readFileSync('/home/teselagen/keys/chain2.pem','utf8')
    ]
  };

  //console.log(options);

  var httpsServer = require('https').createServer(options,app).listen(3443);
  var httpServer = require('http').Server(app).listen(3000);

  require('./environments').readEnvironments(app);

  require('./logging').configLogging(app, express);

  app.configure('development', function () { app.locals.pretty = true; });
  app.configure('production', function () { app.locals.pretty = true; });

   var Opts = {
        host: "127.0.0.1",
        port: 27017,
        authHost: "mongodb://127.0.0.1/" + app.dbname
    }; 

    app.set("env","production");
    app.dbname = "teselagen";

    if(app.get("env") === "production") {
        var Opts = {
            host: "54.215.198.196",
            port: 27017,
            username: "prod",
            password: "o+Me+IFYebytd9u2TaCuSoI3AjAu2p4hplSIxqWKi/8=",
            authRequired : true,
            redis_pass : "X+lLN+06kOe7pVKT06z9b1lEPeuBam1EdQtUk965Wj8="
        };
        Opts.authHost = "mongodb://" + Opts.username + ":" + Opts.password + "@" + Opts.host + ":" + Opts.port + "/" + app.dbname
    }

  if (!app.settings.env) {app.settings.env="development";}

/*
app.use(function(req,res,next) {
  if (!/https/.test(req.protocol)){
     res.redirect("https://" + req.headers.host + req.url);
  } else {
     return next();
  } 
});
*/

  //env specific config
      app.configure('development', function(){
        var MongoStore = app.mongostore(express);
            
            app.set('views', __dirname + '/views');
            app.set('view engine', 'jade'); // Jade engine for templates (http://jade-lang.com/)
            app.set('view options', {
                layout: false
            }); // This opt allow extends
            app.use(express.bodyParser()); // Use express response body parser (recommended)
            app.use(express.cookieParser("secretj5!")); // Use express response cookie parser (recommended)
            app.use(express.session({ 
              secret: 'teselagen',
              store: new MongoStore(
                  {
                      db: app.dbname,
                      host: 'localhost',
                      collection: 'web_sessions',
                      auto_reconnect: true
                  }
              )
            })); // Sessions managed using cookies

            app.use(app.passport.initialize());
            app.use(app.passport.session());

          app.logger.info("USING MONGODB SESSION STORE");
          app.use(express.methodOverride()); // This config put express top methods on top of the API config
          app.use(express.static(__dirname + '/public'));

          app.use(app.router); // Use express routing system
          //app.use(express.static(__dirname + '/public')); // Static folder (not used) (optional)
      });

      app.configure('production', function() {      
        process.env.NODE_ENV = 'production';

        // User Airbrake to log errors.
        var airbrake = require('airbrake').createClient("40e870e0-c0a6-c307-8bef-37371fd86407");
        airbrake.serviceHost = "exceptions.codebasehq.com"
        airbrake.protocol = "https"
        airbrake.handleExceptions();

        // Use Nodetime to monitor/profile the server.
        require('nodetime').profile({
            accountKey: '7a81c5694843fb2ead319abf624219460dad4f47', 
            appName: 'Teselagen App'
        });

        var redis = require("redis").createClient(6379,Opts.host,{ auth_pass : Opts.redis_pass });
        app.redis = redis;
        var RedisStore = require('connect-redis')(express)

        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade'); // Jade engine for templates (http://jade-lang.com/)
        app.set('view options', {
            layout: false
        }); // This opt allow extends
        app.use(express.bodyParser()); // Use express response body parser (recommended)
        app.use(express.cookieParser("secretj5!")); // Use express response cookie parser (recommended)
        app.use(express.session({ 
            secret: 'j5',
            store: new RedisStore({client: redis})
        })); // Sessions managed using cookies

        redis.auth(Opts.redis_pass,function(err,ok){
            if(!err&&ok=="OK") app.logger.info("REDIS: Online (Remote Server)");
            else app.logger.error("REDIS: CONNECTION PROBLEMS",err);
        });

        redis.on('error'       , function(err){app.logger.error("REDIS: CONNECTION PROBLEMS",err);});

        app.use(app.passport.initialize());
        app.use(app.passport.session());

        app.use(express.methodOverride()); // This config put express top methods on top of the API config
        app.use(express.static(__dirname + '/public')); // Static folder (not used) (optional)
        app.use(app.router); // Use express routing system
        app.use(airbrake.expressHandler());
      });
      
      var mandrill = require('mandrill-api/mandrill');
      app.mailer = new mandrill.Mandrill('eHuRc2KcVFU5nqCOAAefnA');


      // Init MONGODB - MONGOOSE (ODM)
      /*
       * MONGOOSE (ODM) Initialization using app.dbname
       */
      app.db = app.mongoose.createConnection(Opts.authHost, function(data) {
          if (data) { app.logger.error("info","MONGOOSE: Offline", data[0]); console.log(data); }
          else { 
              app.logger.log("info","MONGOOSE: Online", app.dbname);
          }
      });
      require('./schemas/DBSchemas.js')(app.db);
};
