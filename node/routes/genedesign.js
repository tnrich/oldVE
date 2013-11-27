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

	app.get('/genedesign/codon_optimize',function(req,res){

		fs.writeFile("/home/teselagen/geneDesign/testagene.fasta", '>insequence\n'+req.query.dna, function(err) {

	        var scriptPath = "/home/teselagen/j5service/j5Interface.pl";
	        
			var deploySh = spawn('/usr/local/bin/GD_Juggle_Codons.pl -i testagene.fasta -org yeast -a most_different_sequence,high', [], {
				cwd: '/home/teselagen/geneDesign',
				env: (process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
			});

			deploySh.stdout.on('data', function (data) {
				console.log('stdout: ' + data);
			});

			deploySh.stderr.on('data', function (data) {
			 	console.log('stderr: ' + data);
			});

			deploySh.on('error', function() { 
				console.log(arguments); 
			});

	        console.log("codon optimizer" + " started with pid: "+deploySh.pid);
	        
	        deploySh.on('exit', function (code,signal) {
	            console.log("Process finished with code ",code," and signal ",signal);

	            setTimeout(function(){
					fs.readFile('/home/teselagen/geneDesign/testagene_CJ.fasta', 'utf8', function (err, data) {
					  if (err) throw err;
					  res.json({response:data});
					});
				},1000);
			});

		});

    });

};
