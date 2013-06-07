/**
 * j5 API
 * @module ./routes/j5
 */

var spawn = require('child_process').spawn;
var xml2js = require('xml2js');
var util = require('util');
var builder = require('xmlbuilder');
var parser = new xml2js.Parser();

module.exports = function (app) {

var j5rpcEncode = require('./j5rpc');
var processJ5Response = require('./j5parser');

var j5Runs = app.db.model("j5run");

/**
 * Write to quick.log
 */
function quicklog(s) {
  var logpath = "/tmp/quick.log";
  var fs = require('fs');
  s = s.toString().replace(/\r\n|\r/g, '\n'); // hack
  var fd = fs.openSync(logpath, 'a+', 0666);
  fs.writeSync(fd, s + '\n');
  fs.closeSync(fd);
}

/**
 *  Login Auth Method : Find User in DB
 */
function authenticate(username, pass, fn) {
  var User = app.db.model("User");
  User.findOne({
    'username': username
  }, function (err, user) {
    if(err) return fn(new Error('cannot find user'));
    return fn(null, user);
  });
};

/**
 * Authentication Restriction.
 * If user session is active then find the user in DB.
 */
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
  data["username"] = 'node';
  data["api_key"] = 'teselarocks';

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
  });
});

//Design Downstream Automation
app.post('/DesignDownstreamAutomation',function(req,res){

  var data = JSON.parse(req.body.files);
  var params = JSON.parse(req.body.params);
  var reuseParams = req.body.reuseParams;

  var downstreamAutomationParamsEncode = function(params){
      var out = "Parameter Name,Value\n"
      
      for(var prop in params) {
          out += prop + ',' + params[prop] + '\n';
      }

      return new Buffer(out).toString('base64');    
  }

  data["encoded_downstream_automation_parameters_file"] =  downstreamAutomationParamsEncode(params);
  data["reuse_downstream_automation_parameters_file"] = reuseParams;
  //data["encoded_downstream_automation_parameters_file"] = "UGFyYW1ldGVyIE5hbWUsVmFsdWUsRGVmYXVsdCBWYWx1ZSxEZXNjcmlwdGlvbg1NQVhERUxUQVRF TVBFUkFUVVJFQURKQUNFTlRaT05FUyw1LDUsVGhlIG1heGltdW0gZGlmZmVyZW5jZSBpbiB0ZW1w ZXJhdHVyZSAoaW4gQykgYmV0d2VlbiBhZGphY2VudCB6b25lcyBvbiB0aGUgdGhlcm1vY3ljbGVy IGJsb2NrDU1BWERFTFRBVEVNUEVSQVRVUkVSRUFDVElPTk9QVElNVU1aT05FQUNDRVBUQ";
  data["automation_task"] = "DistributePcrReactions";
  data["username"] = 'node';
  data["api_key"] = 'teselarocks';

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
  });
});

// Condense AssemblyFiles
app.post('/condenseAssemblyFiles',function(req,res){

  var params = JSON.parse(req.body.data);
  var data = {};
  data["encoded_assembly_files_to_condense_file"] = params["assemblyFiles"]["content"];
  data["encoded_zipped_assembly_files_file"] = params["zippedFiles"]["content"];
  data["username"] = 'node';
  data["api_key"] = 'teselarocks';

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
  });
});


/**
 * Read file.
 */
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

/**
 * Save file.
 */
function saveFile(newj5Run,data,j5parameters,fileData,user,deproject,cb)
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

            var j5Run = app.db.model("j5run");
            
            processJ5Response(data.assembly_method,fileData,function(parsedResults,warnings){

              newj5Run.j5Parameters = { j5Parameters : JSON.parse(j5parameters) };
              newj5Run.file_id = objectId.toString();
              newj5Run.j5Results = parsedResults;
              newj5Run.endDate = new Date();
              newj5Run.status = (warnings.length > 0) ? "Completed with warnings" : "Completed";
              newj5Run.warnings = warnings;

              newj5Run.save(function(){
                deproject.j5runs.push(newj5Run);
                deproject.save(function(){
                  app.GridStoreDB.close();
                  //return cb(newj5Run,warnings);
                });
              });

            });
          });
        });
      });
    });
}

