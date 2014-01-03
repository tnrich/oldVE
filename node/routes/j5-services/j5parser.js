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

function processNonCombinatorial_MOCK(lines,cb){
    try {
        console.log("Processing processNonCombinatorial_MOCK");

        var obj = {};
        /* Lines by line processing */
        
        // Type of assembly and date
        obj.date = lines.splice(0,1)[0];
        // Cite
        obj.cite = lines.splice(0,1)[0];

        lines.splice(0,1)[0]; // Empty space

        //Assembly Parameteres
        obj.assemblyParameters = {};
        lines.splice(0,1)[0]; //Assembly parameters title
        var params = lines.splice(0,1)[0].split(',');
        var values = lines.splice(0,1)[0].split(',');

        params.forEach(function(val,key){
            obj.assemblyParameters[val] = values[key];
        });

        lines.splice(0,1)[0]; // Empty space

        //Warnings
        obj.warnings = [];
        var currentWarning = lines.splice(0,1)[0];
        while(currentWarning.match(/"Note:/) !== null)
        {
            obj.warnings.push({"message": currentWarning});
            currentWarning = lines.splice(0,1)[0]; // Empty space after warnings
        }

        obj.note = currentWarning; // In this method there is not space between warnings and note

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

        lines.splice(0,1)[0]; // Extra empty space
        
        //Warnings
        var currentWarning = lines.splice(0,1)[0];
        while(currentWarning.match(/"Warning:/) !== null)
        {
            obj.warnings.push({"message": currentWarning});
            currentWarning = lines.splice(0,1)[0]; // Empty space after warnings
        }

        //Target Parts
        //lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Part
        lines.splice(0,1)[0]; //Columns

        console.log(lines);

        obj.targetParts = [];
        var currentPart = lines.splice(0,1)[0];
        while(currentPart!== "")
        {
            splitted = currentPart.split(',');
            // "ID Number",Name"
            obj.targetParts.push({
                order: splitted[0],
                id: splitted[1],
                name: splitted[2],
                direction: splitted[3],
                strategy: splitted[4]
            });
            currentPart = lines.splice(0,1)[0];
        }

        lines.splice(0,1)[0]; // Extra empty space

        //Final Assembled Vector
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.finalAssembledVector = [];
        var currentLine = lines.splice(0,1)[0];
        while(currentLine!== "" && currentLine != null)
        {
            var splitted = currentLine.split(',');  // Length,Sequence

            obj.finalAssembledVector.push({
                length: splitted[0],
                sequence: splitted[1]
            });
            currentLine = lines.splice(0,1)[0];
        }


        cb(obj);
    
        }
    catch(err)
        {
            console.log("Error processing j5 output");
            console.log(err);
            cb({warnings:["Error processing j5 output: " + err]});
        }
}

function processNonCombinatorial_SLIC_GIBSON_CPEC(lines,cb){
    try {
        console.log("Processing processNonCombinatorial_SLIC_GIBSON_CPEC");

        var obj = {};
        /* Lines by line processing */
        
        // Type of assembly and date
        obj.date = lines.splice(0,1)[0];
        // Cite
        obj.cite = lines.splice(0,1)[0];

        lines.splice(0,1)[0]; // Empty space

        //Assembly Parameteres
        obj.assemblyParameters = {};
        lines.splice(0,1)[0]; //Assembly parameters title
        var params = lines.splice(0,1)[0].split(',');
        var values = lines.splice(0,1)[0].split(',');

        params.forEach(function(val,key){
            obj.assemblyParameters[val] = values[key];       
        });

        lines.splice(0,1)[0]; // Empty space

        //Warnings
        obj.warnings = [];
        var currentWarning = lines.splice(0,1)[0];
        while(currentWarning.match(/"Warning:/) !== null)
        {
            obj.warnings.push({"message": currentWarning});
            currentWarning = lines.splice(0,1)[0]; // Empty space after warnings
        }

        obj.note = currentWarning; // In this method there is not space between warnings and note

        lines.splice(0,1)[0]; //Empty space


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

        lines.splice(0,1)[0]; // Extra empty space
        
        //Warnings
        var currentWarning = lines.splice(0,1)[0];
        while(currentWarning.match(/"Warning:/) !== null)
        {
            obj.warnings.push({"message": currentWarning});
            currentWarning = lines.splice(0,1)[0]; // Empty space after warnings
        }

        lines.splice(0,1)[0]; //Empty space

        //Target Parts
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Part
        lines.splice(0,1)[0]; //Columns

        obj.targetParts = [];
        var currentPart = lines.splice(0,1)[0];
        while(currentPart!== "")
        {
            splitted = currentPart.split(',');
            // "ID Number",Name"
            obj.targetParts.push({
                order: splitted[0],
                id: splitted[1],
                name: splitted[2],
                direction: splitted[3],
                strategy: splitted[4]
            });
            currentPart = lines.splice(0,1)[0];
        }

        // Extra warnings
        lines.splice(0,1)[0]; //Extra empty space

        var currentLine = lines.splice(0,1)[0];
        if(currentLine.match(/Warning:/))
        {
            obj.warnings.push({"message": currentLine});
            currentLine = lines.splice(0,1)[0];
        }
        else lines.splice(0,0,currentLine)[0];

        lines.splice(0,1)[0]; // Empty space

        //"Incompatibilities between Assembly Pieces:"
        lines.splice(0,1)[0]; //Columns

        obj.Incompatibilities = [];
        var currentAssembly = lines.splice(0,1)[0];
        while(currentAssembly!== "")
        {
            var splitted = currentAssembly.split(',');

            obj.Incompatibilities.push({
                id: splitted[0],
                left_end: splitted[1],
                right_end: splitted[2]
            });
            currentAssembly = lines.splice(0,1)[0];
        }

        //"Suggested Assembly Piece Contigs For Hierarchical Assembly:"
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.suggestedAssemblyPieceContigs = [];
        var currentAssembly = lines.splice(0,1)[0];
        while(currentAssembly!== "")
        {
            var splitted = currentAssembly.split(',');  // "Suggested Assembly Piece Contigs For Hierarchical Assembly:"

            obj.suggestedAssemblyPieceContigs.push({
                contig: splitted[0],
                assembly_piece_container: splitted[1]
            });
            currentAssembly = lines.splice(0,1)[0];
        }

        //Oligo Synthesis
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.oligoSynthesis = [];
        var currentLine = lines.splice(0,1)[0];
        while(currentLine!== "")
        {
            var splitted = currentLine.split(',');  // "ID Number",Name,"First Target Part","Last Target Part",Length,Tm,"Tm (3' only)",Cost,Sequence

            obj.oligoSynthesis.push({
                id_number: splitted[0],
                name: splitted[1],
                first_target_part: splitted[2],
                last_target_part: splitted[3],
                length: splitted[4],
                tm: splitted[5],
                tm3: splitted[6],
                cost: splitted[7],
                sequence: splitted[8]
            });
            currentLine = lines.splice(0,1)[0];
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

        // Assembly Pieces (SLIC/GIBSON/CPEC)
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.assemblyPieces = [];
        var currentPiece = lines.splice(0,1)[0];
        while(currentPiece!== "")
        {
            splitted = currentPiece.split(',');
            // "ID Number",Type,"Type ID Number",Part(s),"Overhang with Previous","Overhang with Next","Relative Overhang Position","Sequence Length",Sequence
            obj.assemblyPieces.push({
                id_number: splitted[0],
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

        // Extra warnings

        var currentLine = lines.splice(0,1)[0];
        if(currentLine.match(/Warning:/))
        {
            obj.warnings.push({"message": currentLine});
            currentLine = lines.splice(0,1)[0];
        }
        else lines.splice(0,0,currentLine)[0];


        //Final Assembled Vector
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.finalAssembledVector = [];
        var currentLine = lines.splice(0,1)[0];
        while(currentLine!== "" && currentLine != null)
        {
            var splitted = currentLine.split(',');  // Length,Sequence

            obj.finalAssembledVector.push({
                length: splitted[0],
                sequence: splitted[1]
            });
            currentLine = lines.splice(0,1)[0];
        }


        cb(obj);
    
        }
    catch(err)
        {
            console.log("Error processing j5 output");
            console.log(err);
            cb({warnings:["Error processing j5 output: " + err]});
        }   
}

function processNonCombinatorial_GOLDEN_GATE(lines,cb){
    try {
        console.log("Processing processNonCombinatorial_GOLDEN_GATE");

        var obj = {};
        /* Lines by line processing */
        
        // Type of assembly and date
        obj.date = lines.splice(0,1)[0];
        // Cite
        obj.cite = lines.splice(0,1)[0];

        lines.splice(0,1)[0]; // Empty space

        //Assembly Parameteres
        obj.assemblyParameters = {};
        lines.splice(0,1)[0]; //Assembly parameters title
        var params = lines.splice(0,1)[0].split(',');
        var values = lines.splice(0,1)[0].split(',');

        params.forEach(function(val,key){
            obj.assemblyParameters[val] = values[key];       
        });

        lines.splice(0,1)[0]; // Empty space

        //Warnings
        obj.warnings = [];
        var currentWarning = lines.splice(0,1)[0];
        while(currentWarning.match(/"Warning:/) !== null)
        {
            obj.warnings.push({"message": currentWarning});
            currentWarning = lines.splice(0,1)[0]; // Empty space after warnings
        }

        obj.note = currentWarning; // In this method there is not space between warnings and note

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

        lines.splice(0,1)[0]; // Extra empty space
        
        //Warnings
        var currentWarning = lines.splice(0,1)[0];
        while(currentWarning.match(/"Warning:/) !== null)
        {
            obj.warnings.push({"message": currentWarning});
            currentWarning = lines.splice(0,1)[0]; // Empty space after warnings
        }

        lines.splice(0,1)[0] //Empty space

        //Target Parts
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Part
        lines.splice(0,1)[0]; //Columns

        obj.targetParts = [];
        var currentPart = lines.splice(0,1)[0];
        while(currentPart!== "")
        {
            splitted = currentPart.split(',');
            // "ID Number",Name"
            obj.targetParts.push({
                order: splitted[0],
                id: splitted[1],
                name: splitted[2],
                direction: splitted[3],
                strategy: splitted[4]
            });
            currentPart = lines.splice(0,1)[0];
        }

        lines.splice(0,1)[0]; //Extra empty space

        //Oligo Synthesis
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.oligoSynthesis = [];
        var currentLine = lines.splice(0,1)[0];
        while(currentLine!== "")
        {
            var splitted = currentLine.split(',');  // "ID Number",Name,"First Target Part","Last Target Part",Length,Tm,"Tm (3' only)",Cost,Sequence

            obj.oligoSynthesis.push({
                id_number: splitted[0],
                name: splitted[1],
                first_target_part: splitted[2],
                last_target_part: splitted[3],
                length: splitted[4],
                tm: splitted[5],
                tm3: splitted[6],
                cost: splitted[7],
                sequence: splitted[8]
            });
            currentLine = lines.splice(0,1)[0];
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

        // Assembly Pieces (GOLDEN-GATE)
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.assemblyPieces = [];
        var currentPiece = lines.splice(0,1)[0];
        while(currentPiece!== "")
        {
            splitted = currentPiece.split(',');
            // "ID Number",Type,"Type ID Number",Part(s),"Overhang with Previous","Overhang with Next","Relative Overhang Position","Sequence Length",Sequence
            obj.assemblyPieces.push({
                id_number: splitted[0],
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

        //Final Assembled Vector
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.finalAssembledVector = [];
        var currentLine = lines.splice(0,1)[0];
        while(currentLine!== "" && currentLine != null)
        {
            var splitted = currentLine.split(',');  // Length,Sequence

            obj.finalAssembledVector.push({
                length: splitted[0],
                sequence: splitted[1]
            });
            currentLine = lines.splice(0,1)[0];
        }


        cb(obj);
    
        }
    catch(err)
        {
            console.log("Error processing j5 output");
            console.log(err);
            cb({warnings:["Error processing j5 output: " + err]});
        }   
}

function processNonCombinatorial(method,file,cb) {
    console.log('Processing non combinatorial.');
    console.log(method);
    var lines = file.fileContent.split(/\r?\n/);
    var obj = {};

    /* First step is identify assembly */
    /*
        Mock
        Golden-gate
        SLIC/Gibson/CPEC
    */

    type = method;
    console.log(method);

    if(type.match(/Mock/)) return processNonCombinatorial_MOCK(lines,cb);
    else if(type.match(/SLIC\/Gibson\/CPEC/)) return processNonCombinatorial_SLIC_GIBSON_CPEC(lines,cb);
    else if(type.match(/GoldenGate/)) return processNonCombinatorial_GOLDEN_GATE(lines,cb);
    else
    {
        return cb({warnings:["Wrong assembly method"]});
    }
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
            cb({warnings:["Error processing j5 output: " + err]});
        }
}

function processCombinatorial_SLIC_GIBSON_CPEC(lines,cb){
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

        nextLine = lines.splice(0,1)[0];
        if(nextLine.match(/design:/))
        {
            obj.warnings.push({"message": nextLine});
            lines.splice(0,1)[0];
        }
        else lines.splice(0,0,nextLine)[0];

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

        // Assembly Pieces (SLIC/Gibson/CPEC)
        lines.splice(0,1)[0]; //Header
        lines.splice(0,1)[0]; //Columns

        obj.assemblyPieces = [];
        var currentAssemblyPiece = lines.splice(0,1)[0];
        while(currentAssemblyPiece!== "")
        {
            splitted = currentAssemblyPiece.split(',');
            // "ID Number",Type,"Type ID Number",Part(s),"Relative Overlap Position","Extra 5' CPEC bps","Extra 3' CPEC bps","CPEC Tm Next","Overlap with Next (bps)","Overlap with Next","Overlap with Next Reverse 
            obj.assemblyPieces.push({
                id: splitted[0],
                type: splitted[1],
                type_id: splitted[2],
                relative_overhang_position: splitted[3],
                extra_5_cpec_bps: splitted[4],
                extra_3_cpec_bps: splitted[5],
                cpec_tm_next: splitted[6],
                overlap_with_next_bps: splitted[7],
                overlap_with_next: splitted[8],
                overlap_with_next_reverse_complement: splitted[9],
                sequence_length: splitted[10],
                sequence: splitted[11]
            });
            currentAssemblyPiece = lines.splice(0,1)[0];
        }

        //Combination of Assembly Pieces
        lines.splice(0,1)[0]; //Header
        var binLine = lines.splice(0,1)[0]; //???
        lines.splice(0,1)[0]; //Columns

        var binCount = (binLine.split("Bin").length-1);
        console.log(binCount);

        obj.combinationPieces = [];
        var currentCombinatorialPiece = lines.splice(0,1)[0];
        while(currentCombinatorialPiece!== "")
        {
            binCombinationPieces = [];
            splitted = currentCombinatorialPiece.split(',');
            for (var i =0; i<binCount; i++) {
                binCombinationPieces.push({
                    parts: splitted[i+(3+i)]
                });
            }
            obj.combinationPieces.push({
                partsContained: binCombinationPieces
            });
            // obj.combinationPieces.push({
            //     variant: splitted[0],
            //     bin0: splitted[3],
            //     bin1: splitted[5]
            // });
            currentCombinatorialPiece = lines.splice(0,1)[0];
        }

        cb(obj);

        }
    catch(err)
        {
            console.log("Error processing j5 output");
            console.log(err);
            cb({warnings:["Error processing j5 output: " + err]});
        }
}

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
        var currentAssemblyPiece = lines.splice(0,1)[0];
        while(currentAssemblyPiece!== "")
        {
            splitted = currentAssemblyPiece.split(',');
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
            currentAssemblyPiece = lines.splice(0,1)[0];
        }

        //Combination of Assembly Pieces
        lines.splice(0,1)[0]; //Header
        binLine = lines.splice(0,1)[0]; //???
        lines.splice(0,1)[0]; //Columns

        var binCount = (binLine.split("Bin").length-1);
        console.log(binCount);

        obj.combinationPieces = [];
        var currentCombinatorialPiece = lines.splice(0,1)[0];
        while(currentCombinatorialPiece!== "")
        {
            var binCombinationPieces = [];
            splitted = currentCombinatorialPiece.split(',');
            for (var i =0; i<binCount; i++) {
                binCombinationPieces.push({
                    parts: splitted[i+(3+i)]
                });
            }
            obj.combinationPieces.push({
                partsContained: binCombinationPieces
            });
            currentCombinatorialPiece = lines.splice(0,1)[0];
        }

        cb(obj);

        }
    catch(err)
        {
            console.log("Error processing j5 output");
            console.log(err);
            cb({warnings:["Error processing j5 output: " + err]});
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

function processAssemblies(files,cb) {
    console.log('processing files');
    console.log(files);
    console.log(typeof files);
    console.log(files.length);

    return cb([{sizeBP: 0, fileContent: ""}]);

    for(var i = 0; i < files.length; i++) {
        var match;
        var sequence;
        var fileExtension = "";
        var fileExtensionMatch = file.fileContent.match(/\.(\w+)$/);

        console.log(fileExtensionmatch);

        if(fileExtensionMatch) {
            fileExtension = fileExtensionMatch[1].toLowerCase();
        }


        if(fileExtension = "gb" || fileExtension = "genbank") {
            // Find something in the form " ## bp"
            match = file.fileContent.match(/\s(\d+)\sbp/);

            if(match && match[1]) {
                file.sizeBP = Number(match[1]);
            }
        } else if(fileExtension = "fas" || fileExtension = "fasta") {
            // Grab all characters after the first line starting with ">"
            match = file.fileContent.match(/\s*>.*?\n(.+)>?^/);

            console.log(match);

            if(match) {
                sequence = match[1];
                file.sizeBP = sequence.length;
            }
        } else if(fileExtension = "xml") {
            console.log('woo');
            file.sizeBP = 0;
        } else {
            console.log('wee');
            file.sizeBP = 0;
        }

        if(!file.sizeBP) {
            file.sizeBP = 0;
        }
    }

    return cb(files);
}

function processj5Parameters(file,cb){
    console.log('processing j5 parameters');
    console.log(file.fileContent);
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

var processJ5Response = function(method,encodedFileData,callback) {
    console.log('processing j5 response');
    var decodedFile = new Buffer(encodedFileData, 'base64').toString('binary');

    var zip = new require('node-zip')(decodedFile, {base64: false, checkCRC32: true});

    var files = {};
    files.assemblies = [];
    files.combinatorial = {}; // Combinatorial Assembly
    files.eugenerules = {};
    files.j5parameters = {};
    files.j5plasmids = {};
    files.mastersequences = {};
    files.targetpartsorder = {};
    files.partslist = {};
    files.zips = [];
    files.assembly = {}; // Non Combinatorial Assembly
    files.masterSources = {};
    
    for(var file in zip.files)
    {

        var fileName = zip.files[file]['name'];
        var newFile = {
            name: zip.files[file]['name'],
            size: zip.files[file]['data'].length,
            fileContent: zip.files[file]['data']
        };

        if     ( fileName.match(/\w+.(\w+)/)[1] == "gb" )           files.assemblies.push(newFile);
        else if( fileName.match(/\w+.(\w+)/)[1] == "xml" )          files.assemblies.push(newFile);
        else if( fileName.match(/\w+.(\w+)/)[1] == "fas" )          files.assemblies.push(newFile);
        else if( fileName.match(/.+combinatorial.csv/) )            files.combinatorial = newFile;
        else if( fileName.match(/.+\d\d.csv/) )                     files.assembly = newFile;
        else if( fileName.match(/eugeneruleslist.eug/) )            files.eugenerules = newFile;
        else if( fileName.match(/j5parameters.csv/) )               files.j5parameters = newFile;
        else if( fileName.match(/mastersequences.csv/) )            files.mastersequences = newFile;
        else if( fileName.match(/partslist.csv/) )                  files.partslist = newFile;
        else if( fileName.match(/targetpartsorder.csv/) )           files.targetpartsorder = newFile;
        else if( fileName.match(/masterplasmidlist.csv/) )          files.masterSources.masterplasmidlist = newFile;
        else if( fileName.match(/masteroligolist.csv/) )            files.masterSources.masteroligolist = newFile;
        else if( fileName.match(/masterdirectsyntheseslist.csv/) )  files.masterSources.masterdirectsyntheseslist = newFile;
        else if( fileName.match(/\w+.(\w+)/)[1] == "zip" )          files.zips.push(newFile);
        else console.log("Warning, file "+newFile.name+" not processed");
    }


    var parsed = {};

    // Parallel processing

    async.parallel({

        masterSources: function(callback){
                    callback(null, files.masterSources);
        },
        combinatorialAssembly: function(callback){
            //processAssemblies(files.assemblies,
                //function(){
                    callback(null, {"temp":"empty"});
                //});
        },

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
        processedData: function(callback){
            if(method.match(/Combinatorial/))
            {
                processCombinatorial(files.combinatorial,
                    function(data){
                        callback(null, data);
                    });
            }
            else
            {
                processNonCombinatorial(method,files.assembly,
                    function(data){
                        callback(null, data);
                    });
            }                
        }
    },
    function(err, results) {
        //quicklog( require('util').inspect(results) );
        var warnings = '';
        console.log('async results');
        console.log(results);
        if(results.processedData.warnings) warnings = results.processedData.warnings;
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
