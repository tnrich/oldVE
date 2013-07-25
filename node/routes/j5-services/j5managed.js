/**
 * j5 MANAGED API
 * @module ./routes/j5managed
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

app.get("/executej5m",restrict,function(req,res){

      var data = generateXML('DesignAssembly',data);
      quicklog(data);

      var newChild = spawn('/usr/bin/perl', ['-t','/Users/rpavez/bin/j5Test.pl']);
      console.log("Process started with pid: "+newChild.pid);

      newChild.stdin.setEncoding = 'utf-8';
      newChild.stdin.write(data+"\n");

      newChild.stdout.on('data', function (stoutData) {
              newChild.data = '' + stoutData;
      });

      newChild.stderr.on('data', function (stoutData) {
              console.log('stderr: ' + stoutData);
      });

      newChild.on('exit', function (code) {
          
          //return res.send(newChild.data);
          if(code!=0) return res.json({"fault":code});

          console.log(newChild.data);

};

}