app.get('/getfile/:id',restrict,function(req,res){
  var o_id = new app.mongoose.mongo.ObjectID(req.params.id);
  
  j5Runs.findOne({'file_id':req.params.id},function(err,j5run){
  console.log(j5run);
  readFile(o_id,function(inputStream){
      var file = new Buffer(inputStream, 'base64').toString('binary');
      var filename = "j5Results-"+j5run.date;
      res.set({
        'Content-Type': 'application/zip',
        'Content-Length': file.length,
        'Content-disposition': 'attachment; filename='+filename
      });
      res.set('Content-Length', file.length);
      res.end(file,'binary');
    });

  });
});

app.post('/getProtocol',restrict,function(req,res){
  var o_id = new app.mongo.ObjectID(req.body._id);
  var protocol = req.user.protocols.id(o_id);
  res.json(protocol);
});

// Resolve sequences given a devicedesign, returns a callback
var resolveSequences = function(devicedesign,cb){
  devicedesign = devicedesign.toObject();
  var Sequence = app.db.model("sequence");
  var partsCounter = 0;
  devicedesign.j5collection.bins.forEach(function(bin){
      partsCounter += bin.parts.length;
  });

  devicedesign.j5collection.bins.forEach(function(bin,binKey){
    bin.parts.forEach(function(part,partKey){
      Sequence.findById(part.sequencefile_id,function(err,seq){
        devicedesign.j5collection.bins[binKey].parts[partKey].SequenceFile = seq;
        partsCounter--;
        if(partsCounter===0) return cb(devicedesign);
      });
    });
  });
};

// Design Assembly RPC
app.post('/executej5',restrict,function(req,res){

  // Variables definition
  var j5Params = {};
  var execParams = {};
  var DeviceDesign = app.db.model("devicedesign");

  //Find the DeviceDesign in the Database populating the parts
  DeviceDesign.findById(req.body.deProjectId).populate('j5collection.bins.parts').exec(function(err,deviceDesignModel){

    // Call resolve sequences to populate sequences (Further releases of mongoose may support multilevel chain population) so this can be refactored
    resolveSequences(deviceDesignModel,function(devicedesign){

      // j5rpcEncode prepares the JSON (which will be translated to XML) to send via RPC.
      var data = j5rpcEncode(devicedesign,req.body.parameters,req.body.masterFiles,req.body.assemblyMethod);

      // Credentials for RPC communication
      data["username"] = 'node';
      data["api_key"] = 'teselarocks';

      /* Everything is ready for j5 communication - j5run is generated on pending status */

      var newj5Run = new j5Runs({
        name: "newResult",
        date: new Date(),
        assemblyMethod: data.assembly_method,
        assemblyType: data.ASSEMBLY_PRODUCT_TYPE,
        status: "In progress",
        user_id: req.user._id,
        devicedesign_id : deviceDesignModel._id,
        project_id : deviceDesignModel.project_id,
        devicedesign_name: deviceDesignModel.name
      });

      newj5Run.save(function(err){
        if(err) return res.json(500,{error: "Unexpected error, j5 task couldn't start."});
        res.json({status:"In progress"});
      });
      // file_id , j5Input and j5Results are filled once the job is completed.

      // Call to j5Client to DesignAssembly 
      app.j5client.methodCall('DesignAssembly', [data], function (error, value) {
        if(error)
        {
          // Catch error during j5 RPC execution
          console.log(error);
          res.send(error["faultString"], 500);
        }
        else
        {
          // Get and decode the zip file returned by j5 server
          var encodedFileData = value['encoded_output_file'];
          var fileName = value['output_filename'];
          var decodedFile = new Buffer(encodedFileData, 'base64').toString('binary');

          saveFile(newj5Run,data,req.body.parameters,encodedFileData,req.user,deviceDesignModel
            /*
            ,function(j5run,warnings){
            res.send(
              {
                j5Results : j5run.j5Results,
                warnings: warnings,
                zipfile: encodedFileData
              });
          }
          */
          );
        }
      });

    });

  });
});

};