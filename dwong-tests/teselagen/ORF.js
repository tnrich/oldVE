
    /**
    *   Open Reading Frame DNA sequence annotation
    *
    *   @author Micah Lerner
    */

Ext.define('Teselagen.ORF', {
	    /** @lends Teselagen.ORF */
    var _frame;
    var _startCodons = new Array();
    var start;
    var end;
    var strand;

    /**
     * Constructor
     * @param  {[int]} start       Frame start
     * @param  {[int]} end         Frame end
     * @param  {[int]} strand    Direction of frame (Forward/Backward)
     * @param  {[int]} frame       Reading frame. Can be 0, 1, 2.
     * @param  {[array]} startCodons List of start codons for an Open Reading Frame
     */
    constructor: function (start, end, strand, frame, startCodons) {
    	//Later this should be made to a super constructor (once StrandedAnnotation is ported)
        this.start        = start;
        this.end          = end;
        this.strand       = strand;
        this._startCodons = startCodons;
        this._frame       = frame;    
    
        return this;
    },

//Properties
/**
 * [getFrame ]
 * @return {[int]} Returns 0, 1, 2 according to frame.
 */
    getFrame: function(){
    	return this._frame;
    }
/**
 * [setFrame Set the reading frame.]
 * @param {[int]} newFrame Sets the reading frame. Value should be  0, 1, or 2
 */
    setFrame: function (newFrame) {
    	this._frame = newFrame;
    }
/**
 * [getStartCodons Retrieves start codons.]
 * @return {[array]} An array of ints.
 */
    getStartCodons: function () {
    	return this._startCodons;
    }

/**
 * [setStartCodons Set start codons]
 * @param {[array]} newStartCodons      Update start codons.
 */
    setStartCodons: function(newStartCodons){
    	this._startCodons = newStartCodons;
    }
});