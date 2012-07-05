/**
 * @class Teselagen.bio.sequence.common.StrandedAnnotation
 * 
 * 
 * 
 * 
 * @author Micah Lerner
 */

Ext.define("Teselagen.bio.sequence.common.StrandedAnnotation", {
	constructor: function(data){

		extend: 'Teselagen.bio.sequence.common.Annotation',

		var start = data.start;
		var end = data.end;
		var strand = data.strand;

		//this.callParent(data);

		this.getStrand = function(){
			return strand;
		}

		this.setStrand= function(pStrand){
			strand = pStrand;
		}

		return this;
	},
});