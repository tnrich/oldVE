/**
 * Application configuration
 * @module ./config
 */

module.exports = function(app, express) {
    app.program
    .version('0.0.1')
    .option('-p, --prod', 'Run Production environment')
    .option('-d, --remote', 'Force use remote DB')
    .option('-r, --port <n>', 'Node port default is 3000', parseInt)
    .parse(process.argv);

    app.set("env", "development"); // Default ENV
    app.dbname = "teselagen"; // Default DB (No change)

    if (app.program.prod) {
        app.set("env", "production");
    }

    var useAirbrake = app.program.useairbrake;

    var server = require('http').Server(app);

    // LOGGING
    require('./logging').configLogging(app, express);

    // PROXY
    //app.routingProxy = new app.httpProxy.RoutingProxy();

    // Express Framework Configuration

    var Opts = {
        host: "localhost",
        port: 27017,
        authHost: "mongodb://localhost/" + app.dbname,
        redis_host: '54.215.198.196',
        redis_pass : "X+lLN+06kOe7pVKT06z9b1lEPeuBam1EdQtUk965Wj8="
    };

    if(app.get("env") === "production") {
        Opts = {
            host: "54.215.198.196",
            port: 27017,
            username: "prod",
            password: "o+Me+IFYebytd9u2TaCuSoI3AjAu2p4hplSIxqWKi/8=",
            authRequired : true,
            redis_host: '54.215.198.196',
            redis_pass : "X+lLN+06kOe7pVKT06z9b1lEPeuBam1EdQtUk965Wj8="
        };
        Opts.authHost = "mongodb://" + Opts.username + ":" + Opts.password + "@" + Opts.host + ":" + Opts.port + "/" + app.dbname;
    }

    if(app.program.remote) {
        console.log("Using remote");
        app.logger.log("USING REMOTE DB");
        Opts = {
            host: "54.215.198.196",
            port: 27017,
            username: "prod",
            password: "o+Me+IFYebytd9u2TaCuSoI3AjAu2p4hplSIxqWKi/8=",
            authRequired : true,
            redis_host: '54.215.198.196',
            redis_pass : "X+lLN+06kOe7pVKT06z9b1lEPeuBam1EdQtUk965Wj8="
        };
        Opts.authHost = "mongodb://" + Opts.username + ":" + Opts.password + "@" + Opts.host + ":" + Opts.port + "/" + app.dbname;
    }

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

        //app.use(function(req, res, next){
        //    req.headers.host = 'teselagen.local';
        //    app.routingProxy.proxyRequest(req, res, {host: 'teselagen.local', port: 80});
        //});

        app.use(express.json());
        app.use(express.urlencoded());

        app.use(express.cookieParser("secretj5!")); // Use express response cookie parser (recommended)
        app.use(express.session({
            cookie: {
                maxAge: 1000 * 60 * 60
            },
            secret: 'j5',
            store: new express.session.MemoryStore()
        }));

        app.use(app.passport.initialize());
        app.use(app.passport.session());

        app.logger.info("USING MONGODB SESSION STORE");
        app.use(express.methodOverride()); // This config put express top methods on top of the API config
        app.use(app.router); // Use express routing system
        app.use(express.static(require('path').resolve(__dirname,"../","vede-cp")));
    });

    app.configure('production', function() {
        process.env.NODE_ENV = 'production';

        if(useAirbrake) {
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
        }

        // Use Nodetime to monitor/profile the server.
        require('nodetime').profile({
            accountKey: '7a81c5694843fb2ead319abf624219460dad4f47',
            appName: 'Teselagen App'
        });

        var redis = app.redis.createClient(6379,Opts.host,{ auth_pass : Opts.redis_pass });
        app.redisClient = redis;
        var RedisStore = require('connect-redis')(express)

        app.use(express.json());
        app.use(express.urlencoded());

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

        redis.on('error', function(err){app.logger.error("REDIS: CONNECTION PROBLEMS",err);});

        app.use(app.passport.initialize());
        app.use(app.passport.session());

        app.use(express.methodOverride()); // This config put express top methods on top of the API config
        app.use(app.router); // Use express routing system
        app.use(express.static(require('path').resolve(__dirname,"../","vede-cp")));
        if(useAirbrake) app.use(airbrake.expressHandler());
    });

    // INIT SOCKET IO

    var io = app.io;

    io.enable('browser client minification');
    io.enable('browser client etag');
    io.enable('browser client gzip');
    io.set( 'origins', '*:*' );
    io.set('log level', 1);

    if(app.get("env")==="development")
    {
        //console.log("SOCKET : XHR POLLING");
        io.set("transports", ["websocket"]);
    }
    else
    {
        console.log("SOCKET : SOCKET");

        io.set('transports', [
            'websocket'
          //, 'flashsocket'
          //, 'htmlfile'
          //, 'xhr-polling'
          //, 'jsonp-polling'
        ]);
    }

    var RedisStore = require('socket.io/lib/stores/redis');

    var pub   =  app.redis.createClient(6379,Opts.redis_host,{ auth_pass : Opts.redis_pass })
      , sub   =  app.redis.createClient(6379,Opts.redis_host,{ auth_pass : Opts.redis_pass })
      , client =  app.redis.createClient(6379,Opts.redis_host,{ auth_pass : Opts.redis_pass });

    pub.auth(   Opts.redis_pass, function (err) { if (err) throw err; });
    sub.auth(   Opts.redis_pass, function (err) { if (err) throw err; });
    client.auth( Opts.redis_pass, function (err) { if (err) throw err; });

    pub.on("error", function(err){ console.log("Error: ",err); });
    sub.on("error", function(err){ console.log("Error: ",err); });
    client.on("error", function(err){ console.log("Error: ",err); });

    io.set('store', new RedisStore({
          redis    : app.redis
        , redisPub : pub
        , redisSub : sub
        , redisClient : client
    }));

    app.io.pub = pub;
    app.io.sub = sub;
    app.io.client = client;

    // Init MEMCACHE

    var cacheType = 'memcache';

    if(cacheType=="memcache") {
        app.logger.log("MEMCACHE CACHE");
        var memCacheHost = Opts.host+':11211';
        memCacheHost = "54.215.198.196:11211";
        app.cache = new app.memcached(memCacheHost);

        app.cache.on('failure', function( details ){ sys.error( "Server " + details.server + "went down due to: " + details.messages.join( '' ) ) });
        app.cache.on('reconnecting', function( details ){ sys.debug( "Total downtime caused by server " + details.server + " :" + details.totalDownTime + "ms")});

        app.cache.cacheDNABuild = function(userKey,cb){
            task = {
                id : new app.mongoose.mongo.ObjectID(),
                taskName : "TECAN Compiler",
                taskType : "builddna",
                status   : "Running",
                dateStarted : new Date(),
                taskRefID   : null
            };

            app.cache.get(userKey,function(err,user){
                if(!user || !user.tasks)
                {
                    user = {};
                    user.tasks = {};
                    user.tasks[task.id] = task;
                }
                else
                {
                    if (Object.keys(user.tasks).length === 7) user.tasks = {};
                    user.tasks[task.id] = task;
                }
                app.cache.set(userKey, user, 0, function(err){
                    cb()
                });
            });
        };

        app.cache.cachej5Run = function(userKey,job,cb){
            job = job.toObject();
            task = {
                id : job._id,
                taskName : job.devicedesign_name,
                taskType : "j5run",
                status   : job.status,
                dateStarted : job.date,
                taskRefID   : job._id,
                assemblyType : job.assemblyMethod,
                run: job
            };

            app.cache.get(userKey,function(err,user){
                if(!user || !user.tasks)
                {
                    user = {};
                    user.tasks = {};
                    user.tasks[task.id] = task;
                }
                else
                {
                    if (Object.keys(user.tasks).length === 7) user.tasks = {};
                    user.tasks[task.id] = task;
                }
                app.cache.set(userKey, user, 0, function(err){
                    cb()
                });
            });
        };

        app.cache.removeTask = function(userKey,taskKey,cb){
            app.cache.get(userKey,function(err,user){
                if(user && user.tasks)
                {
                    delete user.tasks[taskKey];
                    app.cache.set(userKey, user, 0, function(err){
                        cb()
                    });
                }
            });
        };

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
    else
    {
        app.logger.log('info',"MEMORY CACHE");
        app.cacheData = {};
        app.cache.set = function(key,value){
            app.cacheData[key] = value;
        };
        app.cache.get = function(key,cb){
            return cb(false,app.cacheData[key]);
        };

        app.cache.cacheJob = function(userKey,job){
            job = job.toObject();
            delete job.j5Input;
            delete job.j5Results;
            app.cache.get(userKey,function(err,user){
                if(!user)
                {
                    user = {};
                    user.jobs = {};
                    user.jobs[job._id] = job;
                }
                else
                {
                    user.jobs[job._id] = job;
                }
                app.cache.set(userKey,user);
            });
        };

        app.cache.removeTask = function(){
            console.log("Warning: non implemented");
        };

    }



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

    // Error handler
    app.errorHandler = express.errorHandler();


    // Resolver server external address
    require('child_process').exec('curl http://169.254.169.254/latest/meta-data/public-hostname', function (error, stdout, stderr) {
        var decoder = new (require('string_decoder').StringDecoder)('utf-8');
        app.localIP = decoder.write(stdout);
    });
};
