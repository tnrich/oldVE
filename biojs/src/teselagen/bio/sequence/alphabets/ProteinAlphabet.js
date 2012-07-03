Ext.define("Teselagen.bio.sequence.alphabets.ProteinAlphabet", {
	extend: "Teselagen.bio.sequence.alphabets.AbstractAlphabet"
	contstructor: function(data){
		var a = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Alanine', threeLettersName: 'Ala', value: 'A');
		var r = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Arginine', threeLettersName: 'Arg', value: 'R');
		var n = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Asparagine', threeLettersName: 'Asn', value: 'N');
		var d = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Aspartic acid', threeLettersName: 'Asp', value: 'D');
		var c = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Cysteine', threeLettersName: 'Cys', value: 'C');
		var e = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Glutamic acid', threeLettersName: 'Glu', value: 'E');
		var q = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Glutamine', threeLettersName: 'Gln', value: 'Q');
		var g = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Glycine', threeLettersName: 'Gly', value: 'G');
		var h = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Histidine', threeLettersName: 'His', value: 'H');
		var i = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Isoleucine ', threeLettersName: 'Ile', value: 'I');
		var l = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Leucine', threeLettersName: 'Leu', value: 'L');
		var k = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Lysine', threeLettersName: 'Lys', value: 'K');
		var m = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Methionine', threeLettersName: 'Met', value: 'M');
		var f = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Phenylalanine', threeLettersName: 'Phe', value: 'F');
		var p = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Proline', threeLettersName: 'Pro', value: 'P');
		var s = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Serine', threeLettersName: 'Ser', value: 'S');
		var t = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Threonine', threeLettersName: 'Thr', value: 'T');
		var w = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Tryptophan', threeLettersName: 'Try', value: 'W');
		var y = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Tyrosine', threeLettersName: 'Tyr', value: 'Y');
		var v = Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Valine ', threeLettersName: 'Val', value: 'V');

		this.getA = function() { return a; }
				this.getR = function() { return r; }
		this.getN = function() { return n; }
		this.getD = function() { return d; }
		 this.getC = function() { return c; }
		 this.getE = function() { return e; }
		 this.getQ = function() { return q; }
		 this.getG = function() { return g; }
		 this.getH = function() { return h; }
		 this.getI = function() { return i; }
		 this.getL = function() { return l; }
		 this.getK = function() { return k; }
		 this.getM = function() { return m; }
		 this.getF = function() { return f; }
		 this.getP = function() { return p; }
		 this.getS = function() { return s; }
		 this.getT = function() { return t; }
		 this.getW = function() { return w; }
		 this.getY = function() { return y; }
		 this.getV = function() { return v; }

			this.getAlanine = function (){ return a; }
   this.getArginine= function (){ return r; }
   this.getAsparagine = function (){ return n; }
   this.getAspartic= function (){ return d; }
   this.getCysteine = function (){ return c; }
   this.getGlutamic = function (){ return e; }
   this.getGlutamine = function (){ return q; }
   this.getGlycine = function (){ return g; }
   this.getHistidine = function (){ return h; }
   this.getIsoleucine = function (){ return i; }
   this.getLeucine = function (){ return l; }
   this.getLysine = function (){ return k; }
   this.getMethionine = function (){ return m; }
   this.getPhenylalanine = function (){ return f; }
   this.getProline = function (){ return p; }
   this.getSerine = function (){ return s; }
   this.getThreonine = function (){ return t; }
   this.getTryptophan = function (){ return w; }
   this.getTyrosine = function (){ return y; }
   this.getValine = function (){ return v; }
		 return this;
	}
});