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
	var spawn = require('child_process').spawn
	var util = require('util');

	app.get('/genedesign/codon_optimize',function(req,res){

		fs.writeFile("/home/teselagen/geneDesign/testagene.fasta", '>\n'+req.query.dna, function(err) {

	        var scriptPath = "/home/teselagen/j5service/j5Interface.pl";
	        
	        var params = ["-i","/home/teselagen/geneDesign/testagene.fasta","-org","yeast","-a most_different_sequence,high"];

	        var newChild = spawn('/usr/local/bin/GD_Juggle_Codons.pl', ['-t',scriptPath]);
	        console.log("codon optimizer" + " started with pid: "+newChild.pid);


	        newChild.on('exit', function (code,signal) {
	            console.log("Process finished with code ",code," and signal ",signal);

				fs.readFile('/home/teselagen/geneDesign/testagene_CJ.fasta', 'utf8', function (err, data) {
				  if (err) throw err;
				  res.json({response:data});
				});
			});

		});

    });

};
