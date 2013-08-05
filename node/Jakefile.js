/*global complete, fail, jake, process, task*/

var _s = require("underscore.string");
var fs = require("fs");
var util = require("util");
var DbManager = require("./manager/DbManager")();
var ApiManager = require("./manager/ApiManager")();
var JakeUtil = require("../jakelib/JakeUtil");
var apiManager;
var dbManager;
var env = process.env.env || "dev";

if (! (env==="dev" || env==="test" || env==="alpha" || env==="beta" || env==="prod")) {
    console.log("Invalid environment:" + env);
    process.exit();
}

var pm2name = _s.capitalize(env);
var dbname = "teselagen" + pm2name;


// Jake 'complete' event listener
jake.addListener("complete", function () {
    if (dbManager) {
        dbManager.closeMongoose();
    }
    process.exit();
});

/*
 * Node tasks
 */

// Patch node_modules
task("patchNode", function() {
    var cmd = "cd resources/utils; ./patchDependencies.sh";
    JakeUtil.exec(cmd);
});

//directory("log");

task("startNode", function() {
    var startNodeCmd = "pm2 start processes.json";
    JakeUtil.exec(startNodeCmd);
});

task("stopNode", function() {
    var stopNodeCmd = "pm2 kill";
    JakeUtil.exec(stopNodeCmd);
});

task("restartNode", function() {
    var restartNodeCmd = "pm2 restartAll";
    JakeUtil.exec(restartNodeCmd);
});

task("logNode", function() {
    var cmd = "sudo tail -f /root/.pm2/logs/" + pm2name + "-out.log";
    JakeUtil.exec(cmd);
});

/*
 *  Database tasks
 */

task("connectdb", function() {
    dbManager = new DbManager(dbname);
    dbManager.connectMongoose(function(pErr) {
        if (pErr) {
            fail(pErr);
        }
        else {
            require("./schemas/DBSchemas")(dbManager.mongoose);
            apiManager = new ApiManager(dbManager.mongoose);
            complete();
        }
    });
}, {async:true});

task("cleardb", function() {
    var cmd = util.format("mongo %s clear.js", dbname);
    JakeUtil.exec(cmd);
});

task("dropdb", function() {
    var cmd = util.format("mongo --eval 'db.dropDatabase()' %s", dbname);
    JakeUtil.exec(cmd);
});

task("resetdb", ["connectdb"], function() {
    apiManager.resetdb(function(pErr) {
        if (pErr) {
            fail(pErr);
        }
        complete();
    });
}, {async:true});

/*
 * Selenium
 */

var SEL_LOG = "/var/log/selenium";
var SEL_PID = SEL_LOG + "/selenium.pid";
task("seleniumStart", function() {
    var SEL_OUT = SEL_LOG + "/selenium.out";
    var SEL_ERR = SEL_LOG + "/selenium.err";
    var cmd = util.format("/usr/local/sbin/daemonize -c /root -e %s -o %s -p %s -l %s -v /usr/local/bin/java -Djava.awt.headless=true -jar /usr/local/lib/selenium/selenium-server-standalone-2.33.0.jar", SEL_ERR, SEL_OUT, SEL_PID, SEL_PID);
    JakeUtil.exec(cmd);
});

task("seleniumStop", function() {
    var pid = fs.readFileSync(SEL_PID);
    process.kill(pid);
    fs.unlinkSync(SEL_PID);
});
