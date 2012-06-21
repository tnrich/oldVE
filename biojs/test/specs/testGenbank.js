/* 
 * @author Diana Womg
 */

//Ext.require('Teselagen.bio.util.StringUtil');

describe("Testing Genbank related classes ", function() {

	describe("Testing Teselagen.bio.util.StringUtil", function() {
	    
	    it("Works?",function(){
	    	var str = "  black  ";
	    	expect("a" + str.trim() + "b").toBe("ablackb");
	    	expect(Ext.String.trim(str)).toBe("black");
	    	expect("a" + str.ltrim() + "b").toBe("ablack  b");  //result "ablack b"
	    	expect("a" + str.rtrim() + "b").toBe("a  blackb");  //result "a blackb"
	    	var str = "5";
	    	expect("" + str.lpad("0", 5)).toBe("00005"); //result "00005"
	    	expect("" + str.rpad("0", 5)).toBe("50000"); //result "50000"
	    	expect(false).toBe(false);
	    });
 
	});
	
	
	describe("Ceating classes correctly?", function() {
		it("GenbankManager statics are ok? ", function() {
			var gbMan = Ext.create('Teselagen.bio.parsers.GenbankManager');
			expect(gbMan).toBeDefined();
			//expect(gbMan.self.LOCUS_TAG).toBe("LOCUS");
			//expect(gbMan.self.END_SEQUENCE_TAG).toBe("//");
	    });
	
	    it("Genbank Initializing? ", function() {
	    	var gb = Ext.create('Teselagen.bio.parsers.Genbank');
	    	expect(gb).toBeDefined();
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

	
	describe("Testing Keyword Parsing from GenbankManager.js", function() {
	    var line, tmp;
	    var dt =  Ext.create('Data');
	    var gbMan =  Ext.create('Teselagen.bio.parsers.GenbankManager');
	    
	    //console.log(Ext.Loader.getConfig());
	    
	    it("Parses LOCUS?",function(){
	    	line = dt.getLocusStr();
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(tmp.getLocus().toString()).toBe(line);
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
	    	line = "ORIGIN      \n" +
	    			"        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa\n" +
	    			"       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc\n" +
	    			"//";
	    	//tmp = gbMan.parseGenbankFile(line);
	    	//console.log(tmp);
	    });

	    it("Parses Top part of pj5_00028.gb string?",function(){
	    	line = dt.getTopStr();
	    	console.log(line);
	    	tmp = gbMan.parseGenbankFile(line);
	    	//console.log(tmp.getLocus().getKeyword());
	    	console.log(tmp.toString());
	    	console.log(tmp.toString2());
	    	console.log(JSON.stringify(tmp));
	    	console.log(JSON.stringify(tmp.getKeywordsTag(), null, '  '));
	    	console.log(JSON.stringify(tmp.getKeywords(), null, '  '));
	    })
	    
	    it("Parses pj5_00028.gb string?",function(){
	    	//line = dt.getPj5Str();
	    	//tmp = gbMan.parseGenbankFile(line);
	    	//console.log(tmp);
	    })
	    
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