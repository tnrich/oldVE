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

    previousCalculatedSequence: null,

    updateEventString: null,

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The SequenceManager to listen to for events.
     * @param {Boolean} dirty A flag which signifies that the mapper must recalculate its data. Set when the SequenceManager fires a SequenceChanged event.
     */

    /**
     * @private
     * Called when the sequence provider changes. Sets the dirty flag to true,
     * telling the mapper to recalculate when it is next accessed.
     */
    sequenceChanged: function() {
        if(this.previousCalculatedSequence !== this.getSequenceManager().getSequence().toString()) {
            //console.log(this.$className + " dirty");
            this.setDirty(true);
            this.previousCalculatedSequence = this.getSequenceManager().getSequence().toString();
        }
    },

    setSequenceManager: function(pSeqMan) {
        if(pSeqMan) {
            if(this.previousCalculatedSequence !== pSeqMan.getSequence().toString()) {
                //console.log(this.$className + " dirty");
                this.setDirty(true);
                this.previousCalculatedSequence = pSeqMan.getSequence().toString();
            }
        } else {
            //console.log(this.$className + " dirty");
            this.setDirty(true);
            this.previousCalculatedSequence = null;
        }

        this.sequenceManager = pSeqMan;
    }
});
