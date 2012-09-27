 function encoded_sequences_list_file(model)
{
    var sequences = model["de:design"]["de:sequenceFiles"]["de:sequenceFile"];

    var out ="Sequence File Name,Format\n";

    sequences.forEach(function(val){
        out += val['de:fileName']+','+val["de:format"]+'\n';
    });

    return new Buffer(out).toString('base64');
}

function encoded_zipped_sequences_file(model)
{

    var sequences = model["de:design"]["de:sequenceFiles"]["de:sequenceFile"];

    var zip = new require('node-zip')();

    sequences.forEach(function(val){
        zip.file(val['de:fileName'], val["de:content"]);
    });    

    var data = zip.generate({base64:true,compression:'DEFLATE'});
    return data;
}

function encoded_parts_list_file(model)
{
    var out = "Part Name,Part Source (Sequence Display ID),Reverse Compliment?,Start (bp),End (bp)\n";

    var parts = model["de:design"]["de:partVOs"]["de:partVO"];
    var sequences = model["de:design"]["de:sequenceFiles"]["de:sequenceFile"];

    parts.forEach(function(val){
        sequences.forEach(function(part){
            if(part["hash"] == val["de:sequenceFileHash"])
                {
                    if(part["de:format"]=="Genbank") out += val['de:name']+','+part['de:content'].match(/LOCUS +(\w+) +/)[1]+','+val["de:revComp"]+','+val["de:startBP"]+','+val["de:stopBP"]+'\n';
                    else if(part["de:format"]=="jbei-seq") out += val['de:name']+','+part['de:content'].match(/<seq:name>(.+)<\/seq:name>/)[1]+','+val["de:revComp"]+','+val["de:startBP"]+','+val["de:stopBP"]+'\n';
                    else if(part["de:format"]=="FASTA") out += val['de:name']+','+part['de:content'].match(/>(.+)\n/)[1]+','+val["de:revComp"]+','+val["de:startBP"]+','+val["de:stopBP"]+'\n';
                }
        });
    });
    return new Buffer(out).toString('base64');  
}

function encoded_j5_parameters_file(params)
{
    var out = "Parameter Name,Value\n"
    
    for(var prop in params) {
        out += prop + ',' + params[prop] + '\n';
    }

    return new Buffer(out).toString('base64'); 
}

function encoded_target_part_order_list_file(model)
{
 

    var bins = model["de:design"]["de:j5Collection"]["de:j5Bins"]["de:j5Bin"];
    var parts = model["de:design"]["de:partVOs"]["de:partVO"];

    var out = '(>Bin) or Part Name,Direction,Forced Assembly Strategy?,Forced Relative Overhang Position?,Direct Synthesis Firewall?,Extra 5\' CPEC overlap bps,Extra 3\' CPEC overlap bps\n';
    
    bins.forEach(function(bin){
        out += '>' + bin["de:binName"] + ',' + bin["de:direction"] + ',' + ',' + ',' + ',' + ',' + ',' + '\n';
    
        var binParts = [];
        if (bin["de:binItems"]["de:partID"].length > 0)
        {
            binParts = bin["de:binItems"]["de:partID"];
        }
        else{ binParts.push(bin["de:binItems"]["de:partID"]); }
        
        binParts.forEach(function(binPart){
            parts.forEach(function(part){
                if(part["de:parts"]["de:part"]["id"] == binPart)
                {
                    fro = bin["de:fro"] || "";
                    out += part["de:name"] + ',' + bin["de:direction"] + ',' + part["de:parts"]["de:part"]["de:fas"] + ',' + fro + ',' + bin["de:dsf"] + ',' + ',' + '\n';
                }
            });
        });

    });
//'(>Bin) or Part Name,Direction,Forced Assembly Strategy?,Forced Relative Overhang Position?,Direct Synthesis Firewall?,Extra 5\' CPEC overlap bps,Extra 3\' CPEC overlap bps\n
//'>vector_backbone,,,2,,,\n
//'pS8c-vector_backbone,forward,,,,,\n
//'>nterm_sig_pep,,,,TRUE,,\n
//'BMC_nterm_sig_pep,forward,,,,,\n
//'ccmN_nterm_sig_pep,forward,,,,,\n
//'>gly_ser_linker,,,,,,\n
//'long_gly_ser_linker,forward,,,,,\n
//'short_gly_ser_linker,forward,,,,,\n
//'>GFPuv,,,,,,\n
//'GFPuv,forward,,,,,\n
//'>ssrA_tag_5prime,,Embed_in_primer_reverse,,TRUE,,\n
//'ssrA_tag_5prime,forward,,,,,\n
//'ssrA_tag_enhanced_5prime,forward,Embed_in_primer_reverse,,,,\n
//'>ssrA_tag_3prime,,Embed_in_primer_forward,,,,\n
//'ssrA_tag_3prime,forward,Embed_in_primer_forward,,,,';


    return new Buffer(out).toString('base64'); 
}

function encoded_eugene_rules_list_file(model)
{
    var eugenes = model["de:design"]["de:eugeneRules"]["de:eugeneRule"];
    var parts = model["de:design"]["de:partVOs"]["de:partVO"];
    var out = "";
    if(eugenes instanceof Array)
    {
    eugenes.forEach(function(val,key){
        var operand1 = val["de:operand1ID"];
        var operator = val["de:compositionalOperator"]
        var operand2 = val["de:operand2ID"];

        parts.forEach(function(part1){
            if(part1["id"] == operand1)
            {
                if( operator == "MORETHAN" || operator == "NOT MORETHAN" )
                {
                    out += "Rule Rule_"+(key+1)+"("+part1["de:name"]+" "+operator+" "+operand2+");\n";                    
                }
                else
                {
                    parts.forEach(function(part2){
                        if(part2["id"] == operand2)
                        {
                            out += "Rule Rule_"+(key+1)+"("+part1["de:name"]+" "+operator+" "+part2["de:name"]+");\n";
                        }
                    });
                }                  
            }
        });


    });
    }

    return new Buffer(out).toString('base64'); 
}

