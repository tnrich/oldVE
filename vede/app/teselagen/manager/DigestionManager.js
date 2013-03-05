/**
 * Digestion manager
 * @class Teselagen.manager.DigestionManager
 */
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
        pasteSequenceProvider: null
    },
    
    constructor: function(inData){
        this.statics();
        this.initConfig(inData);
        this.sequenceProvider = inData.sequenceManager;
        this.start =  inData.start;
        this.end = inData.end;
        this.digestionSequence = inData.digestionSequence;

        this.initializeSource();
        /* this.initializeDestination();
         this.calculateMatchingType();
*/
    },
    initializeSource: function(){
        this.sourceSequence = this.digestionSequence.sequenceProvider.sequence.toString();
        this.sourceRevComSequence = this.digestionSequence.sequenceProvider.sequence.toString();
        
        var pastableStartIndex = this.digestionSequence.startRestrictionEnzyme.dsForward;
        var pastableEndIndex = this.digestionSequence.endRelativePosition + this.digestionSequence.endRestrictionEnzyme.dsReverse;
        
        if(this.digestionSequence.startRestrictionEnzyme.dsForward < this.digestionSequence.startRestrictionEnzyme.dsReverse) {
            this.sourceOverhangStartType = this.self.overhangTop;
            this.sourceOverhangStartSequence = this.sourceSequence.substring(this.digestionSequence.startRestrictionEnzyme.dsForward, this.digestionSequence.startRestrictionEnzyme.dsReverse);
            pastableStartIndex = this.digestionSequence.startRestrictionEnzyme.dsForward;
        } else if(this.digestionSequence.startRestrictionEnzyme.dsForward > this.digestionSequence.startRestrictionEnzyme.dsReverse) {
            this.sourceOverhangStartType = this.self.overhangBottom;
            this.sourceOverhangStartSequence = this.sourceRevComSequence.substring(this.digestionSequence.startRestrictionEnzyme.dsForward, this.digestionSequence.startRestrictionEnzyme.dsReverse);
            pastableStartIndex = this.digestionSequence.startRestrictionEnzyme.dsReverse;
        } else {
            this.sourceOverhangStartType = this.self.overhangNone;
            this.sourceOverhangStartSequence = "";
        }
        
        if(this.digestionSequence.endRestrictionEnzyme.dsForward < this.digestionSequence.endRestrictionEnzyme.dsReverse) {
            this.sourceOverhangEndType = this.self.overhangBottom;
            this.sourceOverhangEndSequence = this.sourceRevComSequence.substring(this.digestionSequence.endRelativePosition + this.digestionSequence.endRestrictionEnzyme.dsForward, this.digestionSequence.endRelativePosition + this.digestionSequence.endRestrictionEnzyme.dsReverse);
            pastableEndIndex = this.digestionSequence.endRelativePosition + this.digestionSequence.endRestrictionEnzyme.dsReverse;
        } else if(this.digestionSequence.endRestrictionEnzyme.dsForward > this.digestionSequence.endRestrictionEnzyme.dsReverse) {
            this.sourceOverhangEndType = this.self.overhangTop;
            this.sourceOverhangEndSequence = this.sourceSequence.substring(this.digestionSequence.endRelativePosition + this.digestionSequence.endRestrictionEnzyme.dsForward, this.digestionSequence.endRelativePosition + this.digestionSequence.endRestrictionEnzyme.dsReverse);
            pastableEndIndex = this.digestionSequence.endRelativePosition + this.digestionSequence.endRestrictionEnzyme.dsForward;
        } else {
            this.sourceOverhangEndType = this.self.overhangNone;
            this.sourceOverhangEndSequence = "";
        }
        
        this.pasteSequenceProvider = this.digestionSequence._sequenceManager.subSequenceProvider(pastableStartIndex, pastableEndIndex);
    },
    
    
    digest: function(pType){
        if (!(pType === this.self.matchNormalOnly || pType === this.self.matchReverseComOnly)){
            throw new Error("Invalid digestion type");
        }

        if (pType === this.self.matchReverseComOnly){
            //reverseComplementSequence();
            this.pasteSequenceProvider.reverseComplementSequence();
        }
        var startPosition = this.destinationStartCutSite.getStart();
        var endPosition = this.destinationStartCutSite.getEnd() + this.destinationStartCutSite.getRestrictionEnzyme.getDsForward();

        if (this.destinationStartCutSite.getRestrictionEnzyme().getDsForward() > this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse()){
            startPosition = this.destinationStartCutSite.getStart() + this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse();

        } else if(this.destinationStartCutSite.getRestrictionEnzyme().getDsForward() < this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse()){
            startPosition = this.destinationStartCutSite.getStart() + this.destinationStartCutSite.getRestrictionEnzyme().getDsForward();
        } else {
            startPosition = this.destinationStartCutSite.getStart() + this.destinationStartCutSite.getRestrictionEnzyme().getDsForward();
        }

        if (this.destinationEndCutSite.getRestrictionEnzyme().getDsForward() > this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse()){
            endPosition = this.destinationEndCutSite.getStart() + this.destinationEndCutSite.getRestrictionEnzyme().getDsForward();
        } else if (this.destinationEndCutSite.getRestrictionEnzyme().getDsForward() < this.destinationEndCutSite.getRestrictionEnzyme.getDsReverse()){
            endPosition = this.destinationEndCutSite.getStart() + this.destinationEndCutSite.getRestrictionEnzyme.getDsReverse();
        } else {
            endPosition = this.destinationEndCutSite.getStart() + this.destinationEndCutSite.getRestrictionEnzyme.getDsReverse();
        }

    }
    /*
    calculateMatchingType: function(){},
    initializeSource: function(){},
    initializeDestination: function(){},
    hasNormalMatch: function(){},
    hasRevComMatch: function(){},
    
    */
});
