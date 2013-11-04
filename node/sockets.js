module.exports = function(app) {	
	app.sockets = {};
	app.io.on('connection', function(socket){
		console.log("New connection");

		socket.on('set nickname', function (name) {
			app.sockets[name] = socket;
			app.cache.get('rpavez',function(err,user){
				app.sockets['rpavez'].emit('update',user);
			});
		});
	});
};