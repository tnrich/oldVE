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
		var reSitesMap = Teselagen.bio.enzymes.RestrictionEnzymeMapper.cutSequence(enzymes, dnaSequence);
		var reSitesList = new Array();

		for(var i = 0; i < reSitesMap.length; i++) {
			var sites = reSitesMap[i];
			while(sites.length > 0) {
				reSitesList.push(sites.pop());
			}
		}
		reSitesList.sort(sortByStart);

		var fragments = new Array();

		if(reSitesList.length == 0) {
			return fragments;
		}

		for(var i = 0; i < reSitesList.length - 1; i++) {
			var fragment = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment", {
				start: reSitesList[i].start,
				end: reSitesList[i].end,
				length: reSitesList[i+1].end - reSitesList[i].start,
				startRE: reSitesList[i].restrictionEnzyme,
				endRE: reSitesList[i+1].restrictionEnzyme
			});
			fragments.push(fragment);
		}

		if(dnaSequence.circular) {
			var fragLength = reSitesList[0].end - reSitesList[reSitesList.length-1].start + dnaSequence.length;
			var fragment = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment", {
				start: reSitesList[reSitesList.length-1].start,
				end: reSitesList[0].end,
				length: fragLength,
				startRE: reSitesList[reSitesList.length-1].restrictionEnzyme,
				endRE: reSitesList[0].restrictionEnzyme
			});
			fragments.push(fragment);
		} else {
			var fragment = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment", {
				start: 0,
				end: reSitesList[0].end,
				length: reSitesList[0].end,
				startRE: null,
				endRE: reSitesList[0].restrictionEnzyme
			});
			fragments.push(fragment);

			fragment = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment", {
				start: reSitesList[reSitesList.length-1],
				end: dnaSequence.length, //TODO: should this be dnaSequence.length-1 ?
				length: dnaSequence.length - reSitesList[reSitesList.length-1].start,
				startRE: reSitesList[reSitesList.length-1].restrictionEnzyme,
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