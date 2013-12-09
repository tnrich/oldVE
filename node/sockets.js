module.exports = function(app) {	
	app.sockets = {};

	io = app.io;
    pub = app.io.pub;
    sub = app.io.sub;
    store = app.io.client;

    io.sockets.on('connection', function (client) {

        console.log("New connection");

        sub.subscribe("j5jobs");
        sub.subscribe("j5completed");

        sub.on("message", function (channel, data) {
            if(channel=="j5jobs") 
            {
                var name = data;
    			if(!app.sockets[name]) { return false; }
    			app.cache.get(name,function(err,user){
    				if(user) app.sockets[name].emit('update',user);
    			});      
            }
            else if(channel=="j5completed")
            {
                var data = JSON.parse(data);
                var name = data.user;
                var j5run = data.j5run;
                if(!app.sockets[name]) { return false; }
                app.sockets[name].emit('j5completed',j5run);                  
            }
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

        client.on("cancelj5run", function(username, j5runid){
            console.log(arguments);
            console.log("Attempt to cancel j5run")
            var j5Runs = app.db.model("j5run");
            j5Runs.findById(j5runid).exec(function(err,j5run){
                if(err || !j5run) { console.log("j5Run not found"); return false;}
                j5run.status = "Canceled"; j5run.save();
                if(!j5run.process || !j5run.process.pid) { console.log("j5Run doesn't have attached process"); return false;}
                var pid = j5run.process.pid;
                require('child_process').exec('kill -15 '+pid, function (error, stdout, stderr) {
                    console.log(arguments);
                });
            });

            app.cache.removeTask( username , j5runid, function(){});
        });

        client.on("cancelbuilddna", function(username, builddnaid){
            console.log("Attempt to cancel builddna")

            app.cache.removeTask( username , builddnaid, function(){});
        });

        client.on("buildDNA", function(url,password){
            console.log("Trying to build DNA");
            name = "rpavez";
            app.cache.cacheDNABuild(name,function(){
                app.cache.get(name,function(err,user){
                    app.sockets[name].emit('update',user);
                });
            })
            
            app.http.request(
            {
              host: url,
              port: 80,
              path: '/start',
              method: 'GET'
            }, function(res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('error', function () {});
            }).end();
             
        });

        client.on('disconnect', function() {});
         
    });

};