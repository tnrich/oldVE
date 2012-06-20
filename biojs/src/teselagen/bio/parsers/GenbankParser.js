    /**
    * GenbankParser class 
    * @description Takes in file input (as a string) and creates the GenbankFileModel class. Static functions. Replaces GenbankFormat.js
    * @author Diana Wong
    * @author Timothy Ham (original author of GenbankFormat.js
    */

Ext.define('Teselagen.bio.parsers.GenbankParser', {
	/** @lends  */
	
	statics: {
		LOCUS_TAG: "LOCUS",
        DEFINITION_TAG: "DEFINITION",
        ACCESSION_TAG: "ACCESSION",
        VERSION_TAG: "VERSION",
        KEYWORDS_TAG: "KEYWORDS",
        //SEGMENT_TAG:"SEGMENT"
        SOURCE_TAG: "SOURCE",
        ORGANISM_TAG: "ORGANISM",
        REFERENCE_TAG: "REFERENCE",
        AUTHORS_TAG: "AUTHORS",
        CONSORTIUM_TAG: "CONSRTM",
        TITLE_TAG: "TITLE",
        JOURNAL_TAG: "JOURNAL",
        PUBMED_TAG: "PUBMED",
        REMARK_TAG: "REMARK",
        COMMENT_TAG: "COMMENT",
        FEATURE_TAG: "FEATURES",
        BASE_COUNT_TAG: "BASE COUNT",
        //CONTIG_TAG: "CONTIG"
        ORIGIN_TAG: "ORIGIN",
        END_SEQUENCE_TAG: "//"
	},

	constructor: function() {
		var that = this;
		
		var gbFM;
    	var lastObj;
    	var lastKey;
    	
    	var myFlag;
    	var myField;
    	
    	var genArr;
		
		
		//var gbFM = Ext.create('Teselagen.bio.parsers.GenbankFileModel');
		//var genArr = new Array();
		
		
		
		/* @function
         * @param {String} String form of Genbank File.
         * @return {GenbankFileModel}
         * @description Converts a Genbank File (in string format) into a GenbankFileFormat object. This is the main method in the GenbankFormat static class that performs the parsing.
         */
        this.parseGenbankFile = function(genbankFileString) {
        	gbFM = Ext.create('Teselagen.bio.parsers.GenbankFileModel');
        	
        	myFlag = new Flags();
        	myField = new Field();
        	
        	genArr	= genbankFileString.split(/[\n]+/g);
        	for (var i=0 ; i < genArr.length; i++) {
        		lineParser(genArr[i]);
        	}
        	
        	
        	return gbFM;
        }
        
        /* @function Line by line parser
         * @param {String} Single line from a Genbank File
         */
        function lineParser(line) {
        	var hasValue, len;
        	var key = getLineKey(line);
        	var val = getLineVal(line);
        	var newKey = isNewKeyword(line);
        	
        	myFlag.setType(key);
        	myFlag.setKeyType(newKey);
        	
        	// For Keyword Lines
        	
        	if ( key === that.self.LOCUS_TAG ) {
        		var tmp = parseLocus(line);
        		console.log(tmp.toString());
        		gbFM.setLocus(tmp);
        		//console.log(gbFM.toString());
        	} else if ( key === that.self.REFERNCE_TAG ) {
        		//parseReference(line);
        	} else if ( key === that.self.FEATURES_TAG ) {
        		//parseFeatures(line);
        	} else if ( key === that.self.ORIGIN_TAG ) {
        		parseOrigin(line);
        	} else if ( key === "BASE") {
        		//parseBaseCount(line);
        	} else if ( myFlag.keyword === true ) { //this is a Keyword, not subKeyword
        		//parseKeyword(line);
        	} else {}
        	
        	
        	
        	
        }
        
        
        /* -----------------------------------------------------
         *  KEYWORD/SUBKEYWORD PARSING FUNCTIONS
         * -----------------------------------------------------*/
        
        function parseLocus(line) {
        	var result, locusName, seqLen, strand, naType, linear, div, date;
        	var lineArr = line.split(/[\s]+/g);
        	//console.log(lineArr);

			locusName = lineArr[1];
			seqLen = lineArr[2];
			
			// StrandType: T.H. Code defaults only to ds-DNA
			if (lineArr[4].match(/ss/gi)) {
				strand = "ss";
			} else if (lineArr[4].match(/ds/gi)) {
				strand = "ds";
			} else {
				strand = "unknown";
			}
			
			// naType: T.H. defaults to DNA.
			if (lineArr[4].match(/DNA/gi)) {
				naType = "DNA";
			} else if (lineArr[4].match(/RNA/gi)) {
				naType = "RNA";
			} else {
				naType ="unknown";
			}
			
			// Linear vs Circular?; CANNOT HANDLE TANDEM
			for (var i=1; i < lineArr.length; i++) {
				if (lineArr[i].match(/linear/gi)) {
					linear = true;
				} else {
					linear = false;
				}
			}
			
			// Date
			if (lineArr[6].match(/[XYZ]{3}/g)) {
				div = lineArr[6];
				date = lineArr[7];
			} else {
				div = "";
				date = lineArr[6];
			}
        	
			// Just rewrite the existing Locus object. It's easier than setting everything.
        	var result = Ext.create('Teselagen.bio.parsers.GenbankLocusKeyword', {
        		locusName: locusName,
        		sequenceLength: seqLen,
        		strandType: strand,
        		naType: naType,
        		linear: linear,
        		divisionCode: div,
        		date: date
        	});
        	
        	//console.log(line);
        	//console.log(result.toString());
        	
        	gbFM.setLocus(result);
        	return result;
        }
		
        function parseFeatures(line) {
        	//var result = Ext.create('Teselagen.bio.parsers.GenbankOriginKeyword');
        	var result;
        	//gbFM.setOrigin(result);
        	return result;
        }
        
        function parseOrigin(line) {
        	//var result = Ext.create('Teselagen.bio.parsers.GenbankOriginKeyword');
        	var result = gbFM.getOrigin();
        	result.setSequence("Testing Sequence Setter");
        	gbFM.setOrigin(result);
        	return result;
        }
        /* -----------------------------------------------------
         *  HELPER PARSING FUNCTIONS
         * -----------------------------------------------------*/
		function getLineKey(line) {
			line    = line.replace(/^[\s]*/, "");
			var arr = line.split(/[\s]+/);
			return arr[0];
		}
		
		function getLineVal(line) {
			line	= line.replace(/^[\s]*[\S]+[\s]+|[\s]+$/, "");	
			return line;
		}
		
		function isNewKeyword(line) {
			if (line.match(/^[\s]+/)) {
				var newKey = true;
			} else {
				var newKey = false;
			}
			return newKey;
		}
		
		function detectField(key, fields) {
			var hasKey;
				for (var j=0; j<fields.length; j++) {
					if (key.match(fields[j]) && fields[j] !== undefined) {
					hasKey = j;
				}
			}
			return hasKey;
		}
		

		
		
		function subFeature(line) {	
			var newLine;
			newLine =    line.replace(/^[\s]*\//,"");
			newLine = newLine.replace(/"$/, "");
			
			var arr = newLine.split(/=\"|=/);
			
			myFlag.runon = runonCheck(line);
		
			return arr;
		}
		
		// Check if this line is connected to previous line (-> no new object)
		function runonCheck(line) {
			var runon;
			if ( line.match(/"$/ )) { // closed case: '/key="blahblah"'
				runon = false;
			} else if (line.match(/\)$/ )) { // closed case: 'CDS  ..join(<265..402,1088..1215)'
				runon = false;
			} else if ( line.charAt(line.length-1).match(/\d/)){ // number case: 'CDS 1..3123' OR  '/codon=1'
				runon = false;
			} else {
				runon = true;
			}
			return runon;
		}
		
		
		
		
		
		
		
		//=================================
		// INITIALIZING FIELDS
		//=================================
		
		function Field() {
			this.field = genbankFieldsSubset();
			this.ref   = genbankReference();
			//this.allFields  = genbankFields();
		
			function genbankFields() {
				var field = new Array();
				field[0] = "LOCUS";
				field[1] = "DEFINITION";
				field[2] = "ACCESSION";
				field[3] = "VERSION";
				field[4] = "KEYWORDS";
				field[5] = "SOURCE";
				field[6] = "ORGANISM";
				field[7] = "REFERENCE";
				field[8] = "AUTHORS";
				field[9] = "CONSRTM";
				field[10] = "TITLE";
				field[11] = "JOURNAL";
				field[12] = "PUBMED";
				field[13] = "REMARK";
				field[14] = "COMMENT";
				field[15] = "FEATURES";
				field[16] = "BASE COUNT";     
				field[17] = "ORIGIN";
				//field[18] = "//";
				field[18] = "ORIGIN";
				field[19] = "SEGMENT";
				field[20] = "CONTIG";
				return field;
			}
			
			function genbankFieldsSubset() {
				var field = new Array();
				//field[0] = "LOCUS";
				field[0] = "DEFINITION";
				field[1] = "ACCESSION";
				field[2] = "VERSION";
				field[3] = "KEYWORDS";
				field[4] = "SOURCE";
				field[5] = "ORGANISM";
				return field;
			}
			
			function genbankReference() {
				var field = new Array();
				field[0] = "AUTHORS";
				field[1] = "TITLE";
				field[2] = "JOURNAL";
				field[3] = "PUBMED";
				field[4] = "CONSRTM";
				return field;
			}
			
			function genbankFeatures() {
				var field = new Array();
				field[0] = "source";
				field[1] = "CDS";
				field[2] = "gene";
				field[3] = "<";
				//field[4] = "protein_id";
				return field;
			}
		} // END OF Field()
		
		
		//=================================
		// INITIALIZING FLAGS 
		//=================================
		function Flags() {
			this.origin     = false;
			this.features   = false;
			this.reference  = false;
			this.keyword	= false;
			this.subkeyword = false;
			this.runon      = false;
		
			this.setOrigin = function() {
				this.origin   = true;
				this.features = false;
				this.reference= false;
			}
			this.setFeatures = function() {
				this.origin   = false;
				this.features = true;
				this.reference= false;
			}
			this.setReference = function() {
				this.origin   = false;
				this.features = false;
				this.reference= true;
			}
			this.setNone = function() {
				this.origin   	= false;
				this.features 	= false;
				this.reference	= false;
				this.keyword	= false;
				this.subkeyword	= false;
				this.runon	  	= false;
			}
			this.setKeyType = function(newKey) {
				if (newKey === true) {
					this.keyword	= true;
					this.subkeyword	= false;
				} else {
					this.keyword	= false;
					this.subkeyword	= true;
				}
			}
			this.setType = function(key) {
				if (key === "REFERENCE") {
					this.setReference();
				} else if (key === "FEATURES") {
					this.setFeatures();
				} else if (key === "ORIGIN") {
					this.setOrigin();
				}
			}
		} // END OF Flags()
		
		return this;
	}

	
});