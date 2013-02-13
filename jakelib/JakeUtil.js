exports.exec = function(pCmd) {
    console.log(pCmd);
    jake.exec([pCmd], {printStdout:true, printStderr:true});
}