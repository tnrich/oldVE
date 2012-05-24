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
	
	var flag = initFlags();

	for (var i=0 ; i < genArr.length; i++) {
		var nextLine = "";
		var hasValue;
		
		// FOR REGULAR FIELDS (not references, features fields, or origin)
		if ( genbankDetectField(genArr[i], genField) != undefined) {
			flag.indent = 0;
			hasValue = genbankDetectField(genArr[i], genField);
			//console.log("HasValue=" + hasValue);
			nextLine = parseLine(genArr[i], genField[hasValue], flag);
		} 		
		
		// FOR REFERENCES AND STUFF
		if (genbankDetectField(genArr[i], genRef) != undefined) {
			flag.indent = 1;
			hasValue = genbankDetectField(genArr[i], genRef);
			//console.log("HasValue=" + hasValue);
			nextLine = "\t" + parseLine(genArr[i], genRef[hasValue], flag);
		}		
		if (genArr[i].match("REFERENCE")) {
			flag.indent = 0;
			var tmp1 = genArr[i].replace(/REFERENCE[\s]*/g, "");
			/*
			//var tmp  = tmp1.split(/\s/);
			if (flag.reference == false ) { //first ref
				//flag.reference = true;
				nextLine = "\"REFERENCE\" : [\n\t\"REF\" : \"" + tmp1 + "\"";
			} else {
				nextLine = "\t[\"REF\" : \"" + tmp1 + "\"";
			}*/
			// OVERWRITING AS TEMPORARY SOLUTION
			nextLine = "\"REFERENCE\" : [\n\t\"name\" : \"" + tmp1;// + "\"";
			flag.origin     = false;
			flag.features   = false;
			flag.reference  = true;
			
		}

		
		// FOR FEATURES
		/*
		if ( genbankDetectField(genArr[i], genFeat) != undefined) {
			hasValue = genbankDetectField(genArr[i], genFeat);
			//console.log("HasValue=" + hasValue);
			nextLine = "\t" + nextLine + parseLine(genArr[i], genFeat[hasValue], flag);
		}*/
		
		
		if (flag.features == true) {
			var slash = genArr[i].match(/^[\s]*\/[\w]+=\"[\S]+/);
			if (slash != null) {
				// FOR entrees with the /KEY="BLAH" format
				flag.indent = 2;
				nextLine = "\t\t" + parseSlashTag(genArr[i], flag);// + "\n";
			} else {
				// FOR entrees with "KEY BLAH" format
				flag.indent = 1;
				slash = genArr[i].replace(/^[\s]*/,"");
				var tmp = slash.split(/\s/);
				nextLine = "\t" + parseFeatures(genArr[i],tmp[0],flag);
			}
		}
		
		if ( genArr[i].match("FEATURES")) {
			flag.indent = 0;
			nextLine = "\"FEATURES\" : \"[\n";
			flag.origin     = false;
			flag.features   = true;
			flag.reference  = false;
			flag.newObj     = true;
		}
		
		
		nextLine = parseTail(nextLine, flag);
	
		// FOR ORIGIN AND END OF FILE
		if (flag.origin == true) {
			nextLine = parseOrigin(genArr[i]);
		}
		if ( genArr[i].match("ORIGIN")) {
			
			if (flag.features==true || flag.reference==true) {
				nextLine = "]\n}\n";
			}
			nextLine = "\"ORIGIN\" : \"";
			flag.origin     = true;
			flag.features   = false;
			flag.reference  = false;
		}
		
		// LINE TERMINATION
		
		
		// RUNON FROM PREVIOUS LINE
		/*if ( nextLine == "") {
			if (genArr[i].match(/^\"$/)) {
				flag.runon = false;
			}
			nextLine = genArr[i].replace(/^[\s]* | \"$ /g, "");
		}*/
		
		// FILE TERMINATION	
		if ( genArr[i].match("//")) {
			nextLine = "\"\n}";
			flag.origin     = false;
			flag.features   = false;
			flag.reference  = false;
		}
		
		flag.prevIndent = flag.indent;
		newGenText = newGenText + nextLine;
	}
	return newGenText;
}

//=================================
// PARSING FUNCTIONS
//=================================

