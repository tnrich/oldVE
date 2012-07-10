/**
 * @class Teselagen.bio.tools.DigestionCalculator
 *
 * Digestion calculator class.
 *
 * @author Nick Elsbree
 * @author unknown (original author)
 */
Ext.define("Teselagen.bio.tools.DigestionCalculator", {
	singleton: true,

	requires: ["Teselagen.bio.enzymes.RestrictionCutSite",
		"Teselagen.bio.enzymes.RestrictionEnzyme",
		"Teselagen.bio.enzymes.RestrictionEnzymeMapper",
		"Teselagen.bio.sequence.dna.DNASequence",
		"Teselagen.bio.sequence.dna.DigestionFragment"],

	/**
	 * Calculates position where enzyme cuts sequence and lists digestion fragments.
	 * 
	 * @param  {Teselagen.bio.sequence.dna.DNASequence} dnaSequence DNA sequence to digest.
	 * @param  {Array<Teselagen.bio.enzymes.RestrictionEnzyme>} enzymes List of enzymes that participate in digestion.
	 * 
	 * @return {Array<Teselagen.bio.sequence.dna.DigestionFragment>} List of resulting digestion fragments.
	 */
	digestSequence: function(dnaSequence, enzymes) {
		var seqLength = dnaSequence.toString().length;
		var reSitesMap = Teselagen.bio.enzymes.RestrictionEnzymeMapper.cutSequence(enzymes, dnaSequence);
		var reSitesList = new Array();

		for(var i = 0; i < reSitesMap.getKeys().length; i++) {
			var enz = reSitesMap.getKeys()[i];
			var sites = reSitesMap.get(enz);
			while(sites.length > 0) {
				reSitesList.push(sites.pop());
			}
		}
		reSitesList.sort(this.sortByStart);

		var fragments = new Array();

		if(reSitesList.length == 0) {
			return fragments;
		}

		for(var i = 0; i < reSitesList.length - 1; i++) {
			var fragment = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment", {
				start: reSitesList[i].getStart(),
				end: reSitesList[i+1].getEnd(),
				length: reSitesList[i+1].getEnd() - reSitesList[i].getStart(),
				startRE: reSitesList[i].getRestrictionEnzyme(),
				endRE: reSitesList[i+1].getRestrictionEnzyme()
			});
			fragments.push(fragment);
		}

		if(dnaSequence.getCircular()) {
			var fragLength = reSitesList[0].end - reSitesList[reSitesList.length-1].start + seqLength;
			var fragment = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment", {
				start: reSitesList[reSitesList.length-1].getStart(),
				end: reSitesList[0].getEnd(),
				length: fragLength,
				startRE: reSitesList[reSitesList.length-1].getRestrictionEnzyme(),
				endRE: reSitesList[0].getRestrictionEnzyme()
			});
			fragments.push(fragment);
		} else {
			var fragment = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment", {
				start: 0,
				end: reSitesList[0].getEnd(),
				length: reSitesList[0].getEnd(),
				startRE: null,
				endRE: reSitesList[0].getRestrictionEnzyme()
			});
			fragments.push(fragment);

			fragment = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment", {
				start: reSitesList[reSitesList.length-1].getStart(),
				end: seqLength, //TODO: should this be seqLength-1 ?
				length: seqLength - reSitesList[reSitesList.length-1].getStart(),
				startRE: reSitesList[reSitesList.length-1].getRestrictionEnzyme(),
				endRE: null
			});
			fragments.push(fragment);
		}

		return fragments;
	},

	/**
	 * @private
	 * Helper function for sorting two restriction cut sites.
	 * 
	 * @param {Teselagen.bio.enzymes.RestrictionCutSite} x
	 * @param {Teselagen.bio.enzymes.RestrictionCutSite} y
	 * 
	 * @return {Int} The sort order.
	 */
	sortByStart: function(x, y) {
		if(x.start < y.start) {
			return -1;
		} else if(x.start > y.start) {
			return 1;
		} else {
			return 0;
		}
	}
});