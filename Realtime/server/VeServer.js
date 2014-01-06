

var CONSTANTS = require("./../shared/Constants");
var EVENTS = CONSTANTS.EVENTS;
var ot = require("./../shared/ot");
var sequenceModels = require("./../shared/SequenceModels");
var Sequence = sequenceModels.Sequence;
var Feature = sequenceModels.Feature;

var SAMPLE_VARS = require("./SampleVars");


VeServer = (function () {
	'use strict';
	
	var VeServer = function(io) {		
		this.io = io;
		
		this.sequence = sequenceModels.Sequence.fromJson(JSON.parse(SAMPLE_VARS.seq1));
		this.operations = [];
		
		this.init();
	};
	
	VeServer.prototype.init = function() {
		var me = this;
		var io = this.io;
		var sequence = this.sequence;
		var operations = this.operations;
		
		io.of('/sequences').on('connection', function (socket) {
			socket.on(EVENTS.GET_FULL_SEQUENCE, function(cb) {
				var message = {
					revision: operations.length,
					sequence: sequence
				};
				cb(message);
			});
			
			socket.on(EVENTS.POST_CLIENT_OPERATIONS, function(data, cb) {
				var clientOp = ot.MachineOperation.fromJson(data.operation);
				var revision = data.revision;
				
				if(revision<0 || operations.length<revision) {
					throw new Error("Operation revision not in history.");
				}
				
				// Find all operations that the client didn't know of when it sent the
				// operation ...
				var serverOps = operations.slice(revision);
				
				if(serverOps.length === 0) {
					serverOps[0] = ot.MachineOperation.generateNoop(sequence);
				}
				
				// Currently transforming clientOp vs serverOps by composing
				// all of the serverOps in one operation and then transforming
				// this composed operation against the client operation.
				var serverOp = serverOps[0];
				for(var i=1;i<serverOps.length;i++) {
					var op = serverOps[i];
					serverOp = ot.MachineOperation.compose(serverOp, op);
				}
				
				// Might easily be stuff wrong here.
				var xformedOps = ot.MachineOperation.transform(serverOp, clientOp);
				var serverOpPrime = xformedOps[0];
				var clientOpPrime = xformedOps[1];
				
				sequence = clientOpPrime.apply(sequence);
				operations.push(clientOpPrime);
				
				
				var broadcastMessage = {
					operation: clientOpPrime.toJson()
				};
				socket.broadcast.emit(EVENTS.SERVER_OPERATIONS, broadcastMessage);
				
				
				var cbMessage = {
					//operation: serverOpPrime.toJson()
				};
				cb(cbMessage);
			});
			
			
			socket.on('disconnect', function() {
				
			});
		});
		
	};
	
	
	return VeServer;
})();


if(typeof module === 'object') {
	module.exports = VeServer;
}














