function genbankDetectField(line,fields) {
	var hasValue;
	var patt = new RegExp("^" + "[\s]*" + fields[j] + "[\s]*","g");
	
	line = line.replace(/^[\s]*/g,"");
	var tmp = line.split(/\s/);
	
	for (var j=0; j<fields.length; j++) {
		if (tmp[0].match(fields[j])) {
			//if (line.match(fields[j])) {
			hasValue = j;
		}
	}
	return hasValue;
}

// was genbankLineParse
function parseLine(line, name, flag) {
	
	var newLine = "";
	//var patt = new RegExp("^" + "[\s]*" + name + "[\s]*","g");
	//line = line.replace(/^[\s]*/g,"");
	//line = line.replace(patt,"");
	//line = line.replace(/^[\s]*/g,"");
	line = line.replace(/^[\s]*[\S]+[\s]+/, "");
	
	if (name=="LOCUS") {
		newLine = "\"" + name + "\" : [\n" + parseLocus(line) + "\t}\n  ]";
	} else {
		newLine = "\"" + name + "\" : \"" + line; // + "\"";
	}
	
	return newLine;
}

function parseLocus(endLine) {
	var arr = endLine.split(/[\s]+/g);
	//console.log(endLine + arr);
	
	// WRITE PARSE CODE FOR LOCUS THAT IS NOT HARD CODED
	var name = arr[0];
	var seqlen = arr[1];
	var moltype = arr[3];
	var gendiv  = arr[4];
	var date = arr[5];
	
	endLine = "\t{\n";
	endLine = endLine +	"\t\t\"name\" : \"" 	+ name		+ "\",\n";
	endLine = endLine +	"\t\t\"seqlen\" : \""	+ seqlen	+ "\",\n";
	endLine = endLine +	"\t\t\"moltype\" : \""	+ moltype	+ "\",\n";
	endLine = endLine +	"\t\t\"genbankDiv\" : \""	+ gendiv	+ "\",\n";
	endLine = endLine +	"\t\t\"date\" : \""		+ date		+ "\"\n";
	
	return endLine;
	
}

function parseFeatures(line, name, flag) {
	var newLine;
	line = line.replace(/^[\s]*[\S]+[\s]+/, "");
	newLine = "\"" + name + "\": [\t{\n\t\t\"basespan\" : \"" + line; // + "\"";

	return newLine;
}

function parseSlashTag(line, flag){
	var newLine;
	newLine =    line.replace(/^[\s]*/g,"");
	newLine = newLine.replace(/^\// , "\"");
	newLine = newLine.replace(/=\"/ , "\" : ");

	if ( newLine.match(/\"$/)) {
		flag.runon = true;
	} else {
		flag.runon = false;
	}
	
	return newLine;
}

 function parseOrigin(line){
	var newLine = "";
	newLine = line.replace(/[\s]*[0-9]*/g,"");
	return newLine;
}


function parseTail(nextLine, flag) {
	var myLine = "";
	if ( nextLine != "") {
		console.log(flag.prevIndent + ":" + flag.indent + ":" + nextLine);
		// && flag.runon == false) {
		myLine = "\",\n";
		if (flag.prevIndent == flag.indent) {
			myLine = "\",\n";
		//} else if (flag.prevIndent >= flag.indent) {
			//do nothing
		} else if (flag.prevIndent <= flag.indent) {
			
			if (flag.prevIndent == 2) {
				myLine = "\",\n\t\t}\n\t  ]\n";
			}
			if (flag.prevIndent == 1) {
				myLine = "\",\n\t}\n  ]\n";
			}
		}
	}
	nextLine = nextLine + myLine;
	return nextLine;
}

//=================================
// INITIALIZING FLAGS AND CONSTANTS
//=================================
function initFlags() {
	flag = new Object();
	flag.newObj     = true;
	flag.lastObj    = false;
	
	flag.prevIndent	= 0;
	flag.indent		= 0; //Number of indents (ie how many layers of subfields into the object; Need to explain this better
	
	flag.runon      = false;
	
	flag.origin     = false;
	flag.features   = false;
	flag.reference  = false;
	return flag;
}

function genbankAllKeyWords() {
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


