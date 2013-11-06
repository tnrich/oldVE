module.exports = function(app) {	
	app.sockets = {};

	io = app.io;
    pub = app.io.pub;
    sub = app.io.sub;
    store = app.io.client;

    io.sockets.on('connection', function (client) {

        console.log("New connection");

        sub.subscribe("j5jobs");
        /*
		socket.on('set nickname', function (name) {
			app.sockets[name] = socket;
			app.cache.get('rpavez',function(err,user){
				if(user&&!err) app.sockets['rpavez'].emit('update',user);
			});
		});
		*/

        sub.on("message", function (channel, name) {
			if(!app.sockets[name]) return false;

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

        /*
        
        sub.subscribe("chatting");

        sub.on("message", function (channel, message) {
            console.log("message received on server from publish ");
            client.send(message);
        });

        client.on("message", function (msg) {
            console.log(msg);
            if(msg.type == "chat"){
                pub.publish("chatting",msg.message);
            }
            else if(msg.type == "setUsername"){
                pub.publish("chatting","A new user in connected:" + msg.user);
                store.sadd("onlineUsers",msg.user);
            }
        });
		*/

        client.on('disconnect', function () {
            //sub.quit();
            //pub.publish("chatting","User is disconnected :" + client.id);
        });
         
    });

};