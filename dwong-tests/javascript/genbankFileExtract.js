
function genbankFileExtract() {	

	//var maxInput = 200000;

	var genFile = document.getElementById('genbankFile').value;
	
	/*if (genText.length < maxInput) {
		document.gentest.otxt1.value = genbankParse(genText);
	} else {
		document.gentest.otxt1.value = "File exceeded input limit of "+ maxInput + " characters.";
		throw new Error("File exceeded input limit of "+ maxInput + " characters.")
		// THROW A REAL ERROR
	}*/
	document.gentest.otxt2.value = genFile;
	return "TEST";
}

// Look at http://www.ncbi.nlm.nih.gov/Sitemap/samplerecord.html for sample GenBank file with formating.

function genbankFileParse(genFile) {
	
	MyGenFile = {};
	var lastObj;
	var lastKey;
	
	Flag = new Flags();
	Field = makeGenbankFields();
		
	//var genArr = genText.split(/\n/g);

	//for (var i=0 ; i < genArr.length; i++) {
		//var testObj = parseLine(genArr[i]);
	//}
	
	console.log(MyGenFile);
	genText = JSON.stringify(MyGenFile, null, "    ");
	return genText;
}
