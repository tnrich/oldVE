/**
 * j5 RPC helper methods
 * @module ./routes/j5rpc
 */

var fs = require("fs");

/**
 * Loop and splice.
 */
var loopAndSplice = function(unordered) {
  for(var i = 0; i < unordered.length; i++) {
    for(var j = i + 1; j < unordered.length; j++) {
      if(unordered[i]&&unordered[j])
      {
        if(unordered[i]["hash"]&&unordered[j]["hash"])
            {
              if (unordered[i]["hash"] == unordered[j]["hash"]) {
                unordered.splice(j, 1);
                j--;
              }
            }
      }
      else
      {
          console.log("Error: sequence not found");
          return [];
      }
    }
  }
  return unordered;
}

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

/**
 * Generate encoded sequences list file
 * @param model
 * @returns {String} base64
 */
function encoded_sequences_list_file(model)
{
    var sequences = model["sequences"];

    var out ="Sequence File Name,Format\n";

    for( sequenceKey in sequences ) {
        var sequenceFile = sequences[sequenceKey];
        var format = (sequenceFile["sequenceFileFormat"]=="GENBANK") ? "Genbank" : sequenceFile["sequenceFileFormat"];
        var sequenceFileName = sequenceFile['sequenceFileName'];
        out += sequenceFileName+','+ format +'\n';
    };
    return new Buffer(out).toString('base64');
}

/**
 * Generate an encoded zipped sequences file.
 * @param model
 * @returns {String} base64
 */
function encoded_zipped_sequences_file(model)
{

    var parts = model["parts"];

    var zip = new require('node-zip')();

    for( partKey in parts )
    {
        var part = parts[partKey]; 
        var sequenceFile = model.sequences[part["sequencefile_id"]];
        var sequenceFileName = sequenceFile['sequenceFileName'];
        if(sequenceFile) zip.file(sequenceFileName, sequenceFile["sequenceFileContent"]);
        else console.log("Warning: Sequence file not found for generating zipped file"," looking for: ",part["sequencefile_id"]);
    }

    var data = zip.generate({base64:true,compression:'DEFLATE'});
    //quicklog(data);
    return data;
}

/**
 * Generate encoded parts list file
 * @param model
 * @returns {String} base64
 */
