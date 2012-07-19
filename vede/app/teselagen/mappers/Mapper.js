/**
 * @class Teselagen.mappers.Mapper
 * Superclass for mappers. A mapper receives a @link Teselagen.manager.SequenceManager object and records and calculates data for that sequence. When the sequence changes for whatever reason, the mapper recalculates its data, be it the amino acid translation of the sequence, 
 */
Ext.define("Teselagen.mappers.Mapper", {
    requires: ["Teselagen.mappers.MapperEvent"],
    
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
            // This line is going to go to a controller instead, which will call the onSequenceProviderChanged method.
			this.sequenceManager.on("SequenceChanged", this.onSequenceProviderChanged, this); 
		}
	},

    /**
     * @private
     * Called when the sequence provider changes. Sets the dirty flag to true,
     * telling the mapper to recalculate when it is next accessed.
     */
	onSequenceProviderChanged: function() {
        this.dirty = true;
    },
});
