/* 
 * @author Diana Womg
 */

describe("Testing Genbank related classes ", function() {
	
	var gbFormat = Ext.create('Teselagen.bio.parsers.GenbankFormat', 'GenFormatTest');
	
	describe("Ceating classes correctly?", function() {
		it("GenbankFormat statics are ok? ", function() {
			
			expect(gbFormat).toBeDefined();
			//expect(gbFormat.pubname).toBeDefined();
			expect(gbFormat.self.LOCUS_TAG).toBe("LOCUS");
			expect(gbFormat.self.END_SEQUENCE_TAG).toBe("//");
	    });
	
		
	    it("GenbankFileModel Initializing? ", function() {
	    	var gbFM = Ext.create('Teselagen.bio.parsers.GenbankFileModel');
	    	console.log(gbFM.locus);
	    	console.log(gbFM.getLocus());
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
	    	//gbLocKey.setKeyword(test);
	    	//expect(gbLocKey.getKeyword()).toBe(test);
	    	
	    	var gbFeatKey = Ext.create('Teselagen.bio.parsers.GenbankFeatureKeyword');
	    	expect(gbFeatKey).toBeDefined();
	    	
	    	var gbOrigKey = Ext.create('Teselagen.bio.parsers.GenbankOriginKeyword');
	    	expect(gbOrigKey).toBeDefined();
	    	
	    });
	
	});
	
	describe("Opening data files from biojs/data/DATAFILE.gb correctly? DUMMY", function() {
	    it("loadFile.js open files and pass in a string correctly?",function(){
	    	// Load data files from biojs/data/. to buffer
	    	var fileinput;  // ?
	    	var fileoutput; // a string
	    	// Make an element and hardcode the path for the files.
	    	//loadFile( fileinput, fileoutput );
	    	expect(false).toBe(false);
	    });
	    
	});
	
	describe("Testing this DUMMY", function() {
	    
	    it("Works?",function(){
	    	expect(false).toBe(false);
	    });
 
	});
	
	
	
});