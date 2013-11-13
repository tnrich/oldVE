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
            if(channel != "j5jobs") return false;
            console.log("Broadcasting message");
			if(!app.sockets[name]) { console.log("Socket not found"); return false; }
            else console.log("Socket found");
            console.log("Looking into cache");
			app.cache.get(name,function(err,user){
                console.log("Number of jobs: "+Object.keys(user.jobs).length);
				app.sockets[name].emit('update',user);
			});            
        });

        client.on("set nickname", function(name){
            console.log("SOCKET REGISTERED");
        	app.sockets[name] = client;

			app.cache.get(name,function(err,user){
				app.sockets[name].emit('update',user);
			});

        });

        client.on("hello", function(name){
            hello.emit('message',"hello");
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