/**
 * This class is the datastructure for bands of a Restriction digest.
 * @author Doug Hershberger
 */

Ext.define("Teselagen.models.digest.GelBand", {

    config: {
        BAND_COLOR: '#fff',
        CONNECTOR_COLOR: '#999999',
        bandYPosition: null,
        bandSizeLabel: null,
        bandSizeLabelYPosition: null,
        name: "default",
        /**
         * A {Text} label to associate with the start usually the restriction enzyme at this end
         */
        start: null,
        /**
         * A {Text} label to associate with the end usually the restriction enzyme at this end
         */
        end: null,
        /**
         * The size of the band in base pairs
         */
        size: 0
    },
    /**
     * You can provide a {Teselagen.bio.sequence.dna.DigestionFragment} to inData as
     * digestionFragment. If you do, then size, start and stop will be calculated from that
     */
    constructor: function(inData){
        if (inData.digestionFragment !== null){
            this.size =  inData.digestionFragment.getLength();
            this.start =  inData.digestionFragment.getStartRE().getName();
            this.end =  inData.digestionFragment.getEndRE().getName();            
        }
    }
});
 
