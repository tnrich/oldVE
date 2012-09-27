
function check(data,fn){
  console.log("checking: "+data);
  var error = true;
  if(data=="123") error = false;  
  return fn(error);
}

var sessions = [];

function findSessionById(sessionId,cb)
{
  for(var session in sessions)
  {
    if(sessions[session].sessionId == sessionId) 
      {
        return cb(sessions[session]);
      }
  }
  return cb(null);
}

function deleteInstanceBySocketId(session,socketId,cb)
{
  for(var instance in session.instances)
  {
    if(session.instances[instance].socketId == socketId) 
      {
        session.instances.splice(instance,1);
        return cb();
      }
  }
  return cb();
}

function calculateInstances(session){
      var de = 0;var ve = 0;
      for(var instance in session.instances)
      {
        var instance = session.instances[instance];
        if(instance.type=="de") de++;
        if(instance.type=="ve") ve++;
      }
      return {de:de,ve:ve};
}

function broadCastUpdates(socket){
    console.log("Broadcasting update");
    var msg = {};
    socket.get('session', function (err, session) {
      msg.count = calculateInstances(session);
      msg.instances = session.instances;
      for(var instance in session.instances)
      {
        var instance = session.instances[instance];
        io.sockets.socket(instance.socketId).emit('updatesBind', msg);
      }
    });
}

/** Start of Teselagen API (Sockets) **/

io.sockets.on('connection', function (socket) {
  socket.on('initSession', function (data) {
    var sessionId = data.sessionId;
    var appType = data.appType;

    check(sessionId,function(err){
      if(err) {socket.emit('error',{msg:"expired"}); return;}

      findSessionById(sessionId,function(session){
        console.log("Session found: "+session);
        if(session)
        {
          var instance = {};
          instance.type = appType;
          instance.socketId = socket.id;

          session.instances.push(instance);  
        }
        else
        {
          console.log("creating session");
          var session = {};
          session.sessionId = sessionId;
          session.instances = [];

          var instance = {};
          instance.type = appType;
          instance.socketId = socket.id;

          session.instances.push(instance);
          sessions.push(session);          
        }

        socket.set('session', session, function(){
          socket.emit('ready',{msg:"valid"}); 
          
          //Broadcast update
          broadCastUpdates(socket);

        });

      })

    });
  });

  socket.on('getInstances', function (cb) {
    socket.get('session', function (err, session) {
      cb(session.instances);
    });
  });

  socket.on('triggerAction', function (msg) {
    socket.get('session', function (err, session) {
      for(var instance in session.instances)
      {
        var instance = session.instances[instance];
        if(instance.type == msg.destination) io.sockets.socket(instance.socketId).emit('actionTriggered', msg);
      }
    });
  });

  socket.on('disconnect', function (data,id) {
    socket.get('session', function (err, session) {
      //console.log("user disconnecting");
      if(session)
      {
        deleteInstanceBySocketId(session,socket.id,function(){
        });
      }
    });
  });

  socket.on('checkSessionId' , function(sessionId){
    if(!security) return console.log("Not available on dev environment");
    // AND TIMESTAMPDIFF(MINUTE,TIMESTAMP(creation_time),NOW())<2000
    console.log("Checking: "+sessionId);
    var query = 'select * from j5sessions where session_id="'+sessionId+'";';
    app.mysql.connection.query(query, function(err, rows, fields) {
      if (err) throw err;
      console.log(rows);
    });
  });

  socket.on('getSequence' , function(params,cb){
    var sequenceId = params.sequenceId;
    try{
      var o_id = new BSON.ObjectID(params.modelId);
    }
    catch(err){
      return socket.emit('error',{msg:"Not a valid Object ID"});
    }

    db.collection('models', function(err, collection) {
      collection.findOne({'_id':o_id},function (err,data){
        if(err) return socket.emit('error',{msg:"Model not found"});
        else {
          var seq = data["payload"]["de:design"]["de:sequenceFiles"]["de:sequenceFile"][0];
          cb(seq);
        }
      });
    });
  });

  socket.on('getModel' , function(params,cb){
    try{
      var o_id = new BSON.ObjectID(params.modelId);
    }
    catch(err){
      return socket.emit('error',{msg:"Not a valid Object ID"});
    }
    db.collection('models', function(err, collection) {
      collection.findOne({'_id':o_id},function (err,data){
        if(err) return socket.emit('error',{msg:"Model not found"});
        else {
          cb(data);
        }
      });
    });
  });

});