var direct = false;
var j5Method1, j5Method2;
j5Method1 = direct ? '/executej5t' : '/executej5';
j5Method2 = !direct ? '/executej5t' : '/executej5';


// DIRECT j5 COMM
app.post(j5Method2,restrict,function(req,res){

  var j5Params = {};
  var execParams = {};
  var DEProject = app.db.model("deproject");

  var resolveSequences = function(deproject,cb){
    deproject = deproject.toObject();
    var Sequence = app.db.model("sequence");
    var partsCounter = 0;
    deproject.j5collection.bins.forEach(function(bin){
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

  DEProject.findById(req.body.deProjectId).populate('design.j5collection.bins.parts').exec(function(err,deviceDesign){
    resolveSequences(deviceDesign,function(populatedDesign){
      var data = j5rpcEncode(populatedDesign,req.body.parameters,req.body.masterFiles);
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

          saveFile(encodedFileData,req.user,deviceDesign);

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