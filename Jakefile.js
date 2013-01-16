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
    var cmd = util.format("jsduck vede/app/teselagen biojs/src" + 
        " --external=Ext.Base,Ext.data.Model,Ext.util.Observable,Ext.util.Memento," +
        "Ext.Error,Ext.Ajax,Ext.data.Store,Ext.data.XmlStore,Ext.data.reader.Xml," +
        "Ext.draw.Sprite,Ext.draw.CompositeSprite,Ext.util.HashMap,Ext.window.MessageBox," +
        "FileInputHTMLElement" +
        " --output %s 2>/tmp/jsduck.err", DOCSROOT);
    console.log(cmd);
    jake.exec([cmd]);
});
