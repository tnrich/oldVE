
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
         * @description Converts a Genbank File (in string format) into a GenbankFileFormat object. This is the main function in the GenbankFormat static class that performs the parsing.
         */
        this.parseGenbankFile = function(genbankFileString) {
        	var gbFM = Ext.create('Teselagen.bio.parsers.GenbankFileModel');
        	
        	// Process Keywords
        	
        	var keywordBlocks = splitKeywordBlocks(genbankFileString);
        	var keyword = Ext.create('Teselagen.bio.parsers.GenbankKeyword');
        	
        	console.log(keywordBlocks);
        	
        	// Process Origin
        	
        	
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

        //---------------------------------------------
        // Private Methods						 	//
		//---------------------------------------------
		
		/* @function
         * @param {String}
         * @returns {Array} 
         */
		function splitKeywordBlocks (genbankFileString) {
			return splitBlocksByCharAt(genbankFileString, 0);
		}
		
		/* @function
         * @param {String, Int}
         * @returns {Array} 
         */
		function splitBlocksByCharAt (gbFileString, ind) {
			var result = new Array();
			if (gbFileString === "" || gbFileString === null) {
				return null;
			}
			
			var lineArr = gbFileString.split(/\n/g);
			var newBlock = "";
			for (var i = 0; i< lineArr.length; i++) {
				var line = lineArr[i];
				if (line.charAt(ind) == " ") {
					newBlock += "\n" + line;
					console.log(newBlock);
				} else if (line != "") {
					
					if (newBlock != "") {
						result.push(newBlock)	
					}
					newBlock = line;
				}
			}
			//console.log(newBlock);
			result.push(newBlock);
			return result;
		}
		
		
		
		
		function extractOrigin(gbFileString) {
			var result = new Array();
			var gbOrigKey = Ext.create(Teselagen.bio.parsers.GenbankOriginKeyword);
			var seq = "";
			var rest = "";
			
			var lineArr = gbFileString.split(/\n/g);
			var origFlag = false;
			var seqBlock = "";
			
			for (var i = 0; i< lineArr.length; i++) {
				var line = lineArr[i];
				if ( getLineKey(line) === "ORIGIN") { //gb.self.ORIGIN_TAG
					gbOrigKey.setKeyword(getLineKey(line));
					//gbOrigKey.setValue();
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
			
			
			return result;
		}
		
		//parseKeywordBlock(block:String):GenbankKeyword
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