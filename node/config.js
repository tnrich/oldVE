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
    require('./environments').configEnvironments(app, express);


    // Express Framework Configuration
    app.configure(function() {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade'); // Jade engine for templates (http://jade-lang.com/)
        app.set('view options', {
            layout: false
        }); // This opt allow extends
        app.use(express.bodyParser()); // Use express response body parser (recommended)
        app.use(express.cookieParser()); // Use express response cookie parser (recommended)
        app.use(express.session({
            secret: 'j5',
            cookie: {
                httpOnly: false
            }
        })); // Sessions managed using cookies
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

    // Load Manager classes
    /*
     * Managers to interact with models
     * Not fully implemented, work in progress
     * @author: Yuri Bendana
     */

    app.ApiManager = require("./manager/ApiManager")(app.db);
    app.DEProjectManager = require("./manager/DEProjectManager")(app.db);
    app.J5RunManager = require("./manager/J5RunManager")(app.db);
    app.PartManager = require("./manager/PartManager")(app.db);
    app.ProjectManager = require("./manager/ProjectManager")(app.db);
    app.SequenceManager = require("./manager/SequenceManager")(app.db);
    app.UserManager = require("./manager/UserManager")(app.db);
    app.VEProjectManager = require("./manager/VEProjectManager")(app.db);

};