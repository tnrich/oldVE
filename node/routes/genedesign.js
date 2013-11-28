/**
 * GeneDesign API
 * @module ./routes/genedesign
 */

module.exports = function (app) {

	/**
	 * Write to quick.log
	 */
	function quicklog(s) {
	  var logpath = "/tmp/quick.log";
	  var fs = require('fs');
	  s = s.toString().replace(/\r\n|\r/g, '\n'); // hack
	  var fd = fs.openSync(logpath, 'a+', 0666);
	  fs.writeSync(fd, s + '\n');
	  fs.closeSync(fd);
	}


	var fs = require("fs");
	var spawn = require('child_process').spawn;
	var util = require('util');
	var spawn = require('child_process').spawn;
	var _ = require('underscore');

/*
Name:
      GD_Juggle_Codons.pl

Version:
      Version 5.52

Description:
      Given at least one protein-coding gene as input, the Juggle_Codons script can
      use several algorithms to modify the sequence without altering its
      translation. It is thus possible to generate a sequence that is optimized for
      expression, as different as possible from the original sequence, or some
      combination of the two.

      If no algorithm is specified, the balanced algorithm will be used. These are
      the algorithms provided by default with GeneDesign; you can make your own; see
      developer docs.

      Output will be named according to the name of the input file, and will be
      tagged with _CJ.

      Algorithms:
        high: The high algorithm replaces every codon in the input sequence with
            the most translationally optimal codon as specified by the input RSCU
            tables or known RSCU tables (if organism is specified). If the codon is
            already the ideal codon it is left alone.
        balanced: The balanced algorithm uses the rscu data to determine a
             likelihood of codon replacement.
        most_different_sequence: The most different sequence algorithm attempts to
            change as many bases as possible within the codon, preferring
            transversions over transitions.
        least_different_RSCU: The least different RSCU algorithm attempts to replace
            as many codons as possible while minimizing disruption of the original
            average RSCU value for the sequence. It will not make a replacement if
            the absolute change in RSCU value is greater than 1.
        random: The random algorithm makes random replacements.

Usage:
      -r OR -org must be provided. If both are given the table will be treated as
          another organism, named after the table's filename.

      Generate high and most different sequences given the yeast rscu table
        ./GD_Juggle_Codons.pl -i sequences.FASTA -org yeast\
                                                     -a most_different_sequence,high

      Use my rscu table to generate balanced sequences
        ./GD_Juggle_Codons.pl -i seqs.FASTA -r /my/dir/myrscu.rscu -a balanced

Arguments:
    Required arguments:

      -i,   --input : a file containing nucleotide sequences.
      -org, --organism : an organism whose RSCU table can be found in the config
          directory, or several separated by commas
        AND/OR
      -r,   --rscu : path to an RSCU table generated by GD_Generate_RSCU_Table.pl

    Optional arguments:

      -a,   --algorithm : which algorithms to use (see above), comma separated
              defaults to balanced
      -out, --output : path to an output directory
      -f,   --format : default genbank
      -s,   --split : output all sequences as separate files
      -h,   --help : Display this message
*/

	app.post('/genedesign/codon_optimize',function(req,res){


		if(app.get("env") !== "production") {
			/*
			return res.json(
				{
				  "response": ">insequence balanced codon juggled with yeast RSCU values\nATGACCGACCAGGCTACTCCAAACTTGCCTTCTCGTGATTTCGACTCTACCGCTGCTTTC\nTACGAAAGATTAGGTTTCGGTATTGTTTTCAGAGATGCTTTGGCTGACGTCTTGATCGTC\nCACGACGCTCGTGACTTCGTCGCTCTAGCCGATGGTCAACAAGTTGGTAGACAAGCCCAT\nGCTGGTAGACGTAGATTGTTCTTGAACAGATCTTCCTTCGTCTGGAAGGCCGTTCACTTG\nGACCGTTGGGCTGCTTTGCCAGGTTGGTTGGGTTTTATTTCCCACCCATTGGCCTTGATC\nTGTTACGCTGGTGGTTCTAGACCAGCCTCTCAATCTAGAATCCCAGTCGAACATAGACAA\nGTTAGAATCCGTGACTCTGAAGAAGGTACCCCAGGTAGAGGTTGGGCTTACTTCACCTAC\nCCTGCACCATTGACCCCATTAGACACCCCAAGAAAGGTCTACACCAACCCATTGGCTAAG\nTCCTGTATTTCATGTGAAAAGGGTTGGATCTACCGTAAGAACAGATACAACGACCCAGAA\nGCTGGTTTGTGTTCTGGTAAGGCTATGACCAAGATTCCATAA\n",
				  "parsedResponse": [
				    "ATGACCGACCAGGCTACTCCAAACTTGCCTTCTCGTGATTTCGACTCTACCGCTGCTTTC",
				    "TACGAAAGATTAGGTTTCGGTATTGTTTTCAGAGATGCTTTGGCTGACGTCTTGATCGTC",
				    "CACGACGCTCGTGACTTCGTCGCTCTAGCCGATGGTCAACAAGTTGGTAGACAAGCCCAT",
				    "GCTGGTAGACGTAGATTGTTCTTGAACAGATCTTCCTTCGTCTGGAAGGCCGTTCACTTG",
				    "GACCGTTGGGCTGCTTTGCCAGGTTGGTTGGGTTTTATTTCCCACCCATTGGCCTTGATC",
				    "TGTTACGCTGGTGGTTCTAGACCAGCCTCTCAATCTAGAATCCCAGTCGAACATAGACAA",
				    "GTTAGAATCCGTGACTCTGAAGAAGGTACCCCAGGTAGAGGTTGGGCTTACTTCACCTAC",
				    "CCTGCACCATTGACCCCATTAGACACCCCAAGAAAGGTCTACACCAACCCATTGGCTAAG",
				    "TCCTGTATTTCATGTGAAAAGGGTTGGATCTACCGTAAGAACAGATACAACGACCCAGAA",
				    "GCTGGTTTGTGTTCTGGTAAGGCTATGACCAAGATTCCATAA"
				  ],
				  "parameters": {
				    "input": "ATGACCGACCAAGCGACGCCCAACCTGCCATCACGAGATTTCGATTCCACCGCCGCCTTCTATGAAAGGTTGGGCTTCGGAATCGTTTTCCGGGACGCCCTCGCGGACGTGCTCATAGTCCACGACGCCCGTGATTTTGTAGCCCTGGCCGACGGCCAGCAGGTAGGCCGACAGGCTCATGCCGGCCGCCGCCGCCTTTTCCTCAATCGCTCTTCGTTCGTCTGGAAGGCAGTACACCTTGATAGGTGGGCTGCCCTTCCTGGTTGGCTTGGTTTCATCAGCCATCCGCTTGCCCTCATCTGTTACGCCGGCGGTAGCCGGCCAGCCTCGCAGAGCAGGATTCCCGTTGAGCACCGCCAGGTGCGAATAAGGGACAGTGAAGAAGGAACACCCGGTCGCGGGTGGGCCTACTTCACCTATCCTGCCCCGCTGACGCCGTTGGATACACCAAGGAAAGTCTACACGAACCCTTTGGCAAAATCCTGTATATCGTGCGAAAAAGGATGGATATACCGAAAAAATCGCTATAATGACCCCGAAGCAGGGTTATGCAGCGGAAAAGCCATGACCAAAATCCCTTAA",
				    "algorithm": "balanced",
				    "organism": "yeast"
				  }
				}
			);
			*/
			return res.json({msg: "In dev mode"});
		}

		var organism = (req.query.organism)? req.body.organism : "yeast";
		var algorithm = (req.body.algorithm)? req.body.algorithm : "balanced";
		var dnaSeq = (req.body.dna)? req.body.dna : "";

		dnaSeq = dnaSeq.replace('<line-break>','\n');

		fs.writeFile("/home/teselagen/geneDesign/tempSeq.fasta", dnaSeq, function(err) {

	        var scriptPath = "/home/teselagen/j5service/j5Interface.pl";
	        
			var deploySh = spawn('/usr/local/bin/GD_Juggle_Codons.pl', ['-i','tempSeq.fasta','-org',organism,'-a',algorithm], {
				cwd: '/home/teselagen/geneDesign',
				env: (process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
			});

			var error = '';
			var out = '';

			deploySh.stdout.on('data', function (data) {
				//console.log('stdout: ' + data);
			});

			deploySh.stderr.on('data', function (data) {
			 	out += data;
			});

			deploySh.on('error', function(data) { 
				error += data;
			});

	        console.log("codon optimizer" + " started with pid: "+deploySh.pid);
	        
	        deploySh.on('exit', function (code,signal) {
	            console.log("Process finished with code ",code," and signal ",signal);

	            if(error!='')
	            {
	            	return res.json({
	            		success: false,
	            		error: errors,
	            		out: out
	            	});
	            }

				fs.readFile('/home/teselagen/geneDesign/tempSeq_CJ.fasta', 'utf8', function (err, data) {
				  if (err) throw err;

				  var sequences = data.toString().split('\n').filter(
				  	function(seq){
				  		if(seq.match(/[C|G|T|A]/)&&seq.indexOf(">insequence")==-1) return seq;
				  });

				  res.json({
				  	success: true,
				  	response:data,
				  	out: out,
				  	parsedResponse: sequences,
				  	parameters: {
				  		input: dnaSeq,
				  		algorithm: algorithm,
				  		organism: organism
				  	}});
				});
			});

		});

    });

};
