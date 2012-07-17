/**
 * @class Teselagen.bio.sequence.alphabets.DNAAlphabet
 * 
 * DNA alphabet. Most general alphabet to build DNA sequences.
 * 
 * @see Teselagen.bio.sequence.symbols.NucleotideSymbol
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 * @author Timothy Ham (original author)
 */
Ext.define("Teselagen.bio.sequence.alphabets.DNAAlphabet", {
	singleton: true,

	alternateClassName: "Teselagen.DNAAlphabet",
	extend: "Teselagen.bio.sequence.alphabets.AbstractAlphabet",
	requires: ["Teselagen.bio.sequence.symbols.NucleotideSymbol"],
	a: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []}),
	g: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []}), 
	c: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Cytosine", value: "c", ambiguousMatches: []}), 
	t: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Thymine", value: "t", ambiguousMatches: []}), 
	m: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;'}" , value: "m", ambiguousMatches: []}),
	r: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g;'}", value: "r", ambiguousMatches: []}),
	w: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 't;'}", value: "w", ambiguousMatches: []}), 
	s: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g;'}", value: "s", ambiguousMatches: []}), 
	y: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 't;'}", value: "y", ambiguousMatches: []}), 
	k: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'g' or 't;'}", value: "k", ambiguousMatches: []}), 
	v: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;' or 'g'}", value: "v", ambiguousMatches: []}), 
	h: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;' or 't'}", value: "h", ambiguousMatches: []}), 
	d: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g;' or 't'}", value: "d", ambiguousMatches: []}), 
	b: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g;' or 't'}", value: "b", ambiguousMatches: []}), 
	n: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 't;' or 'g' or 'c'}", value: "n", ambiguousMatches: [] }), 

	//A workaround to set ambiguous matches.
	constructor: function(){
		//Set ambiguous matches inside the constructor so ExtJS doesn't complain.
		var that = this;
		that.m.setAmbiguousMatches([that.a, that.c]);
		that.r.setAmbiguousMatches([that.a, that.g]);
		that.w.setAmbiguousMatches([that.a, that.t]);
		that.s.setAmbiguousMatches([that.c, that.g]);
		that.y.setAmbiguousMatches([that.c, that.t]);
		that.k.setAmbiguousMatches([that.g, that.t]);
		that.v.setAmbiguousMatches([that.a, that.c, that.g]);
		that.h.setAmbiguousMatches([that.a, that.c, that.t]);
		that.d.setAmbiguousMatches([that.a, that.g, that.t]);
		that.b.setAmbiguousMatches( [that.c, that.g, that.t]);
		that.n.setAmbiguousMatches([that.a, that.c, that.g, that.t]);
		that.callParent([]);
	},

              symbolMap: function (pCharacter) {
               var safeChar = pCharacter.toLowerCase();
               symbols = {
                "a": this.getA(),
                "g": this.getG(),
                "c": this.getC(),
                "t": this.getT(),
                "m": this.getM(),
                "r": this.getR(),
                "w": this.getW(),
                "s": this.getS(),
                "y": this.getY(),
                "k": this.getK(),
                "v": this.getV(),
                "h": this.getH(),
                "d": this.getD(),
                "b": this.getB(),
                "n": this.getN(),
            }

                return symbols[pCharacter];
            },
		/**
		 * Returns data about the Adenine NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the "a" nucleotide
		 */
		getA: function() { 
			return this.a;
		},
		
		/**
		 * Returns data about the Guanine NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the "g" nucleotide
		  */
		getG: function() { 
			return this.g; 
		},

		/**
		 * Returns data about the Cytosine NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the "c" nucleotide
		 */
		getC: function(){ 
			return this.c; 
		},

		/**
		 * Returns data about the Thymine NucleotideSymbol
		 * @return {NucleotideSymbol} [description]
		 */
		getT: function(){ return this.t; },

		/**
		  * Returns data about the "Ambiguous a or c" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or c nucleotide
		 */
		getM: function(){ return this.m; },

		/**
		  * Returns data about the "Ambiguous a or g" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or g nucleotide
		 */
		getR: function(){ return this.r; },

		/**
		  * Returns data about the "Ambiguous a or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or t nucleotide
		 */
		getW: function(){ return this.w; },

		/**
		  * Returns data about the "Ambiguous c or g" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous c or g nucleotide
		 */
		getS: function(){ return this.s; },
		/**
		*
		  * Returns data about the "Ambiguous c or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous c or t nucleotide
		  */
		getY: function(){ return this.y; },

		/**
		  * Returns data about the "Ambiguous g or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous g or t nucleotide
		 */
		getK: function(){ return this.k; },

		/**
		  * Returns data about the "Ambiguous a or c or g" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or c or g nucleotide
		 */
		getV: function(){ return this.v; },

		/**
		  * Returns data about the "Ambiguous a or c or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or c or t nucleotide
		 */
		getH: function(){ return this.h; },

		/**
		  * Returns data about the "Ambiguous a or g or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or g or t nucleotide
		 */
		getD: function(){ return this.d; },

		/**
		  * Returns data about the "Ambiguous c or g or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous c or g or t nucleotide
		 */
		getB: function(){ return this.b; },

		/**
		  * Returns data about the "Ambiguous a or t or g or c" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or t or g or c nucleotide
		 */
		getN: function(){ return this.n; },

	
});
