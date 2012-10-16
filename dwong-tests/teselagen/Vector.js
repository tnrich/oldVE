
// Vector object
// input: Genbank Class
// output:

Ext.define('Teselagen.Vector', {
    constructor: function (genbank) {
	
	var that = this;
	var thisGenbank = genbank;
	
	console.log(thisGenbank.getOrigin());
	
	var myComp= new Complement();
	this.tmp = "YAY!";
	
	
	//Vector.prototype = VeDe;

	
	// -----------------------------------------------------
	// PRIVELEGED METHODS/FUNCTIONS --- ACCESSIBLE BY PUBLIC
	// -----------------------------------------------------
	
	this.getFeatures = function () {
		return null;
		
	}

	this.findORF = function () {
		return null;
		
	}
	this.forwardTranslation = function () {
		return null;
		
	}
	this.backTranslator = function () {
		return null;
		
	}
	this.getReverseComplement = function () {
		var seq = thisGenbank.getOrigin();
		console.log(seq);
		//var len = seq.length;
		var revcomp = "";
		
		//for (var i=0; i<seq.length; i++) {
		//	revcomp = revcomp + myComp.getNA(seq.charAt(i));
		//}
		return revcomp;
	}
	
	// Given restriction sites, return an array of where all the cuts occur.
	this.getCutSites = function () {
		return null;
	}
	
	
	//=================================
	// INTERNAL DATA STRUCTURES
	//=================================
	
	function Complement() {
		this.A = "T";
		this.T = "A";
		this.C = "G";
		this.G = "C";
		
		this.getNA = function (nucAcid) {
			//return this[nucAcid];
			return null;
		};
	}
	
	return this;
    }

});
