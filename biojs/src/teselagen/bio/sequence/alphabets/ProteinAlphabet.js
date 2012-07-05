//Need to implement  singleton
Ext.define("Teselagen.bio.sequence.alphabets.ProteinAlphabet", {
	extend: "Teselagen.bio.sequence.alphabets.AbstractAlphabet",
	singleton: true,

		a: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Alanine', threeLettersName: 'Ala', value: 'A'),
		r: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Arginine', threeLettersName: 'Arg', value: 'R'),
		n: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Asparagine', threeLettersName: 'Asn', value: 'N'),
		d: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Aspartic acid', threeLettersName: 'Asp', value: 'D'),
		c: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Cysteine', threeLettersName: 'Cys', value: 'C'),
		e: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Glutamic acid', threeLettersName: 'Glu', value: 'E'),
		q: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Glutamine', threeLettersName: 'Gln', value: 'Q'),
		g: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Glycine', threeLettersName: 'Gly', value: 'G'),
		h: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Histidine', threeLettersName: 'His', value: 'H'),
		i: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Isoleucine ', threeLettersName: 'Ile', value: 'I'),
		l: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Leucine', threeLettersName: 'Leu', value: 'L'),
		k: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Lysine', threeLettersName: 'Lys', value: 'K'),
		m: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Methionine', threeLettersName: 'Met', value: 'M'),
		f: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Phenylalanine', threeLettersName: 'Phe', value: 'F'),
		p: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Proline', threeLettersName: 'Pro', value: 'P'),
		s: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Serine', threeLettersName: 'Ser', value: 'S'),
		t: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Threonine', threeLettersName: 'Thr', value: 'T'),
		w: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Tryptophan', threeLettersName: 'Try', value: 'W'),
		y: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Tyrosine', threeLettersName: 'Tyr', value: 'Y'),
		v: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {(name:'Valine ', threeLettersName: 'Val', value: 'V'),

		getA: function() { return a; }
		getR: function() { return r; }
		getN: function() { return n; }
		getD: function() { return d; }
		 getC: function() { return c; }
		 getE: function() { return e; }
		 getQ: function() { return q; }
		 getG: function() { return g; }
		 getH: function() { return h; }
		 getI: function() { return i; }
		 getL: function() { return l; }
		 getK: function() { return k; }
		 getM: function() { return m; }
		 getF: function() { return f; }
		 getP: function() { return p; }
		 getS: function() { return s; }
		 getT: function() { return t; }
		 getW: function() { return w; }
		 getY: function() { return y; }
		 getV: function() { return v; }

			getAlanine:  function (){ return a; }
   getArginine: function (){ return r; }
   getAsparagine:  function (){ return n; }
   getAspartic: function (){ return d; }
   getCysteine:  function (){ return c; }
   getGlutamic:  function (){ return e; }
   getGlutamine:  function (){ return q; }
   getGlycine:  function (){ return g; }
   geidine:  function (){ return h; }
   getIsoleucine:  function (){ return i; }
   getLeucine:  function (){ return l; }
   getLysine:  function (){ return k; }
   getMethionine:  function (){ return m; }
   getPhenylalanine:  function (){ return f; }
   getProline:  function (){ return p; }
   getSerine:  function (){ return s; }
   getThreonine:  function (){ return t; }
   getTryptophan:  function (){ return w; }
   getTyrosine:  function (){ return y; }
   getValine:  function (){ return v; }
	
});