Ext.define("Teselagen.bio.sequence.dna.DNASequence", {
	requires: ["Teselagen.bio.sequence.common.Sequence", "Teselagen.bio.sequence.common.SymbolList"],
	extend: "Teselagen.bio.sequence.common.Sequence",

	constructor: function (inData) {
		if (inData) {
			var symbolList = inData.symbolList || null;
			var name = inData.name || "";
			var circular = inData.circular || false;
			var accession = inData.accession || "";
			var version = inData.version || 1;
			var seqVersion = inData.seqVersion || 0.0;
			this.callParent([inData]);
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}

		/**
		this.getAccession = function(){
			return accession;
		}

		/**
		this.setAccession= function (pAccession){
			accession = pAccession;
		}

		/**
		this.getVersion = function(){
			return version;
		}

		/**
		this.setVersion= function (pVersion){
			version = pVersion;
		}

		/**
		this.getSeqVersion = function(){
			return seqVersion;
		}

		/**
		this.setSeqVersion= function (pSeqVersion){
			seqVersion = pSeqVersion;
		}

		/**
		this.getCircular = function(){
			return circular;
		}

		/**
		this.setCircular = function (pCircular){
			circular = pCircular;
		}

		return this;
	}
});