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
