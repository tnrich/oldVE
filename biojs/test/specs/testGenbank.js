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
		it("GenbankManager statics are ok?", function() {
			var gbMan = Ext.create("Teselagen.bio.parsers.GenbankManager");
			expect(gbMan).toBeDefined();
			expect(gbMan.self.LOCUS_TAG).toBe("LOCUS");
			expect(gbMan.self.END_SEQUENCE_TAG).toBe("//");
	    });
	
	    it("Genbank Initializing? ", function() {
	    	var gb = Ext.create("Teselagen.bio.parsers.Genbank");
	    	expect(gb).toBeDefined();
	    });
	    
	    it("GenbankKeyword classes ok?.", function() {
	    	var test = "blah;"
	    	var gbKey = Ext.create("Teselagen.bio.parsers.GenbankKeyword");
	    	expect(gbKey).toBeDefined();
	    	gbKey.setKeyword(test);
	    	expect(gbKey.getKeyword()).toBe(test);

	    	var gbFeatKey = Ext.create("Teselagen.bio.parsers.GenbankFeatureKeyword");
	    	expect(Ext.getClassName(gbFeatKey)).toBe("Teselagen.bio.parsers.GenbankFeatureKeyword");

	    });
	    it("All Genbank classes defined?", function() {
    	
	    	expect( Ext.create("Teselagen.bio.parsers.Genbank")).toBeDefined();
	    	expect( Ext.create("Teselagen.bio.parsers.GenbankKeyword")).toBeDefined();
	    	expect( Ext.create("Teselagen.bio.parsers.GenbankSubKeyword")).toBeDefined();
	    	expect( Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword")).toBeDefined();
	    	expect( Ext.create("Teselagen.bio.parsers.GenbankFeatureKeyword")).toBeDefined();
	    	expect( Ext.create("Teselagen.bio.parsers.GenbankFeatureElement")).toBeDefined();
	    	expect( Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier")).toBeDefined();
	    	expect( Ext.create("Teselagen.bio.parsers.GenbankLocation")).toBeDefined();
	    	expect( Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword")).toBeDefined();
	    });	
	});

	
	describe("Testing Keyword Parsing from GenbankManager.js", function() {
	    var line, tmp;
	    var dt =  Ext.create("Data");
	    var gbMan =  Ext.create("Teselagen.bio.parsers.GenbankManager");
	    
	    //console.log(Ext.Loader.getConfig());
	    
	    it("Parses LOCUS 1: circular?",function(){
	    	//line = dt.getLocusStr();
	    	line = "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012";
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(tmp.getLocus().toString()).toBe(line);
	    	expect(tmp.getLocus().getStrandType()).toBe("ds");
	    	expect(tmp.getLocus().getSequenceLength()).toBe("5371");
	    	expect(tmp.getLocus().getNaType()).toBe("DNA");
	    	expect(tmp.getLocus().getLinear()).toBe(false);
	    	expect(tmp.getLocus().getDivisionCode()).toBe("");
	    	// CURRENTLY DOES NOT SUPPORT DATE TYPE
	    	expect(tmp.getLocus().getDate()).toBe("1-APR-2012");
	    });
	    it("Parses LOCUS 2: linear, divisionCode?",function(){
	    	line = "LOCUS       SCU49845     5028 bp    DNA             PLN       21-JUN-1999";
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(tmp.getLocus().getLocusName()).toBe("SCU49845");
	    	expect(tmp.getLocus().getStrandType()).toBe("");
	    	expect(tmp.getLocus().getSequenceLength()).toBe("5028");
	    	expect(tmp.getLocus().getNaType()).toBe("DNA");
	    	expect(tmp.getLocus().getLinear()).toBe(true);
	    	expect(tmp.getLocus().getDivisionCode()).toBe("PLN");
	    });
	    it("Parses LOCUS3: no ds/ss, linear, division code?",function(){
	    	line = "LOCUS       LISOD                    756 bp    DNA     linear   BCT 30-JUN-1993";
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(tmp.getLocus().toString()).toBe(line);
	    });
	    it("Parses ACCESSION? Correctly parses/adds Dummy SubKeywords?",function(){
	    	line = "ACCESSION   pj5_00028 Accession";
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(tmp.findKeyword("ACCESSION").toString()).toBe(line);
	    	expect(tmp.findKeyword("ACCESSION").getSubKeywords()).toBe(undefined);
	    	tmp.findKeyword("ACCESSION").addSubKeyword(Ext.create('Teselagen.bio.parsers.GenbankSubKeyword', {keyword: "test", value : "test2"}));
	    	
	    	expect(tmp.findKeyword("ACCESSION").getSubKeywords().length).toBe(1);
	    	expect(tmp.findKeyword("ACCESSION").getSubKeywords()[0].getKeyword()).toBe("test");
	    	expect(tmp.findKeyword("ACCESSION").getSubKeywords()[0].getValue()).toBe("test2");
	    	
	    });

	    it("Parses VERSION?",function(){
	    	line = "VERSION     pj5_00028 version.12";
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(tmp.findKeyword("VERSION").toString()).toBe(line);
	    });
	    it("Parses DEFINITION?",function(){
	    	line = "DEFINITION  pj5_00028 Definition";
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(tmp.findKeyword("DEFINITION").toString()).toBe(line);
	    });
	    it("Parses KEYWORDS?",function(){
	    	line = "KEYWORDS    .";
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(tmp.findKeyword("KEYWORDS").toString()).toBe(line);
	    });
	    
	    it("Parses SOURCE? Correctly parses SubKeywords and runons?",function(){
	    	line = 
	    		'SOURCE      Saccharomyces cerevisiae (baker\'s yeast)\n' +
	    		'  ORGANISM  Saccharomyces cerevisiae\n' +
	    		'            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n' +
	    		'            Saccharomycetales; Saccharomycetaceae; Saccharomyces.';
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(tmp.findKeyword("SOURCE").getSubKeywords()[0].getKeyword()).toBe("ORGANISM");
	    	
	    });
	    
	    it("Parses FEATURE, FEATURE ELEMENTS, LOCATION, and QUALIFIER?",function(){
	    	line = 
	    		'FEATURES             Location/Qualifiers\n' + 
	    		'     CDS             complement(7..885)\n' + 
	    		'                     /label="araC"';
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(Ext.getClassName(tmp.getLastKeyword())).toBe("Teselagen.bio.parsers.GenbankFeatureKeyword");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getKeyword()).toBe("CDS");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getStart()).toBe("7");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getEnd()).toBe("885");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getName()).toBe("label");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getValue()).toBe("araC");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getQuoted()).toBe(true);
	    });
	    
	    it("Parses Runon LOCATION, and QUALIFIER?",function(){
	    	line = 
	    		'FEATURES             Location/Qualifiers\n' + 
	    		'     CDS             complement(7..885)\n' + 
	    		'                     /label="araC"\n' + 
	    		'     fakemRNA        join(<265..402,673..781,911..1007,1088..1215,\n' +
	    		'                     1377..1573,1866..2146,2306..2634,2683..>2855)\n' +
	    		'                     /translation="MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQ\n' +
	    		'                     FVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVD\n' +
	    		'                     LISGDDKILNGVYSQYEEGESIFGSLF\n';
	    	tmp = gbMan.parseGenbankFile(line);
	    	//console.log(tmp.toString());
	    	expect(Ext.getClassName(tmp.getLastKeyword())).toBe("Teselagen.bio.parsers.GenbankFeatureKeyword");
	    	//console.log(tmp.findKeyword("FEATURES").getLastElement());
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getKeyword()).toBe("fakemRNA");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getStart()).toBe("<265");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getEnd()).toBe("402");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[7].getStart()).toBe("2683");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[7].getEnd()).toBe(">2855");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation().length).toBe(8);
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getName()).toBe("translation");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getValue()).toBe("MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQFVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVDLISGDDKILNGVYSQYEEGESIFGSLF");
	    	expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getQuoted()).toBe(true);
	    });
	    
	    it("Parses ?",function(){
	    	line = "";
	    	
	    });
	    it("Parses ORIGIN?",function(){
	    	line = "ORIGIN      \n" +
	    			"        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa\n" +
	    			"       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc\n";// +
	    			//"//";
	    	tmp = gbMan.parseGenbankFile(line);
	    	expect(line).toMatch(tmp.findKeyword("ORIGIN").toString());
	    });

	    it("Parses Top part of pj5_00028.gb string?",function(){
	    	line = dt.getTopStr();
	    	console.log(line);
	    	tmp = gbMan.parseGenbankFile(line);
	    	console.log("RECONSTRUCTED GENBANK FILE\n" + tmp.toString());
	    	//console.log(JSON.stringify(tmp, null, '  '));
	    	//console.log(JSON.stringify(tmp.getKeywordsTag(), null, '  '));
	    	console.log(JSON.stringify(tmp.getKeywords(), null, '  '));
	    	expect(tmp.getKeywords().length).toBe(9);
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