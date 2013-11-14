module.exports = function(app) {	
	app.sockets = {};

	io = app.io;
    pub = app.io.pub;
    sub = app.io.sub;
    store = app.io.client;

    io.sockets.on('connection', function (client) {

        console.log("New connection");

        sub.subscribe("j5jobs");

        sub.on("message", function (channel, name) {
            if(channel != "j5jobs") return false;
			if(!app.sockets[name]) { return false; }
			app.cache.get(name,function(err,user){
				app.sockets[name].emit('update',user);
			});            
        });

        client.on("set nickname", function(name){
        	app.sockets[name] = client;

			app.cache.get(name,function(err,user){
				app.sockets[name].emit('update',user);
			});

        });

        client.on("hello", function(name){
            hello.emit('message',"hello");
        });

        client.on("cancelj5run", function(j5runid){
            console.log("Attempt to cancel j5run")
            console.log(j5runid);;
        });

        client.on('disconnect', function() {});
         
    });

};