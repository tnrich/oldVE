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


		//var gb = Ext.create('Teselagen.bio.parsers.Genbank');
		//var genArr = new Array();


		/* @function
		 * @param {String} String form of Genbank File.
		 * @return {Genbank}
		 * @description Converts a Genbank File (in string format) into a GenbankFileFormat object. This is the main method in the GenbankFormat static class that performs the parsing.
		 */
		this.parseGenbankFile = function(genbankFileString) {
			gb = Ext.create("Teselagen.bio.parsers.Genbank");

			myFlag = new Flags();
			//myField = new Field();

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
			//var isSubKey = isSubKeyword(line);
			var tmp = null;

			myFlag.setType(key, subKey);

			// For Keyword Lines

			switch (key) {
			case that.self.LOCUS_TAG:
				tmp = parseLocus(line);
				lastObj = gb.getLocus();
				break;
			case that.self.REFERENCE_TAG:
				//tmp = parseReference(line);
				break;
			case that.self.FEATURES_TAG:
				tmp = parseFeatures(line);
				lastObj = gb.getFeatures();
				break;
			case that.self.ORIGIN_TAG:
				var tmp = parseOrigin(line);
				lastObj = gb.getOrigin();
				break;
			case "BASE":
				//
				break;
			case that.self.END_SEQUENCE_TAG:
				break;
			default:
				//console.log("default case: " + line);
				if (myFlag.keyword ) {	// NON-LOCUS/REFERENCE/FEATURES/ORIGIN KEYWORDS
					tmp = parseKeyword(line);
					gb.addKeyword(tmp);
					lastObj = gb.getKeywords().pop();
				} else if ( myFlag.subkeyword && myFlag.features) { // FEATURE ELEMENTS & FEATURE QUALIFIERS
					console.log(line);
					tmp = parseFeatures(line);
					//console.log(tmp.toString());
					lastObj = tmp;
				} else if (myFlag.origin) {	// ORIGIN SEQUENCE LINES
					tmp = parseOrigin(line);
					lastObj = gb.getOrigin();
				}


			}
			//lastObj = gb.getKeywords().pop();
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
			gb.setLocus(result);
			gb.addKeywordTag(that.self.LOCUS_TAG);
			//gb.addKeywords(result);
			return result;
		}

		function parseKeyword(line) {
			var key = getLineKey(line);
			var val = getLineVal(line);
			var result = Ext.create("Teselagen.bio.parsers.GenbankKeyword", {
				keyword: key,
				value: val
			});;

			gb.addKeyword(result);
			gb.addKeywordTag(key);
			//gb.addKeywords(result); only do this if not existing
			return result;
		}

		function parseReference(line) {
			var result;
			/*if (getLineKey(line) === that.self.REFERENCE_TAG) {
        		result = Ext.create("Teselagen.bio.parsers.GenbankKeyword", {
        			keyword: that.self.REFERENCE_TAG,
        			value: getLineVal(line)
        		});
        	} else {

        	}*/
			return result;
		}

		function parseFeatures(line) {
			var result, featElm;
			var key, val, qual;
			
			if (myFlag.runon === false ) {
				if (getLineKey(line) === that.self.FEATURES_TAG) {
					result = Ext.create("Teselagen.bio.parsers.GenbankFeatureKeyword");
					result.setKeyword(that.self.FEATURES_TAG);
					gb.setFeatures(result);
					gb.addKeywordTag(that.self.FEATURES_TAG);
				} else {
					result = gb.getFeatures();
					//console.log(result.toString());
					//var lineArr = line.split(/[\s]+/g);
					qual = isQualifier(line);
					if (!qual) { // is a  Feature Element (e.g. source, CDS) with sequence indices/locations in the "KEY  BLAH"
						key = getLineKey(line);
						val = getLineVal(line);
						featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
							key: key,
							strand: val
						});
						// complment and join are default for now
						parseFeatureLocation(featElm, val);
						console.log(featElm.toString());
						result.addElement(featElm);	
					} else {  // is a FeatureQualifier in the /KEY="BLAH" format
						featQual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
							name: key,
							value: val,
							quoted: null
						});


					}

				}
			}
			return result;
		}
		
		function parseFeatureLocation(featElm, locStr) {
			var result, location;
			var complement = false;
			var join = false;
			
			locStr = locStr.trim();
			console.log(locStr);
			
			if (locStr.match(/complement\(join/i) ) {
				complement = true;
				featElm.setComplement(complement);
			}
			if (locStr.match(/join/i) ) {
				join = true;
				featElm.setJoin(join);
			}
			
			
			locStr = locStr.replace(/complement | join | \( | \) | \> | \< /g,"");
			console.log(locStr);
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

			return result;
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
				console.log("Found Qualifier using RegEx.");
			}
			return qual;
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