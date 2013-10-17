module.exports = function(app) {	
	
	app.io.on('connection', function(socket){
		console.log("New connection");

		socket.on('sampleEvent', function(data){
			console.log("sample event");
			console.log(data);
		});

	});
};