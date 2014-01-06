

var CONSTANTS = require("./../shared/Constants");
var EVENTS = CONSTANTS.EVENTS;

var ot = require("./../shared/DeOt");

var deviceModels = require("./../shared/DeviceModels");
var Device = deviceModels.Device;
var Bin = deviceModels.Bin;
var Cell = deviceModels.Cell;
var Rule = deviceModels.Rule;
var Part = deviceModels.Part;

var SAMPLE_VARS = require("./SampleVars");


DeServer = (function () {
	'use strict';
	
	var DeServer = function(io) {		
		this.io = io;
		
		this.device = Device.fromJson(JSON.parse(SAMPLE_VARS.device1));
		this.operations = [];
		
		this.init();
	};
	
	DeServer.prototype.init = function() {
		var me = this;
		var io = this.io;
		var device = this.device;
		var operations = this.operations;
		
		io.of('/devices').on('connection', function (socket) {
			socket.on(EVENTS.GET_FULL_DEVICE, function(cb) {
				var message = {
					revision: operations.length,
					device: device.toJson()
				};
				cb(message);
			});
			
			socket.on(EVENTS.POST_CLIENT_OPERATIONS, function(data, cb) {
				var clientOp = ot.DeOperation.fromJson(data.operation);
				var revision = data.revision;
				
				if(revision<0 || operations.length<revision) {
					throw new Error("Operation revision not in history.");
				}
				
				// Find all operations that the client didn't know of when it sent the
				// operation ...
				var serverOps = operations.slice(revision);
				
				if(serverOps.length === 0) {
					serverOps[0] = new ot.DeOperation();
				}
				
				// Currently transforming clientOp vs serverOps by composing
				// all of the serverOps in one operation and then transforming
				// this composed operation against the client operation.
				var serverOp = serverOps[0];
				for(var i=1;i<serverOps.length;i++) {
					var op = serverOps[i];
					serverOp = ot.DeOperation.compose(serverOp, op);
				}
				
				// Might easily be stuff wrong here.
				var xformedOps = ot.DeOperation.transform(serverOp, clientOp);
				var serverOpPrime = xformedOps[0];
				var clientOpPrime = xformedOps[1];
				
				device = clientOpPrime.apply(device);
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
	
	return DeServer;
})();


if(typeof module === 'object') {
	module.exports = DeServer;
}













































