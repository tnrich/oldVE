
function genbankExtractObj() {	

	var maxInput = 200000;

	var genText = document.getElementById('genbankText').value;
	
	if (genText.length < maxInput) {
		document.gentest.otxt1.value = genbankLineParser(genText);
	} else {
		document.gentest.otxt1.value = "File exceeded input limit of "+ maxInput + " characters.";
		throw new Error("File exceeded input limit of "+ maxInput + " characters.")
		// THROW A REAL ERROR
	}
}

// Look at http://www.ncbi.nlm.nih.gov/Sitemap/samplerecord.html for sample GenBank file with formating.

function genbankLineParser(genText) {
	
	MyGenFile = {};
	var lastObj;
	var lastKey;
	
	Flag = new Flags();
	Field = makeGenbankFields();
		
	var genArr = genText.split(/\n/g);

	for (var i=0 ; i < genArr.length; i++) {
		var testObj = parseLine(genArr[i]);
	}
	
	console.log(MyGenFile);
	genText = JSON.stringify(MyGenFile, null, "    ");
	return genText;
}


function parseLine(line) {
	var hasValue;
	var len;
	var key = getLineKey(line);
	var val = getLineVal(line);
	
	Flag.setType(key);
	
	// INITIALIZATION //
	
	// LOCUS
	if ( key === "LOCUS" ) {
		// WARNING This is hardcoded. Fix later.
		MyGenFile[key] = makeLocus(key,val);
		//MyGenFile[key] = new Locus(key,val);
		
	// REFERENCE init
	} else if ( key === "REFERENCE") {
		if ( MyGenFile[key] == undefined) {
			MyGenFile[key] = [];	
		}
		len = MyGenFile[key].length;
		MyGenFile[key].push({ "name" : val });
		lastObj = MyGenFile[key][len];
		
	// FEATURES init	
	} else if ( key === "FEATURES" ) {
		MyGenFile[key] = [];
		lastObj = MyGenFile[key];
		
	// ORIGIN init
	} else if ( key === "ORIGIN") {
		MyGenFile[key] = "";
		
	// BASE COUNT
	} else if ( key === "BASE") {
		// WARNING THIS IS HARDCODED!!!
		Flag.setNone();
		var tmp = line.replace(/^[\s]*BASE COUNT[\s]+/g,"");
		var cnt = tmp.split(/[\s]+/g);
		//console.log(cnt);
		MyGenFile["BASECOUNT"] = {"A":cnt[0], "C":cnt[2], "G":cnt[4], "T":cnt[6] };
		//cnt[3]:cnt[2], cnt[5]:cnt[4], cnt[7]:cnt[6] });
	}
	
	// PARSE FIELDS, REFERENCES, FEATURES, ORIGIN entries //
	
	// FIELDS - standard stuff
	hasKey = detectField(key, Field.field);
	if ( hasKey !== undefined) {
		MyGenFile[key] = val;
	//}
	// REFERENCES entries
	} else if (Flag.reference === true && key !== "REFERENCE") {
		hasKey = detectField(key, Field.ref);
		if (hasKey !== undefined) {
			lastObj[key] = val;
			lastKey = key;
		} else {
			//RUN ON case
			var tmp = MyGenFile["REFERENCE"].pop();
			tmp[lastKey] = tmp[lastKey] + line.replace(/^[\s]*/g, " ");
			MyGenFile["REFERENCE"].push(tmp);
		}
		
	// FEATURES entries
	} else if (Flag.features === true && key !== "FEATURES" ) {
		
		if (Flag.runon === false) {
			var slash = line.match(/^[\s]*\/[\w]+=[\S]+/);
			if (slash == null) {
				// FOR entrees with "KEY BLAH" format
				len = MyGenFile["FEATURES"].length;
				MyGenFile["FEATURES"].push({"name":key, "basespan":val});
				lastKey = "basespan";
				lastObj = MyGenFile["FEATURES"][len];

			} else {
				// FOR entrees with the /KEY="BLAH" format
				var arr = subFeature(line);
				lastObj[arr[0]]= arr[1];	
				lastKey = arr[0];
				
			}
		} else {
			// RUN ON case
			var tmp = MyGenFile["FEATURES"].pop();
			tmp[lastKey] = tmp[lastKey] + line.replace(/^[\s]*|\"$/g, "");
			MyGenFile["FEATURES"].push(tmp);
			console.log(tmp);
		}
		// Flag runon for next line
		Flag.runon = runonCheck(line);
		
	// ORIGIN entries
	} else if (Flag.origin === true && key !== "ORIGIN" ) {
		line = line.replace(/[\s]*[0-9]*/g,"");
		if ( key === "//" ) {
			Flag.setNone();
			console.log("End of File.");
		} else {
			MyGenFile.ORIGIN = MyGenFile.ORIGIN + line;
		}
	} 
		
	return line;
}


//=================================
// OBJECT FUNCTIONS
//=================================

function getLineKey(line) {
	line    = line.replace(/^[\s]*/, "");
	var arr = line.split(/\s/);
	return arr[0];
}

function getLineVal(line) {
	line	= line.replace(/^[\s]*[\S]+[\s]+/, "");	
	return line;
}

function getKeyValObj(line) {
	line    = line.replace(/^[\s]*/, "");
	var arr = line.split(/\s/);
	line	= line.replace(/^[\s]*[\S]+[\s]+/, "");
	
	var obj = new Object(); 
	obj[arr[0]] = line;
	
	return obj;
}

function Locus(field, endLine) {
	var arr = endLine.split(/[\s]+/g);
	// WRITE PARSE CODE FOR LOCUS THAT IS NOT HARD CODED
	this.name   = arr[0];
	this.seqlen = arr[1];
	this.moltype = arr[3];
	this.gendiv  = arr[4];
	this.date = arr[5];
}

function makeLocus(field, endLine) {
	// FIELD MUST BE === "LOCUS"
	var locus = {};	
	var arr = endLine.split(/[\s]+/g);
	// WRITE PARSE CODE FOR LOCUS THAT IS NOT HARD CODED
	/*locus.name   = arr[0];
	locus.seqlen = arr[1];
	locus.moltype = arr[3];
	locus.gendiv  = arr[4];
	locus.date = arr[5];
	*/
	locus = { "name": arr[0], "seqlen":arr[1], "moltype":arr[3], "gendiv":arr[4], "date":arr[5] };
	return locus;
}


//=================================
// PARSING FUNCTIONS
//=================================

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
	
	Flag.runon = runonCheck(line);

	return arr;
}


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
		//console.log("num case: " + line);
		//console.log(runon);
	} else {
		runon = true;
		//console.log("runon case: " + line);
		//console.log(runon);
	}
	return runon;
}


function toString(obj) {
	
}



//=================================
// INITIALIZING FLAGS AND CONSTANTS
//=================================

function makeGenbankFields() {
	Field = {};
	Field.field = genbankFieldsSubset();
	Field.feat  = genbankFeatures();
	Field.ref   = genbankReference();
	return Field;
}


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


function Flags() {
	//this.needsTail	= false; 
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
}
