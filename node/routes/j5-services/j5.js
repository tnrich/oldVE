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

var restrict = app.auth.restrict;
var j5rpcEncode = require('./j5rpc');
var processJ5Response = require('./j5parser');

var j5Runs = app.db.model("j5run");

var fs = require("fs");

var spawn = require('child_process').spawn
var path = require('path');

var Serializer = require("./Serializer");
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
      // res.json(500, {"error":error["faultString"], "endDate": Date.now()});
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
app.post('/DesignDownstreamAutomation', restrict, function(req,res){

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
      // res.json(500, {"error":error["faultString"], "endDate": Date.now()});
    }
    else
    {
      res.json({"username":req.user.username,"endDate":Date.now(),"data":value});
    }
  });
});

// Condense AssemblyFiles
app.post('/condenseAssemblyFiles',restrict, function(req,res){

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
      // res.json(500, {"error":error["faultString"], "endDate": Date.now()});
    }
    else
    {
      res.json({"username":req.user.username,"endDate":Date.now(),"data":value});
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
      //console.log(fileBuffer);
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

  var handleErrors = function(err,newj5Run){
    console.log(err);
    newj5Run.status = "Error";
    newj5Run.endDate = Date.now();
    newj5Run.error_list.push({"error":err});
    newj5Run.save();
    throw new Error(err);
  };


  var objectId = new app.mongoose.mongo.ObjectID();

  var gridStore = new app.mongo.GridStore(app.GridStoreDB, objectId, 'w');
    // Open the file
    gridStore.open(function(err, gridStore) {
      if(err) return handleErrors(err,newj5Run);
      // Write some data to the file
      gridStore.write(fileData, function(err, gridStore) {
        if(err) return handleErrors(err,newj5Run);
        // Close (Flushes the data to MongoDB)
        gridStore.close(function(err, result) {
          if(err) return handleErrors(err,newj5Run);
          // Verify that the file exists
          app.mongo.GridStore.exist(app.GridStoreDB, objectId, function(err, result) {
            if(err) return handleErrors(err,newj5Run);
            
            processJ5Response(data.assembly_method,fileData,function(parsedResults,warnings){

              newj5Run.j5Parameters = { j5Parameters : JSON.parse(j5parameters) };
              newj5Run.file_id = objectId.toString();
              newj5Run.j5Results = parsedResults;
              newj5Run.endDate = new Date();
              newj5Run.status = (warnings.length > 0) ? "Completed with warnings" : "Completed";
              newj5Run.warnings = warnings;

              newj5Run.save(function(){
                deproject.j5runs.push(newj5Run);
                deproject.save();
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
  //console.log(j5run);
  readFile(o_id,function(inputStream){
      var file = new Buffer(inputStream, 'base64').toString('binary');
      var filename = "j5Results-"+j5run.date+'-'+req.user.username;
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
var DeviceDesignPreProcessing = function(devicedesignInput,cb){

  var Part = app.db.model("part");
  Part.populate( devicedesignInput.parts, { path: 'sequencefile_id' }, function(err,parts){

    // Generate temporal sequences index
    var sequenceIndex = {};
    var partsIndex = {};
    parts.forEach(function(part){
      sequenceIndex[part.sequencefile_id._id] = part.sequencefile_id;
      part.sequencefile_id = part.sequencefile_id._id;
      partsIndex[part._id] = part;
    });
    var devicedesign = devicedesignInput.toObject();
    devicedesign.parts = partsIndex;
    devicedesign.sequences = sequenceIndex;

    //console.log(Object.keys(devicedesign.sequences).length," sequences indexed");

    cb(devicedesign);
  });
};

// Design Assembly RPC
app.post('/executej5',restrict,function(req,res){

  // Variables definition
  var DeviceDesign = app.db.model("devicedesign");

  //Find the DeviceDesign in the Database populating the parts
  DeviceDesign.findById(req.body.deProjectId).populate('bins.cells.part_id.sequencefile_id parts').exec(function(err,deviceDesignModel){
    // Call resolve sequences to populate sequences (Further releases of mongoose may support multilevel chain population) so this can be refactored
    DeviceDesignPreProcessing(deviceDesignModel,function(devicedesign){
      // j5rpcEncode prepares the JSON (which will be translated to XML) to send via RPC.
      var data = j5rpcEncode(devicedesign,req.body.parameters,req.body.masterFiles,req.body.assemblyMethod);
      //return res.json(devicedesign);
      //quicklog(JSON.stringify(data));

      // Credentials for RPC communication
      data["username"] = 'node';
      data["api_key"] = 'teselarocks';

      //quicklog(JSON.stringify(data));

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
        devicedesign_name: deviceDesignModel.name,
        combinatorialAssembly: [],
        j5Input :
          {
            j5Parameters: JSON.parse(req.body.parameters)
          }
      });

      newj5Run.save(function(err){
        if(err) return res.json(500,{error: "Unexpected error, j5 task couldn't start."});
        res.json({status:"In progress"});
      });
      // file_id , j5Input and j5Results are filled once the job is completed.

      //quicklog(require('util').inspect(data,false,null));
      var xml = Serializer.serializeMethodCall('DesignAssembly', [data]);
      //quicklog(require('util').inspect(xml,false,null));

      var scriptPath = "/home/teselagen/j5service/j5Interface.pl";

      // Call to j5Client to DesignAssembly 
      if(app.get("env") === "production" && deviceDesignModel.name == "test" && fs.lstatSync(scriptPath).isFile()) {

        console.log("Executing experimental j5 through pipe");

        var xml = Serializer.serializeMethodCall('DesignAssembly', [data]);
        //quicklog(require('util').inspect(xml,false,null));
        var newChild = spawn('/usr/bin/perl', ['-t',scriptPath]);
        console.log("Process started with pid: "+newChild.pid);

        newChild.stdin.setEncoding = 'utf-8';
        newChild.stdin.write(xml+"\n");

        newChild.output = "";

        newChild.stdout.on('data', function (stoutData) {
          newChild.output += stoutData;
        });

        newChild.stderr.on('data', function (stoutData) {
            //Errors
        });

        newChild.on('exit', function () {
            console.log("J5 execution finished");

            require('xml2js').parseString(newChild.output, function (err, result) {
                quicklog(require('util').inspect(newChild.output,false,null));
                if(result.methodResponse.fault)
                {
                  var error = result.methodResponse.fault[0].value[0].struct[0].member[0].value[0].string[0];
                  console.log(error);
                  if(error.match('can\'t copy file masterplasmidlist.csv to the upload directory'))
                  {
                    error = "No previous master plasmids, please generate empty plasmid file";
                  }

                  newj5Run.status = "Error";
                  newj5Run.endDate = Date.now();
                  newj5Run.error_list.push({"error":error});
                  newj5Run.save();

                }
                else
                { 
                  var fileName = result.methodResponse.params[0].param[0].value[0].struct[0].member[0].value[0].string[0];
                  var encodedFileData = result.methodResponse.params[0].param[0].value[0].struct[0].member[1].value[0].string[0];
                  saveFile(newj5Run,data,req.body.parameters,encodedFileData,req.user,deviceDesignModel);
                }
            });

        });
      }
      else
      {
        app.j5client.methodCall('DesignAssembly', [data], function (error, value) {
          if(error)
          {
            if(error && error.code && error.code === 'ECONNRESET') error = {faultString: "J5 Remote Server Timeout"};
            
            newj5Run.status = "Error";
            newj5Run.endDate = Date.now();
            newj5Run.error_list.push({"error":error});
            newj5Run.save();
          }
          else
          {
            // Get and decode the zip file returned by j5 server
            var encodedFileData = value['encoded_output_file'];
            var fileName = value['output_filename'];

            saveFile(newj5Run,data,req.body.parameters,encodedFileData,req.user,deviceDesignModel);
          }
        });
      }

    });

  });
});

// Convert SBOL-TO-GENBANK
app.post('/sbol',function(req,res){
  /* For testing */
  //fs.readFile('./resources/sbol/ConvertSBOLXML_query0.json', encoding='utf8', function (err, rawData) {
    //var data = JSON.parse(rawData);
    //res.json({data:data});
  //});
    var data = {};
    
    data["encoded_to_be_converted_file"] = req.body.data;

    if(req.body.preserveSBOL==="true")
    {
      data["conversion_method"] = "ConvertSBOLXMLToGenBankPreserveSBOLInformation";
    }
    else
    {
      data["conversion_method"] = "ConvertSBOLXMLToGenBankClean"
    }

    console.log("Running ConvertSBOLXML");
    app.j5client.methodCall('ConvertSBOLXML', [data], function (error, value) {
      //quicklog(require('util').inspect(value,false,null));
      if(!error && value["encoded_output_file"])
      {
        var encodedFile = value["encoded_output_file"];
        var zip = new require('node-zip')(encodedFile, {base64: true, checkCRC32: true});
        var file = zip.files["inputsequencefile.gb"].data;
        res.json({error:error,data:file});
      }
      else
      {
        res.send({error:error,details:value},500);
      }
    });
});

// Convert GENBANKTOSBOL
app.post('/genbanktosbol',function(req,res){

    var data = {};
    
    data["encoded_to_be_converted_file"] = req.body.data;
    data["conversion_method"] = "ConvertGenBankToSBOLXML";

    console.log("Converting GENBANK TO SBOL using j5 webservice");
    app.j5client.methodCall('ConvertSBOLXML', [data], function (error, value) {
      //quicklog(require('util').inspect(value,false,null));
      if(!error && value["encoded_output_file"])
      {
        var encodedFile = value["encoded_output_file"];
        var zip = new require('node-zip')(encodedFile, {base64: true, checkCRC32: true});
        //quicklog(require('util').inspect(zip.files,false,null));
        var file = zip.files["inputsequencefile.xml"].data;
        res.json({error:error,data:file});
      }
      else
      {
        res.send({error:error,details:value},500);
      }
    });
});

};