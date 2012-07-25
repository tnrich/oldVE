/**
 * @class Teselagen.manager.SequenceManagerMemento
 * Memento to keep track of old versions of SequenceManager.
 *
 * Based off SequenceProviderMemento.as
 * @author Diana Wong
 * @author Zinovii Dmytriv (original author of SequenceProvider.as)
 */
Ext.define("Teselagen.manager.SequenceManagerMemento", {

    config: {
        name: "",
        circular: null,
        sequence: null,
        features: []
    },

    extend: "Ext.util.Memento",

    constructor: function(inData) {
        if (inData) {
            this.name     = inData.name     || null;
            this.circular = inData.circular || false;
            this.sequence = inData.sequence || null;
            this.features = inData.features || [];
        }
    }

});