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