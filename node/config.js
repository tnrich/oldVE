/**
 * Application configuration
 * @module ./config
 */

module.exports = function(app, express) {

    var config = this;

    var server = require('http').Server(app);
   
    // LOGGING
    require('./logging').configLogging(app, express);

    // LOAD ENVIRONMENT VARIABLES
    require('./environments').readEnvironments(app);
    //require('./environments').configEnvironments(app, express);

    // Express Framework Configuration

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
	app.logger.info("USING MONGODB SESSION STORE");
        app.use(express.methodOverride()); // This config put express top methods on top of the API config
        app.use(app.router); // Use express routing system
        //app.use(express.static(__dirname + '/public')); // Static folder (not used) (optional)
    });

    app.configure('test', function() {      

        var redis = require("redis").createClient();
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
	app.logger.info("USING REDIS SESSION STORE");
        app.use(express.methodOverride()); // This config put express top methods on top of the API config
        app.use(app.router); // Use express routing system
        //app.use(express.static(__dirname + '/public')); // Static folder (not used) (optional)
    });


    // Init MONGODB (Native Driver)
    /*
     * Reason to open MongoDB Native Driver is support for GridSTORE
     * DB Operations managed by Mongoose loaded below
     */

    var MongoDBServer = new app.mongo.Server('localhost', 27017, {
        auto_reconnect: true
    });
    var db = new app.mongo.Db(app.dbname, MongoDBServer, {
        safe: true
    });
    db.open(function(err, db) {
        if (!err) {
            app.logger.info("GRIDFS: Online");
        }
    });
    app.GridStoreDB = db;


    // Init MONGODB - MONGOOSE (ODM)
    /*
     * MONGOOSE (ODM) Initialization using app.dbname
     */

    app.db = app.mongoose.createConnection('localhost', app.dbname);
    if (app.db) {
        app.logger.log("info","Mongoose: connected to database \"%s\"", app.dbname);
        require('./schemas/DBSchemas.js')(app.db);
    } else {
        throw new Error("Cannot create Mongoose connection");
    }

    // Init XML-RPC
    /*
     * XML RPC Client Iniciatlization to execute j5 on remote servers
     */

    app.j5client = app.xmlrpc.createClient({
        host: 'dev.teselagen.com',
        port: 80,
        path: '/j5/j5_xml_rpc.pl'
    });

    // Init XML PARSER
    /*
     * XML Parser needed for coding and decoding ICE messages
     * Maybe in future ICE can be refactored as a module and this added a self dependency
     */
    app.xmlparser = new app.xml2js.Parser();

    // INIT NodeMailer
    /*
     * NodeMailer user to send emails using local SMTP server
     */

    app.mailer = app.nodemailer.createTransport("SMTP", {
        host: 'localhost'
    });


    // MYSQL CONNECTION
    if (app.program.alpha || app.program.beta || app.program.prod) {
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
        console.log('OPTIONS: MYSQL OMITTED');
    }
    app.mysql = connection;

    // Error handler
    app.errorHandler = express.errorHandler();

    
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
