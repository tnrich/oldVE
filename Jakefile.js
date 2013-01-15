var fs = require("fs");
var util = require("util");
var WEBROOT, DOCSROOT;

if (process.platform == "darwin") {
    WEBROOT = "/Library/WebServer/Documents";
    DOCSROOT = WEBROOT + "/docs";
}
else if (process.platform == "linux") {
    WEBROOT = "/var/www/webroot";
    DOCSROOT = WEBROOT + "/dev.teselagen.com/docs";
}

task("docs", function() {
    if (fs.existsSync(DOCSROOT)) {
	jake.rmRf(DOCSROOT);
    }
    var cmd = util.format("jsduck -v vede/app/teselagen biojs/src" + 
			  " --output %s 2>/tmp/jsduck.err", DOCSROOT);
    console.log(cmd);
    jake.exec([cmd]);
});
