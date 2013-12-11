/**
 * Application configuration
 * @module ./config
 */

module.exports = function(app, express) {

    var config = this;

    //var server = require('http').Server(app);
 
    var options = {
        key: app.fs.readFileSync('/home/teselagen/keys/app.teselagen.com.key', 'utf8'),
        cert: app.fs.readFileSync('/home/teselagen/keys/certificate.pem', 'utf8'),
    };

    //console.log(options);

    var httpsServer = require('https').createServer(options,app).listen(3443);
    var httpServer = require('http').Server(app).listen(3000);

    // LOGGING
    require('./logging').configLogging(app, express);

    // LOAD ENVIRONMENT VARIABLES
    require('./environments').readEnvironments(app);
    //require('./environments').configEnvironments(app, express);

    // Express Framework Configuration

    app.set('env','production');
    app.dbname = "teselagen";

    var Opts = {
        host: "localhost",
        port: 27017,
        authHost: "mongodb://localhost/" + app.dbname
    };

    if(app.get("env") === "production") {
        Opts = {
            host: "54.215.198.196",
            port: 27017,
            username: "prod",
            password: "o+Me+IFYebytd9u2TaCuSoI3AjAu2p4hplSIxqWKi/8=",
            authRequired : true,
            redis_pass : "X+lLN+06kOe7pVKT06z9b1lEPeuBam1EdQtUk965Wj8="
        };
        Opts.authHost = "mongodb://" + Opts.username + ":" + Opts.password + "@" + Opts.host + ":" + Opts.port + "/" + app.dbname;
    }

    /* User should be added to production like
        db.addUser('prod', 'o+Me+IFYebytd9u2TaCuSoI3AjAu2p4hplSIxqWKi/8=')
    */

    /*
    For quick activation
    db.users.update({"username" : "rpavez"},{$set:{"activated":true}})
    */

    app.configure('development', function() {

        var MongoStore = app.mongostore(express);

        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade'); // Jade engine for templates (http://jade-lang.com/)
        app.set('view options', {
            layout: false
        }); // This opt allow extends
        app.use(express.bodyParser()); // Use express response body parser (recommended)
        app.use(express.cookieParser("secretj5!")); // Use express response cookie parser (recommended)
        app.use(express.session({ 
            secret: 'j5',
            store: new MongoStore(
                {
                    db: app.dbname,
                    host: 'localhost',
                    collection: 'sessions',
                    auto_reconnect: true
                }
            )
        })); // Sessions managed using cookies

        app.use(app.passport.initialize());
        app.use(app.passport.session());

        app.logger.info("USING MONGODB SESSION STORE");
        app.use(express.methodOverride()); // This config put express top methods on top of the API config
        app.use(app.router); // Use express routing system
        app.use(express.static(__dirname + '/public'));
    });

    app.configure('production', function() {
        process.env.NODE_ENV = 'production';

        // User Airbrake to log errors.
        var airbrake = require('airbrake').createClient("40e870e0-c0a6-c307-8bef-37371fd86407");
        airbrake.serviceHost = "exceptions.codebasehq.com"
        airbrake.protocol = "https"
        airbrake.handleExceptions();

        airbrake.on('vars', function(type, vars) {
          if (type === 'cgi-data') {
            vars.SOURCE = "NodeJS";
          }
        });

        // Use Nodetime to monitor/profile the server.
        require('nodetime').profile({
            accountKey: '7a81c5694843fb2ead319abf624219460dad4f47',
            appName: 'Teselagen App'
        });

        var redis = require("redis").createClient(6379,Opts.host,{ auth_pass : Opts.redis_pass });
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
            store: new RedisStore({
                client: redis,
                prefix: 'vede://',
                ttl: 3600
            })
        })); // Sessions managed using cookies

        redis.auth(Opts.redis_pass,function(err,ok){
            if(!err&&ok=="OK") app.logger.info("REDIS: Online (Remote Server)");
            else app.logger.error("REDIS: CONNECTION PROBLEMS",err);
        });

        redis.on('error'       , function(err){app.logger.error("REDIS: CONNECTION PROBLEMS",err);});

        app.use(app.passport.initialize());
        app.use(app.passport.session());

        app.use(express.methodOverride()); // This config put express top methods on top of the API config
        app.use(app.router); // Use express routing system
        app.use(express.static(__dirname + '/public'));
        app.use(airbrake.expressHandler());
    });

    // Init MEMCACHED
    /*
    var memCacheHost = Opts.host+':11211';
    memCacheHost = "54.215.198.196:11211";
    app.cache = new app.memcached(memCacheHost);

    app.cache.on('failure', function( details ){ sys.error( "Server " + details.server + "went down due to: " + details.messages.join( '' ) ) });
    app.cache.on('reconnecting', function( details ){ sys.debug( "Total downtime caused by server " + details.server + " :" + details.totalDownTime + "ms")});

    if(app.get("env") === "production") {
    setTimeout(function(){        
        console.log("writing to memcache");
        app.cache.set('test', 'hello', 0, function (err, result) {
            if(err) {
                app.logger.error("MEMCACHE: CONNECTION PROBLEMS");
                console.log(arguments);
            }
            else {
                console.log("reading to memcache");
                app.cache.get('test', function (err, data) {
                  if(err) console.log("Error reading data from memcache");
                  console.log(data);
                });
            }
        });
        
    },1000);
    }
    */


    // Init MONGODB - MONGOOSE (ODM)
    /*
     * MONGOOSE (ODM) Initialization using app.dbname
     */


    app.db = app.mongoose.createConnection(Opts.authHost, function(err) {
        if (err) {
            app.logger.error("info","MONGOOSE: Offline", err[0]); console.log(err); 
            //app.mongoose.connection.db.serverConfig.connection.autoReconnect = true;
        }
        else { 
            app.logger.log("info","MONGOOSE: Online", app.dbname);
        }
    });
    require('./schemas/DBSchemas.js')(app.db);
    
    

    // Init XML-RPC
    /*
     * XML RPC Client Iniciatlization to execute j5 on remote servers
     */

    app.j5client = app.xmlrpc.createClient({
        host: 'j5dev.teselagen.com',
        port: 80,
        path: '/j5/j5_xml_rpc.pl',
        timeout: 600000 //ms timeout
    });

    // Init XML PARSER
    /*
     * XML Parser needed for coding and decoding ICE messages
     * Maybe in future ICE can be refactored as a module and this added a self dependency
     */
    app.xmlparser = new app.xml2js.Parser();

    //NodeMailer Config
    app.mailer = app.nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "teselagen.testing@gmail.com",
            pass: "teselagen#rocks"
        }
    });


    // MYSQL CONNECTION
    if (app.program.mysql) {
        // Init MYSQL
        var connection = app.mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'tesela#rocks',
            database: 'teselagen',
            insecureAuth: true
        });

        function handleDisconnect(connection) {
            connection.on('error', function(err) {
                if (!err.fatal) {
                    return;
                }

                if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
                    throw err;
                }

                console.log('Re-connecting lost connection: ' + err.stack);

                connection = app.mysql.createConnection(connection.config);
                handleDisconnect(connection);
                connection.connect();
            });
        }

        handleDisconnect(connection);

        // We will only connect to mysql and check for credetentials on production environment
        connection.connect();
        console.log('OPTIONS: MYSQL started');
        app.mysql.connection = connection;

        function keepAlive() {
            connection.query('SELECT 1');
            console.log("Fired Keep-Alive");
            return;
        }
        setInterval(keepAlive, 60000);
        if (app.program.debug) {
            console.log("Retrieving a valid sessionId");
            var query = 'select * from j5sessions order by id desc limit 1;';
            connection.query(query, function(err, rows, fields) {
                if (err) throw err;
                app.testing.sessionId = rows[0].session_id;
                console.log("Using sessionId: " + app.testing.sessionId);
            });
        }
    } else {
        app.logger.info('OPTIONS: MYSQL OMITTED');
    }
    app.mysql = connection;

    // Error handler
    app.errorHandler = express.errorHandler();

    
    // Resolver server external address
    require('child_process').exec('curl http://169.254.169.254/latest/meta-data/public-hostname', function (error, stdout, stderr) { 
        var decoder = new (require('string_decoder').StringDecoder)('utf-8');
        app.localIP = decoder.write(stdout);
    });

    /*
     * Load Manager classes
     * Managers interact with models
     */

    app.ApiManager = require("./manager/ApiManager")();
    app.DeviceDesignManager = require("./manager/DeviceDesignManager")();
    app.J5RunManager = require("./manager/J5RunManager")();
    app.PartManager = require("./manager/PartManager")();
    app.ProjectManager = require("./manager/ProjectManager")();
    app.SequenceManager = require("./manager/SequenceManager")();
    app.UserManager = require("./manager/UserManager")();

};
