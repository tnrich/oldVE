Ext.define("Teselagen.manager.DigestionManager", {
    requires: ["Teselagen.bio.enzymes.RestrictionCutSite", 
               "Teselagen.bio.sequence.DNATools",
               "Teselagen.manager.SequenceManager",
               "Teselagen.data.DigestionSequence",
               "Teselagen.manager.RestrictionEnzymeManager"],

    statics: {
        matchNone: "None",
        matchNormalOnly: "NormalOnly",
        matchReverseComOnly: "RevComOnly",
        matchBoth: "Both",
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
        this.sequenceProvider = inData.sequenceManager;
        this.start =  inData.start;
        this.end = inData.end;
        this.digestionSequence = inData.digestionSequence;

        /*this.initializeSource();
         this.initializeDestination();
         this.calculateMatchingType();
*/
    },
    
    digest: function(pType){
        if (!(pType == this.self.matchNormalOnly 
           || pType == this.self.matchReverseComOnly)){
            throw new Error("Invalid digestion type");
        }

        if (pType == matchReverseComOnly){
            //reverseComplementSequence();
        };
        var startPosition = destinationStartCutSite.getStart();
        var endPosition = destinationStartCutSite.getEnd() 
            + destinationStartCutSite.getRestrictionEnzyme.getDsForward();

        if (destinationStartCutSite.getRestrictionEnzyme().getDsForward()
        > destinationStartCutSite.getRestrictionEnzyme().getDsReverse()){
            startPosition = destinationStartCutSite.getStart() + destinationStartCutSite.getRestrictionEnzyme().getDsReverse();

        } else if(destinationStartCutSite.getRestrictionEnzyme().getDsForward() < destination.getRestrictionEnzyme().getDsReverse()){
            startPosition = destinationStartCutSite.getStart() + destinationStartCutSite.getRestrictionEnzyme().getDsForward();
        } else {
            startPosition = destinationStartCutSite.getStart() + destinationStartCutSite.getRestrictionEnzyme().getDsForward();
        }

        if (destinationEndCutSite.getRestrictionEnzyme().getDsForward() > destinationEndCutSite.getRestrictionEnzyme().getDsReverse()){
            endPosition = destinationEndCutSite.getStart() + destinationEndCutSite.getRestrictionEnzyme().getDsForward();
        } else if (destinationEndCutSite.getRestrictionEnzyme().getDsForward() < destinationEndCutSite.getRestrictionEnzyme.getDsReverse()){
            endPosition = destinationEndCutSite.getStart() + destinationEndCutSite.getRestrictionEnzyme.getDsReverse();
        } else {
            endPosition = destinationEndCutSite.getStart() + destinationEndCutSite.getRestrictionEnzyme.getDsReverse();
        }

    },
    /*
    calculateMatchingType: function(){},
    initializeSource: function(){},
    initializeDestination: function(){},
    hasNormalMatch: function(){},
    hasRevComMatch: function(){},
    
    */
});