var j5rpcEncode = function(model,j5Params,execParams) {

//var j5Params = JSON.parse('{"MASTEROLIGONUMBEROFDIGITS": "5", "MASTERPLASMIDNUMBEROFDIGITS": "5", "GIBSONOVERLAPBPS": "26", "GIBSONOVERLAPMINTM": "60", "GIBSONOVERLAPMAXTM": "70", "MAXIMUMOLIGOLENGTHBPS": "110", "MINIMUMFRAGMENTSIZEGIBSONBPS": "250", "GOLDENGATEOVERHANGBPS": "4digestion", "GOLDENGATERECOGNITIONSEQ": "GGTCTC", "GOLDENGATETERMINIEXTRASEQ": "CACACCAGGTCTCA", "MAXIMUM_IDENTITIES_GOLDEN_GATE_OVERHANGS_COMPATIBLE": "2", "OLIGOSYNTHESISCOSTPERBPUSD": "0.1", "OLIGOPAGEPURIFICATIONCOSTPERPIECEUSD": "40", "OLIGOMAXLENGTHNOPAGEPURIFICATIONREQUIREDBPS": "60", "MINIMUMPCRPRODUCTBPS": "100", "DIRECTSYNTHESISCOSTPERBPUSD": "0.39", "DIRECTSYNTHESISMINIUMUMCOSTPERPIECEUSD": "159", "PRIMER_GC_CLAMP": "2", "PRIMER_MIN_SIZE": "18", "PRIMER_MAX_SIZE": "36", "PRIMER_MIN_TM": "60", "PRIMER_MAX_TM": "70", "PRIMER_MAX_DIFF_TM": "5", "PRIMER_MAX_SELF_ANY_TH": "47", "PRIMER_MAX_SELF_END_TH": "47", "PRIMER_PAIR_MAX_COMPL_ANY_TH": "47", "PRIMER_PAIR_MAX_COMPL_END_TH": "4747)", "PRIMER_TM_SANTALUCIA": "1", "PRIMER_SALT_CORRECTIONS": "1", "PRIMER_DNA_CONC": "250", "MISPRIMING_3PRIME_BOUNDARY_BP_TO_WARN_IF_HIT": "4", "MISPRIMING_MIN_TM": "45", "MISPRIMING_SALT_CONC": "0.05", "MISPRIMING_OLIGO_CONC": "2.5e-7", "OUTPUT_SEQUENCE_FORMAT": "Genbank", "ASSEMBLY_PRODUCT_TYPE": "circular", "SUPPRESS_PURE_PRIMERS": "TRUE"}');

// encoded_master_oligos_file : Oligo Name,Length,Tm,Tm (3' only),Sequence
// encoded_master_direct_syntheses_file : Direct Synthesis Name,Alias,Contents,Length,Sequence
// encoded_master_plasmids_file : Plasmid Name,Alias,Contents,Length,Sequence

/*
var execParams = JSON.parse(' \
    { \
        "master_plasmids_list_filename": "j5_plasmids.csv",  \
        "reuse_zipped_sequences_file": "FALSE", \
        "reuse_master_oligos_file": "false", \
        "encoded_master_oligos_file": "T2xpZ28gTmFtZSxMZW5ndGgsVG0sVG0gKDMnIG9ubHkpLFNlcXVlbmNlCg==", \
        "reuse_parts_list_file": "FALSE",  \
        "master_oligos_list_filename": "j5_oligos.csv",  \
        "reuse_master_direct_syntheses_file": "false",  \
        "reuse_target_part_order_list_file": "FALSE",  \
        "encoded_master_direct_syntheses_file": "RGlyZWN0IFN5bnRoZXNpcyBOYW1lLEFsaWFzLENvbnRlbnRzLExlbmd0aCxTZXF1ZW5jZQo=",  \
        "master_direct_syntheses_list_filename": "j5_directsyntheses.csv",  \
        "reuse_eugene_rules_list_file": "FALSE",  \
        "assembly_method": "CombinatorialMock",  \
        "j5_session_id": "34b649fcffc392f1d18027c945359bd0",  \
        "reuse_j5_parameters_file": "FALSE",  \
        "reuse_master_plasmids_file": "false",  \
        "reuse_sequences_list_file": "FALSE",  \
        "encoded_master_plasmids_file": "UGxhc21pZCBOYW1lLEFsaWFzLENvbnRlbnRzLExlbmd0aCxTZXF1ZW5jZQo=" \
    }');
*/

var data = {};

data["encoded_sequences_list_file"] = encoded_sequences_list_file(model);
data["encoded_zipped_sequences_file"] = encoded_zipped_sequences_file(model);
data["encoded_parts_list_file"] = encoded_parts_list_file(model);

data["encoded_j5_parameters_file"] = encoded_j5_parameters_file(j5Params);
data["encoded_target_part_order_list_file"] = encoded_target_part_order_list_file(model);

data["encoded_eugene_rules_list_file"] = encoded_eugene_rules_list_file(model);



Object.keys(execParams).forEach(function(prop) {
    data[prop] = execParams[prop];
});

return data;

}

module.exports = j5rpcEncode
