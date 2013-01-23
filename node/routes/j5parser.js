var csv = require('csv');
var async = require('async');

/**
 * Write to quick log.
 * @param s
 */
function quicklog(s) {
  var logpath = "/tmp/quick.log";
  var fs = require('fs');
  s = s.toString().replace(/\r\n|\r/g, '\n'); // hack
  var fd = fs.openSync(logpath, 'a+', 0666);
  fs.writeSync(fd, s + '\n');
  fs.closeSync(fd);
}

function processAssemblies(file,cb){
    cb(file);
}

function processCombinatorial(file,cb){
    cb({nonDegenerativeParts:file.fileContent});
}

function processj5Parameters(file,cb){
    csv().from( file.fileContent ).to.array( function(data, count){
        var obj = {};
        for(var l in data)
        {
            line = data[l];
            obj[line[0]] = line[1];
        }
        cb(obj);
    });
}

var processJ5Response = function(encodedFileData,callback) {

    var decodedFile = new Buffer(encodedFileData, 'base64').toString('binary');

    var zip = new require('node-zip')(decodedFile, {base64: false, checkCRC32: true});

    var files = {};
    files.assemblies = [];
    files.combinatorial = {};
    files.eugenerules = {};
    files.j5parameters = {};
    files.j5plasmids = {};
    files.mastersequences = {};
    files.targetpartsorder = {};
    files.partslist = {};
    files.zips = [];

//
    
    for(var file in zip.files)
    {

        var fileName = zip.files[file]['name'];
        var newFile = {
            name: zip.files[file]['name'],
            size: zip.files[file]['data'].length,
            fileContent: zip.files[file]['data']
        };

        if( fileName.match(/\w+.(\w+)/)[1] == "gb" )       files.assemblies.push(newFile);
        else if( fileName.match(/.+combinatorial.csv/) )   files.combinatorial = newFile;
        else if( fileName.match(/eugeneruleslist.eug/) )   files.eugenerules = newFile;
        else if( fileName.match(/j5_plasmids.csv/) )       files.j5plasmids = newFile;
        else if( fileName.match(/j5parameters.csv/) )      files.j5parameters = newFile;
        else if( fileName.match(/mastersequences.csv/) )   files.mastersequences = newFile;
        else if( fileName.match(/partslist.csv/) )         files.partslist = newFile;
        else if( fileName.match(/targetpartsorder.csv/) )  files.targetpartsorder = newFile;
        else if( fileName.match(/\w+.(\w+)/)[1] == "zip" ) files.zips.push(newFile);
        else console.log("Warning, file "+newFile.name+" not processed");
    }


    var parsed = {};

    // Parallel processing

    async.parallel({

        assemblies: function(callback){
            processAssemblies(files.assemblies,
                function(assemblies){
                    callback(null, assemblies);
                });
        },

        j5parameters: function(callback){
            processj5Parameters(files.j5parameters,
                function(j5parameters){
                    callback(null, j5parameters);
                });
        },
        combinatorialAssembly: function(callback){
            processCombinatorial(files.combinatorial,
                function(combinatorial){
                    callback(null, combinatorial);
                });
        }
    },
    function(err, results) {
        quicklog( require('util').inspect(results) );
        return callback(results);
    });

    /*
    objResponse.files.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (b.name < a.name) return 1;
        return 0;
    });
    */

    //quicklog(JSON.stringify(files));

};

module.exports = processJ5Response;
