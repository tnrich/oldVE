

var CONSTANTS = require("./../shared/Constants");
var EVENTS = CONSTANTS.EVENTS;
var ot = require("./../shared/ot");
var sequenceModels = require("./../shared/SequenceModels");
var Sequence = sequenceModels.Sequence;
var Feature = sequenceModels.Feature;

var VeServer = require("./VeServer");
var DeServer = require("./DeServer");

OtServer = (function () {
	'use strict';
	
	var OtServer = function(io) {		
		this.io = io;
		this.veServer = new VeServer(this.io);
		this.deServer = new DeServer(this.io);
	};
	
	/*OtServer.prototype.init = function() {
		var io = this.io;
		
	};*/
	
	
	
	return OtServer;
})();


if(typeof module === 'object') {
	module.exports = OtServer;
}














































