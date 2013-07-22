/**
 * @class Teselagen.manager.TraceManager
 * NOTE: As far as I can tell, this isn't used in the application at all.
 * Annotates aligned sequences with matches, mismatches, deletions, and insertions.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv
 */
Ext.define("Teselagen.manager.TraceManager", {
    extend: "Teselagen.mappers.Mapper",

    mixins: {
        observable: "Ext.util.Observable"
    },

    config: {
        traceAnnotations: null
    },

    updateEventString: Teselagen.event.MapperEvent.TRACE_MAPPER_UPDATED,

    constructor: function(inData) {
        this.mixins.observable.constructor.call(arguments, this);
        this.addEvents(this.updateEventString);

        this.callParent([inData]);
        this.initConfig(inData);

        this.adjustTraces(inData.traces);
    },

    adjustTraces: function(traces) {
        var adjusted = [];
        var annotation;

        Ext.each(traces, function(trace) {
            alignment = trace.getTraceSequenceAlignment();
            if(alignment) {
                annotation = Ext.create("Teselagen.data.TraceAnnotation", {
                    start: alignment.getQueryStart() - 1,
                    end: alignment.getQueryEnd() - 1,
                    traceSequence: trace
                });
                adjusted.push(annotation);
            }
        });

        this.setTraceAnnotations(adjusted);
    },

    getTraceAnnotations: function() {
        if(this.dirty) {
            this.recalculate();
            this.dirty = false;
        }

        return this.traceAnnotations;
    },

    recalculate: function() {
        var alignment;
        var allMismatches;

        Ext.each(this.traceAnnotations, function(annotation) {
            alignment = annotation.getTraceSequence().getTraceSequenceAlignment();

            annotation.setMatches(this.calculateMatches(alignment));
            annotation.setMismatches(this.calculateMismatches(alignment));
            annotation.setDeletions(this.calculateMismatches(alignment));
            annotation.setInsertions(this.calculateInsertions(alignment));

            allMismatches = annotation.getAllMismatches();

            allMismatches.concat(annotation.getMismatches(),
                                 annotation.getDeletions(),
                                 annotation.getInsertions());
        });
    },

    /**
     * aIterates through a given alignment object and creates Annotations for each
     * area where the query and subject alignments match.
     * @param {TraceSequence}
     */
    calculateMatches: function(alignment) {
        var matches = [];
        var alignLen = alignment.getQueryAlignment().length;

        if(alignLen < 1) {
            return [];
        }

        var matchStart = -1;
        var matchEnd = -1;
        var isMatch = false;

        for(var i = 0; i < alignLen; i++) {
            if(alignment.getQueryAlignment().charAt(i) === alignment.getSubjectAlignment().charAt(i)) {
                // If we haven't already found a match, the match must start here.
                if(!isMatch) {
                    matchStart = i;
                }

                isMatch = true;
            } else {
                if(isMatch) {
                    matchEnd = i - 1;

                    // Add a new annotation to matches. 
                    // We subtract 1 because our sequence starts from 0.
                    matches.push(Ext.create("Teselagen.bio.sequence.common.Annotation", {
                        start: alignment.getQueryStart() + matchStart - 1,
                        end: alignment.getQueryStart() + matchEnd - 1
                    }));
                }

                matchStart = -1;
                matchEnd = -1;
                isMatch = false;
            }
        }

        if(isMatch) {
            matchEnd = alignLen - 1;

            // Create a match that goes to the end of the sequence.
            Ext.create("Teselagen.bio.sequence.common.Annotation", {
                start: alignment.getQueryStart() + matchStart - 1,
                end: alignment.getQueryStart() + matchEnd - 1
            });
        }

        return matches;
    },

    calculateMismatches: function(alignment) {
        var mismatches = [];
        var alignLen = alignment.getQueryAlignment().length;

        if(alignLen < 1) {
            return [];
        }

        var matchStart = -1;
        var matchEnd = -1;
        var isMatch = false;

        for(var i = 0; i < alignLen; i++) {
            if(alignment.getQueryAlignment().charAt(i) !== alignment.getSubjectAlignment().charAt(i) &&
               alignment.getQueryAlignment().charAt(i) !== "-" &&
               alignment.getQueryAlignment().charAt(i) !== "-") {
                if(!isMatch) {
                    matchStart = i;
                }

                isMatch = true;
            } else {
                if(isMatch) {
                    matchEnd = i - 1;

                    mismatches.push(Ext.create("Teselagen.bio.sequence.common.Annotation", {
                        start: alignment.getQueryStart() + matchStart - 1,
                        end: alignment.getQueryStart() + matchEnd - 1
                    }));
                }

                matchStart = -1;
                matchEnd = -1;
                isMatch = false;
            }
        }

        if(isMatch) {
            matchEnd = alignLen - 1;

            mismatches.push(Ext.create("Teselagen.bio.sequence.common.Annotation", {
                start: alignment.getQueryStart() + matchStart - 1,
                end: alignment.getQueryStart() + matchEnd - 1
            }));
        }

        return mismatches;
    },

    calculateDeletions: function(alignment) {
        var deletions = [];
        var alignLen = alignment.getQueryAlignment().length;

        if(alignLen < 1) {
            return deletions;
        }

        var matchStart = -1;
        var matchEnd = -1;
        var isMatch = false;

        for(var i = 0; i < alignLen; i++) {
            if(alignment.getSubjectAlignment.charAt(i) == "-") {
                if(!isMatch) {
                    matchStart = i;
                }

                isMatch = true;
            } else {
                if(isMatch) {
                    matchEnd = i - 1;

                    deletions.push(Ext.create("Teselagen.bio.sequence.common", {
                        start: alignment.getQueryStart() + matchStart - 1,
                        end: alignment.getQueryStart() + matchEnd - 1
                    }));

                    matchStart = -1;
                    matchEnd = -1;
                    isMatch = false;
                }
            }
        }

        if(isMatch) {
            matchEnd = alignLen - 1;

            deletions.push(Ext.create("Teselagen.bio.sequence.common", {
                start: alignment.getQueryStart() + matchStart - 1,
                end: alignment.getQueryStart() + matchEnd - 1
            }));
        }

        return deletions;
    },

    calculateInsertions: function(alignment) {
        var insertions = [];
        var alignLen = alignment.getQueryAlignment().length;

        if(alignLen < 1) {
            return insertions;
        }

        var matchStart = -1;
        var matchEnd = -1;
        var isMatch = false;

        for(var i = 0; i < alignLen; i++) {
            if(alignment.getQueryAlignment.charAt(i) == "-") {
                if(!isMatch) {
                    matchStart = i;
                }

                isMatch = true;
            } else {
                if(isMatch) {
                    matchEnd = i - 1;

                    insertions.push(Ext.create("Teselagen.bio.sequence.common", {
                        start: alignment.getQueryStart() + matchStart - 1,
                        end: alignment.getQueryStart() + matchEnd - 1
                    }));

                    matchStart = -1;
                    matchEnd = -1;
                    isMatch = false;
                }
            }
        }

        if(isMatch) {
            matchEnd = alignLen - 1;

            insertions.push(Ext.create("Teselagen.bio.sequence.common", {
                start: alignment.getQueryStart() + matchStart - 1,
                end: alignment.getQueryStart() + matchEnd - 1
            }));
        }

        return insertions;
    }
});
