var fs = require("fs");
var util = require("util");
var WEBROOT, DOCSROOT; 
var USESUDO=false;

if (process.platform == "darwin") {
    WEBROOT = "/Library/WebServer/Documents";
    DOCSROOT = WEBROOT + "/docs";
}
else if (process.platform == "linux") {
    WEBROOT = "/var/www/webroot";
    DOCSROOT = WEBROOT + "/dev.teselagen.com/docs";
    USESUDO = true;
}

directory(DOCSROOT);

task("jsduck", [DOCSROOT], function() {
    var JSDUCK_OUT = DOCSROOT + "/jsduck";
    if (fs.existsSync(JSDUCK_OUT)) {
	exec("rm -rf " + JSDUCK_OUT, USESUDO);
    }
    var cmd = util.format("jsduck biojs/src vede/app/teselagen vede/app/controller " + 
        "vede/app/view extjs/src --builtin-classes --images extjs/docs/images " + 
        "--external=XMLHttpRequest,FileInputHTMLElement," +
        "Ext.ux.ItemSelector,Ext.ux.form.MultiSelect,Ext.ux.form.ItemSelector " +
        "--output %s 2>/tmp/jsduck.err", JSDUCK_OUT);
    exec(cmd, USESUDO);
});

task("jsdoc", [DOCSROOT], function() {
    var JSDOC_OUT = DOCSROOT + "/jsdoc";
    if (fs.existsSync(JSDOC_OUT)) {
	jake.rmRf(JSDOC_OUT);
    }
    var cmd = util.format("./lib/jsdoc3/jsdoc -d %s node/development.js " +
	"node/config.js node/routes/api.js node/routes/ice.js node/routes/j5.js " + 
        "node/routes/j5rpc.js node/schemas/DBSchemas.js " +
        "2>/tmp/jsdoc.err", JSDOC_OUT);
    cmd = USESUDO ? "sudo " + cmd : cmd;
    console.log(cmd);
    jake.exec([cmd]);
});

task("docs", ["jsduck", "jsdoc"]);

function exec(pCmd, pUseSudo) {
    var cmd = pUseSudo ? "sudo "+ pCmd : pCmd;
    console.log(cmd);
    jake.exec([cmd]);
}