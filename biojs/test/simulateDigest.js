function simulateDigest(canvasId) {
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
	var rulersTitle = "100kb Ladder";

	var dnaLengths = [ 150, 250, 350, 550, 650, 750, 1000, 2000, 3000 ];
	var dnaTitle = "Cut DNA"

	console.log(dnaLengths);
	console.log(dnaLengths.length);

//	var c = document.getElementById("myDigestCanvas");
	var c = canvasId;
	console.log(canvasId);
	var ctx = c.getContext("2d");
	console.log(ctx);
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.lineWidth = 2;
	ctx.fillStyle = "#26858B";
	ctx.strokeStyle = "#000000";
	
	var white = "rgb(255,255,255)";
	var black = "rgb(0,0,0)";
	
	var Y_gel_min = rulersMarkers[0];
	var Y_gel_max = rulersMarkers[rulersMarkers.length - 1];
	var Y_gel_range = Y_gel_max - Y_gel_min;
	var Y_gel_image_height = c.height * 0.9;
	var X_gel_image_width = c.width * 0.9;
	var X_margin = c.width * 0.10;
	var Y_margin = c.height * 0.10;
	var X_mid    = c.width * 0.50;
	var X_gel_band_width = c.width * 0.15;
	var X_dna    = 2*X_margin + X_gel_band_width;
	var Y_scale_factor = Y_gel_image_height / Y_gel_range;

	
	ctx.fillStyle    = white;
	ctx.fillRect(0, 0, c.height, c.width);
	
	ctx.fillStyle    = black;
	ctx.strokeStyle  = black;
	
	ctx.font="10px Helvetica";
	ctx.textAlign="center";
	ctx.textBaseline="bottom";
	ctx.fillText(rulersTitle,X_margin+X_gel_band_width*0.5,Y_margin);
	ctx.fillText(dnaTitle,X_dna+X_gel_band_width*0.5,Y_margin);
	
	ctx.font="15px Helvetica";
	ctx.textAlign="right";
	ctx.textBaseline="middle";
	
	var startX = new Array();
	var startY = new Array();
	var endX   = new Array();
	var endY   = new Array();
	
	
	for ( var i = 0; i < rulersMarkers.length; i++) {
		startY[i] = Y_margin + Y_scale_factor * rulersMarkers[i]
	}
	endY = startY;
	for ( var i = 0; i < startY.length; i++) {
		startX[i] = X_margin;
		endX[i] = startX[i] + X_gel_band_width
	}
	for ( var i = 0; i < startY.length; i++) {
		var sX = startX[i];
		var sY = startY[i];
		var eX = endX[i];
		var eY = endY[i];
		ctx.beginPath();
		ctx.moveTo(sX, sY);
		ctx.lineTo(eX, eY);
		ctx.stroke();
		ctx.fillText(rulersMarkers[i],sX-X_margin*0.05,sY)
	}
	
	ctx.font="15px Helvetica";
	ctx.textAlign="left";
	ctx.textBaseline="middle";
	
	var startX = new Array();
	var startY = new Array();
	var endX   = new Array();
	var endY   = new Array();	
	for ( var i = 0; i < dnaLengths.length; i++) {
		startY[i] = Y_margin + Y_scale_factor * dnaLengths[i]
	}
	endY = startY;
	for ( var i = 0; i < startY.length; i++) {
		startX[i] = X_dna;
		endX[i] = startX[i] + X_gel_band_width
	}
	for ( var i = 0; i < startY.length; i++) {
		var sX = startX[i];
		var sY = startY[i];
		var eX = endX[i];
		var eY = endY[i];
		ctx.beginPath();
		ctx.moveTo(sX, sY);
		ctx.lineTo(eX, eY);
		ctx.stroke();
		ctx.fillText(dnaLengths[i],sX+X_gel_band_width*1.1,sY)
	}
	
	
	return ctx;
}
