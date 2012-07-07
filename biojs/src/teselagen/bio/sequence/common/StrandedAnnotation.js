/**
 * @class Teselagen.bio.sequence.common.StrandedAnnotation
 * 
 * 
 * 
 * 
 * @author Micah Lerner
 */

Ext.define("Teselagen.bio.sequence.common.StrandedAnnotation", {
	extend: 'Teselagen.bio.sequence.common.Annotation',
	
	constructor: function(data){


		start = data.start;
		end = data.end;
		strand = data.strand;

		console.log(strand);

		this.callParent([data]);

		this.getStrand = function(){
			return strand;
		}

		this.setStrand= function(pStrand){
			strand = pStrand;
		}

		return this;
	},
});