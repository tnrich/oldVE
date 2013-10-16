module.exports = function(app) {	
	
	app.io.on('connection', function(data){
		console.log("New connection");
		console.log(data);
	});
	
};