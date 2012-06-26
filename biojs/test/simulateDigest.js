function simulateDigest(document) {
	var rulers = [ {
		"company" : "Fermentas",
		"name" : "GeneRulerª 1 kb Plus DNA Ladder, 75-20,000 bp"
	}, {
		"company" : "Fermentas",
		"name" : "GeneRulerª 100 bp Plus DNA Ladder, 100-3000 bp"
	} ];

	var rulersMarkers = [ 75, 200, 300, 400, 500, 700, 1000, 1500, 2000, 3000,
	                      4000, 5000, 7000, 10000, 20000 ];
	var rulersMarkers = [ 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
	                      1200, 1500, 2000, 3000 ];

	var dnaLengths = [ 150, 250, 350, 550, 650, 750, 1000, 2000, 3000 ];

	console.log(dnaLengths);
	console.log(dnaLengths.length);

	var c = document.getElementById("myDigestCanvas");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.lineWidth = 2;
	ctx.fillStyle = "#26858B";
	ctx.strokeStyle = "#000000";

	var Y_gel_min = rulersMarkers[0];
	var Y_gel_max = rulersMarkers[rulersMarkers.length - 1];
	var Y_gel_range = Y_gel_max - Y_gel_min;
	var Y_gel_image_height = c.height * 0.9;
	var X_gel_image_width = c.width * 0.9;
	var X_margin = c.width * 0.05;
	var Y_margin = c.height * 0.05;
	var X_gel_band_width = c.width * 0.25;
	var Y_scale_factor = Y_gel_image_height / Y_gel_range;

	var startY = new Array();
	var startX = new Array();
	var endY = new Array();
	var endX = new Array();

	console.log(Y_margin);
	console.log(Y_scale_factor);
	console.log(dnaLengths.length);

	for ( var i = 0; i < dnaLengths.length; i++) {
		startY[i] = Y_margin + Y_scale_factor * dnaLengths[i]
	}
	;
	console.log(startY);
	endY = startY;
	for ( var i = 0; i < startY.length; i++) {
		startX[i] = X_margin;
		endX[i] = startX[i] + X_gel_band_width
	}
	;
	var white = "rgb(255,255,255)";
	var black = "rgb(0,0,0)";

	ctx.fillStyle = black;
	ctx.fillRect(0, 0, c.height, c.width)

	for ( var i = 0; i < startY.length; i++) {
		ctx.strokeStyle = white;
		var sX = startX[i];
		var sY = startY[i];
		var eX = endX[i];
		var eY = endY[i];
		ctx.beginPath();
		ctx.moveTo(sX, sY);
		ctx.lineTo(eX, eY);
		ctx.stroke();
	}
}
