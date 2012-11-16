/**
 * j5 API - VEDE EXT Platform
 * -----------------------
 */

module.exports = function (app) {

var j5rpcEncode = require('./j5rpc');

function authenticate(username, pass, fn) {
  var User = app.db.model("User");
  User.findOne({
    'username': username
  }, function (err, user) {
    if(err) return fn(new Error('cannot find user'));
    return fn(null, user);
  });
};

function restrict(req, res, next) {
  if(req.session.user) {
    var User = app.db.model("User");
    User.findOne({
      'username': req.session.user.username
    }, function (err, user) {
      req.user = user;
      next();
    });
  } else {
    if(!app.testing.enabled) {
      res.send('Wrong credentials');
    } else {
      /*
      console.log("Logged as Guest user");
      authenticate("Guest", "", function (err, user) {
        req.session.regenerate(function () {
          req.session.user = user;
          req.user = user;
          next();
        });

      });
      */
      res.send("Wrong credentials",401);
    }
  }
};

// Get Last Updated User Files
app.all('/GetLastUpdatedUserFiles',function(req,res){

  var data = {}
  data["j5_session_id"] = req.body.sessionID;
  if(app.testing.enabled) data["j5_session_id"] = app.testing.sessionId;

  app.j5client.methodCall('GetLastUpdatedUserFiles', [data], function (error, value) {

  function base64CSVDecodeToObject(field)
  {
      var decoded = new Buffer(field.replace('\n',""), 'base64').toString();
      var obj = {};
      var lines = decoded.split(['\n']);decoded.split(['\n']).shift();
      lines.forEach(function(line){
        obj[line.split([','])[0]] = line.split([','])[1];
      });
      return obj;
  }

    if(error) 
    {
      console.log(error);
      res.send(error["faultString"], 500);
    }
    else
    {
      
      var j5parameters = base64CSVDecodeToObject(value["encoded_j5_parameters_file"]);
      var master_plasmids_list = value["encoded_master_plasmids_file"];
      var master_oligos_list = value["encoded_master_oligos_file"]; 
      var master_direct_synthesis_list = value["encoded_master_direct_syntheses_file"];

      var data = {};
      data.j5parameters = j5parameters;
      data["encoded_master_plasmids_file"] = master_plasmids_list;
      data["encoded_master_oligos_file"] = master_oligos_list;
      data["encoded_master_direct_syntheses_file"] = master_direct_synthesis_list;

      res.send(data);
    }
  })
});

//Design Downstream Automation 
app.post('/DesignDownstreamAutomation',function(req,res){

  var data = JSON.parse(req.body.params);
  if(app.testing.enabled) data["j5_session_id"] = app.testing.sessionId;

  app.j5client.methodCall('DesignDownstreamAutomation', [data], function (error, value) {

    if(error) 
    {
      console.log(error);
      res.send(error["faultString"], 500);
    }
    else
    {
      res.send(value);
    }
  })
});

// Condense AssemblyFiles
app.post('/condenseAssemblyFiles',function(req,res){

  var params = JSON.parse(req.body.params);
  var data = {};
  data["encoded_assembly_files_to_condense_file"] = params["assemblyFiles"]["content"];
  data["encoded_zipped_assembly_files_file"] = params["zippedFiles"]["content"];  
  data["j5_session_id"] = req.body.sessionID;
  if(app.testing.enabled) data["j5_session_id"] = app.testing.sessionId;

  app.j5client.methodCall('CondenseMultipleAssemblyFiles', [data], function (error, value) {

    if(error) 
    {
      console.log(error);
      res.send(error["faultString"], 500);
    }
    else
    {
      res.send(value);
    }
  })
});


function readFile(objectId,cb)
{
  var gridStore = new app.mongo.GridStore(app.GridStoreDB, objectId, 'r');
  
  gridStore.open(function(err, file) {
    // Peform a find to get a cursor
    var stream = file.stream(true);

    // Pause the stream initially
    stream.pause();

    // Save read content here
    var fileBuffer = '';

    // For each data item
    stream.on("data", function(item) {
      // Pause stream
      stream.pause();
      // Check if cursor is paused
      // assert.equal(true, stream.paused);

      fileBuffer += item.toString('utf8');

      // Restart the stream after 1 miliscecond
      setTimeout(function() {
        stream.resume();
        // Check if cursor is paused
      }, 100);
    });

    // For each data item
    stream.on("end", function(item) {
    });
    // When the stream is done
    stream.on("close", function() {
      // Have we received the same file back?
      //assert.equal(fileBuffer, fileBody);
      console.log(fileBuffer);
      cb(fileBuffer);
      app.GridStoreDB.close();
    });

    // Resume the stream
    stream.resume();
  });

  // Open the file
  /*
  gridStore.open(function(err, gridStore) {
    cb(gridStore.stream());
    gridStore.read(gridStore.length,function(err,data){
      cb(data);
    });
  });
  */
}

function saveFile(fileData,user,deproject)
{
  var assert = require('assert');

  //console.log(app.GridStoreDB);

  var objectId = new app.mongoose.mongo.ObjectID();

  var gridStore = new app.mongo.GridStore(app.GridStoreDB, objectId, 'w');
    // Open the file
    gridStore.open(function(err, gridStore) {
      // Write some data to the file
      gridStore.write(fileData, function(err, gridStore) {
        // Close (Flushes the data to MongoDB)
        gridStore.close(function(err, result) {
          // Verify that the file exists
          app.mongo.GridStore.exist(app.GridStoreDB, objectId, function(err, result) {

            var j5Result = app.db.model("j5result");
            var newj5Result = new j5Result({deprojectName:deproject.name,fileId:objectId.toString(),dateCreated:new Date()});
            newj5Result.save(function(){
              deproject.j5results.push(newj5Result);
              deproject.save();
              app.GridStoreDB.close();
            });
          });
        });
      });
    });
};

app.get('/openResult',restrict,function(req,res){
  var o_id = new app.mongoose.mongo.ObjectID(req.query.fileId);
  
  readFile(o_id,function(inputStream){

      var decodedFile = new Buffer(inputStream, 'base64').toString('binary');
      
      var zip = new require('node-zip')(decodedFile, {base64: false, checkCRC32: true});

      var objResponse = {};
      objResponse.files = [];
      objResponse.data = inputStream;

      var plasmids = [];

      for(var file in zip.files)
      {
        var fileName = zip.files[file]['name'];
        if( fileName.match(/\w+.(\w+)/)[1] == "gb" )
        {
          var newFile = {};
          newFile.data = zip.files[file]['data'];
          newFile.name = fileName;
          newFile.size = zip.files[file]['data'].length;
          objResponse.files.push(newFile);

          plasmids.push({'text':fileName, 'leaf': true, 'type':'plasmid','data':newFile.data});
        }
      }

      objResponse.files.sort(function (a, b) {
          if (a.name < b.name) return -1;
          if (b.name < a.name) return 1;
          return 0;
      });
      
      console.log(zip);
      console.log(plasmids);

      var tree = {
        children : plasmids
      };

      res.json(tree);
      
    });
});

app.post('/getProtocol',restrict,function(req,res){
  var o_id = new app.mongo.ObjectID(req.body._id);
  var protocol = req.user.protocols.id(o_id);
  res.json(protocol);
});

// Design Assembly RPC
app.post('/executej5',restrict,function(req,res){

  var j5Params = {};
  var execParams = {};
  var DEProject = app.db.model("deproject");

  var resolveSequences = function(deproject,cb){
    deproject = deproject.toObject();
    var Sequence = app.db.model("sequence");
    var partsCounter = 0;
    deproject.design.j5collection.bins.forEach(function(bin){
        partsCounter += bin.parts.length;
    });

    deproject.design.j5collection.bins.forEach(function(bin,binKey){
      bin.parts.forEach(function(part,partKey){
        Sequence.findById(part.sequencefile_id,function(err,seq){
          deproject.design.j5collection.bins[binKey].parts[partKey].SequenceFile = seq;
          partsCounter--;
          if(partsCounter==0) return cb(deproject);
        });
      });
    });
  };

  DEProject.findById(req.body.deProjectId).populate('design.j5collection.bins.parts').exec(function(err,deprojectModel){
    resolveSequences(deprojectModel,function(deproject){
      var data = j5rpcEncode(deproject.design,req.body.parameters,req.body.masterFiles);
      data["j5_session_id"] = 'ce03444cd7da329896e8d6115f98cea5';
      app.j5client.methodCall('DesignAssembly', [data], function (error, value) {
        if(error) 
        {
          console.log(error);
          res.send(error["faultString"], 500);
        }
        else
        {
          var encodedFileData = value['encoded_output_file'];
          var fileName = value['output_filename'];

          var decodedFile = new Buffer(encodedFileData, 'base64').toString('binary');

          saveFile(encodedFileData,req.user,deprojectModel);

          var zip = new require('node-zip')(decodedFile, {base64: false, checkCRC32: true});
          
          var objResponse = {};
          objResponse.files = [];
          objResponse.data = encodedFileData;

          for(var file in zip.files)
          {
            var fileName = zip.files[file]['name'];
            if( fileName.match(/\w+.(\w+)/)[1] == "gb" )
            {
              var newFile = {};
              //newFile.data = zip.files[file]['data'];
              newFile.data = 'test';
              newFile.name = fileName;
              newFile.size = zip.files[file]['data'].length;
              objResponse.files.push(newFile);
            }
          }

          objResponse.files.sort(function (a, b) {
              if (a.name < b.name) return -1;
              if (b.name < a.name) return 1;
              return 0;
          });
          
          res.send(objResponse);
        }
      })

    });

  });

});

};