
    /**
    * GenbankFormat class 
    * @description Takes in file input (as a string) and creates the GenbankFileModel class. Static functions.
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankFormat', {
	/** @lends  */
	//singleton: true, // CANNOT USE THIS WITH EXT.CREATE
    
	/* Public statics */
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
 
	
	
	/* @constructor
	 * @param {String} 
	 * @description Static Class. Methods help build a GenbankFileModel object.
	 */
	constructor: function () {
		var that = this;
		
		//---------------------------------------------
        // Priveleged Methods (Open to Public)		//
		//---------------------------------------------
        
        /*
         * @function
         * @param {String} String form of Genbank File.
         * @return {GenbankFileModel}
         * @description Converts a Genbank File (in string format) into a GenbankFileFormat object. This is the main method in the GenbankFormat static class that performs the parsing.
         */
        this.parseGenbankFile = function(genbankFileString) {
        	var gbFM = Ext.create('Teselagen.bio.parsers.GenbankFileModel');
        	
        	// Process Keywords
        	
        	var keywordBlocks = splitKeywordBlocks(genbankFileString);
        	//var keyword = Ext.create('Teselagen.bio.parsers.GenbankKeyword');
        	//console.log(keywordBlocks);
        	
        	
        	
        	// RECONSIDER REWRITING THIS PART TO SAVE KEYWORDS. THIS IS NOT OPTIMAL!!!!
        	for (var i=0; i < keywordBlocks.length; i++) {
        		gbKey = parseKeywordBlock(keywordBlocks[i]);
        		console.log(gbKey);
        		if (gbKey.keyword === that.self.LOCUS_TAG) {
        			//gbFM.setKeyword
        		} else if (gbKey.keywords === that.self.ACCESSION_TAG) {
        		} else if (gbKey.keywords === that.self.VERSION_TAG) {
        		} else if (gbKey.keywords === that.self.DEFINITION_TAG) {
        		} else if (gbKey.keywords === that.self.KEYWORDS_TAG) {
        		} else if (gbKey.keywords === that.self.FEATURES_TAG) {
        		} else if (gbKey.keywords === that.self.ORIGIN_TAG) {
        		} else {
        			gbFM.getKeywords().push(gbKey);
        		}
        		
        		
        	}
        	//gbFM.setKeywords(gbFM.getKeywords().push(keyword));
        	//console.log(gbFM.getKeywords());
        	
        	
        	// Process Origin
        	var orig = extractOrigin(genbankFileString);
        	console.log(orig);
        	gbFM.setOrigin(orig);
        	
        	
        	return gbFM;
        }
        
        /*
         * @function
         * @param {GenbankFileModel}
         * @returns {String} String form of Genbank File.
         */
        this.generateGenbankFile = function(genbankFileModel) {
        	var result = "";
        	
        	return result;
        }
        
        /* 
         * @function
         * @param {text}
         * @returns {Array} 
         */
        this.parseGenbankLocation = function(text) {
        	var result = new Array();
        	
        	return result;
        }

        // =============================================
        // Private Methods						 	//
		// =============================================

        // ---------------------------------------------
        // KEYWORD PARSING (all but Origin)
        // ---------------------------------------------
         
		/* @function 
         * @param {String}
         * @returns {Array} 
         */
		function splitKeywordBlocks (gbFileStr) {
			return splitBlocksByCharAt(gbFileStr, 0);
		}
		
		/* @function
         * @param {String, Int}
         * @returns {Array} 
         */
		function splitBlocksByCharAt (gbFileStr, ind) {
			var result = new Array();
			if (gbFileStr === "" || gbFileStr === null) {
				return null;
			}
			
			var lineArr = gbFileStr.split(/[\n]+/g);
			var newBlock = "";
			for (var i = 0; i< lineArr.length; i++) {
				var line = lineArr[i];
				if (line.charAt(ind) == " ") {
					newBlock += "\n" + line;
				} else if (line != "") {
					if (newBlock != "") {
						result.push(newBlock);	
					}
					newBlock = line;
				}
			}
			//console.log(newBlock);
			result.push(newBlock);
			//console.log(result);
			return result;
		}
		
        /* @function Takes a keword block (not origin) and parses into a GenbankKeyword (super) object.
         * @param {String}
         * @returns {GenbankKeyword} 
         */
		function parseKeywordBlock (blockStr) {
			if (blockStr === "" || blockStr === undefined) {
				return null;
			}
			
			var result = Ext.create('Teselagen.bio.parsers.GenbankKeyword');
			var blockArr, keyword, subKeywords;
			
			var blockArr = blockStr.split(/[\s]+/);
			console.log(blockArr);
			var keyword = blockArr[0];
			console.log(keyword);
			
			//console.log(that.self.LOCUS_TAG);
			if (keyword === that.self.LOCUS_TAG) {
				result = parseLocusBlock(blockArr);
				console.log(result);
			} else if (keyword === that.self.FEATURE_TAG) {
				subBlocks = splitFeatureKeywordBlocks(blockStr);
			}
			
			result.setKeyword(keyword);
			result.setSubKeywords(subKeywords);
			console.log(result.toJsonString());
			return result;
		}
		// ---------------------------------------------
		// parseKeywordBlock: LOCUS PARSING
		// ---------------------------------------------
        /* @function Takes a locus block and parses into a GenbankLocusKeyword object.
         * @param {StringArray}
         * @returns {GenbankLocusKeyword} 
         */
		function parseLocusBlock(blockArr) {
			var result = Ext.create('Teselagen.bio.parsers.GenbankLocusKeyword');
			// T.H. code does not distinguish btw "bp" or not "bp"
			/*if (blockArr[3] === "bp") {
				result.setLocusName(blockArr[1]);
			} else {
				result.setLocusName(blockArr[1]);
			}*/
			// Locus Name
			result.setLocusName(blockArr[1]);
			
			// SequenceLength
			result.setSequenceLength(blockArr[2]);
			
			// StrandType: T.H. Code defaults only to ds-DNA
			if (blockArr[3].match(/ss/gi)) {
				result.setStrandType("ss");
			} else if (blockArr[3].match(/ds/gi)) {
				result.setStrandType("ds")
			} else {
				result.setStrandType("unknown");
			}
			
			// naType: T.H. defaults to DNA.
			if (blockArr[3].match(/DNA/gi)) {
				result.setNaType("DNA");
			} else if (blockArr[3].match(/RNA/gi)) {
				result.setNaType("RNA")
			} else {
				result.setNaType("unknown");
			}
			
			// Linear vs Circular?; CANNOT HANDLE TANDEM
			for (var i=1; i < blockArr.length; i++) {
				if (blockArr[i].match(/linear/gi)) {
					result.setLinear(true);
				} else {
					result.setLinear(false);
				}
				// Circular may be redundant
				if (blockArr[i].match(/circular/gi)) {
					result.setLinear(true);
				} else {
					result.setLinear(false);
				}
			}
			
			// Date
			result.setDate = new Date(blockArr[6]);
			
			//console.log(result);
			return result;
		}
		// ---------------------------------------------
		// parseKeywordBlock: FEATURE PARSING
		// ---------------------------------------------
        /* @function Takes a feature block and //parses into a GenbankLocusKeyword object.
         * @param {StringArray}
         * @returns {GenbankLocusKeyword} 
         */
		function splitFeatureKeywordBlocks(blockArr) {
			var result = new Array();
			
			for (var i=1; i < blockArr.length; i++) { // First line is just FEATURES..Location/Qualifiers
				var line = blockArr[i];
				
			}
			
			return result;
		}
		
		
		// ---------------------------------------------
		// ORIGIN PARSING
		// ---------------------------------------------
		
		function extractOrigin(gbFileString) {
			var result = new Array();
			var gbOriginKey = Ext.create(Teselagen.bio.parsers.GenbankOriginKeyword);
			var seq = "";
			var rest = "";
			
			var lineArr = gbFileString.split(/\n/g);
			var origFlag = false;
			var seqBlock = "";
			
			for (var i = 0; i< lineArr.length; i++) {
				var line = lineArr[i];
				if ( getLineKey(line) === "ORIGIN") { //gb.self.ORIGIN_TAG
					//gbOriginKey.setKeyword(getLineKey(line));
					//gbOriginKey.setValue();
					origFlag = true;
					i++;
				}
				
				if (origFlag === true && getLineKey(line) !== "//") {
					line = line.replace(/[\s]*[0-9]*/g,"");
					gbOriginKey.appendSequence(line);
				}
				
				if (origFlag === true && getLineKey(line) === "//") {
					origFlag = false;
				}
			}
			console.log(JSON.stringify(gbOriginKey));
			console.log("yup");
			
			return gbOriginKey;
			
		}
		
		//-parseKeywordBlock(block:String):GenbankKeyword
		//-extractOrigin(genbankFile:String):Array
		//-splitKeywordBlocks(genbankFile:String):Vector.<String>
		//splitSubKeywordBlocks(block:String):Vector.<String>
		//parseSubKeywordBlock(block:String):GenbankSubKeyword
		//splitFeatureKeywordBlocks(block:String):Vector.<String>
		// parseFeatureKeywordBlock(block:String):GenbankFeatureElement
		//splitFeatureQualifierBlocks(block:String):Vector.<String>
		//parseFeatureQualifierBlock(block:String):GenbankFeatureQualifier
		
		//parseLocusBlock(block:String):GenbankLocusKeyword
		
		//-splitBlocksByCharAt(block:String, index:int):Vector.<String>
		
		//generateLocusKeyword(locusKeyword:GenbankLocusKeyword):String
		
		//generateOriginKeyword(originKeyword:GenbankOriginKeyword):String
		
		
		//generateKeyword(keyword:GenbankKeyword):String
		
		//generateFeatureKeyword(featureKeyword:GenbankFeatureKeyword):String
		
		//generateFeatureQualifiers(qualifiers:Vector.<GenbankFeatureQualifier>):String
		
		//paddedString(value:String, length:int, leftPadding:Boolean = false):String
		
		//wrapLines(input:String, leftStartColumn:int = 12):String
		
		
		function getLineKey(line) {
			line    = line.replace(/^[\s]*/, "");
			var arr = line.split(/\s/);
			return arr[0];
		}
		
		function getLineVal(line) {
			line	= line.replace(/^[\s]*[\S]+[\s]+/, "");	
			return line;
		}
		
		
		return this;
    }
	
	
	

});