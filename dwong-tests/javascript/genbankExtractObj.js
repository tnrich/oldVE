
function genbankExtractObj() {	

	var maxInput = 200000;

	var genText = document.getElementById('genbank').value;
	
	if (genText.length < maxInput) {
		document.gentest.otxt2.value = genbankParse(genText);
	} else {
		document.gentest.otxt2.value = "File exceeded input limit of "+ maxInput + " characters.";
		throw new Error("File exceeded input limit of "+ maxInput + " characters.")
		// THROW A REAL ERROR
	}
}

// Look at http://www.ncbi.nlm.nih.gov/Sitemap/samplerecord.html for sample GenBank file with formating.

function genbankParse(genText) {
	
	MyGenFile = new Object();
	
	flag = new Flags();
	//console.log(flag);
	var lastObj;
	var lastKey;
	
	Field = {};
	Field.field = genbankFieldsSubset();
	Field.feat  = genbankFeatures();
	Field.ref   = genbankReference();
		
	var genArr = genText.split(/\n/g);
	
	//console.log(Field.field);
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
	
	flag.setType(key);
	
	// LOCUS
	if ( key === "LOCUS" ) {
		// This is hardcoded. Fix later.
		//MyGenFile[key] = makeLocus(key,val);
		MyGenFile[key] = new Locus(key,val);
		
	// REFERENCE init
	} else if ( key === "REFERENCE") {
		if ( MyGenFile[key] == undefined) {
			MyGenFile[key] = [];	
		}
		len = MyGenFile[key].length;
		//MyGenFile["REFERENCE"].push(new Ref(len, val));
		MyGenFile[key].push({ "name" : val });
		lastObj = MyGenFile[key][len];
		
	// FEATURES init	
	} else if ( key === "FEATURES" ) {
		MyGenFile[key] = [];
		lastObj = MyGenFile[key];
		
	// ORIGIN init
	} else if ( key === "ORIGIN") {
		MyGenFile[key] = "";
	}
	
	// PARSE FIELDS, REFERENCES, FEATURES, ORIGIN entries	
	// FIELDS - standard stuff
	hasKey = detectField(key, Field.field);
	if ( hasKey !== undefined) {
		MyGenFile[key] = val;
	//}
	
	// REFERENCES entries
	} else if (flag.reference === true && key !== "REFERENCE") {
		hasKey = detectField(key, Field.ref);
		if (hasKey !== undefined) {
			lastObj[key] = val;
			lastKey = key;
		} else {
			//run on case
			var tmp = MyGenFile["REFERENCE"].pop();
			//console.log(tmp);
			//console.log(lastKey);
			//console.log(tmp[lastKey]);
			tmp[lastKey] = tmp[lastKey] + line.replace(/^[\s]*/g, " ");
			//console.log(tmp[lastKey]);
			MyGenFile["REFERENCE"].push(tmp);
		}
		
	// FEATURES entries
	} else if (flag.features === true && key !== "FEATURES" ) {
		
		if (flag.runon === false) {
			var slash = line.match(/^[\s]*\/[\w]+=[\S]+/);
			if (slash == null) {
				// FOR entrees with "KEY BLAH" format
				
				len = MyGenFile["FEATURES"].length;
				//MyGenFile["FEATURES"].push(new Feat( len, key, val ));
				MyGenFile["FEATURES"].push({"name":key, "basespan":val});
				lastKey = "basespan";
				lastObj = MyGenFile["FEATURES"][len];
				//flag.runon = runonCheck(line);
			} else {
				// FOR entrees with the /KEY="BLAH" format
				//MyGenFile["FEATURES"].push(new SubFeature( line ));
				
				//if ( flag.runon === false) {
					var arr = subFeature(line);
					lastObj[arr[0]]= arr[1];
					lastKey = arr[0];
				//} else {
				//	console.log(line);
				//	var tmp = MyGenFile["FEATURES"].pop();
				//	console.log(tmp);
				//	tmp[lastKey] = tmp[lastKey] + line.replace(/^[\s]*/g, " ");
				//	MyGenFile["FEATURES"].push(tmp);
				//	console.log(tmp);
				//	flag.runon = runonCheck(line);
				//}
			}
		} else {
			// run on case
			//console.log(line);
			var tmp = MyGenFile["FEATURES"].pop();
			//console.log(tmp);
			tmp[lastKey] = tmp[lastKey] + line.replace(/^[\s]*/g, " ");
			MyGenFile["FEATURES"].push(tmp);
			console.log(tmp);
			//flag.runon = runonCheck(line);
			
		}
		flag.runon = runonCheck(line);
	// ORIGIN entries
	} else if (flag.origin === true && key !== "ORIGIN" ) {
		line = line.replace(/[\s]*[0-9]*/g,"");
		if ( key === "//" ) {
			flag.setNone();
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
	locus.name   = arr[0];
	locus.seqlen = arr[1];
	locus.moltype = arr[3];
	locus.gendiv  = arr[4];
	locus.date = arr[5];
	return locus;
}
/*
function Ref(key, value) {
	this[key] = { "name" : value };
}

function Feat(ind, key, value) {
	//this[key] = [{ "basespn" : value }];
	//this[ind] = {"name":key, "basespan":value};
	
	return {"name":key, "basespan":value};
}
*/

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
	
	/*if ( line.match(/"$/) ) {
		flag.runon = false;
	} else {
		if ( line.match(/=\"/) ) {
			flag.runon = true;
			//console.log(line);
		}
	}*/
	flag.runon = runonCheck(line);
	//var sub = new Object();
	//sub[arr[0]] = arr[1];
	return arr;
}


function runonCheck(line) {
	var runon;
	if ( line.match(/"$/ )) {
		// closed case: '/key="blahblah"'
		runon = false;
	} else if (line.match(/\)$/ )) {
		//closed case: 'CDS  ..join(<265..402,1088..1215)'
		runon = false;
	} else if ( line.charAt(line.length-1).match(/\d/)){
		//number case: 'CDS 1..3123' OR  '/codon=1'
		runon = false;
		//console.log("num case: " + line);
		//console.log(runon);
	} else {
		runon = true;
		console.log("num case: " + line);
		console.log(runon);
	}
	return runon;
}


function toString(obj) {
	
}



//=================================
// INITIALIZING FLAGS AND CONSTANTS
//=================================

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
