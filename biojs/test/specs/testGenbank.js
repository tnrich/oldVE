/* 
 * @author Diana Womg
 */

Ext.require('Teselagen.bio.parsers.GenTest');

describe("Testing Genbank related classes ", function() {
	
	describe("Ceating classes correctly?", function() {
		it("GenbankFormat statics are ok? ", function() {
			var gbFormat = Ext.create('Teselagen.bio.parsers.GenbankFormat');
			expect(gbFormat).toBeDefined();
			expect(gbFormat.self.LOCUS_TAG).toBe("LOCUS");
			expect(gbFormat.self.END_SEQUENCE_TAG).toBe("//");
	    });
	
	    it("GenbankFileModel Initializing? ", function() {
	    	var gbFM = Ext.create('Teselagen.bio.parsers.GenbankFileModel');
	    	expect(gbFM.getLocus()).toBeDefined();
	    });
	    
	    it("GenbankFileKeyword classes exist? ", function() {
	    	var test = "blah;"
	    	var gbKey = Ext.create('Teselagen.bio.parsers.GenbankKeyword');
	    	expect(gbKey).toBeDefined();
	    	gbKey.setKeyword(test);
	    	expect(gbKey.getKeyword()).toBe(test);
	    	
	    	// GenbankLocusKeyword extends GenbankKeyword. Should GLK access private variables in GK?
	    	var gbLocKey = Ext.create('Teselagen.bio.parsers.GenbankLocusKeyword');
	    	expect(gbLocKey).toBeDefined();
	    	
	    	var gbFeatKey = Ext.create('Teselagen.bio.parsers.GenbankFeatureKeyword');
	    	expect(gbFeatKey).toBeDefined();
	    	
	    	var gbOrigKey = Ext.create('Teselagen.bio.parsers.GenbankOriginKeyword');
	    	expect(gbOrigKey).toBeDefined();
	    });
	
	});

	
	describe("Testing Keyword Parsing from GenbankFormat.js", function() {
	    var line;
	    var gf =  Ext.create('Teselagen.bio.parsers.GenbankFormat');
	    //console.log(Ext.Loader.getConfig());
	    
	    it("Parses LOCUS?",function(){
	    	line = "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012";
	    	var tmp = gf.parseGenbankFile(line);
	    	console.log(tmp);
	    });
	    it("Parses ACCESSION?",function(){
	    	line = "ACCESSION   pj5_00028 Accession";
	    	
	    });
	    it("Parses VERSION?",function(){
	    	line = "VERSION     pj5_00028 version.12";
	    	
	    });
	    it("Parses DEFINITION?",function(){
	    	line = "DEFINITION  pj5_00028 Definition";
	    	
	    });
	    it("Parses KEYWORDS?",function(){
	    	line = "KEYWORDS    .";
	    	
	    });
	    it("Parses FEATURE-SUBKEYWORD?",function(){
	    	line = '     CDS             complement(7..885)\n                     /label="araC"';
	    	
	    });
	    it("Parses ?",function(){
	    	line = "";
	    	
	    });
	    it("Parses ORIGIN?",function(){
	    	line = "ORIGIN      " +
	    			"        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa" +
	    			"       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc";
	    	tmp = gf.parseGenbankFile(line);
	    	console.log(tmp);
	    });
	    /*
	    it("Parses ?",function(){
	    	line = "";
	    	
	    })*/;
 
	});
	
	/*
	describe("Opening data files from biojs/data/DATAFILE.gb correctly? DUMMY", function() {
	    it("loadFile.js open files and pass in a string correctly?",function(){
	    	// Load data files from biojs/data/. to buffer
	    	var fileinput;  // ?
	    	var fileoutput; // a string
	    	// Make an element and hardcode the path for the files.
	    	//loadFile( fileinput, fileoutput );
	    	expect(false).toBe(false);
	    });
	    
	});*/
	
	describe("Testing this DUMMY", function() {
	    
	    it("Works?",function(){
	    	expect(false).toBe(false);
	    });
 
	});
	
	
	
});