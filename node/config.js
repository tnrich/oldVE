
/**
 * /config.js  
 * -------------
 */

module.exports = function(app, express){

  var config = this;

  app.security = true;
  
// Socket io Config
  var server = require('http').createServer(app);
  app.io = require('socket.io').listen(server);

  // Express Framework Configuration
  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'supersecretkeygoeshere'}));
    app.use(express.methodOverride());
    
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });

  // Environments
  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.security = false;
  });

  app.configure('stage', function(){
    app.use(express.errorHandler());
    app.security = true;
  });

  // Init MONGODB (Native Driver)
  var server = new app.mongo.Server('localhost', 27017, {auto_reconnect: true});
  var db = new app.mongo.Db('deviceEditor', server);
  db.open(function(err, db) { if(!err) {console.log("MongoDB is online"); }});
  app.mongodb = db;

  // Init MONGOOSE (ODM)
  app.db = app.mongoose.createConnection('localhost', 'deviceEditor',function(){
    console.log('MongoDB: Mongoose is online');
    app.development.reloadExamples();
    app.development.reloadUsers();
  });

  // Load MONGOOSE SCHEMAS
  require('./schemas.js')(app);


  // Init MYSQL
  var connection = app.mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'tesela#rocks',
    database : 'teselagen',
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
  if(app.security) {
    connection.connect();console.log("Mysql: Mysql is online");
    app.mysql.connection = connection;
    function keepAlive() {
    connection.query('SELECT 1');
    console.log("Fired Keep-Alive");
    return;
    }
    setInterval(keepAlive, 60000);
    if(app.testing.enabled)
    {
      console.log("Retrieving a valid sessionId");
      var query = 'select * from j5sessions order by id desc limit 1;';
      connection.query(query, function(err, rows, fields) {
        if (err) throw err;
        app.testing.sessionId = rows[0].session_id;
        console.log("Using sessionId: "+app.testing.sessionId);
      });
    }
  }
  else {console.log("Mysql: Mysql is offline (only stage env)");}
  app.mysql = connection;

  // Init XML-RPC
  app.j5client = app.xmlrpc.createClient({ host: 'eaa.teselagen.com', port: 80, path: '/bin/j5_xml_rpc.pl'})

  // Init SOAP Jbei-ICE Client
  app.soap.createClient('http://teselagen.com:8080/api/RegistryAPI?wsdl', function(err, client) {
    app.soap.client = client;
    if(!err) console.log('JBEI-ICE: SOAP Client started.');
    
    app.soap.client.login({login:'Administrator',password:'te#rocks'}, function(err, result) {
      app.soap.sessionId = result.return[0];
      console.log('JBEI-ICE: SOAP Authentication complete #'+app.soap.sessionId);
    });
    
  });

  app.xmlparser = new app.xml2js.Parser();

  return config;

};
