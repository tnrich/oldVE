/**
 * @class Teselagen.bio.sequence.common.StrandedAnnotation
 * Annotation with defined read direction.
 * 
 * @see Teselagen.bio.sequence.common.StrandType
 * @extends {Teselagen.bio.sequence.common.Annotation}
 * @author Micah Lerner
 */

Ext.define("Teselagen.bio.sequence.common.StrandedAnnotation", {
	extend: 'Teselagen.bio.sequence.common.Annotation',
	
	/**
	 * Constructor
	 * @param  {Integer} start stranded annotaiton start
	 * @param {Integer} end stranded annotaiton end
	 * @param {Integer} Strand strand directionality
	 */
	constructor: function(inData){
		var start;
		var end;
		var strand;
		
		if (inData) {	
			start  = inData.start || 0 ;
			end    = inData.end || 0;
			strand = inData.strand || Teselagen.StrandType.FORWARD;
		} else{
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}


		this.callParent([inData]);

		/**
		 * Returns strand directionality
		 * @return {Integer} strand directionality
		 */
		this.getStrand = function(){
			return strand;
		}

		/**
		 * Sets strand directionality
		 * @param {Integer} pStrand strand directionality
		 */
		this.setStrand= function(pStrand){
			strand = pStrand;
		}

		return this;
	},
});