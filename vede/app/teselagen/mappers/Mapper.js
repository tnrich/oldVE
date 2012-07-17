Ext.define("Teselagen.mappers.Mapper", {
    requires: ["Teselagen.mappers.MapperEvent"],
    
    config: {
        sequenceManager: null,
        dirty: true
    },

    mixins: {
        observable: "Ext.util.Observable"
    },

	constructor: function(inData) {
        var that = this;
        this.mixins.observable.constructor.call(this, inData);
		
        if (inData) {
			this.initConfig(inData);
			this.sequenceManager.on("SequenceChanged", this.onSequenceProviderChanged, this);
		}

		this.onSequenceProviderChanged = function() {
            this.dirty = true;
        }
	},
});
