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

directory(DOCSROOT);

task("jsduck", [DOCSROOT], function() {
    var JSDUCK_OUT = DOCSROOT + "/jsduck";
    if (fs.existsSync(JSDUCK_OUT)) {
	jake.rmRf(JSDUCK_OUT);
    }
    var cmd = util.format("jsduck biojs/src vede/app/teselagen vede/app/controller " + 
        "vede/app/view " + 
        "--external=Ext.Base,Ext.data.Model,Ext.util.Observable,Ext.util.Memento," +
        "Ext.Error,Ext.Ajax,Ext.data.Store,Ext.data.XmlStore,Ext.data.reader.Xml," +
        "Ext.draw.Sprite,Ext.draw.CompositeSprite,Ext.util.HashMap,Ext.window.MessageBox," +
        "Ext.app.Controller,Ext.direct.Event,Ext.MessageBox,Ext.data.proxy.Rest," + 
        "Ext.draw.Component,Ext.container.Container,Ext.window.Window,FileInputHTMLElement," +
        "Ext.container.Viewport,Ext.panel.Panel,Ext.tab.Panel,Ext.ux.ItemSelector," +
        "Ext.toolbar.Toolbar,Ext.form.Panel,Ext.ux.form.MultiSelect,Ext.ux.form.ItemSelector " +
        "--output %s 2>/tmp/jsduck.err", JSDUCK_OUT);
    console.log(cmd);
    jake.exec([cmd]);
});

task("jsdoc", [DOCSROOT], function() {
    var JSDOC_OUT = DOCSROOT + "/jsdoc";
    if (fs.existsSync(JSDOC_OUT)) {
	jake.rmRf(JSDOC_OUT);
    }
    var cmd = util.format("./lib/jsdoc/jsdoc -d %s node/development.js " +
	"node/config.js node/routes/api.js node/routes/ice.js node/routes/j5.js " + 
        "node/routes/j5rpc.js node/schemas/DBSchemas.js " +
        "2>/tmp/jsdoc.err", JSDOC_OUT);
    console.log(cmd);
    jake.exec([cmd]);
});
