Ext.define("Teselagen.mappers.Mapper", {
    requires: ["Teselagen.mappers.MapperEvent"],
    
    config: {
        sequenceManager: null
    },

    mixins: {
        observable: "Ext.util.Observable"
    },

	constructor: function(inData) {
        var dirty = true;

		if (inData) {
			this.initConfig(inData);
            // TODO: figure out what to do with this event
			this.sequenceManager.on("SequenceChanged", this.onSequenceProviderChanged);
		}

		this.onSequenceProviderChanged = function() {
            dirty = true;
        }
	},
});

