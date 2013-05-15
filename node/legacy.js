/*
    // Socket io Config

SOCKET IO SUPPORT
    //app.io = require('socket.io').listen(server);


*/


// MYSQL SUPPORT
/*
 * Mysql support for Legacy connection with Yii users 
 */


    // MYSQL CONNECTION
    if (app.program.beta || app.program.prod) {
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
        if (app.testing.enabled) {
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


/*
 * ICE INTERFACE SUPPORT
 */


 // SOAP Jbei-ICE Client
if (app.program.beta || app.program.prod) {
    app.soap.createClient('http://teselagen.com:8080/api/RegistryAPI?wsdl', function(err, client) {
        app.soap.client = client;
        if (!err) console.log('OPTIONS: SOAP CLIENT started');

        app.soap.client.login({
            login: 'Administrator',
            password: 'te#rocks'
        }, function(err, result) {
            app.soap.sessionId = result.
            return [0];
            console.log('SOAP CLIENT: Jbei-ice Authentication complete #' + app.soap.sessionId);
        });
    });
} else {
    console.log('OPTIONS: SOAP CLIENT OMITTED');
}