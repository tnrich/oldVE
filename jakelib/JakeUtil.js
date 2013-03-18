var execSync = require("exec-sync");

exports.exec = function(pCmd) {
    console.log(pCmd);
    var out = execSync(pCmd, true);
    console.log(out);
}