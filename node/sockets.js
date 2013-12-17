module.exports = function(app) {	
	app.sockets = {};
    app.j5pids = {};
	io = app.io;
    pub = app.io.pub;
    sub = app.io.sub;
    store = app.io.client;

    sub.subscribe("j5jobs");
    sub.subscribe("j5completed");
    sub.subscribe("j5error");
    sub.subscribe("canceled");
    sub.subscribe("killj5process");

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
        else if(channel=="j5error")
        {
            var data = JSON.parse(data);
            var name = data.user;
            var j5run = data.j5run;
            if(!app.sockets[name]) { return false; }
            app.sockets[name].emit('j5error',j5run);                  
        }
        else if(channel=="canceled") 
        {
            var data = JSON.parse(data);
            var name = data.user;
            var j5run = data.j5run;
            if(!app.sockets[name]) { return false; }
            app.sockets[name].emit('canceled', j5run);   
        }
        else if(channel=="killj5process") 
        {
            var data = JSON.parse(data);
            var pid = data.pid;
            console.log("Received broadcast to kill process "+pid)
            if(app.j5pids[pid])
            {
                console.log("Server received broadcast to kill j5 job and is killing the process");
                require('child_process').exec('kill -15 '+pid, function (error, stdout, stderr) {
                    console.log(arguments);
                    app.io.pub.publish("canceled", JSON.stringify({user:data.user,j5run:data.j5run}));
                });
            }
            else
            {
                console.log("Server received broadcast to kill j5 job but process was not on this server");
            } 
        }
    });


    io.sockets.on('connection', function (client) {

        console.log("New connection");

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
            console.log("Attempt to cancel j5run");

            var j5Runs = app.db.model("j5run");
            j5Runs.findById(j5runid).exec(function(err,j5run){
                if(err || !j5run) { console.log("j5Run not found"); return false;}
                j5run.status = "Canceled"; j5run.save();
                if(!j5run.process || !j5run.process.pid) { console.log("j5Run doesn't have attached process"); return false;}
                var pid = j5run.process.pid;

                if(app.j5pids[pid])
                {
                    require('child_process').exec('kill -15 '+pid, function (error, stdout, stderr) {
                        console.log(arguments);
                        app.io.pub.publish("canceled", JSON.stringify({user:username,j5run:j5run}));
                    });
                }
                else
                {
                    console.log("j5 process not in this server... broadcasting to other servers")
                    app.io.pub.publish("killj5process", JSON.stringify({user:username,j5run:j5run,pid:pid}));
                }
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
