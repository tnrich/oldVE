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

function processCombinatorial_MOCK(lines,cb){
    try {

        var obj = {};
        /* Lines by line processing */
        
        // Type of assembly and date
        obj.date = lines.splice(0,1)[0];
        // Cite
        obj.cite = lines.splice(0,1)[0];

        //Warnings
        obj.warnings = [];
        var currentWarning = lines.splice(0,1)[0];
        while(currentWarning.match(/"Warning:/) !== null)
        {
            obj.warnings.push({"message": currentWarning});
            currentWarning = lines.splice(0,1)[0]; // Empty space after warnings
        }

        //Assembly Parameteres
        obj.assemblyParameters = {};
        lines.splice(0,1)[0]; //Assembly parameters title
        var params = lines.splice(0,1)[0].split(',');
        var values = lines.splice(0,1)[0].split(',');

        params.forEach(function(val,key){
            obj.assemblyParameters[val] = values[key];       
        });

        lines.splice(0,1)[0] //Empty space

        obj.note = lines.splice(0,1)[0];

        lines.splice(0,1)[0] //Empty space


        //Non degenerate Part IDs and Sources
        lines.splice(0,1)[0]; // Header
        lines.splice(0,1)[0]; // ????
        lines.splice(0,1)[0]; // Columns Header

        obj.nondegenerateParts = [];
        var currentPart = lines.splice(0,1)[0];
        while(currentPart!== "")
        {
            splittedPart = currentPart.split(',');
            // ""ID Number",Name,"Source Plasmid","Reverse Complement","Start (bp)","End (bp)","Size (bp)",Sequence"
            obj.nondegenerateParts.push({
                id: splittedPart[0],
                name: splittedPart[1],
                source: splittedPart[2],
                revComp: splittedPart[3],
                startBP: splittedPart[4],
                stopBP: splittedPart[5],
                size: splittedPart[6],
                sequence: splittedPart[7]
            });
            currentPart = lines.splice(0,1)[0];
        }

        //Target Bins
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.targetBins = [];
        var currentBin = lines.splice(0,1)[0];
        while(currentBin!== "")
        {
            splittedBin = currentBin.split(',');
            // "ID Number",Name"
            obj.targetBins.push({
                id: splittedBin[0],
                name: splittedBin[1]
            });
            currentBin = lines.splice(0,1)[0];
        }

        //Combination of Parts
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //???
        lines.splice(0,1)[0]; //Columns

        obj.combinationParts = [];
        var currentPart = lines.splice(0,1)[0];
        while(currentPart!== "")
        {
            splittedPart = currentPart.split(',');
            
            binNumber = splittedPart.splice(0,1)[0];
            binName = splittedPart.splice(0,1)[0];

            obj.combinationParts.push({
                id: binNumber,
                name: binNumber,
                parts: splittedPart
            });
            currentPart = lines.splice(0,1)[0];
        }

        cb(obj);

        }
    catch(err)
        {
            console.log("Error processing j5 output");
            console.log(err);
            cb({warnings:["Error processing j5 output"]});
        }
}

function processCombinatorial_SLIC_GIBSON_CPEC(lines,cb){}

function processCombinatorial_GOLDEN_GATE(lines,cb){
    try {
        var obj = {};
        /* Lines by line processing */
        
        // Type of assembly and date
        obj.date = lines.splice(0,1)[0];
        // Cite
        obj.cite = lines.splice(0,1)[0];

        //Warnings
        obj.warnings = [];
        var currentWarning = lines.splice(0,1)[0];
        while(currentWarning.match(/"Warning:/) !== null)
        {
            obj.warnings.push({"message": currentWarning});
            currentWarning = lines.splice(0,1)[0]; // Empty space after warnings
        }

        //Assembly Parameteres
        obj.assemblyParameters = {};
        lines.splice(0,1)[0]; //Assembly parameters title
        var params = lines.splice(0,1)[0].split(',');
        var values = lines.splice(0,1)[0].split(',');

        params.forEach(function(val,key){
            obj.assemblyParameters[val] = values[key];       
        });

        lines.splice(0,1)[0] //Empty space

        obj.note = lines.splice(0,1)[0];

        lines.splice(0,1)[0] //Empty space


        //Non degenerate Part IDs and Sources
        lines.splice(0,1)[0]; // Header
        lines.splice(0,1)[0]; // ????
        lines.splice(0,1)[0]; // Columns Header

        obj.nondegenerateParts = [];
        var currentPart = lines.splice(0,1)[0];
        while(currentPart!== "")
        {
            splittedPart = currentPart.split(',');
            // ""ID Number",Name,"Source Plasmid","Reverse Complement","Start (bp)","End (bp)","Size (bp)",Sequence"
            obj.nondegenerateParts.push({
                id: splittedPart[0],
                name: splittedPart[1],
                source: splittedPart[2],
                revComp: splittedPart[3],
                startBP: splittedPart[4],
                stopBP: splittedPart[5],
                size: splittedPart[6],
                sequence: splittedPart[7]
            });
            currentPart = lines.splice(0,1)[0];
        }

        //Target Bins
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.targetBins = [];
        var currentBin = lines.splice(0,1)[0];
        while(currentBin!== "")
        {
            splittedBin = currentBin.split(',');
            // "ID Number",Name"
            obj.targetBins.push({
                id: splittedBin[0],
                name: splittedBin[1]
            });
            currentBin = lines.splice(0,1)[0];
        }

        //Oligo Synthesis
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.oligoSynthesis = [];
        var currentOligo = lines.splice(0,1)[0];
        while(currentOligo!== "")
        {
            splitted = currentOligo.split(',');
            // "ID Number",Name,Length,Tm,"Tm (3' only)",Cost,Sequence
            obj.oligoSynthesis.push({
                id: splitted[0],
                name: splitted[1],
                length: splitted[2],
                tm: splitted[3],
                tm_three: splitted[4],
                cost: splitted[5],
                sequence: splitted[6]
            });
            currentOligo = lines.splice(0,1)[0];
        }

        //PCR Reactions
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.pcrReactions = [];
        var currentPCR = lines.splice(0,1)[0];
        while(currentPCR!== "")
        {
            splitted = currentPCR.split(',');
            // "ID Number","Primary Template","Alternate Template","ID Number",Name,"ID Number",Name,Note,"Mean Oligo Tm","Delta Oligo Tm","Mean Oligo Tm (3' only)","Delta Oligo Tm (3' only)",Length,Sequence
            obj.pcrReactions.push({
                pcrReaction:
                    {
                        id: splitted[0],
                        primary_template: splitted[1],
                        alternate_template: splitted[2]
                    },
                forwardOligo:
                    {
                        id: splitted[3],
                        name: splitted[4]
                    },
                reverseOligo:
                    {
                        id: splitted[5],
                        name: splitted[6]
                    },
                note: splitted[7],
                mean_oligo: splitted[8]
            });
            currentPCR = lines.splice(0,1)[0];
        }

        // Assembly Pieces (Golden-gate)
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.assemblyPieces = [];
        var currentPiece = lines.splice(0,1)[0];
        while(currentPiece!== "")
        {
            splitted = currentPiece.split(',');
            // "ID Number",Type,"Type ID Number",Part(s),"Overhang with Previous","Overhang with Next","Relative Overhang Position","Sequence Length",Sequence
            obj.assemblyPieces.push({
                id: splitted[0],
                type: splitted[1],
                type_id: splitted[2],
                parts: splitted[3],
                overhang_with_next: splitted[4],
                relative_overhang_position: splitted[5],
                sequence_length: splitted[6],
                sequence: splitted[7]
            });
            currentPiece = lines.splice(0,1)[0];
        }

        //Combination of Assembly Pieces
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //???
        lines.splice(0,1)[0]; //Columns

        obj.combinationPieces = [];
        var currentPiece = lines.splice(0,1)[0];
        while(currentPiece!== "")
        {
            splittedPart = currentPiece.split(',');
            obj.combinationPieces.push({
                variant: splitted[0],
                bin0: splitted[1],
                bin1: splitted[2]
            });
            currentPiece = lines.splice(0,1)[0];
        }

        cb(obj);

        }
    catch(err)
        {
            console.log("Error processing j5 output");
            console.log(err);
            cb({warnings:["Error processing j5 output"]});
        }
}

function processCombinatorial(file,cb){
    var lines = file.fileContent.split(/\r?\n/);
    var obj = {};

    /* First step is identify assembly */
    /* 
        Combinatorial Mock
        Combinatorial Golden-gate 
        Combinatorial SLIC/Gibson/CPEC
    */

    type = lines[0];

    if(type.match(/Combinatorial Mock/)) return processCombinatorial_MOCK(lines,cb);
    else if(type.match(/Combinatorial SLIC\/Gibson\/CPEC/)) return processCombinatorial_SLIC_GIBSON_CPEC(lines,cb);
    else if(type.match(/Combinatorial Golden-gate/)) return processCombinatorial_GOLDEN_GATE(lines,cb);
    else
    {
        return cb({warnings:["Wrong assembly method"]});
    }


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
        //quicklog( require('util').inspect(results) );
        var warnings = results.combinatorialAssembly.warnings;
        return callback(results,warnings);
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
