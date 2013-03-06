/**
 * Digestion manager
 * @class Teselagen.manager.DigestionManager
 */
Ext.define("Teselagen.manager.DigestionManager", {
    requires: ["Teselagen.bio.enzymes.RestrictionCutSite",
               "Teselagen.bio.sequence.DNATools",
               "Teselagen.manager.SequenceManager",
               "Teselagen.models.DigestionSequence",
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
        sequenceManager: null,
        start: null,
        end: null,
        digestionSequence: null,
        restrictionEnzymeManager: null,

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
        pasteSequenceManager: null
    },
    
    constructor: function(inData){
        this.statics();
        this.initConfig(inData);
        this.sequenceManager = inData.sequenceManager;
        this.start =  inData.start;
        this.end = inData.end;
        this.digestionSequence = inData.digestionSequence;

        this.initializeSource();
        this.initializeDestination();
        /* this.calculateMatchingType();
*/
    },
    initializeSource: function(){
        this.sourceSequence = this.digestionSequence.get("sequenceManager").sequence.toString();
        this.sourceRevComSequence = this.digestionSequence.get("sequenceManager").sequence.toString();
        
        var pastableStartIndex = this.digestionSequence.get("startRestrictionEnzyme").getDsForward();
        var pastableEndIndex = this.digestionSequence.get("endRelativePosition") + this.digestionSequence.get("endRestrictionEnzyme").getDsReverse();
        
        if(this.digestionSequence.get("startRestrictionEnzyme").getDsForward() < this.digestionSequence.get("startRestrictionEnzyme").getDsReverse()) {
            this.sourceOverhangStartType = this.self.overhangTop;
            this.sourceOverhangStartSequence = this.sourceSequence.substring(this.digestionSequence.get("startRestrictionEnzyme").getDsForward(), this.digestionSequence.get("startRestrictionEnzyme").getDsReverse());
            pastableStartIndex = this.digestionSequence.get("startRestrictionEnzyme").getDsForward();
        } else if(this.digestionSequence.get("startRestrictionEnzyme").getDsForward() > this.digestionSequence.get("startRestrictionEnzyme").getDsReverse()) {
            this.sourceOverhangStartType = this.self.overhangBottom;
            this.sourceOverhangStartSequence = this.sourceRevComSequence.substring(this.digestionSequence.get("startRestrictionEnzyme").getDsForward(), this.digestionSequence.get("startRestrictionEnzyme").getDsReverse());
            pastableStartIndex = this.digestionSequence.get("startRestrictionEnzyme").getDsReverse();
        } else {
            this.sourceOverhangStartType = this.self.overhangNone;
            this.sourceOverhangStartSequence = "";
        }
        
        if(this.digestionSequence.get("endRestrictionEnzyme").getDsForward() < this.digestionSequence.get("endRestrictionEnzyme").getDsReverse()) {
            this.sourceOverhangEndType = this.self.overhangBottom;
            this.sourceOverhangEndSequence = this.sourceRevComSequence.substring(this.digestionSequence.get("endRelativePosition") + this.digestionSequence.get("endRestrictionEnzyme").getDsForward(), this.digestionSequence.get("endRelativePosition") + this.digestionSequence.get("endRestrictionEnzyme").getDsReverse());
            pastableEndIndex = this.digestionSequence.get("endRelativePosition") + this.digestionSequence.get("endRestrictionEnzyme").getDsReverse();
        } else if(this.digestionSequence.get("endRestrictionEnzyme").getDsForward() > this.digestionSequence.get("endRestrictionEnzyme").getDsReverse()) {
            this.sourceOverhangEndType = this.self.overhangTop;
            this.sourceOverhangEndSequence = this.sourceSequence.substring(this.digestionSequence.get("endRelativePosition") + this.digestionSequence.get("endRestrictionEnzyme").getDsForward(), this.digestionSequence.get("endRelativePosition") + this.digestionSequence.get("endRestrictionEnzyme").getDsReverse());
            pastableEndIndex = this.digestionSequence.get("endRelativePosition") + this.digestionSequence.get("endRestrictionEnzyme").getDsForward();
        } else {
            this.sourceOverhangEndType = this.self.overhangNone;
            this.sourceOverhangEndSequence = "";
        }
        
        this.pasteSequenceManager = this.digestionSequence.get("sequenceManager").subSequenceManager(pastableStartIndex, pastableEndIndex);
    },
    
    initializeDestination: function(){
        //var this.destinationStartCutSite = null;
        //var this.destinationEndCutSite = null;
        
        for(var i = 0; i < this.restrictionEnzymeManager.cutSites.length; i++) {
            var cutSite = this.restrictionEnzymeManager.cutSites[i];
            if(this.start === cutSite.start) {
                this.destinationStartCutSite = cutSite;
            }
            
            if(this.end === cutSite.end) {
                this.destinationEndCutSite = cutSite;
            }
            
            if(this.destinationStartCutSite && this.destinationEndCutSite) {
                break;
            }
        }
        
        if(!this.destinationStartCutSite || !this.destinationEndCutSite) {
            throw new Error("This should never happen!");
        }
        
        var destinationSequence = (this.start > this.end) ? (this.sequenceManager.sequence.subList(0, this.end).seqString() + this.sequenceManager.sequence.subList(this.start, this.sequenceManager.sequence.length).seqString()) : this.sequenceManager.sequence.subList(this.start, this.end).seqString();
        var destinationRevComSequence = (this.start > this.end) ? (this.sequenceManager.getComplementSequence().subList(0, this.end).seqString() + this.sequenceManager.getComplementSequence().subList(this.start, this.sequenceManager.getComplementSequence().length).seqString()) : this.sequenceManager.getComplementSequence().subList(this.start, this.end).seqString();
        
        if(this.destinationStartCutSite.getRestrictionEnzyme().getDsForward() < this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse()) {
            this.destinationOverhangStartSequence = destinationRevComSequence.substring(this.destinationStartCutSite.getRestrictionEnzyme().getDsForward(), this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse());
            
            this.destinationOverhangStartType = this.self.overhangBottom;
        } else if(this.destinationStartCutSite.getRestrictionEnzyme().getDsForward() > this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse()) {
            this.destinationOverhangStartSequence = destinationSequence.substring(this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse(), this.destinationStartCutSite.getRestrictionEnzyme().getDsForward());
            
            this.destinationOverhangStartType = this.self.overhangTop;
        } else {
            this.destinationOverhangStartType = this.self.overhangNone;
            this.destinationOverhangStartSequence = "";
        }
        
        var rePosition = this.destinationEndCutSite.start - this.destinationStartCutSite.start;
        
        if(this.destinationEndCutSite.getRestrictionEnzyme().getDsForward() < this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse()) {
            this.destinationOverhangEndSequence = destinationSequence.substring(rePosition + this.destinationEndCutSite.getRestrictionEnzyme().getDsForward(), rePosition + this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse());
            this.destinationOverhangEndType = this.self.overhangTop;
        } else if(this.destinationEndCutSite.getRestrictionEnzyme().getDsForward() > this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse()) {
            this.destinationOverhangEndSequence = destinationRevComSequence.substring(rePosition + this.destinationEndCutSite.getRestrictionEnzyme().getDsForward(), rePosition + this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse());
            this.destinationOverhangEndType = this.self.overhangBottom;
        } else {
            this.destinationOverhangEndType = this.self.overhangNone;
            this.destinationOverhangEndSequence = "";
        }
    },
    
    digest: function(pType){
        if (!(pType === this.self.matchNormalOnly || pType === this.self.matchReverseComOnly)){
            throw new Error("Invalid digestion type");
        }

        if (pType === this.self.matchReverseComOnly){
            //reverseComplementSequence();
            this.pasteSequenceManager.reverseComplementSequence();
        }
        var startPosition = this.destinationStartCutSite.getStart();
        var endPosition = this.destinationStartCutSite.getEnd() + this.destinationStartCutSite.getRestrictionEnzyme().getDsForward();

        if (this.destinationStartCutSite.getRestrictionEnzyme().getDsForward() > this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse()){
            startPosition = this.destinationStartCutSite.getStart() + this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse();

        } else if(this.destinationStartCutSite.getRestrictionEnzyme().getDsForward() < this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse()){
            startPosition = this.destinationStartCutSite.getStart() + this.destinationStartCutSite.getRestrictionEnzyme().getDsForward();
        } else {
            startPosition = this.destinationStartCutSite.getStart() + this.destinationStartCutSite.getRestrictionEnzyme().getDsForward();
        }

        if (this.destinationEndCutSite.getRestrictionEnzyme().getDsForward() > this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse()){
            endPosition = this.destinationEndCutSite.getStart() + this.destinationEndCutSite.getRestrictionEnzyme().getDsForward();
        } else if (this.destinationEndCutSite.getRestrictionEnzyme().getDsForward() < this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse()){
            endPosition = this.destinationEndCutSite.getStart() + this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse();
        } else {
            endPosition = this.destinationEndCutSite.getStart() + this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse();
        }
        this.sequenceManager.manualUpdateStart();
        this.sequenceManager.removeSequence(startPosition, endPosition);
        this.sequenceManager.insertSequenceManager(this.pasteSequenceManager, startPosition);
        this.sequenceManager.manualUpdateEnd();
    }
    /*
     * Not implemented because I don't think they do anything
    calculateMatchingType: function(){},
    hasNormalMatch: function(){},
    hasRevComMatch: function(){},
    
    */
});
