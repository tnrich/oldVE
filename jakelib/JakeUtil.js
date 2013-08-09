var child_process = require("child_process");
var execSync = require("exec-sync");
var util = require("util");

exports.exec = function(pCmd) {
    console.log(pCmd);
    var out = execSync(pCmd, true);
    console.log(out);
}


/**
 * @param {String} cmd
 * @param {Array} [args]
 * @param {Object} [opts]
 */
exports.spawn = function(pCmd, pArgs, pOpts) {
    var args = pArgs || [];
    var opts = {stdio: "inherit"};
    if (pOpts) {
	if (pOpts.cwd) {
	    opts.cwd = pOpts.cwd;
	    console.log("Working directory: ", opts.cwd);
	}
    }
    var cmdstr = util.format("%s %s",  pCmd, pArgs.join(" "));
    cmdstr = "Command: " + cmdstr;
    console.log(cmdstr);
    var child = child_process.spawn(pCmd, args, opts);
    child.on("exit", function(pCode) {
	var rc = pCode || 0;
	process.exit(rc);
    });
}
