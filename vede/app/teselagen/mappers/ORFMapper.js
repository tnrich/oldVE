Ext.define("Teselagen.mappers.ORFMapper", {
    config: {
        minORFSize: 300
    },

    constructor: function(inData) {
        this.callParent(arguments);
        this.addEvent(Teselagen.mappers.MapperEvent.ORF_MAPPER_UPDATED);

        orfs = [];
    },

    getORFs: function() {
        if(dirty) {
            recalculate();

            dirty = false;
        } 

        return orfs;
    },

    setMinORF: function(pSize) {
        if(minORFSize != pSize) {
            minORFSize = value;
            dirty = true;
        }
    },

    recalculate: function() {
        if(sequenceManager) {
            if(sequenceManager.getIsCircular()) {
                recalculateCircular();
            } else {
                recalculateNonCircular();
            }
        } else {
            ords = null;
        }

        this.fireEvent(Teselagen.mappers.MapperEvent.ORF_MAPPER_UPDATED);
    }

    recalculateNonCircular: function() {
        var orfs = Teselagen.bio.orf.ORFFinder.calculateORFBothDirections(
                                sequenceManager.getSequence(),
                                sequenceManager.getReverseComplementSequence(),
                                minORFSize);
    },

    recalculateCircular: function() {
        var forwardSequence = sequenceManager.getSequence();
        var backwardSequence = sequenceManager.getReverseComplementSequence();

        var doubleForward = DNATools.createDNA(forwardSequence.seqString() +
                                               forwardSequence.seqString());
        var doubleBackward = DNATools.createDNA(backwardSequence.seqString() +
                                                backwardSequence.seqString());

        var orfsSequence = Teselagen.bio.orf.ORFFinder.calculateORFBothDirections(
                                                                doubleForward,
                                                                doubleBackward,
                                                                minORFSize);

        var maxLength = forwardSequence.getLength();

        orfs = [];
        var normalOrfs = [];
        var orf = null;

        for(var i = 0; i < orfsSequence.getLength(); i++) {
            orf = orfsSequence[i];

            if(orf.getStart() >= maxLength) {
            } else if(orf.getEnd() < maxLength) {
                normalOrffs.push(orf);
            } else if(orf.getEnd() >= maxLength && orf.getStart() < maxLength) {
                orf.setOneEnd(orf.end - maxLength);
                var startCodons = orf.getStartCodons();

                for(var j = 0; j < startCodons.length; j++) {
                    if(startCodons[j] >= maxLength) {
                        startCodons[j] -= maxLength;
                    }
                }

                orfs.push(orf);
            }
        }
        
        var normalOrf = null;
        var circularOrf = null;
        // Eliminate the orf that overlaps with circular orfs.
        for(var k = 0; k < normalOrfs.length; k++) {
            normalOrf = normalOrfs[k];
            var skip = false;

            for(var l = 0; l < orfs.length; l++) {
                circularOrf = orfs[l];
                if(circularOrf.getEnd() == normalOrf.getEnd() &&
                   circularOrg.getStrand() == normalOrf.getStrand()) {
                    skip = true;
                    break;
                }
            }
            if(!skip) {
                orfs.push(normalOrf);
            }
        }
    },
});
