var fs = require("fs");
var spawn = require('child_process').spawn;
var xml2js = require('xml2js');
var util = require('util');
var builder = require('xmlbuilder');
var parser = new xml2js.Parser();
var Serializer = require("./Serializer");
var Deserializer = require('./Deserializer');

module.exports = function(app) {

console.log("Using j5 debug instance");

function quicklog(s) {
  var logpath = "/tmp/quick.log";
  var fs = require('fs');
  s = s.toString().replace(/\r\n|\r/g, '\n'); // hack
  var fd = fs.openSync(logpath, 'a+', 0666);
  fs.writeSync(fd, s + '\n');
  fs.closeSync(fd);
}

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function UUIDLog(s,uuid,sub_name) {

  if(!uuid) uuid = randomUUID();
  if(!sub_name) sub_name = "";

  var logpath = "/tmp/j5_"+uuid+"_"+sub_name+".log";
  var fs = require('fs');
  s = s.toString().replace(/\r\n|\r/g, '\n'); // hack
  var fd = fs.openSync(logpath, 'a+', 0666);
  fs.writeSync(fd, s + '\n');
  fs.closeSync(fd);
}

return {

  methodCall: function(methodName,data,cb,cb2){

      console.log("Reading output from j5output.xml");

      var xml = Serializer.serializeMethodCall(methodName, data);
      var deserializer = new Deserializer();

      var filePath = require('path').resolve(__dirname,'../','../','j5output.xml');

      var readStream = app.fs.createReadStream(filePath);

      deserializer.deserializeMethodResponse(readStream, function(err,data){
        return cb(false,data);
      });

  }

};

};
