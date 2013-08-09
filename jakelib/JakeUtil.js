var child_process = require("child_process");
var execSync = require("exec-sync");

exports.exec = function(pCmd) {
    console.log(pCmd);
    var out = execSync(pCmd, true);
    console.log(out);
}


/**
 * @param {String} cmd
 * @param {Array} args
 */
exports.spawn = function(pCmd, pArgs) {
    console.log("Command: %s %s", pCmd, pArgs.join(" "));
    var child = child_process.spawn(pCmd, pArgs, {stdio: "inherit"});
    child.on("exit", function(pCode) {
	var rc = pCode || 0;
	process.exit(rc);
    });
}
