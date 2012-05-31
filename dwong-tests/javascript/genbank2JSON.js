// Make sure that genText input is a string of your genbank file, with return characters.

function genbank2JSON(genText) {	
	
	var maxInput = 2000000;
	MyGenFile = {};
	
	if (genText.length < maxInput) {
		MyGenFile = genbankText2JSON(genText);
	} else {
		throw new Error("File contains (" + genText.length + ") exceeded input limit of "+ maxInput + " characters.")
		// THROW A REAL ERROR
		MyGenFile = "File exceeded input limit of " + maxInput + " characters.";
	}
	return MyGenFile;
}

// Look at http://www.ncbi.nlm.nih.gov/Sitemap/samplerecord.html for sample GenBank file with formating.

function genbank2JSONhelper(genText) {
	
	var lastObj;
	var lastKey;
	
	Flag = new Flags();
	Field = makeGenbankFields();
	
	// Make an array of lines out of your file and parse line by line.
	var genArr = genText.split(/\n/g);

	for (var i=0 ; i < genArr.length; i++) {
		var testObj = genbankLineParser(genArr[i]);
	}
	
	console.log(MyGenFile);
	//genText = JSON.stringify(MyGenFile, null, "    ");
	return MyGenFile;
}
