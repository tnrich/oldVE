var fs = require("fs");
var spawn = require('child_process').spawn
var xml2js = require('xml2js');
var util = require('util');
var builder = require('xmlbuilder');
var parser = new xml2js.Parser();
var Serializer = require("./Serializer");
var Deserializer = require('./Deserializer')

module.exports = function() {

function quicklog(s) {
  var logpath = "/tmp/quick.log";
  var fs = require('fs');
  s = s.toString().replace(/\r\n|\r/g, '\n'); // hack
  var fd = fs.openSync(logpath, 'a+', 0666);
  fs.writeSync(fd, s + '\n');
  fs.closeSync(fd);
}

return {

methodCall: function(methodName,data,cb){

        var xml = Serializer.serializeMethodCall(methodName, data);

        var deserializer = new Deserializer();

        //var scriptPath = "/home/teselagen/j5service/j5Interface.pl";
        var scriptPath = "/Users/rpavez/bin/downstream.pl";
        var newChild = spawn('/usr/bin/perl', ['-t',scriptPath]);
        console.log("J5 Process started with pid: "+newChild.pid);

		deserializer.deserializeMethodResponse(newChild.stdout, function(err,data){
			cb(false,data);
		});

}

};

};
