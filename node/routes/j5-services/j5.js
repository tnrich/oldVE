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
var j5Runs = app.db.model("j5run");

var j5rpcEncode = require('./j5rpc');
var processJ5Response = require('./j5parser');
var fs = require("fs");
var spawn = require('child_process').spawn
var path = require('path');
var Serializer = require("./Serializer");
var gridfs = require("./gridfs")(app);

if(app.get("env") === "production") {
  app.j5client = require("./j5communication")();
};
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

  req.user.J5MethodAllowed("DesignDownstreamAutomation",function(allowed){
    if(!allowed) return res.json({"fault":"Feature unavailable for free accounts"});

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
        res.json({"username":req.user.username,"endDate":Date.now(),"data":value});
      }
    });

  });
});

// Condense AssemblyFiles
app.post('/condenseAssemblyFiles',restrict, function(req,res){

  req.user.J5MethodAllowed("condenseAssemblyFiles",function(allowed){
    if(!allowed) return res.json({"fault":"Feature unavailable for free accounts"});

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
        res.json({"username":req.user.username,"endDate":Date.now(),"data":value});
      }
    });

  });
});


/**
 * Read file.
 */


app.get('/getfile/:id',restrict,function(req,res){
  
  j5Runs.findOne({'file_id':req.params.id},function(err,j5run){
  //console.log(j5run);
  gridfs.readFile(req.params.id,function(inputStream){
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


function updateMasterSources(sources,user){
  //if(Object.keys(sources).length>0)
  //{
    if(sources.masterplasmidlist) user.masterSources.masterplasmidlist.fileContent = new Buffer(sources.masterplasmidlist.fileContent).toString('base64');
    if(sources.masteroligolist) user.masterSources.masteroligolist.fileContent = new Buffer(sources.masteroligolist.fileContent).toString('base64');
    if(sources.masterdirectsyntheseslist) user.masterSources.masterdirectsyntheseslist.fileContent = new Buffer(sources.masterdirectsyntheseslist.fileContent).toString('base64');
    user.save();
  //}
};

var clearUserFolder = function(user){
  return false;
  require('child_process').exec("rm -R /home/teselagen/j5service/usr/"+user.username+"/", function (error, stdout, stderr) { 
      console.log("User folder cleared");
  });
};


function reportChange(j5run,user, completed, error){
  if(!user.username) throw new Error('Invalid user');

  app.cache.cachej5Run(user.username,j5run,function(){
    app.io.pub.publish("j5jobs",user.username);
    if(error==true) {app.io.pub.publish("j5error", JSON.stringify({user:user.username,j5run:j5run}));}
    else if(completed==true && !j5run.status=="Canceled") {app.io.pub.publish("j5completed", JSON.stringify({user:user.username,j5run:j5run}));}
  });
};


function onDesignAssemblyComplete(newj5Run,data,j5parameters,fileData,user)
{

  var handleErrors = function(err,newj5Run){
    console.log(err);
    newj5Run.status = "Error";
    newj5Run.endDate = Date.now();
    newj5Run.error_list.push({"error":err.toString()});
    newj5Run.save();
  };

  gridfs.saveFile(fileData,function(err,objectId){
    if(err) return handleErrors(err,newj5Run);
    processJ5Response(data.assembly_method,fileData,function(parsedResults,warnings){
      newj5Run.j5Parameters = { j5Parameters : JSON.parse(j5parameters) };
      newj5Run.file_id = objectId.toString();
      newj5Run.j5Results = parsedResults;
      newj5Run.endDate = new Date();
      newj5Run.status = (warnings.length > 0) ? "Completed with warnings" : "Completed";
      newj5Run.warnings = warnings;

      var completed = true;
      newj5Run.save();
      reportChange(newj5Run,user,completed);
      updateMasterSources(parsedResults.masterSources,user);
      clearUserFolder(user);
    });    

  });

}

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

    var names = {};

    for(var seqKey in devicedesign.sequences)
    {
      seq = devicedesign.sequences[seqKey];
      sequenceFileName = seq.sequenceFileName;
      sequenceFileName = sequenceFileName.replace(/\./g,'');
      sequenceFileName = sequenceFileName.replace(/\s/g,"_");
      sequenceFileName = sequenceFileName.replace(/(\r\n|\n|\r|\\)/gm,"");

      devicedesign.sequences[seqKey].sequenceFileName = sequenceFileName;
      

      if(names[sequenceFileName]===undefined) { names[sequenceFileName] = 0 }
      else
      {
        names[sequenceFileName]++; 
        devicedesign.sequences[seqKey].sequenceFileName = sequenceFileName + "_" + names[sequenceFileName];
      }
    }

    cb(devicedesign);
  });
};

app.get('/memjobs',function(req,res){
  app.cache.get('rpavez',function(err,user){
    return res.json({user:user});
  });
});

// Design Assembly RPC
app.post('/executej5',restrict,function(req,res){

  req.user.J5MethodAllowed(req.body.assemblyMethod,function(allowed){
    if(!allowed) return res.json({"fault":"Feature unavailable for free accounts"});

    var DeviceDesign = app.db.model("devicedesign");

    //Find the DeviceDesign in the Database populating the parts
    DeviceDesign.findById(req.body.deProjectId).populate('bins.cells.part_id.sequencefile_id parts').exec(function(err,deviceDesignModel){
      // Call resolve sequences to populate sequences (Further releases of mongoose may support multilevel chain population) so this can be refactored
      DeviceDesignPreProcessing(deviceDesignModel,function(devicedesign){

        var User = app.db.model("User");
        User.findById(req.user._id).select({ "masterSources.masterplasmidlist.fileContent": 1, "masterSources.masteroligolist.fileContent": 1,"masterSources.masterdirectsyntheseslist.fileContent": 1 }).exec(function(err,user){

        // j5rpcEncode prepares the JSON (which will be translated to XML) to send via RPC.
        var data = j5rpcEncode(devicedesign,req.body.parameters,req.body.masterFiles,req.body.assemblyMethod,user);

        // Credentials for RPC communication
        data["username"] = req.user.username;
        data["api_key"] = 'teselarocks';

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

        reportChange(newj5Run,req.user);

        newj5Run.save(function(err){
          deviceDesignModel.j5runs.push(newj5Run);
          deviceDesignModel.save(function(err){
            if(err) return res.json(500,{error: "Database error."});
          });
        });
        // file_id , j5Input and j5Results are filled once the job is completed.

        // In production mode use internal script
        //var testing = !(app.get("env") === "production");

        if(app.get("env") === "production") {

          //console.log("Executing experimental j5 through pipe");

          var xml = Serializer.serializeMethodCall('DesignAssembly', [data]);
          var scriptPath = "/home/teselagen/j5service/j5Interface.pl";
          var newChild = spawn('/usr/bin/perl', ['-t',scriptPath]);
          console.log("J5 Process started with pid: "+newChild.pid);

          newj5Run.process = {
            pid: newChild.pid,
            server: app.localIP
          };

          res.json({status:"In progress",j5run:newj5Run});

          newChild.stdin.setEncoding = 'utf-8';
          newChild.stdin.write(xml+"\n");

          newChild.output = "";

          newChild.stdout.on('data', function (stoutData) {
            newChild.output += stoutData;
          });

          newChild.stderr.on('data', function (stoutData) {}); // For further development

          newChild.on('exit', function (code,signal) {
              console.log("Process finished with code ",code," and signal ",signal);
              //quicklog(require('util').inspect(newChild.output,false,null));
              newChild.output = newChild.output.substr(newChild.output.indexOf('<'));
              require('xml2js').parseString(newChild.output, function (err, result) {
                  if(signal === "SIGTERM")
                  {
                    newj5Run.status = "Canceled";
                    newj5Run.endDate = Date.now();
                    newj5Run.save();
                    reportChange(newj5Run,req.user,true,true);
                  }
                  else if(err)
                  {
                    console.log(err);
                    newj5Run.status = "Error";
                    newj5Run.endDate = Date.now();
                    newj5Run.error_list.push({"error":{faultString: "Error parsing j5 output: " + err}});
                    newj5Run.save();
                    reportChange(newj5Run,req.user,true,true);
                  }
                  else if(result.methodResponse.fault)
                  {
                    var error = result.methodResponse.fault[0].value[0].struct[0].member[0].value[0].string[0];
                    console.log(error);
                    if(error.match('Can\'t copy file masterplasmidlist.csv to the upload directory'))
                    {
                      error = "No previous master plasmids, please generate empty plasmid file";
                    }

                    newj5Run.status = "Error";
                    newj5Run.endDate = Date.now();
                    newj5Run.error_list.push({"error":{faultString: error}});
                    newj5Run.save();
                    reportChange(newj5Run,req.user,true,true);

                  }
                  else
                  { 
                    var fileName = result.methodResponse.params[0].param[0].value[0].struct[0].member[0].value[0].string[0];
                    var encodedFileData = result.methodResponse.params[0].param[0].value[0].struct[0].member[1].value[0].string[0];
                    onDesignAssemblyComplete(newj5Run,data,req.body.parameters,encodedFileData,req.user);
                  }
              });

          });
        }
        else // Run as XML_RPC Depending on remote server (With timeout limit)
        {
          res.json({status:"In progress"});
          console.log("Executing XML RPC");
          app.j5client.methodCall('DesignAssembly', [data], function (error, value) {
            if(error)
            {
              if(error && error.code && error.code === 'ECONNRESET') error = {faultString: "J5 Remote Server Timeout"};
              
              newj5Run.status = "Error";
              newj5Run.endDate = Date.now();
              newj5Run.error_list.push({"error":error});
              newj5Run.save();
              reportChange(newj5Run,user,true,true);
            }
            else
            {
              // Get and decode the zip file returned by j5 server
              var encodedFileData = value['encoded_output_file'];
              var fileName = value['output_filename'];

              onDesignAssemblyComplete(newj5Run,data,req.body.parameters,encodedFileData,req.user);
            }
          });
        }

      });

      });
    });
  });
});

app.post('/cancelj5run',function(req,res){
  var j5Runs = app.db.model("j5run");
  j5Runs.findById(req.body.id).exec(function(err,j5run){
    if(err || !j5run) res.json({"fault":"j5 run not found"},500);
    var pid = j5run.process.pid;
    require('child_process').exec('kill -15 '+pid, function (error, stdout, stderr) {
        res.json(arguments);
        app.io.pub.publish("canceled". JSON.stringify({user:req.user.username,j5run:j5run}));
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
