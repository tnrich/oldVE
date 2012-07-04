
/**
 * @class Teselagen.bio.enzymes.RestrictionCutSite
 * 
 * Restriction cut site.
 * 
 * @author Michael Fero
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.enzymes.RestrictionCutSite", {

	extend: "Teselagen.bio.sequence.common.StrandedAnnotation",

	constructor: function(inData) {
		var that = this;
		var restrictionEnzyme;
		var numCuts = 0;

		if (inData){        
			that.start = inData.start;
			that.end = inData.end;
			restrictionEnzyme = inData.restrictionEnzyme;

		}
		
		this.getRestrictionEnzyme = function(){
		return restrictionEnzyme;
		}
		this.getNumCuts = function(){
			return numCuts;
		}
		this.setNumCuts = function(pNumCuts){
			numCuts = pNumCuts;
		}
		
		
		return this;

	}
});