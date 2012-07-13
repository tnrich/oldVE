Ext.define("Teselagen.mappers.Mapper", {
    config: {
        sequenceManager: null
    };

	constructor: function(inData) {
		var that = this;
        var dirty = true;

		if (inData) {
			initConfig(inData);
            // TODO: figure out what to do with this event
			that.sequenceManager.addEventListener(Events.SEQUENCE_CHANGED, this.onSequenceProviderChanged);
		}

		this.onSequenceProviderChanged = function() {
            dirty = true;
        }
	},
});

