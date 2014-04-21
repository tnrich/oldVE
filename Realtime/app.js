// cd "JavaScript workplace"\OT_Test001
// http://localhost:8888/index.html
// http://noseblunt:8888/index.html

var fs = require('fs');
var http = require('http');
var socketio = require('socket.io');
var url = require("url");
var path = require("path");

var CONSTANTS = require("./shared/Constants");
var EVENTS = CONSTANTS.EVENTS;
var ot = require("./shared/ot");
var sequenceModels = require("./shared/SequenceModels");
var Sequence = sequenceModels.Sequence;
var Feature = sequenceModels.Feature;

var SAMPLE_VARS = require("./server/SampleVars");


var OtServer = require("./server/OtServer");


var port = process.argv[2] || 8888;

var app = http.createServer(function(request, response) {
	var uri = url.parse(request.url).pathname;
	
	var filename = path.join(process.cwd(), uri);
	
	var contentTypesByExtension = {
		'.html': "text/html",
	    '.css':  "text/css",
	    '.js':   "text/javascript"
	};
	
	path.exists(filename, function(exists) {
		if(!exists) {
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
			return;
	    }
	    
	    fs.readFile(filename, "binary", function(err, file) {
		    if(err) {
		    	response.writeHead(500, {"Content-Type": "text/plain"});
			    response.write(err + "\n");
			    response.end();
			    return;
		    }
		    
		    var headers = {};
		    var contentType = contentTypesByExtension[path.extname(filename)];
		    if(contentType) headers["Content-Type"] = contentType;
		    response.writeHead(200, headers);
		    response.write(file, "binary");
		    response.end();
	    });
	});
}).listen(parseInt(port, 10));


/*var sequence = sequenceModels.Sequence.fromJson(JSON.parse(SAMPLE_VARS.seq1));
var operations = [];*/

var io = socketio.listen(app);

// The following line of code was added because Apache/2.2.25 only
// supports xhr-polling and jsonp-polling (I think). Otherwise, there
// was a 5-7 second delay before the client would get connected, which
// was annoying. If no delay is present, then probably delete the following
// line of code.
io.set("transports", ["xhr-polling", "jsonp-polling"]);

var otServer = new OtServer(io);


