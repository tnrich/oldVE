/**
 * GenbankManager 
 * Takes in Genbank File (as a string) and creates the Genbank class. Static functions. (Replaces GenbankFormat.js)
 * @author Diana Wong
 * @author Timothy Ham (original author of GenbankFormat.js)
 */

Ext.define("Teselagen.bio.parsers.GenbankManager", {
	/**
	 * Static variables. Common Genbank Keyword names.
	 */
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
		FEATURES_TAG: "FEATURES",
		BASE_COUNT_TAG: "BASE COUNT",
		//CONTIG_TAG: "CONTIG"
		ORIGIN_TAG: "ORIGIN",
		END_SEQUENCE_TAG: "//"
	},
	
	/**
	 * Creates a static GenbankManager class with public functions.
	 * @returns {GenbankManager} Handle to execute methods.
	 */
	constructor: function() {
		var that = this;

		var gb;
		var lastObj, lastKey; // To keep track of last object/key when parsing next line
		var flag, myField;  // Flags and Fields to keep track of stuff
		var genArr;
		
		/**
		 * Loads a Genbank File.
		 * @param {HTMLElement} fileInput
		 * @returns {String} genbankFileString
		 */
		this.loadFile = function(fileInput) {
			var genbankFileString;
			var file = fileInput.files[0];
			fr = new FileReader();
			fr.onload = processText;
            fr.readAsText(file);
            
            function processText() {
                var result = fr.result;
                //var gb = Ext.create('Teselagen.Genbank', result);
                //console.log(gb);
            }
            
			return genbankFileString;
		}
		
		/**
		 * Converts a Genbank File (in string format) into a GenbankFileFormat object. This is the main method in the GenbankFormat static class that performs the parsing.
		 * @param {String} genbankFileString String form of Genbank File.
		 * @return {Genbank}
		 */
		this.parseGenbankFile = function(genbankFileString) {
			gb = Ext.create("Teselagen.bio.parsers.Genbank");

			flag = new Flags();
			//myField = new Field();

			genArr	= genbankFileString.split(/[\n]+|[\r]+/g);
			for (var i=0 ; i < genArr.length; i++) {
				lineParser(genArr[i]);
			}
			return gb;
		}
		
		/** 
		 * Line by line parser
		 * @param {String} line A single line from a Genbank File
		 * @private
		 */
		function lineParser(line) {
			//var hasValue, len;
			var key = getLineKey(line);
			var val = getLineVal(line);
			var isKeyRunon = isKeywordRunon(line);
			var isSubKey = isSubKeyword(line);
			var isKey = isKeyword(line);
			var tmp = null;
			

			flag.setType(key, isKey);

			// For Keyword Lines
			
			//console.log(flag.features + "-" + line + "isKey" + isKey);
			
			switch (key) {
			case that.self.LOCUS_TAG:
				lastObj = parseLocus(line);
				break;
			case that.self.FEATURES_TAG:
				lastObj = parseFeatures(line);
				break;
			case that.self.ORIGIN_TAG:
				lastObj = parseOrigin(line);
				break;
			case "BASE":
				console.log("BASE");
				break;
			case that.self.END_SEQUENCE_TAG:
				console.log("END");
				break;
			default:
				if ( line === "") {
					// do nothing;
					break;
				} else if ( isKey  ) {		// REGULAR KEYWORDS (NOT LOCUS/FEATURES/ORIGIN)
					lastObj = parseKeyword(line);
				} else if ( flag.features ) { // FEATURE ELEMENTS & FEATURE QUALIFIERS
					console.log(line);
					lastObj = parseFeatures(line);
				} else if ( flag.origin) {		// ORIGIN SEQUENCE LINES; THIS MUST COME BEFORE SUBKEYWORD BECAUSE THESE LINES LOOK LIKE SUBKEYWORDS
					lastObj = parseOrigin(line);
				} else if ( isSubKey ) {	// REGULAR KEYWORD SUBKEYWORD, NOT FEATURE
					tmp = gb.getLastKeyword();
					lastObj = parseSubKeyword(tmp, line);
				} else if ( isKeyRunon ) {
					//console.log(lastObj.getValue());
					lastObj.setValue(lastObj.getValue() + "\n".rpad(" ",13) + line.trim());
					//console.log(lastObj.getValue());
					//console.log(lastObj.toString());
				}
			}
			
		}

		/* -----------------------------------------------------
		 *  KEYWORD/SUBKEYWORD PARSING FUNCTIONS
		 * -----------------------------------------------------*/
		/**
		 * Parses Locus Line
		 * @param {String} line
		 * @returns {GenbankLocusKeyword} result
		 * @private
		 */
		function parseLocus(line) {
			var result, locusName, seqLen, strand, naType, linear, div, date;
			var lineArr = line.split(/[\s]+/g);

			locusName = lineArr[1];
			seqLen = lineArr[2];

			// StrandType: T.H. Code defaults only to ds-DNA
			if (lineArr[4].match(/ss/gi)) {
				strand = "ss";
			} else if (lineArr[4].match(/ds/gi)) {
				strand = "ds";
			} else {
				strand = ""; //"unknown";
			}

			// naType: T.H. defaults to DNA.
			if (lineArr[4].match(/DNA/gi)) {
				naType = "DNA";
			} else if (lineArr[4].match(/RNA/gi)) {
				naType = "RNA";
			} else {
				naType = ""; //"unknown";
			}

			// Linear vs Circular?; CANNOT HANDLE TANDEM
			for (var i=1; i < lineArr.length; i++) {
				if (lineArr[i].match(/circular/gi)) {
					linear = false;
					break;
				} else {
					linear = true;
				}
			}

			// Date
			if (lineArr[lineArr.length-2].match(/[A-Z]{3}/g)  ) {
				div = lineArr[lineArr.length-2];
				date = lineArr[lineArr.length-1];
			} else {
				div = "";
				date = lineArr[lineArr.length-1];
			}

			// Just rewrite the existing Locus object. It's easier than setting everything.
			var result = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
				locusName: locusName,
				sequenceLength: seqLen,
				strandType: strand,
				naType: naType,
				linear: linear,
				divisionCode: div,
				date: date
			});

			result.setKeyword(that.self.LOCUS_TAG);	
			gb.addKeyword(result);
			gb.addKeywordTag(that.self.LOCUS_TAG);
			return result;
		}
		/**
		 * Parses Keyword
		 * @param {String} line
		 * @returns {GenbankKeyword} result
		 * @private
		 */
		function parseKeyword(line) {
			var key = getLineKey(line);
			var val = getLineVal(line);
			var result = Ext.create("Teselagen.bio.parsers.GenbankKeyword", {
				keyword: key,
				value: val
			});
			gb.addKeyword(result);
			gb.addKeywordTag(key);

			return result;
		}
		/**
		 * Parses SubKeywords
		 * @param {GenbankKeyword} mainKey
		 * @param {String} line
		 * @returns {GenbankSubKeyword} result
		 * @private
		 */
		function parseSubKeyword(mainKey, line) {
			var key = getLineKey(line);
			var val = getLineVal(line);

			var result = Ext.create("Teselagen.bio.parsers.GenbankSubKeyword", {
				keyword: key,
				value: val
			});
			mainKey.addSubKeyword(result);

			return result;
		}
		
		
		
		/**
		 * Parses Features
		 * @param {String} line
		 * @returns {GenbankFeaturesKeyword} result
		 * @private
		 */
		function parseFeatures(line) {
			var result, featElm, featQual, lastElm;
			var qual;
			var key = getLineKey(line);
			var val = getLineVal(line);
			
			//// console.log(flag.runon + " : " + line);
			
			if (flag.runon === false ) {
				if (getLineKey(line) === that.self.FEATURES_TAG) {
					result = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword");
					result.setKeyword(that.self.FEATURES_TAG);
					gb.setFeatures(result);
					gb.addKeywordTag(that.self.FEATURES_TAG);
				} else {
					result = gb.getFeatures();
					qual = isQualifier(line);
					if (!qual) { // is a  Feature Element (e.g. source, CDS) with sequence indices/locations in the "KEY  BLAH"
						
						featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
							key: key,
							strand: val
						});
						// complment and join are default for now
						// Could be multiple locations per Element
						parseFeatureLocation(featElm, val);
						result.addElement(featElm);
						lastObj = featElm;
					} else {  // is a FeatureQualifier in the /KEY="BLAH" format; could be multiple per Element
						featQual = parseFeatureQualifier(line);
						lastElm = result.getLastElement();
						lastElm.addFeatureQualifier(featQual);
						lastObj = featQual;
					}
					flag.runon = isRunon(line);
				}
			} else {
				result = gb.getFeatures();
				var type = Ext.getClassName(lastObj);
				if (type.match(/GenbankFeatureElement/g) ) {
					parseFeatureLocation(lastObj, line.trim());
				} else if ( type.match(/GenbankFeatureQualifier/) ) {
					
					////console.log("Qualifier: " + line.trim().replace(/\"/g, ""));
					
					lastObj.appendValue(line.trim().replace(/\"/g, ""));
				}
				flag.runon = isRunon(line);
			}
			
			return result;
		}
		/**
		 * Parses Feature Locations
		 * @param {GenbankFeaturesElement} featElm
		 * @param {String} locStr
		 * @returns {GenbankFeatureLocation} location
		 * @private
		 */
		function parseFeatureLocation(featElm, locStr) {
			var location;
			var complement = false;
			var join = false;
			
			locStr = locStr.trim();
			
			if (locStr.match(/complement/i) ) {
				complement = true;
				featElm.setComplement(complement);
			}
			if (locStr.match(/join/i) ) {
				join = true;
				featElm.setJoin(join);
			}
			
			//locStr = locStr.replace(/complement|join|\(|\)|\>|\</g,"");
			locStr = locStr.replace(/^,|,$|complement|join|\(|\)/g,"");
			locArr = locStr.split(/,/g);
			
			// NEED TO DO > or < cases?
			
			for (var i=0; i<locArr.length; i++) {
				var ind = locArr[i].split(/[.]+/);
				location = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
					start: ind[0],
					end: ind[1]
				});
				featElm.addFeatureLocation(location);
			}
			
			if (complement && join) {
				// Do ReverseLocations Case
			}

			return location;
		}
		/**
		 * Parses Feature Qualifier
		 * @param {String} line
		 * @returns {GenbankFeatureQualifier} featQual
		 * @private
		 */
		function parseFeatureQualifier(line) {
			var featQual, newLine, lineArr, quoted;
			
			newLine = line.trim();
			newLine = newLine.replace(/^\/|"$/g, "");
			lineArr = newLine.split(/=\"|=/);
			
			if (line.match(/=\"/g)) {
				quoted = true;
			} else { 
				quoted = false;
			}
			
			featQual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
				name: lineArr[0],
				value: lineArr[1],
				quoted: quoted
			});
			return featQual;
		}
		/**
		 * Parses Origin lines.
		 * @param {String} line
		 * @returns {GenbankOriginKeyword} result
		 * @private
		 */
		function parseOrigin(line) {  
			var result;
			var key = getLineKey(line);
			if (key === that.self.ORIGIN_TAG) {
				result = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword");
				result.setKeyword(that.self.ORIGIN_TAG);
				gb.setOrigin(result);
				gb.addKeywordTag(that.self.ORIGIN_TAG);
			} else { 
				result = gb.getOrigin();
				line = line.replace(/[\s]*[0-9]*/g,"");
				result.appendSequence(line);
			}
			return result;
		}

		/* -----------------------------------------------------
		 *  HELPER PARSING FUNCTIONS
		 * -----------------------------------------------------*/
		/**
		 * Gets the Key in a line of format " Key Value"
		 * @param {String} line
		 * @returns {String} key
		 * @private
		 */
		function getLineKey(line) {
			line    = line.replace(/^[\s]*/, "");
			var arr = line.split(/[\s]+/);
			return arr[0];
		}
		/**
		 * Gets the value in a line of format " Key Value"
		 * @param {String} line
		 * @returns {String} val
		 * @private
		 */
		function getLineVal(line) {
			line	= line.replace(/^[\s]*[\S]+[\s]+|[\s]+$/, "");	
			line = Ext.String.trim(line);
			return line;
		}
		/**
		 * Checks if line is a Keyword line. If there is NO whitespace greater than before keyword, then it's a subkeyword. 
		 * Works for FeatureElements too but not used there.
		 * @param {String} line
		 * @return {Boolean} isKey
		 * @private
		 */
		function isKeyword(line) {
			var key = getLineKey(line);
			var isKey = false;
			if ( line.substr(0,10).match(/^[\S]+/) ) {
				//console.log("Key" + line);
				isKey = true;
			}
			return isKey;
		}
		/**
		 * Checks if line is a SubKeyword line. If there is some whitespace before keyword, then it's a subkeyword. 
		 * Works for FeatureElements too but not used there.
		 * @param {String} line
		 * @return {Boolean} isSubKey
		 * @private
		 */
		function isSubKeyword(line) {
			var key = getLineKey(line);
			var isSubKey = false;
			//console.log(key.match(/[\d]+/));
			/*if (line.match(/^[\s]+/)) {// && !key.match(/[\d]+/)) {
				var subKey = true;
			} else {
				var subKey = false;
			}
			return subKey;
			*/
			
			if ( line.substr(0,10).match(/^[\s]+[\S]+/) ) {
				//console.log("sub:" + line);
				var isSubKey = true;
			} 
			return isSubKey;
		}

		/**
		 *  Checks if this line is a continuation of previous Keyword or SubKeyword line. 
		 *  (Do not create new object, just append to previous object.)
		 *  @param {String} line
		 *  @returns {Boolean} runon
		 *  @private
		 */
		function isKeywordRunon(line) {
			var runon;
			if ( line.substr(0,10).match(/[\s]{10}/)) {
				runon = true;
			} else {
				runon = false;
			}
			return runon;
		}
		
		/**
		 * Determines if the line is a Feature Qualifier, ie with syntax like /blah="information"
		 * @param {String} line
		 * @return {Boolean} qual
		 * @private
		 */
		function isQualifier(line) {
			var qual = false;
			/*if (line.charAt(21) === "/") {//T.H. Hard coded method 
				qual = true;
			}*/

			if ( line.trim().charAt(0).match(/\// )) {
				console.log("Found Qualifier using / sign.");
				qual = true;
			} else if ( line.match(/^[\s]*\/[\w]+=[\S]+/) ) {
				qual = true;
			}
			return qual;
		}
		/**
		 *  Checks if this line is a continuation of previous Feature Qualfier line. 
		 *  (Do not create new object, just append to previous object.)
		 *  @param {String} line
		 *  @returns {Boolean} runon
		 *  @private
		 */
		function isFeatureQualifierRunon(line) {
			var runon = false;
			if ( line.trim().charAt(0).match(/\// )) {
				runon = false;
			}
			return runon;
		}
		/**
		 *  Checks if this line is a continuation of previous Feature Location line. 
		 *  (Do not create new object, just append to previous object.)
		 *  @param {String} line
		 *  @returns {Boolean} runon
		 *  @private
		 */
		function isFeatureLocationRunon(line) {
			var runon = false;
			if ( line.trim().charAt(0).match(/[\d]/) && line.match(/../g) ) {
				runon = false;
			}
			return runon;
		}
		/**
		 *  Checks if this line will runon to next line (do not create new object @ next line, just append)
		 *  @param {String} line
		 *  @returns {Boolean} runon
		 *  @private
		 */
		function isRunon(line) {
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
			this.field = keywords();
			this.ref   = references();
			//this.allFields  = genbankFields();

			function keywords() {
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
				field[19] = "SEGMENT";
				field[20] = "CONTIG";
				return field;
			}

			function subKeyword() {
				var field = new Array();
				field[0] = "AUTHORS";
				field[1] = "TITLE";
				field[2] = "JOURNAL";
				field[3] = "PUBMED";
				field[4] = "CONSRTM";
				field[5] = "ORGANISM";
				return field;
			}

			function references() {
				var field = new Array();
				field[0] = "AUTHORS";
				field[1] = "TITLE";
				field[2] = "JOURNAL";
				field[3] = "PUBMED";
				field[4] = "CONSRTM";
				return field;
			}

			function features() {
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
				//this.keyword	= false;
				//this.subkeyword	= false;
				this.runon	  	= false;
			}

			this.setType = function(key, isKey) {
				if (isKey === true) {
					this.keyword	= true;
					this.subkeyword	= false;
				} else {
					this.keyword	= false;
					this.subkeyword	= true;
				}

				if (key === "REFERENCE") {
					this.setReference();
				} else if (key === "FEATURES") {
					this.setFeatures();
				} else if (key === "ORIGIN") {
					this.setOrigin();
				} else if (key === that.self.END_SEQUENCE_TAG) {
					this.setNone();
				} else if (isKey === true) {
					this.setNone();
				}
			}
		} // END OF Flags()

		return this;
	}


});