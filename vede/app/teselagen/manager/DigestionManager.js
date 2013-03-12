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
        this.sourceSequence = this.digestionSequence.get("sequenceManager").getSequence().toString();
        this.sourceRevComSequence = this.digestionSequence.get("sequenceManager").getComplementSequence().toString();

        //The position the starting restriction enzyme matches on the sequence
        var relativeStart =  this.digestionSequence.get("startRelativePosition");
        var pastableStartIndex = this.digestionSequence.get("startRestrictionEnzyme").getDsForward() + relativeStart;
        var pastableEndIndex = this.digestionSequence.get("endRelativePosition") + this.digestionSequence.get("endRestrictionEnzyme").getDsReverse();
        //Check to see if this enzyme has a top overhang or bottom
        //       * - DsForward = 5
        // 5-CTGCA     G-3
        // 3-G     ACGTC-3  --Bottom overhang - DsForward > DsReverse
        //   * - DsReverse = 1
        //
        //   * - DsForward = 1
        // 5-A     AGCTT-3
        // 3-TTCGA     A-3  --Top overhang - DsForward < DsReverse
        //       * - DsReverse = 5
        //Basically, we always use the smaller of the two because We are going to use the overhang sequence from the destination, not the source
        if(this.digestionSequence.get("startRestrictionEnzyme").getDsForward() < this.digestionSequence.get("startRestrictionEnzyme").getDsReverse()) {
            this.sourceOverhangStartType = this.self.overhangTop;
            this.sourceOverhangStartSequence = this.sourceSequence.substring(this.digestionSequence.get("startRestrictionEnzyme").getDsForward() + relativeStart, this.digestionSequence.get("startRestrictionEnzyme").getDsReverse() + relativeStart);//taking into account the offset
            pastableStartIndex = this.digestionSequence.get("startRestrictionEnzyme").getDsForward() + relativeStart;
        } else if(this.digestionSequence.get("startRestrictionEnzyme").getDsForward() > this.digestionSequence.get("startRestrictionEnzyme").getDsReverse()) {
            this.sourceOverhangStartType = this.self.overhangBottom;
            this.sourceOverhangStartSequence = this.sourceRevComSequence.substring(this.digestionSequence.get("startRestrictionEnzyme").getDsForward() + relativeStart, this.digestionSequence.get("startRestrictionEnzyme").getDsReverse() + relativeStart);
            pastableStartIndex = this.digestionSequence.get("startRestrictionEnzyme").getDsReverse() + relativeStart;
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
            this.pasteSequenceManager.doReverseComplementSequence();
        }
        //startPosition and stopPosition are the start and stop of the sequence that we are going to remove from the destination.
        //We will be replacing it with sequence from the source, so we need to remove the overhang as well or it will be duplicated in the final.
        var startPosition = this.destinationStartCutSite.getStart();
        var endPosition = this.destinationStartCutSite.getEnd() + this.destinationStartCutSite.getRestrictionEnzyme().getDsForward();
        
        //Check to see if this enzyme has a top overhang or bottom
        //       * - DsForward = 5
        // 5-CTGCA     G-3
        // 3-G     ACGTC-3  --Bottom overhang - DsForward > DsReverse
        //   * - DsReverse = 1
        //
        //   * - DsForward = 1
        // 5-A     AGCTT-3
        // 3-TTCGA     A-3  --Top overhang - DsForward < DsReverse
        //       * - DsReverse = 5
        //Basically, we always use the smaller of the two because we always remove the overhang from the destination
        if (this.destinationStartCutSite.getRestrictionEnzyme().getDsForward() > this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse()){
            //If the overhang is on the bottom
            startPosition = this.destinationStartCutSite.getStart() + this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse();
        } else if(this.destinationStartCutSite.getRestrictionEnzyme().getDsForward() < this.destinationStartCutSite.getRestrictionEnzyme().getDsReverse()){
            //If the overhang is on the top
            startPosition = this.destinationStartCutSite.getStart() + this.destinationStartCutSite.getRestrictionEnzyme().getDsForward();
        } else {
            //If this is blunt
            startPosition = this.destinationStartCutSite.getStart() + this.destinationStartCutSite.getRestrictionEnzyme().getDsForward();
        }
        //For the end position we do the opposite, taking the larger of the two values, to remove the overhang
        if (this.destinationEndCutSite.getRestrictionEnzyme().getDsForward() > this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse()){
            //Top Overhang
            endPosition = this.destinationEndCutSite.getStart() + this.destinationEndCutSite.getRestrictionEnzyme().getDsForward();
        } else if (this.destinationEndCutSite.getRestrictionEnzyme().getDsForward() < this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse()){
            //Bottom overhang
            endPosition = this.destinationEndCutSite.getStart() + this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse();
        } else {
            //Blunt
            endPosition = this.destinationEndCutSite.getStart() + this.destinationEndCutSite.getRestrictionEnzyme().getDsReverse();
        }
        this.sequenceManager.manualUpdateStart();
        this.sequenceManager.removeSequence(startPosition, endPosition);
        this.sequenceManager.insertSequenceManager(this.pasteSequenceManager, startPosition);
        this.sequenceManager.manualUpdateEnd();
    },
    getMatchingType: function(){
        if (this._matchType == null){
            this.calculateMatchingType();
        }
        return this._matchType;
    },
    calculateMatchingType: function(){
        var normalMatch = this.hasNormalMatch();
        var revComMatch = this.hasRevComMatch();
        if(normalMatch && revComMatch) {
            this._matchType = this.self.matchBoth;
        } else if (normalMatch && !revComMatch) {
            this._matchType = this.self.matchNormalOnly;
        } else if (!normalMatch && revComMatch) {
            this._matchType = this.self.matchReverseComOnly;
        } else {
            this._matchType = this.self.matchNone;
        }
    },
    hasNormalMatch: function(){
        // Trying to much overhang by shape
        var matchByShapeStart = this.matchByShape(this.sourceOverhangStartType, this.destinationOverhangStartType);
        var matchByShapeEnd = this.matchByShape(this.sourceOverhangEndType, this.destinationOverhangEndType);
        if(!matchByShapeStart || !matchByShapeEnd) {
            return false;
        }
        // Trying to much overhang by length
        if(this.sourceOverhangStartSequence.length !== this.destinationOverhangStartSequence.length || this.sourceOverhangEndSequence.length !== this.destinationOverhangEndSequence.length) {
            return false;
        }
        // Trying to much overhang by sequence

        var matchBySequenceStart = this.matchBySequence(this.sourceOverhangStartSequence, this.destinationOverhangStartSequence);
        var matchBySequenceEnd = this.matchBySequence(this.sourceOverhangEndSequence, this.destinationOverhangEndSequence);
        if(!matchBySequenceStart || !matchBySequenceEnd) {
            return false;
        }
        return true;
    },
    hasRevComMatch: function(){
        // Trying to match overhang by shape
        var matchByShapeStart = this.matchRevComByShape(this.sourceOverhangStartType, this.destinationOverhangEndType);
        var matchByShapeEnd = this.matchRevComByShape(this.sourceOverhangEndType, this.destinationOverhangStartType);
        if(!matchByShapeStart || !matchByShapeEnd) {
            return false;
        }
        // Trying to match overhang by length
        if(this.sourceOverhangStartSequence.length !== this.destinationOverhangEndSequence.length || this.sourceOverhangEndSequence.length !== this.destinationOverhangStartSequence.length) {
            return false;
        }
        // Trying to match overhang by sequence

        if (this.sourceOverhangStartSequence !== this.destinationOverhangEndSequence){
            return false;
        }
        if (this.sourceOverhangEndSequence !== this.destinationOverhangStartSequence){
            return false;
        }
        return true;
    },
    matchByShape: function(sourceOverhangType, destinationOverhangType){
        // Trying to match overhang by shape
        var match = false;
        
        if((sourceOverhangType === this.self.overhangTop && destinationOverhangType === this.self.overhangBottom) || (sourceOverhangType === this.self.overhangBottom && destinationOverhangType === this.self.overhangTop) || (sourceOverhangType === this.self.overhangNone && destinationOverhangType === this.self.overhangNone)) {
            match = true;
        }
        return match;
    },
    matchRevComByShape: function(sourceOverhangType, destinationOverhangType){
        // Trying to match overhang by shape
        var match = false;
        if((sourceOverhangType === this.self.overhangTop && destinationOverhangType === this.self.overhangTop) || (sourceOverhangType === this.self.overhangBottom && destinationOverhangType === this.self.overhangBottom) || (sourceOverhangType === this.self.overhangNone && destinationOverhangType === this.self.overhangNone)) {
            match = true;
        }
        return match;
    },
    matchBySequence: function(sourceOverhangSequence, destinationOverhangSequence){
        // Trying to match overhang by sequence
        var match = false;
        var complement = Teselagen.bio.sequence.DNATools.complement(Teselagen.bio.sequence.DNATools.createDNA(destinationOverhangSequence)).seqString();
        if(sourceOverhangSequence === complement) {
            match = true;
        }
        return match;
    }
    /*
     * Not implemented because I don't think they do anything
    hasNormalMatch: function(){},
    hasRevComMatch: function(){},
    
    */
});
