/**
 * /config.js
 * -------------
 */

module.exports = function (app, express) {

  var config = this;

  // Socket io Config
  var server = require('http').createServer(app);
  //app.io = require('socket.io').listen(server);
  // Express Framework Configuration
  app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
      layout: false
    });
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: 'j5',
      cookie: { httpOnly: false }
    }));
    /*
    app.use(express.cookieSession({
      key: 'teselagen',
      secret: 'j5',
      cookie: { httpOnly: false }
    }));
    */
    app.use(express.methodOverride());

    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });

  // Environments
  app.configure('development', function () {
    app.use(express.errorHandler());
  });

  app.configure('stage', function () {
    app.use(express.errorHandler());
  });

  // Init MONGODB (Native Driver)
  
  var server = new app.mongo.Server('localhost', 27017, {
    auto_reconnect: true
  });
  var db = new app.mongo.Db('TestingTeselagen', server);
  db.open(function (err, db) {
    if(!err) {
      console.log("GRIDFS: Online");
    }
  });
  app.GridStoreDB = db;
  

  // Init MONGOOSE (ODM)
  //host, database, port, options


  /*
  J:true is specified, the getlasterror call awaits the journal commit before returning. 
  If the server is running without journaling, it returns immediately, and successfully.
  
  W:2 A client can block until a write operation has been replicated to N servers.

  majority: waits for more than 50% of the members to acknowledge the write 
  (until replication is applied to the point of that write).
  
  fsync (Not recommended. Use j instead.) When running with journaling, the fsync option awaits the next group commit before returning.

  */


  // MONGODB CONNECTION
  /*
  var opts = {
    getlasterror: 1,
    j: true,
    wtimeout: 10000
  };
  */

  app.db = app.mongoose.createConnection('localhost', 'TestingTeselagen', function () {
    console.log('MONGODB: MONGODB is online');
    require('./schemas/DBSchemas.js')(app);
  });

  // MYSQL CONNECTION
  if(app.program.stage || app.program.production) {
    // Init MYSQL
    var connection = app.mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'tesela#rocks',
      database: 'teselagen',
      insecureAuth: true
    });

  function handleDisconnect(connection) {
      connection.on('error', function (err) {
        if(!err.fatal) {
          return;
        }

        if(err.code !== 'PROTOCOL_CONNECTION_LOST') {
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
  if(app.testing.enabled) {
      console.log("Retrieving a valid sessionId");
      var query = 'select * from j5sessions order by id desc limit 1;';
      connection.query(query, function (err, rows, fields) {
        if(err) throw err;
        app.testing.sessionId = rows[0].session_id;
        console.log("Using sessionId: " + app.testing.sessionId);
      });
  }
  } 
  else {
    console.log('OPTIONS: MYSQL OMMITED');
  }
  app.mysql = connection;

  // Init XML-RPC
  app.j5client = app.xmlrpc.createClient({
    host: 'dev.teselagen.com',
    port: 80,
    path: '/j5/j5_xml_rpc.pl'
  });


  // SOAP Jbei-ICE Client
  if(app.program.stage || app.program.production) {
    app.soap.createClient('http://teselagen.com:8080/api/RegistryAPI?wsdl', function (err, client) {
      app.soap.client = client;
      if(!err) console.log('OPTIONS: SOAP CLIENT started');

      app.soap.client.login({
        login: 'Administrator',
        password: 'te#rocks'
      }, function (err, result) {
        app.soap.sessionId = result.
        return [0];
        console.log('SOAP CLIENT: Jbei-ice Authentication complete #' + app.soap.sessionId);
      });
    });
  } else {
    console.log('OPTIONS: SOAP CLIENT OMMITED');
  }

  app.xmlparser = new app.xml2js.Parser();

  app.mailer = app.nodemailer.createTransport("SMTP",{
      host: 'localhost'
  });

  // Load Manager classes
  app.ApiManager = require("./manager/ApiManager.js")(app);
  app.ProjectManager = require("./manager/ProjectManager.js")(app);
  
  return config;

};