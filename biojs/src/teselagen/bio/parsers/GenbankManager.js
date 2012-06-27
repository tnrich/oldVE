/**
 * GenbankManager class 
 * @description Takes in file input (as a string) and creates the Genbank class. Static functions. Replaces GenbankFormat.js
 * @author Diana Wong
 * @author Timothy Ham (original author of GenbankFormat.js)
 */

Ext.define("Teselagen.bio.parsers.GenbankManager", {
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
		FEATURES_TAG: "FEATURES",
		BASE_COUNT_TAG: "BASE COUNT",
		//CONTIG_TAG: "CONTIG"
		ORIGIN_TAG: "ORIGIN",
		END_SEQUENCE_TAG: "//"
	},

	constructor: function() {
		var that = this;

		var gb;
		var lastObj, lastKey; // To keep track of last object/key when parsing next line
		var myFlag, myField; // Flags and Fields to keep track of stuff
		var genArr;

		/* @function
		 * @param {String} String form of Genbank File.
		 * @return {Genbank}
		 * @description Converts a Genbank File (in string format) into a GenbankFileFormat object. This is the main method in the GenbankFormat static class that performs the parsing.
		 */
		this.parseGenbankFile = function(genbankFileString) {
			gb = Ext.create("Teselagen.bio.parsers.Genbank");

			myFlag = new Flags();
			myField = new Field();

			genArr	= genbankFileString.split(/[\n]+/g);
			for (var i=0 ; i < genArr.length; i++) {
				lineParser(genArr[i]);
			}
			return gb;
		}

		/* @function Line by line parser
		 * @param {String} Single line from a Genbank File
		 */
		function lineParser(line) {
			var hasValue, len;
			var key = getLineKey(line);
			var val = getLineVal(line);
			var subKey = isSubKeyword(line);
			var tmp = null;

			myFlag.setType(key, subKey);

			// For Keyword Lines

			switch (key) {
			case that.self.LOCUS_TAG:
				tmp = parseLocus(line);
				break;
			/*case that.self.REFERENCE_TAG: // THIS IS SAME AS A KEYWORD/SUBKEYWORD
				tmp = parseReference(line);
				break;*/
			case that.self.FEATURES_TAG:
				tmp = parseFeatures(line);
				break;
			case that.self.ORIGIN_TAG:
				tmp = parseOrigin(line);
				break;
			case "BASE":
				//
				break;
			case that.self.END_SEQUENCE_TAG:
				break;
			default:
				if ( line === "") {
					// do nothing;
					break;
				} else if ( myFlag.keyword ) {		// NON-LOCUS/REFERENCE/FEATURES/ORIGIN KEYWORDS
					tmp = parseKeyword(line);
				} else if ( myFlag.subkeyword && myFlag.features) { // FEATURE ELEMENTS & FEATURE QUALIFIERS
					tmp = parseFeatures(line);
				} else if ( myFlag.origin) {		// ORIGIN SEQUENCE LINES
					tmp = parseOrigin(line);
				} else if ( myFlag.subkeyword ) {	// REGULAR KEYWORD SUBKEYWORD, NOT FEATURE
					tmp = gb.getLastKeyword();
					parseSubKeyword(tmp, line);
				}
			}
		}


		/* -----------------------------------------------------
		 *  KEYWORD/SUBKEYWORD PARSING FUNCTIONS
		 * -----------------------------------------------------*/

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
			//gb.setLocus(result);
			gb.addKeyword(result);
			gb.addKeywordTag(that.self.LOCUS_TAG);
			return result;
		}

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
		
		function parseSubKeyword(mainKey, line) {
			var key = getLineKey(line);
			var val = getLineVal(line);
			
			if (!line.substr(0,11).match(/[\s]{11}/)) {  // A bit of a hack. Just makes sure first keyword has more than 2 upper case letters which signifies a keyword
				var result = Ext.create("Teselagen.bio.parsers.GenbankSubKeyword", {
					keyword: key,
					value: val
				});
				mainKey.addSubKeyword(result);
			} else {
				mainKey.getLastSubKeyword().appendValue("\n".rpad(" ",13) + line.trim());
			}
			return result;
		}

		function parseFeatures(line) {
			var result, featElm, featQual, lastElm;
			var qual;
			var key = getLineKey(line);
			var val = getLineVal(line);
			
			//// console.log(myFlag.runon + " : " + line);
			
			if (myFlag.runon === false ) {
				if (getLineKey(line) === that.self.FEATURES_TAG) {
					result = Ext.create("Teselagen.bio.parsers.GenbankFeatureKeyword");
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
					myFlag.runon = isRunon(line);
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
				myFlag.runon = isRunon(line);
			}
			
			return result;
		}
		
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
				location = Ext.create("Teselagen.bio.parsers.GenbankLocation", {
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
		function getLineKey(line) {
			line    = line.replace(/^[\s]*/, "");
			var arr = line.split(/[\s]+/);
			return arr[0];
		}

		function getLineVal(line) {
			line	= line.replace(/^[\s]*[\S]+[\s]+|[\s]+$/, "");	
			line = Ext.String.trim(line);
			return line;
		}
		/* @function If whitespace before keyword, then it's a subkeyword. Works for FeatureElements
		 * @param {String}
		 * @return {Boolean}
		 */
		function isSubKeyword(line) {
			if (line.match(/^[\s]+/)) {
				var newKey = true;
			} else {
				var newKey = false;
			}
			return newKey;
		}
		/* @function Determines if the line is a Feature Qualifier, ie with syntax like /blah="information"
		 * @param {String}
		 * @return {Boolean}
		 */
		function isQualifier(line) {
			var qual = false;
			/*if (line.charAt(21) === "/") {
				qual = true;
				console.log("T.H. Hard coded method works.");
			} else */
			
			if ( line.match(/^[\s]*\/[\w]+=[\S]+/) ) {
				qual = true;
			} else if ( line.substr(0,21).match(/[\s]{21}/ )) {
				console.log("Found Qualifier using 21 spaces.");
				qual = true
			}
			return qual;
		}

		// Check if this line is connected to previous line (-> no new object)
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
		
		function isAFieldName(key) {
			if (key.match(/[A-Z0-9]/i)) {
				return true;
			} else {
				return false;
			}
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

			this.setType = function(key, subKey) {
				if (subKey === false) {
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
				} else if (subKey === false) {
					this.setNone();
				}
			}
		} // END OF Flags()

		return this;
	}


});