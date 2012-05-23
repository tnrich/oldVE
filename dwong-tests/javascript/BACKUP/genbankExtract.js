function genbankExtract() {	

	var maxInput = 200000;

	var genText = document.getElementById('genbank').value;
	
	if (genText.length < maxInput) {
		document.gentest.otxt.value = genbankParse(genText);
	} else {
		document.gentest.otxt.value = "File exceeded input limit of "+ maxInput + " characters.";
		// THROW A REAL ERROR
	}
}


// Look at http://www.ncbi.nlm.nih.gov/Sitemap/samplerecord.html for sample GenBank file with formating.


function genbankParse(genText) {
	
	//var genArr = genText.split(/LOCUS\s\s\s[^\f\n\r]*/m); //P.Slothard line
	
	// Parse line by line. Save as an array of lines.
	var genArr = genText.split(/\n/g);
	
	var genField = genbankFieldsSubset();
	var genFeat  = genbankFeatures();
	var genRef   = genbankReference();
	//console.debug("genField==" + genField.length + "\n" + genField);
		
	var newGenText = "{\n";
	
	flag = new Object();
	flag.newObj     = true;
	flag.lastObj    = false;
	flag.runon      = false;
	flag.origin     = false;
	flag.features   = false;
	flag.reference  = false;
	
	for (var i=0 ; i < genArr.length; i++) {
		var nextLine = "";
		var hasValue;
		
		
		// FOR REGULAR FIELDS
		if ( genbankDetectField(genArr[i], genField) != undefined) {
			hasValue = genbankDetectField(genArr[i], genField);
			//console.log("HasValue=" + hasValue);
			nextLine = nextLine + genbankLineParse(genArr[i], genField[hasValue], flag);
		} 		
		
		// FOR REFERENCES AND STUFF
		if (genbankDetectField(genArr[i], genRef) != undefined) {
			hasValue = genbankDetectField(genArr[i], genRef);
			//console.log("HasValue=" + hasValue);
			nextLine = "\t" + nextLine + genbankLineParse(genArr[i], genRef[hasValue], flag);
		}		
		if (genArr[i].match("REFERENCE")) {
			if (flag.newObj = true ) { //first ref
				flag.newObj = false;
				var tmp1 = genArr[i].replace(/REFERENCE[\s]*/g, "");
				var tmp  = tmp1.split(/\s/);
				nextLine = "\"REFERENCE\" : [\n\t";
				nextLine = nextLine + genbankLineParse(tmp1, tmp[0], flag);
				//console.log(nextLine);
			}
			flag.origin     = false;
			flag.features   = false;
			flag.reference  = true;
		}
		
		
		
		// FOR FEATURES
		if ( genbankDetectField(genArr[i], genFeat) != undefined) {
			hasValue = genbankDetectField(genArr[i], genFeat);
			//console.log("HasValue=" + hasValue);
			nextLine = "\t" + nextLine + genbankLineParse(genArr[i], genFeat[hasValue], flag);
		}
		
		
		//if (flag.features == true && genArr[i].match(/^[\s]*\/[\w]*=\"[\s]*/)) {
		//if (flag.features == true && genbankDetectField(genArr[i], genFeat) == undefined  ) {
		//	nextLine = "\t\t" + parseFeatures(genArr[i], flag) + "\n";
		//}
		
		
		if (flag.features == true) {
			if (genArr[i].match(/^[\s]*\/[\w]*=\"[\s]*/)) {
				nextLine = "\t\t" + parseFeatures(genArr[i], flag) + "\n";
		} else {
			
		
		}
		
		if ( genArr[i].match("FEATURES")) {
			nextLine = "\"FEATURES\" : \"[\n";
			//console.log(nextLine);
			flag.origin     = false;
			flag.features   = true;
			flag.reference  = false;
			flag.newObj     = true;
		}
		
		
		
		// FOR ORIGIN AND END OF FILE
		if (flag.origin == true) {
			nextLine = parseOrigin(genArr[i]);
		}
		if ( genArr[i].match("ORIGIN")) {
			
			if (flag.features==true || flag.reference==true) {
				nextLine = "]\n}\n";
			}
			nextLine = "\"ORIGIN\" : \"";
			//console.log(nextLine);
			flag.origin     = true;
			flag.features   = false;
			flag.reference  = false;
		}
		
		// LINE TERMINATION
		
		/*
		if ( flag.runon = true ) {
			if (genArr[i].match(/^\"$/)) {
				flag.runon = false;
			}
			nextLine = genArr[i].replace(/^[\s]* | \"$ /g, "");
		}*/
		
		// FILE TERMINATION	
		if ( genArr[i].match("//")) {
			//nextLine = "\"\n}";
			flag.origin     = false;
			flag.features   = false;
			flag.reference  = false;
		}
		
		newGenText = newGenText + nextLine;
	}
	nextLine = "\"\n}";
	return newGenText;
}


function genbankDetectField(line,genField) {
	var hasValue;
	var patt = new RegExp("^" + "[\s]*" + genField[j] + "[\s]*","g");
	
	line = line.replace(/^[\s]*/g,"");
	var tmp = line.split(/\s/);
	
	for (var j=0; j<genField.length; j++) {
		if (tmp[0].match(genField[j])) {
			//if (line.match(genField[j])) {
			hasValue = j;
		}
	}
	return hasValue;
}


function genbankLineParse(line, name, flag) {
	
	var newLine = "";
	var patt = new RegExp("^" + "[\s]*" + name + "[\s]*","g");
	
	line = line.replace(/^[\s]*/g,"");
	line = line.replace(patt,"");
	line = line.replace(/^[\s]*/g,"");
	
	//console.log("line=" + line);
	
	if ( name == "CDS" ) {
		newLine = "\"" + name + "\": [\n\t\t\"basespan\" : \"" + line + "\"";
	} else {
		newLine = newLine + "\"" + name + "\" : \"" + line + "\"";
	}
	
	//console.log(newLine);
	
	if (flag.lastObj == true) {
		newLine = newLine + "\n}";
	} else {
		newLine = newLine + ",\n";
	}
	return newLine;
}



function parseOrigin(line){
	var newLine = "";
	newLine = line.replace(/[\s]*[0-9]*/g,"");
	return newLine;
}


function parseFeatures(line, flag){
	var newLine = "";
	newLine =    line.replace(/^[\s]*/g,"");
	newLine = newLine.replace(/^\// , "\"");
	newLine = newLine.replace(/=\"/ , "\" : \"");

	if ( newLine.match(/\"$/)) {
		flag.runon = true;
	} else {
		flag.runon = false;
	}
	
	return newLine;
}

//=================================

function genbankAllKeyWords() {
	var genField = new Array();
	genField[0] = "LOCUS";
	genField[1] = "DEFINITION";
	genField[2] = "ACCESSION";
	genField[3] = "VERSION";
	genField[4] = "KEYWORDS";
	genField[5] = "SOURCE";
	genField[6] = "ORGANISM";
	genField[7] = "REFERENCE";
	genField[8] = "AUTHORS";
	genField[9] = "CONSRTM";
	genField[10] = "TITLE";
	genField[11] = "JOURNAL";
	genField[12] = "PUBMED";
	genField[13] = "REMARK";
	genField[14] = "COMMENT";
	//genField[15] = "FEATURES";
	genField[16] = "BASE COUNT";     
	//genField[17] = "ORIGIN";
	//genField[18] = "//";
	genField[19] = "SEGMENT";
	genField[20] = "CONTIG";
	return genField;
}


function genbankFieldsSubset() {
	var field = new Array();
	field[0] = "LOCUS";
	field[1] = "DEFINITION";
	field[2] = "ACCESSION";
	field[3] = "VERSION";
	field[4] = "KEYWORDS";
	field[5] = "SOURCE";
	field[6] = "ORGANISM";
	//field[7] = "REFERENCE";

	return field;
}

function genbankFeatures() {
	var field = new Array();
	field[0] = "source";
	field[1] = "CDS";
	field[2] = "gene";
	field[3] = "<";
	//field[4] = "protein_id";
	//field[5] = "GI";
	//field[6] = "ORGANISM";
	//field[7] = "REFERENCE";

	return field;
}

function genbankReference() {
	var field = new Array();
	field[0] = "AUTHORS";
	field[1] = "TITLE";
	field[2] = "JOURNAL";
	field[3] = "PUBMED";
	field[4] = "CONSRTM";
	//field[5] = "SOURCE";
	//field[6] = "ORGANISM";
	//field[7] = "REFERENCE";

	return field;
}

function genbankCheckFileFormat() {
	return true;	
}



//=================================

function OLDgenbankLineParse(line, genField, flag) {
	
	var newLine = "";
	for (var j=0; j<genField.length; j++) {

		if (line.match(genField[j]))  {
			console.log("found: " + genField[j] + " at " + j);
			var patt = new RegExp("^" + "[\s]*" + genField[j] + "[\s]*","g");
			//console.log(patt);
			//console.log(patt.test(line));
			//console.log(line.split(patt));
			
			if (flag.newObj == true) {
				newLine = "\n{\n\t";
			} else {
				newLine = "},\n";
			}
			
			newLine = newLine + "\"" + genField[j] + "\":\"" + line.replace(patt,"").replace("/^[\s]*/","") + "\"";
			console.log(newLine);
			
			if (flag.lastObj == true) {
				newLine = newLine + "\n}";
			}
			//newLine = newLine + ",\n"
		}
	}
	return newLine;
}


