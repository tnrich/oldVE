var fs = require("fs");
var util = require("util");
var JakeUtil = require("./jakelib/JakeUtil");
var WEBROOT, DOCSROOT, cmd; 

if (process.platform == "darwin") {
    WEBROOT = "/Library/WebServer/Documents";
    DOCSROOT = WEBROOT + "/docs";
}
else if (process.platform == "linux") {
    WEBROOT = "/var/www/webroot";
    DOCSROOT = WEBROOT + "/dev.teselagen.com/docs";
}

directory(DOCSROOT);

task("jsduck", [DOCSROOT], function() {
    var JSDUCK_OUT = DOCSROOT + "/jsduck";
    if (fs.existsSync(JSDUCK_OUT)) {
	JakeUtil.exec("rm -rf " + JSDUCK_OUT);
    }
    var cmd = util.format("jsduck biojs/src vede/app/teselagen vede/app/controller " + 
        "vede/app/view extjs/src --builtin-classes --images extjs/docs/images " + 
        "--external=XMLHttpRequest,FileInputHTMLElement," +
        "Ext.ux.ItemSelector,Ext.ux.form.MultiSelect,Ext.ux.form.ItemSelector " +
        "--output %s 2>/tmp/jsduck.err", JSDUCK_OUT);
    JakeUtil.exec(cmd);
});

task("jsdoc", [DOCSROOT], function() {
    var JSDOC_OUT = DOCSROOT + "/jsdoc";
    if (fs.existsSync(JSDOC_OUT)) {
	JakeUtil.exec("rm -rf " + JSDOC_OUT);
    }
    var cmd = util.format("./lib/jsdoc3/jsdoc -d %s node/development.js " +
	"node/config.js node/routes/api.js node/routes/ice.js node/routes/j5.js " + 
        "node/routes/j5rpc.js node/schemas/DBSchemas.js " +
        "node/manager " + 
        "2>/tmp/jsdoc.err", JSDOC_OUT);
    JakeUtil.exec(cmd);
});

task("docs", ["jsduck", "jsdoc"]);

task("loc", function() {
//cloc.pl biojs/src biojs/test/specs biojs/test/js biojs/test/*.js biojs/test/*.html
//cloc.pl node/*.js node/test node/routes node/schemas
//cloc.pl vede/*.js vede/*.html vede/app vede/test/specs vede/test/js vede/test/html
});

