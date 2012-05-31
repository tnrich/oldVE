function simulatedigest(){

a = document.test_simulatedigest.txta.value
b = document.test_simulatedigest.txtb.value
c = document.test_simulatedigest.txtc.value
d = document.test_simulatedigest.txtd.value
e = document.test_simulatedigest.txte.value
o = a + b + c + d + e
document.test_simulatedigest.otxta.value = o
document.test_simulatedigest.otxtb.value = o.length

var c = document.getElementById("myDigestCanvas");
var ctx = c.getContext("2d");
ctx.clearRect(0,0,c.width,c.height);
ctx.lineWidth=2;
ctx.fillStyle="#26858B";
ctx.strokeStyle="#000000";

var Y_gel_image_height = c.height*0.9;
var X_gel_image_width  = c.width*0.9;
var X_baseline = c.width*0.1;
var Y_baseline = c.height*0.1;
var X_gel_band_width = c.width*.0.25;

var startY = new Array();
var startX = new Array();
var endY = new Array();
var endX = new Array();
startY[0] = Y_baseline;
startY[1] = Y_gel_image_height * a.length/o.length + Y_baseline;
startY[2] = Y_gel_image_height * b.length/o.length + Y_baseline;
startY[3] = Y_gel_image_height * c.length/o.length + Y_baseline;
startY[4] = Y_gel_image_height * d.length/o.length + Y_baseline;
startY[5] = Y_gel_image_height * e.length/o.length + Y_baseline;
endY = startY;
startX[0] = X_baseline;
var i = 0;
for(i=0; i<6; i++){startX[i] = X_baseline; endX[i] = startX[i] + X_width};

var fillStyles = new Array();
fillStyles[0] = "rgb(255,221,0)"
fillStyles[1] = "rgb(142,208,255)"
fillStyles[2] = "rgb(185,166,255)"
fillStyles[3] = "rgb(255,129,127)"
fillStyles[4] = "rgb(128,215,96)"

for (i=0;i<5;i++){
ctx.fillStyle = fillStyles[i];
var sX = startX[i];
var sY = startY[i];
var eX = endX[i];
var eY = endY[i];
ctx.beginPath();
ctx.moveTo(sX,sY);
ctx.lineTo(eX,eY);
ctx.stroke();
}  
}
