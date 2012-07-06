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
	extend: "Teselagen.bio.sequence.alphabets.AbstractAlphabet",
	requires: ["Teselagen.bio.sequence.symbols.NucleotideSymbol"],
	//statics: {
	
		a: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []}),
		g: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []}), 
		c: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Cytosine", value: "c", ambiguousMatches: []}), 
		t: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Thymine", value: "t", ambiguousMatches: []}), 
		m: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;'}" , value: "m", ambiguousMatches: [this.a, this.c]}),
		r: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g;'}", value: "r", ambiguousMatches: [this.a, this.g]}),
		w: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 't;'}", value: "w", ambiguousMatches: [this.a, this.t]}), 
		s: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g;'}", value: "s", ambiguousMatches: [this.c, this.g]}), 
		y: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 't;'}", value: "y", ambiguousMatches: [this.c, this.t]}), 
		k: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'g' or 't;'}", value: "k", ambiguousMatches: [this.g, this.t]}), 
		v: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;' or 'g'}", value: "v", ambiguousMatches: [this.a, this.c, this.g]}), 
		h: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;' or 't'}", value: "h", ambiguousMatches: [this.a, this.c, this.t]}), 
		d: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g;' or 't'}", value: "d", ambiguousMatches: [this.a, this.g, this.t]}), 
		b: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g;' or 't'}", value: "b", ambiguousMatches: [this.c, this.g, this.t] }), 
		n: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 't;' or 'g' or 'c'}", value: "n", ambiguousMatches: [this.a, this.c, this.g, this.t] }), 
		
		/**
		 * Returns data about the Adenine NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the "a" nucleotide
		 */
		getA: function() { 
			return this.a;
		},
		/**
		*
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
		
	//}

	
});
