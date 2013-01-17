/**
 * @class Teselagen.mappers.Mapper
 * Superclass for mappers. A mapper receives a Teselagen.manager.SequenceManager object and records and calculates data for that sequence. When the sequence changes for whatever reason, the mapper recalculates its data, be it the amino acid translation of the sequence, 
 */
Ext.define("Teselagen.mappers.Mapper", {
    requires: ["Teselagen.event.MapperEvent"],
    
    config: {
        sequenceManager: null,
        dirty: true
    },

    mixins: {
        observable: "Ext.util.Observable"
    },

    updateEventString: null,
    
    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The SequenceManager to listen to for events.
     * @param {Boolean} dirty A flag which signifies that the mapper must recalculate its data. Set when the SequenceManager fires a SequenceChanged event.
     */
	constructor: function(inData) {
        var that = this;
        this.mixins.observable.constructor.call(this, inData);
		
        if (inData) {
			this.initConfig(inData);
		}
	},

    /**
     * @private
     * Called when the sequence provider changes. Sets the dirty flag to true,
     * telling the mapper to recalculate when it is next accessed.
     */
	sequenceChanged: function() {
        this.dirty = true;
    },

    setSequenceManager: function(pSeqMan) {
        this.dirty = true;
        this.sequenceManager = pSeqMan;
    }
});