function encoded_parts_list_file(model)
{
    var out = "Part Name,Part Source (Sequence Display ID),Reverse Compliment?,Start (bp),End (bp)\n";

    var bins = model["bins"];

    //bins.forEach(function(bin){
    //    bin.cells.forEach(function(cell){
    for( var partKey in model.parts) {
            var part = model.parts[partKey];
            //var part = model.parts[cell.part_id];
            if(part)
            {
                var sequenceFile = model.sequences[part["sequencefile_id"]];
                if(sequenceFile)
                {
                    var sequenceName = "";
                    if (sequenceFile["sequenceFileFormat"]=="Genbank")
                        {
                            sequenceName = sequenceFile['sequenceFileContent'].match(/LOCUS +(\w+) +/);
                            if(sequenceName) sequenceName = sequenceName[1];
                            else 
                            {
                                sequenceName = sequenceFile['sequenceFileContent'].match(/LOCUS\s+([[a-zA-Z0-9~@#\^\$&\*\(\)-_\+=\[\]\{\}\|\\,\.\?]*|\-]+)/);
                                if(!sequenceName) console.log(JSON.stringify(sequenceFile['sequenceFileContent']));
                                else sequenceName = sequenceName[1];
                            }
                                //sequenceName = sequenceFile['sequenceFileContent'].match(/LOCUS\s+((\w|-)+).+/)[1];
                        }

                    if (sequenceFile["sequenceFileFormat"]=="jbei-seq") sequenceName = sequenceFile['sequenceFileContent'].match(/<seq:name>(.+)<\/seq:name>/)[1];
                    if (sequenceFile["sequenceFileFormat"]=="FASTA") sequenceName = sequenceFile['sequenceFileContent'].match(/>(.+)\n/)[1];
                    sequenceName = sequenceName;
                    out += part['name']+','+ sequenceName +','+part["revComp"].toString().toUpperCase()+','+part["genbankStartBP"]+','+part["endBP"]+'\n';
                }
                else
                {
                    console.log("Warning: Sequence file not found");
                }
            }
    }
    //    });
    //});
    //quicklog(out);
    return new Buffer(out).toString('base64');
}

/**
 * Generate encoded j5 parameters file
 * @param params
 * @returns {String} base64
 */
function encoded_j5_parameters_file(params)
{
    var out = "Parameter Name,Value\n";
    
    params["PRIMER_TM_SANTALUCIA"] = params["PRIMER_TM_SANTALUCIA"] ? 1 : 0;
    params["PRIMER_SALT_CORRECTIONS"] = params["PRIMER_SALT_CORRECTIONS"] ? 1 : 0;
    params["SUPPRESS_PURE_PRIMERS"] = params["SUPPRESS_PURE_PRIMERS"] ? "TRUE" : "FALSE";


    for(var prop in params) {
        out += prop + ',' + params[prop] + '\n';
    }
    //quicklog(out);
    return new Buffer(out).toString('base64');
}

/**
 * Generate encoded target part order list file
 * @param model
 * @returns {String} base64
 */
function encoded_target_part_order_list_file(model,method)
{


    var bins = model["bins"];

    var out = '(>Bin) or Part Name,Direction,Forced Assembly Strategy?,Forced Relative Overhang Position?,Direct Synthesis Firewall?,Extra 5\' CPEC overlap bps,Extra 3\' CPEC overlap bps\n';
    bins.forEach(function(bin){
        var direction = '';
        if(method.match(/Combinatorial/))
        {
            var tempOut = '';
            var dsfFirewall = '';
            var fas;
            bin.cells.forEach(function(cell,cellKey){
                var part = model.parts[cell.part_id];
                if(part)
                {
                    fas = (cell.fas === 'None') ? '' : cell.fas;
                    fro = (bin['fro'] === 'None') ? '' : bin['fro'];
                    direction = (bin["directionForward"] === 'true') ? 'forward' : 'reverse';
                    dsf = (bin['dsf'] === false) ? '' : '';
                    extra3PrimeBps = (bin['extra3PrimeBps'] === null) ? '' : bin['extra3PrimeBps'];
                    extra5PrimeBps = (bin['extra5PrimeBps'] === null) ? '' : bin['extra5PrimeBps'];

                    tempOut += part["name"] + ',' + direction + ',' + fas + ',' + fro + ',' + dsf + ',' + extra5PrimeBps + ',' + extra3PrimeBps + '\n';
                }
            });

            fas = "";
            var firstCell = bin.cells[0];
            if(firstCell) fas = (firstCell.fas === 'None') ? '' : firstCell.fas;
            tempBinHeader = '>' + bin["binName"] + ',' + ',' + fas + ',' + ',' + bin["dsf"] + ',' + ',' + '\n';
            out += tempBinHeader;
            out += tempOut;

        }
        else
        {
            direction = (bin["directionForward"] === 'true') ? 'forward' : 'reverse';
            //fas = (bin.parts[0]["fas"] === 'None') ? '' : bin.parts[0]["fas"];
            fas = bin.cells[0].fas;
            if(fas === 'None') fas = '';
            fro = (bin['fro'] === 'None') ? '' : bin['fro'];
            dsf = (bin['dsf'] === false) ? '' : bin['dsf'];
            extra3PrimeBps = (bin['extra3PrimeBps'] === null) ? '' : bin['extra3PrimeBps'];
            extra5PrimeBps = (bin['extra5PrimeBps'] === null) ? '' : bin['extra5PrimeBps'];

            out += model.parts[bin.cells[0].part_id]["name"] + ',' + direction + ',' + fas + ',' + fro + ',' + dsf + ',' + extra5PrimeBps + ',' + extra3PrimeBps + '\n';
        }
    });
    //quicklog(out);
    return new Buffer(out).toString('base64');
}

/**
 * Generate encoded Eugene rules list file
 * @param model
 * @returns {String} base64
 */
function encoded_eugene_rules_list_file(model)
{
    var partsIndex = model.parts;
    var eugenes = model["rules"];
    //console.log("Processing "+eugenes.length+" eugene rules");
    var out = "";
    
    eugenes.forEach(function(val,key){
        var name = val["name"];
        var operand1 = val["operand1_id"];
        var operator = val["compositionalOperator"];
        var operand2 = val["operand2_id"];
        var negationOperationModifier = (val["negationOperator"])? "NOT " : "";

        part1 = partsIndex[operand1];
        if(!val["operand2isNumber"])
        {
            part2 = partsIndex[operand2];            
            out += "Rule "+name+"("+negationOperationModifier+part1["name"]+" "+operator+" "+part2["name"]+");\n";
        }
        else
        {
            operand2 = val["operand2Number"];
            out += "Rule "+name+"("+negationOperationModifier+part1["name"]+" "+operator+" "+operand2+");\n";
        }


    });
    
    //quicklog(out);
    return new Buffer(out).toString('base64');
}

/**
 * Encode j5 inputs
 */
var j5rpcEncode = function(model,encodedParameters,encodedMasterFiles,assemblyMethod,user,testing) {

    var parameters = JSON.parse(encodedParameters);
    var masterFiles = JSON.parse(encodedMasterFiles);

    var j5Params = JSON.parse(' \
        { \
        "MASTEROLIGONUMBEROFDIGITS": "5", \
        "MASTERPLASMIDNUMBEROFDIGITS": "5", \
        "GIBSONOVERLAPBPS": "26", \
        "GIBSONOVERLAPMINTM": "60", \
        "GIBSONOVERLAPMAXTM": "70", \
        "MAXIMUMOLIGOLENGTHBPS": "110", \
        "MINIMUMFRAGMENTSIZEGIBSONBPS": "250", \
        "GOLDENGATEOVERHANGBPS": "4digestion", \
        "GOLDENGATERECOGNITIONSEQ": "GGTCTC", \
        "GOLDENGATETERMINIEXTRASEQ": "CACACCAGGTCTCA", \
        "MAXIMUM_IDENTITIES_GOLDEN_GATE_OVERHANGS_COMPATIBLE": "2", \
        "OLIGOSYNTHESISCOSTPERBPUSD": "0.1", \
        "OLIGOPAGEPURIFICATIONCOSTPERPIECEUSD": "40", \
        "OLIGOMAXLENGTHNOPAGEPURIFICATIONREQUIREDBPS": "60", \
        "MINIMUMPCRPRODUCTBPS": "100", \
        "DIRECTSYNTHESISCOSTPERBPUSD": "0.39", \
        "DIRECTSYNTHESISMINIUMUMCOSTPERPIECEUSD": "159", \
        "PRIMER_GC_CLAMP": "2", \
        "PRIMER_MIN_SIZE": "18", \
        "PRIMER_MAX_SIZE": "36", \
        "PRIMER_MIN_TM": "60", \
        "PRIMER_MAX_TM": "70", \
        "PRIMER_MAX_DIFF_TM": "5", \
        "PRIMER_MAX_SELF_ANY_TH": "47", \
        "PRIMER_MAX_SELF_END_TH": "47", \
        "PRIMER_PAIR_MAX_COMPL_ANY_TH": "47", \
        "PRIMER_PAIR_MAX_COMPL_END_TH": "4747)", \
        "PRIMER_TM_SANTALUCIA": "1", \
        "PRIMER_SALT_CORRECTIONS": "1", \
        "PRIMER_DNA_CONC": "250", \
        "MISPRIMING_3PRIME_BOUNDARY_BP_TO_WARN_IF_HIT": "4", \
        "MISPRIMING_MIN_TM": "45", \
        "MISPRIMING_SALT_CONC": "0.05", \
        "MISPRIMING_OLIGO_CONC": "2.5e-7", \
        "OUTPUT_SEQUENCE_FORMAT": "Genbank", \
        "ASSEMBLY_PRODUCT_TYPE": "circular", \
        "SUPPRESS_PURE_PRIMERS": "TRUE"\
        }');

    var execParams = JSON.parse('\
        { \
            "reuse_master_oligos_file": "false", \
            "master_oligos_list_filename": "masteroligolist.csv",  \
            "encoded_master_oligos_file": "T2xpZ28gTmFtZSxMZW5ndGgsVG0sVG0gKDMnIG9ubHkpLFNlcXVlbmNlCg==", \
            "reuse_master_plasmids_file": "false",  \
            "master_plasmids_list_filename": "masterplasmidslist.csv",  \
            "encoded_master_plasmids_file": "UGxhc21pZCBOYW1lLEFsaWFzLENvbnRlbnRzLExlbmd0aCxTZXF1ZW5jZQo=", \
            "reuse_master_direct_syntheses_file": "false",  \
            "master_direct_syntheses_list_filename": "masterdirectsyntheseslist.csv",  \
            "encoded_master_direct_syntheses_file": "RGlyZWN0IFN5bnRoZXNpcyBOYW1lLEFsaWFzLENvbnRlbnRzLExlbmd0aCxTZXF1ZW5jZQo=",  \
            "reuse_eugene_rules_list_file": "FALSE",  \
            "assembly_method": "CombinatorialMock",  \
            "reuse_j5_parameters_file": "FALSE",  \
            "reuse_sequences_list_file": "FALSE",  \
            "reuse_target_part_order_list_file": "FALSE",  \
            "reuse_parts_list_file": "FALSE",  \
            "reuse_zipped_sequences_file": "FALSE" \
        }');


    var emptySources = 
    {
        masterplasmidlist: 
        { 
            name: "masterplasmidlist.csv",
            fileContent: "UGxhc21pZCBOYW1lLEFsaWFzLENvbnRlbnRzLExlbmd0aCxTZXF1ZW5jZQ0KcGo1XzAwMDAwLCwsLA=="
        },
        masteroligolist: 
        {
            name: "masteroligolist.csv",
            fileContent: "T2xpZ28gTmFtZSxMZW5ndGgsVG0sVG0gKDMnIG9ubHkpLFNlcXVlbmNlDQpqNV8wMDAwMCwsLCw="
        },
        masterdirectsyntheseslist: {
            name: "masterdirectsyntheseslist.csv",
            fileContent: "RGlyZWN0IFN5bnRoZXNpcyBOYW1lLEFsaWFzLENvbnRlbnRzLExlbmd0aCxTZXF1ZW5jZQ0KZHNqNV8wMDAwMCwsLCw="
        }
    };

    execParams["assembly_method"] = assemblyMethod;


    function processMasterFiles(reuse,filename,fileEncoded,ParamFilename,ParamFileEncoded,baseName){
        execParams[filename] = masterFiles[ParamFilename];
        execParams[fileEncoded] = masterFiles[ParamFileEncoded];
        
        if(execParams[filename]==='' && execParams[fileEncoded]==='') 
        {
            // Reuse Source from DB
            execParams[fileEncoded] = user.masterSources[baseName].fileContent;
            //console.log(user.masterSources[baseName].fileContent);
            execParams[filename] = user.masterSources[baseName].name;
            execParams[reuse] = false;
            
        }

        execParams[filename] = emptySources[baseName].name; // Force standard name


    };

    processMasterFiles(
        "reuse_master_plasmids_file",
        "master_plasmids_list_filename",
        "encoded_master_plasmids_file",
        "masterPlasmidsListFileName",
        "masterPlasmidsList",
        "masterplasmidlist"
    );

    processMasterFiles(
        "reuse_master_oligos_file",
        "master_oligos_list_filename",
        "encoded_master_oligos_file",
        "masterOligosListFileName",
        "masterOligosList",
        "masteroligolist"
    );
    
    processMasterFiles(
        "reuse_master_direct_syntheses_file",
        "master_direct_syntheses_list_filename",
        "encoded_master_direct_syntheses_file",
        "masterDirectSynthesesListFileName",
        "masterDirectSynthesesList",
        "masterdirectsyntheseslist"
    );

    //quicklog(require('util').inspect(execParams, true, 5));

    var data = {};

    data["encoded_sequences_list_file"] = encoded_sequences_list_file(model);
    data["encoded_zipped_sequences_file"] = encoded_zipped_sequences_file(model);
    data["encoded_parts_list_file"] = encoded_parts_list_file(model);
    data["encoded_target_part_order_list_file"] = encoded_target_part_order_list_file(model,assemblyMethod);
    data["encoded_eugene_rules_list_file"] = encoded_eugene_rules_list_file(model);
    data["encoded_j5_parameters_file"] = encoded_j5_parameters_file(parameters);
    

    Object.keys(parameters).forEach(function(prop) {
        data[prop] = parameters[prop];
    });

    /*
    Object.keys(j5Params).forEach(function(prop) {
        data[prop] = j5Params[prop];
    });
    */

    Object.keys(execParams).forEach(function(prop) {
        data[prop] = execParams[prop];
    });

    console.log("Executing using method: "+data["assembly_method"]);

    quicklog(require('util').inspect(data, true, 5));

    return data;

}

module.exports = j5rpcEncode
