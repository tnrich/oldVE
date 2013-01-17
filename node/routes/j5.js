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
  });
});

//Design Downstream Automation
app.post('/DesignDownstreamAutomation',function(req,res){

  var data = JSON.parse(req.body.files);
  var params = JSON.parse(req.body.params);

  var downstreamAutomationParamsEncode = function(params){
      var out = "Parameter Name,Value\n"
      
      for(var prop in params) {
          out += prop + ',' + params[prop] + '\n';
      }

      return new Buffer(out).toString('base64');    
  }

  data["encoded_downstream_automation_parameters_file"] =  downstreamAutomationParamsEncode(params);
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
function saveFile(fileData,user,deproject,cb)
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
            var newj5Run = new j5Run({
              deproject_id: deproject._id,
              name: "newResult",
              file_id:objectId.toString(),
              date:new Date()
            });
            newj5Run.save(function(){
              deproject.j5runs.push(newj5Run);
              deproject.save(function(){
                app.GridStoreDB.close();
                return cb(newj5Run);
              });
            });
          });
        });
      });
    });
};

app.get('/getfile/:id',restrict,function(req,res){
  var o_id = new app.mongoose.mongo.ObjectID(req.params.id);
  
  var j5Runs = app.db.model("j5run");
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

  })
});

app.post('/getProtocol',restrict,function(req,res){
  var o_id = new app.mongo.ObjectID(req.body._id);
  var protocol = req.user.protocols.id(o_id);
  res.json(protocol);
});

var direct = false;
var j5Method1, j5Method2;
j5Method1 = direct ? '/executej5t' : '/executej5';
j5Method2 = !direct ? '/executej5t' : '/executej5';

// Design Assembly RPC
app.post(j5Method1,restrict,function(req,res){

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
          if(partsCounter===0) return cb(deproject);
        });
      });
    });
  };

  DEProject.findById(req.body.deProjectId).populate('design.j5collection.bins.parts').exec(function(err,deprojectModel){
    resolveSequences(deprojectModel,function(deproject){
      var data = j5rpcEncode(deproject.design,req.body.parameters,req.body.masterFiles,req.body.assemblyMethod);
      data["username"] = 'rpavez';
      data["api_key"] = 'teselarocks';

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

          saveFile(encodedFileData,req.user,deprojectModel,function(j5run){

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
                newFile.fileContent = zip.files[file]['data'];
                newFile.name = fileName;
                newFile.size = zip.files[file]['data'].length;
                objResponse.files.push(newFile);
              }
              if( fileName.match(/.+combinatorial.csv/) )
              {
                objResponse.combinatorial = zip.files[file]['data'];
              }
            }

            objResponse.files.sort(function (a, b) {
                if (a.name < b.name) return -1;
                if (b.name < a.name) return 1;
                return 0;
            });
            
            j5run.j5Results = {};
            j5run.j5Results.assemblies = objResponse.files;
            j5run.j5Results.combinatorialAssembly = {};
            j5run.j5Results.combinatorialAssembly.nonDegenerativeParts = objResponse.combinatorial;
            j5run.save();

            res.send(objResponse);

          });
        }
      })

    });

  });

});

// DIRECT j5 COMM
app.post(j5Method2,restrict,function(req,res){

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

  var generateXML = function(method,data){
      var xml = builder.create('methodCall');
      xml.ele('methodName',{},method);
      var params = xml.ele('params');
      var param = params.ele('param').ele('value').ele('struct');
      for(var prop in data)
      {
          var member = param.ele('member');
          member.ele('name',{},prop);
          member.ele('value').ele('string',{},data[prop]);
      }

      return xml.toString();
  };

  var processXMLResponse = function(xml){
    var response = xml.methodResponse.params[0].param[0].value[0].struct[0].member;
    var parsed = {};
    response.forEach(function(entry){
      parsed[entry.name[0]] = entry.value[0].string[0];
    });
    return parsed;
  };

  DEProject.findById(req.body.deProjectId).populate('design.j5collection.bins.parts').exec(function(err,deprojectModel){
    resolveSequences(deprojectModel,function(deproject){
      var data = j5rpcEncode(deproject.design,req.body.parameters,req.body.masterFiles);
      data["username"] = 'node';

      data = generateXML('DesignAssembly',data);
      //return res.send(data);
      var newChild = spawn('/usr/bin/perl', ['-t','/home/rpavez/sandbox/j5_new/bin/j5Interface.pl']);
      console.log("Process started with pid: "+newChild.pid);

      newChild.stdin.setEncoding = 'utf-8';
      newChild.stdin.write(data+"\n");

      newChild.stdout.on('data', function (stoutData) {
              newChild.data = '' + stoutData;
      });

      newChild.stderr.on('data', function (stoutData) {
              //console.log('stderr: ' + stoutData);
      });

      newChild.on('exit', function (code) {
          
          //return res.send(newChild.data);
          if(code!=0) return res.json({"fault":code});

          parser.parseString(newChild.data, function (err, result) {
              if(err) { console.log("error"); console.log(newChild.data); }
              //if(!err) { newChild.data = result; console.log(util.inspect(result,null,100)); }
              
          value = processXMLResponse(result);
          
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
          
      

          });
      });

    });

  });

});

};