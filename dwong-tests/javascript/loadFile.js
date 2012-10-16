function loadFile(inElm, outElm) {
	var input, file, fr;
	if (typeof window.FileReader !== 'function') {
		outElm.value = "The file API isn't supported on this browser yet.";
		//bodyAppend("p", "The file API isn't supported on this browser yet.");
		return;
	}
	//input = document.getElementById('fileinput');
	input = inElm;
	if (!input) {
		outElm.value = "Um, couldn't find the fileinput element.";
		//bodyAppend("p", "Um, couldn't find the fileinput element.");
	}
	else if (!input.files) {
		outElm.value = "This browser doesn't seem to support the `files` property of file inputs.";
		//bodyAppend("p", "This browser doesn't seem to support the `files` property of file inputs.");
	}
	else if (!input.files[0]) {
		outElm.value = "Please select a file before clicking 'Load'";
		//bodyAppend("p", "Please select a file before clicking 'Load'");
	}
	else {
		file = input.files[0];
		fr = new FileReader;
		fr.onload = showText;

		fr.readAsText(file);
	}
	
	function showText() {
		var markup, result, n, aByte, byteStr;
		markup = [];
		result = fr.result;
		outElm.value = result;
		
		//console.log(outElm.value);
		for (n=0; n<result.length; ++n) {
			aByte = result.charCodeAt(n);
			byteStr = aByte.toString(16);
			if (byteStr.length < 2) {byteStr = "0" + byteStr;}
			markup.push(byteStr);
		}
		//bodyAppend("p", "The encoded text representation (length = " + result.length + "):");
		//bodyAppend("pre", markup.join(" "));
		//bodyAppend("p", "The text:");
		//bodyAppend("pre", result);
		//document.gentestFile.otxt1.value = result;
		
	}
}


/*
function bodyAppend(tagName, innerHTML) {
	var elm;
	elm = document.createElement(tagName);
	elm.innerHTML = innerHTML;
	document.body.appendChild(elm);
}
*/

