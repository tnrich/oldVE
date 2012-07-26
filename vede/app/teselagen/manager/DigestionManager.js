Ext.define("Teselagen.manager.DigestionManager", {
    extend: "Teselagen.mapper.Mapper",
    singleton: true,
    requires: ["Teselagen.bio.enzymes.RestrictionCutSite", 
               "Teselagen.bio.sequence.DNATools",
               "Teselagen.manager.SequenceManager",
               "Teselagen.data.DigestionSequence",
               "Teselagen.manager.RestrictionEnzymeManager"],

    statics: {
        matchNone: "None",
        matchNormalOnly: "NormalOnly",
        matchReverseComOnly: "RevComOnly",
        matchBoth: "Both"
        overhangNone: "None",
        overhangTop: "Top",
        overhangBottom: "Bottom"
    },

    config: {
        sequenceProvider: null,
        start: null,
        end: null,
        digestionSequence: null,
        restrictionEnzymeMapper: null,

        _matchType: null,

        destinationStartCutSite: null,
        destinationEndCutSite: null,
        destinationOverhangStartType: null,
        destinationOverhangEndType: null,
        destinationOverhangStartSequence: null,
        destinationOverhangEndSequence: null,

        sourceSequence: null,
        sourceRevComSequence: null,
        sourceOverhangStartType: null,
        sourceOverhangEndType: null,
        sourceOverhangStartSequence: null,
        sourceOverhangEndSequence: null,
        pasteSequenceProvider: null,
    },
    
    constructor: function(inData){
        this.statics();
        this.initConfig(inData);

        /*this.initializeSource();
         this.initializeDestination();
         this.calculateMatchingType();
*/
    },
    
    /*
    digest: function(){},
    calculateMatchingType: function(){},
    initializeSource: function(){},
    initializeDestination: function(){},
    hasNormalMatch: function(){},
    hasRevComMatch: function(){},
    
    */
});
