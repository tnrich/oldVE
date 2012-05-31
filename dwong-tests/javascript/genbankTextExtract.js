
function genbankTextExtract() {	

	var maxInput = 200000;

	var genText = document.getElementById('genbankText').value;
	
	if (genText.length < maxInput) {
		//document.gentest.otxt1.value = genbankText2JSON(genText);
		return genbankText2JSON(genText);
	} else {
		//document.gentest.otxt1.value = "File exceeded input limit of "+ maxInput + " characters.";
		throw new Error("File exceeded input limit of "+ maxInput + " characters.")
		// THROW A REAL ERROR
		return "File exceeded input limit of "+ maxInput + " characters.";
	}
}

// Look at http://www.ncbi.nlm.nih.gov/Sitemap/samplerecord.html for sample GenBank file with formating.

function genbankText2JSON(genText) {
	
	MyGenFile = {};
	var lastObj;
	var lastKey;
	
	Flag = new Flags();
	Field = makeGenbankFields();
		
	var genArr = genText.split(/\n/g);

	for (var i=0 ; i < genArr.length; i++) {
		var testObj = genbankLineParser(genArr[i]);
	}
	
	console.log(MyGenFile);
	genText = JSON.stringify(MyGenFile, null, "    ");
	return genText;
}



