function anotherdrawvector(){

a = document.f_adv.elements[0].value
b = document.f_adv.elements[0].value
c = document.f_adv.elements[0].value
d = document.f_adv.elements[0].value
e = document.f_adv.elements[0].value

o = a + b + c + d + e;

var Angles = new Array();
Angles[0] = 45;
Angles[1] = 360 * a.length/o.length
Angles[2] = 360 * b.length/o.length
Angles[3] = 360 * c.length/o.length
Angles[4] = 360 * d.length/o.length
Angles[5] = 360 * e.length/o.length

var c = document.getElementById("c_adv");
var ctx = c.getContext("2d");
ctx.clearRect(0,0,c.width,c.height);
ctx.lineWidth=2;
ctx.fillStyle="#26858B";
ctx.strokeStyle="#000000";

var fillStyles = new Array();
fillStyles[0] = "rgb(255,221,0)"
fillStyles[1] = "rgb(142,208,255)"
fillStyles[2] = "rgb(185,166,255)"
fillStyles[3] = "rgb(255,129,127)"
fillStyles[4] = "rgb(128,215,96)"

centerX = 200;
centerY = 200;

var oneDegree = (2*Math.PI/360);
var radius = 120;
var radiusOuter = radius+radius*0.05;
var radiusInner = radius - radius*0.05;

eAngleD = Angles[0];
var i = 0;
for (i=0;i<=4;i++){
ctx.fillStyle = fillStyles[i];
var sAngleD = eAngleD;
var eAngleD = sAngleD + Angles[i+1];
var sAngle=sAngleD*oneDegree;
var eAngle=eAngleD*oneDegree;
var dAngle=5*oneDegree;
var endPointX=radius*Math.cos(eAngle)+centerX;
var endPointY=radius*Math.sin(eAngle)+centerY;
ctx.beginPath();
ctx.arc(centerX,centerY,radiusInner,sAngle,eAngle-dAngle,false);
ctx.lineTo(endPointX,endPointY);
ctx.arc(centerX,centerY,radiusOuter,eAngle-dAngle,sAngle,true);
ctx.closePath();
ctx.fill();
ctx.stroke();
}  
}
