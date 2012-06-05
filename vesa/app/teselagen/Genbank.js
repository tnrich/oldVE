
// Genbank object
// input: string of text of the genbank file
// ouput: Genbank Object
// http://javascript.crockford.com/private.html

Ext.define('Teselagen.Genbank', {
    constructor: function (genText) {
	
	// Make this.BLAH in lineParser() --> only make public objects as needed
	//this.LOCUS = "test";
	//this["REFERENCE"] = "blah";
	
	var that = this; // stupid thing to make this available to private functions
	
	var lastObj;
	var lastKey;
	var myFlag	= new Flags();
	var myField	= new Field();
	
	var genArr	= genText.split(/\n/g);
	
	for (var i=0 ; i < genArr.length; i++) {
		lineParser(genArr[i]);
	}

	
	//=================================================
	// Line by Line Parser, for constructor
	//=================================================
	function lineParser(line) {
		var hasValue;
		var len;
		var key = getLineKey(line);
		var val = getLineVal(line);
		
		myFlag.setType(key);
		// -----------------------------------------------------
		// INITIALIZATION //
		
		// LOCUS
		if ( key === "LOCUS" ) {
			// WARNING This is hardcoded. Fix later.
			//that[key] = makeLocus(key,val);
			that[key] = new Locus(val);
			return;
		}
		// REFERENCE init
		else if ( key === "REFERENCE") {
			if ( that[key] == undefined) {
				that[key] = [];	
			}
			len = that[key].length;
			that[key].push({ "name" : val });
			lastObj = that[key][len];
		}
		// FEATURES init
		else if ( key === "FEATURES" ) {
			that[key] = [];
			lastObj = that[key];
		}
		// ORIGIN init
		else if ( key === "ORIGIN") {
			that[key] = "";
		}
		// BASE COUNT
		else if ( key === "BASE") {
			// WARNING THIS IS HARDCODED!!!
			myFlag.setNone();
			var tmp = line.replace(/^[\s]*BASE COUNT[\s]+/g,"");
			var cnt = tmp.split(/[\s]+/g);
			that["BASECOUNT"] = {"A":cnt[0], "C":cnt[2], "G":cnt[4], "T":cnt[6] };
			//cnt[3]:cnt[2], cnt[5]:cnt[4], cnt[7]:cnt[6] });
		}
		
		// -----------------------------------------------------
		// PARSE FIELDS, REFERENCES, FEATURES, ORIGIN entries //
		
		// FIELDS - standard stuff
		hasKey = detectField(key, myField.field);
		if ( hasKey !== undefined) {
			that[key] = val;
		} 
		// REFERENCES entries
		else if (myFlag.reference === true && key !== "REFERENCE") {
			hasKey = detectField(key, myField.ref);
			if (hasKey !== undefined) {
				lastObj[key] = val;
				lastKey = key;
			} else {
				//RUN ON case
				var tmp = that["REFERENCE"].pop();
				tmp[lastKey] = tmp[lastKey] + line.replace(/^[\s]*/g, " ");
				that["REFERENCE"].push(tmp);
			}
		}
		// FEATURES entries
		else if (myFlag.features === true && key !== "FEATURES" ) {
			
			if (myFlag.runon === false) {
				var slash = line.match(/^[\s]*\/[\w]+=[\S]+/);
				if (slash == null) {
					// FOR entrees with "KEY BLAH" format
					len = that["FEATURES"].length;
					that["FEATURES"].push({"name":key, "basespan":val});
					lastKey = "basespan";
					lastObj = that["FEATURES"][len];
	
				} else {
					// FOR entrees with the /KEY="BLAH" format
					var arr = subFeature(line);
					lastObj[arr[0]]= arr[1];
					lastKey = arr[0];
					
				}
			} else {
				// RUN ON case
				var tmp = that["FEATURES"].pop();
				tmp[lastKey] = tmp[lastKey] + line.replace(/^[\s]*|\"$/g, "");
				that["FEATURES"].push(tmp);
			}
			// myFlag runon for next line
			myFlag.runon = runonCheck(line);
		}
		// ORIGIN entries
		else if (myFlag.origin === true && key !== "ORIGIN" ) {
			line = line.replace(/[\s]*[0-9]*/g,"");
			if ( key === "//" ) {
				myFlag.setNone();
				console.log("End of File.");
			} else {
				that["ORIGIN"] = that["ORIGIN"] + line;
				//console.log(line);
			}
		}

	
		// -----------------------------------------------------
		// Sub-OBJECT FUNCTIONS -- for constructor
		// -----------------------------------------------------
	


		
		function Locus(endLine) {
			var arr = endLine.split(/[\s]+/g);
			// WRITE PARSE CODE FOR LOCUS THAT IS NOT HARD CODED
			/*
			this.name   = arr[0];
			this.seqlen = arr[1];
			this.moltype = arr[3];
			this.gendiv  = arr[4];
			this.date = arr[5];
			*/
			return { "name": arr[0], "seqlen":arr[1], "moltype":arr[3], "gendiv":arr[4], "date":arr[5] };
		}
		
		function Reference(name) {
			this.REFERENCE = name;
		}
		function Feature(name) {
			this.FEATURE = name;
		}
		
		
	
		
		// -----------------------------------------------------
		// PARSING FUNCTIONS
		// -----------------------------------------------------
		
		function detectField(key, fields) {
			var hasKey;
				for (var j=0; j<fields.length; j++) {
					if (key.match(fields[j]) && fields[j] !== undefined) {
					hasKey = j;
				}
			}
			return hasKey;
		}
		
		function getLineKey(line) {
			line    = line.replace(/^[\s]*/, "");
			var arr = line.split(/\s/);
			return arr[0];
		}
		
		function getLineVal(line) {
			line	= line.replace(/^[\s]*[\S]+[\s]+/, "");	
			return line;
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
			if ( line.match(/"$/ )) {
				// closed case: '/key="blahblah"'
				runon = false;
			} else if (line.match(/\)$/ )) {
				// closed case: 'CDS  ..join(<265..402,1088..1215)'
				runon = false;
			} else if ( line.charAt(line.length-1).match(/\d/)){
				// number case: 'CDS 1..3123' OR  '/codon=1'
				runon = false;
			} else {
				runon = true;
			}
			return runon;
		}
		
	} // END OF lineParser()
	
	
	//=================================
	// INITIALIZING FIELDS
	//=================================
	
	function Field() {
		this.field = genbankFieldsSubset();
		//this.allFields  = genbankFields();
		this.ref   = genbankReference();
	
	
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
		this.runon      = false;
		this.origin     = false;
		this.features   = false;
		this.reference  = false;
	
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
			this.origin   = false;
			this.features = false;
			this.reference= false;
			this.runon	  = false;
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



	// -----------------------------------------------------
	// PRIVELEGED METHODS/FUNCTIONS --- ACCESSIBLE BY PUBLIC
	// -----------------------------------------------------
	
	this.toString = function () {
		return JSON.stringify(this, null, '  ');
	}	
	
	
	this.getOrigin = function () {
		return this.ORIGIN;
	}

	return this;
    }

});