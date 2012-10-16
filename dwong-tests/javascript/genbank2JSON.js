// Make sure that genText input is a string of your genbank file, with return characters.

function genbank2JSON(genText) {	
	
	var maxInput = 2000000;
	//MyGenbank = {};
	
	if (genText.length < maxInput) {
		//MyGenbank = genbank2JSONhelper(genText);
		
		MyGenbank = new Genbank(genText);
		console.log(MyGenbank);
	} else {
		throw new Error("genbank2JSON.js ERROR: File contains (" + genText.length + ") exceeded input limit of "+ maxInput + " characters.")
		// THROW A REAL ERROR
		MyGenbank = "File exceeded input limit of " + maxInput + " characters.";
	}
	return MyGenbank;


/*	// DO NOT NEED THIS OR genbankLineParser() anymore.
	// WE NOW USE Genbank.js
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
	*/

}