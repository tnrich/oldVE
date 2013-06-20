/**
 * Methods for sequence searching.
 * @class Teselagen.manager.FindManager
 */
Ext.define("Teselagen.manager.FindManager", {
    config: {
        sequenceManager: null,
        AAManager: null
    },

    /**
     * Search for the given expression in the sequence.
     * @param {String} expression The expression to search for.
     * @param {String} dataType Either "DNA" or "Amino Acids"- what to search in.
     * @param {String} searchType Either "literal" or "ambiguous"- how to search.
     * @param {Object[]} Array of objects with attributes start and end.
     */
    findAll: function(expression, dataType, searchType) {
        if(!this.sequenceManager || 
           this.sequenceManager.getSequence().toString().length == 0 || 
           expression.length == 0) { 

            return null; 
        }

        expression = expression.toLowerCase();
        dataType = dataType.toLowerCase();
        searchType = searchType.toLowerCase();
        
        var sequence;
        var revComSequence;
        var originalSequence;
        var result = [];
        
        if(dataType === "dna") {
            if(searchType === "ambiguous") {
                expression = this.makeAmbiguousDNAExpression(expression);
            }

            sequence = this.sequenceManager.getSequence().toString();
            revComSequence = this.sequenceManager.getReverseComplementSequence().toString();

            originalSequence = sequence;

            // Tack on extra base pairs to the end of the sequence to ensure
            // that the search will find results which go from the end of the
            // sequence to the beginning.
            sequence += sequence.slice(0, expression.length - 1);
            revComSequence += revComSequence.slice(0, expression.length);

            var regEx = new RegExp(expression, "gi");
            var found;
            var findStart;
            var findEnd;

            while((found = regEx.exec(sequence)) !== null) {
                findStart = found.index;
                findEnd = regEx.lastIndex;

                if(findStart >= originalSequence.length) {
                    findStart -= originalSequence.length;
                }
                if(findEnd >= originalSequence.length) {
                    findEnd -= originalSequence.length;
                }

                result.push({start: findStart, end: findEnd});
            }

            // Search the reverse complement sequence.
            while((found = regEx.exec(revComSequence)) !== null) {
                findStart = revComSequence.length - regEx.lastIndex - expression.length;
                findEnd = revComSequence.length - found.index - expression.length;

                if(findStart >= originalSequence.length) {
                    findStart -= originalSequence.length;
                }
                if(findEnd >= originalSequence.length) {
                    findEnd -= originalSequence.length;
                }

                result.push({start: findStart, end: findEnd});
            }
        } else {
            if(searchType === "ambiguous") {
                expression = this.makeAmbiguousAAExpression(expression);
            }

            // Escape periods, which are meant to be interpreted as stop codons.
            expression = expression.replace("\.", "\\.");

            this.AAManager.recalculateNonCircular();

            var aaSequenceFrames = this.AAManager.getAaSequence();
            var aaRevComSequenceFrames = this.AAManager.getAaRevCom();
            var originalSequence;
            var regEx;
            var aaStart;
            var found;

            // Search all 3 frames of the forward sequence.
            Ext.each(aaSequenceFrames, function(aaSequence, frame) {
                originalSequence = aaSequence;
                aaSequence += aaSequence.slice(0, expression.length - 1);

                regEx = new RegExp(expression, "gi");
                while((found = regEx.exec(aaSequence)) !== null) {
                    var findStart = found.index;
                    var findEnd = regEx.lastIndex;

                    if(findStart >= originalSequence.length) {
                        findStart -= originalSequence.length;
                    }
                    if(findEnd >= originalSequence.length) {
                        findEnd -= originalSequence.length;
                    }

                    result.push({start: findStart * 3 + frame,
                                  end: findEnd * 3 + frame});
                }
            });

            var offsets;
            var seqLength = this.sequenceManager.getSequence().toString().length;

            // Build an array of offsets based on the length of the sequence.
            // These determine the distance in base pairs of the last character
            // in each frame of the amino acid sequence from the first character
            // of the DNA sequence.
            if(seqLength % 3 === 0) {
                offsets = [0, 2, 1];
            } else if(seqLength % 3 === 1) {
                offsets = [1, 0, 2];
            } else {
                offsets = [2, 1, 0];
            }

            // Search all 3 frames of the reverse complement sequence.
            Ext.each(aaRevComSequenceFrames, function(aaSequence, frame) {
                originalSequence = aaSequence;
                aaSequence += aaSequence.slice(0, expression.length - 1);

                regEx = new RegExp(expression + "(?!.*" + expression + ")", "gi"); 
                while((found = regEx.exec(aaSequence)) !== null) {
                    var findStart = aaSequence.length - regEx.lastIndex;
                    var findEnd = aaSequence.length - found.index;

                    if(findStart >= originalSequence.length) {
                        findStart -= originalSequence.length;
                    }
                    if(findEnd > originalSequence.length) {
                        findEnd -= originalSequence.length;
                    }

                    result.push({start: findStart * 3 + offsets[frame],
                                  end: findEnd * 3 + offsets[frame]});
                }
            });
        }

        return result;
    },

    /**
     * Search for the given expression in the sequence.
     * @param {String} expression The expression to search for.
     * @param {String} dataType Either "DNA" or "Amino Acids"- what to search in.
     * @param {String} searchType Either "literal" or "ambiguous"- how to search.
     * @param {Int} start Where to start the search.
     * @returns {Object} Object with attributes start and end.
     */
    findOne: function(expression, dataType, searchType, start, aaSearchStart) {
        if(!this.sequenceManager || 
           this.sequenceManager.getSequence().toString().length == 0 || 
           expression.length == 0) { 

            return null; 
        }

        expression = expression.toLowerCase();
        dataType = dataType.toLowerCase();
        searchType = searchType.toLowerCase();
        
        var sequence;
        var revComSequence;
        var originalSequence;
        var result;
        
        if(dataType === "dna") {
            if(searchType === "ambiguous") {
                expression = this.makeAmbiguousDNAExpression(expression);
            }

            sequence = this.sequenceManager.getSequence().toString();
            revComSequence = this.sequenceManager.getReverseComplementSequence().toString();

            originalSequence = sequence;

            sequence += sequence;
            revComSequence += revComSequence;

            if(start != 0) {
                sequence = sequence.slice(start);
                revComSequence = revComSequence.substring(0,
                                                revComSequence.length - start);
            }

            var regEx = new RegExp(expression, "gi");
            var found = regEx.exec(sequence);
            var distanceFromCaret;

            if(found) {
                var findStart = found.index + start;
                var findEnd = regEx.lastIndex + start;
                distanceFromCaret = found.index;

                if(findStart >= originalSequence.length) {
                    findStart -= originalSequence.length;
                }
                if(findEnd >= originalSequence.length) {
                    findEnd -= originalSequence.length;
                }
            }

            // Create a new regEx that will only match the last occurrence of
            // expression. This is what we want, since we are searching the
            // reverse complement of the sequence next.
            regEx = new RegExp(expression + "(?!.*" + expression + ")", "gi"); 
            var revComFound = regEx.exec(revComSequence);
            var revComDistanceFromCaret;

            if(revComFound) {
                var revComStart = revComSequence.length - regEx.lastIndex + start;
                var revComEnd = revComSequence.length - revComFound.index + start;
                revComDistanceFromCaret = revComStart - start;

                if(revComStart >= originalSequence.length) {
                    revComStart -= originalSequence.length;
                }
                if(revComEnd >= originalSequence.length) {
                    revComEnd -= originalSequence.length;
                }
            }

            // Compare the forward find and reverse complement find to see
            // which is closer- we want to return that one.
            if(found && revComFound) {
                if(distanceFromCaret < revComDistanceFromCaret) {
                    return {start: findStart, end: findEnd};
                } else {
                    return {start: revComStart, end: revComEnd};
                }
            } else if(found) {
                return {start: findStart, end: findEnd};
            } else if(revComFound) {
                return {start: revComStart, end: revComEnd};
            } else {
                return false;
            }
        } else {
            if(searchType === "ambiguous") {
                expression = this.makeAmbiguousAAExpression(expression);
            }

            // Escape periods, which are meant to be interpreted as stop codons.
            expression = expression.replace("\.", "\\.");

            this.AAManager.recalculateNonCircular();

            var aaSequenceFrames = this.AAManager.getAaSequence();
            var aaRevComSequenceFrames = this.AAManager.getAaRevCom();
            var originalSequence;
            var regEx;
            var aaStart;
            var bestResult;
            var bestRevComResult;
            var found;
            var distanceFromCaret;
            var bestDistanceFromCaret = null;

            // Search all 3 frames of the forward sequence.
            Ext.each(aaSequenceFrames, function(aaSequence, frame) {
                regEx = new RegExp(expression, "gi");
                originalSequence = aaSequence;
                aaSequence = aaSequence + aaSequence;

                if(start === 0) {
                    aaStart = 0;
                } else {
                    aaStart = Math.ceil((start - frame) / 3);
                }

                aaSequence = aaSequence.slice(aaStart);

                found = regEx.exec(aaSequence);

                if(found) {
                    var findStart = found.index + aaStart;
                    var findEnd = regEx.lastIndex + aaStart;
                    distanceFromCaret = found.index;

                    if(findStart >= originalSequence.length) {
                        findStart -= originalSequence.length;
                    }
                    if(findEnd >= originalSequence.length) {
                        findEnd -= originalSequence.length;
                    }

                    // If the current result is closer to the caret than the previous,
                    // save it as the best result.
                    if(bestDistanceFromCaret === null || 
                       distanceFromCaret < bestDistanceFromCaret) {
                        bestResult = {start: findStart * 3 + frame,
                                      end: findEnd * 3 + frame};

                        bestDistanceFromCaret = distanceFromCaret;
                    }
                }
            });

            if(aaSearchStart) {
                start = aaSearchStart;
            }

            var offsets;
            var seqLength = this.sequenceManager.getSequence().toString().length;

            // Build an array of offsets based on the length of the sequence.
            // These determine the distance in base pairs of the last character
            // in each frame of the amino acid sequence from the first character
            // of the DNA sequence.
            if(seqLength % 3 === 0) {
                offsets = [0, 2, 1];
            } else if(seqLength % 3 === 1) {
                offsets = [1, 0, 2];
            } else {
                offsets = [2, 1, 0];
            }

            // Search all 3 frames of the reverse complement sequence.
            Ext.each(aaRevComSequenceFrames, function(aaSequence, frame) {
                regEx = new RegExp(expression + "(?!.*" + expression + ")", "gi"); 
                originalSequence = aaSequence;
                aaSequence = aaSequence + aaSequence;

                if(start === 0) {
                    aaStart = 0;
                } else {
                    aaStart = Math.ceil((start - frame) / 3);
                }

                aaSequence = aaSequence.substring(0, aaSequence.length - aaStart);

                found = regEx.exec(aaSequence);

                if(found) {
                    var findStart = aaSequence.length - regEx.lastIndex + aaStart;
                    var findEnd = aaSequence.length - found.index + aaStart;
                    distanceFromCaret = findStart - aaStart;

                    if(findStart >= originalSequence.length) {
                        findStart -= originalSequence.length;
                    }
                    if(findEnd > originalSequence.length) {
                        findEnd -= originalSequence.length;
                    }

                    if(bestDistanceFromCaret === null || 
                       distanceFromCaret < bestDistanceFromCaret) {
                        bestResult = {start: findStart * 3 + offsets[frame],
                                      end: findEnd * 3 + offsets[frame]};

                        bestDistanceFromCaret = distanceFromCaret;
                    }
                }
            }, this);

            return bestResult;
        }
    },

    makeAmbiguousDNAExpression: function(expression) {
        var ambiguous = [];

        var switchObj = {
            n: "[ATGC]",
            k: "[GT]",
            m: "[AC]",
            r: "[AG]",
            y: "[CT]",
            s: "[CG]",
            w: "[AT]",
            b: "[CGT]",
            v: "[ACG]",
            h: "[ACT]",
            d: "[AGT]"
        };

        for(var i = 0; i < expression.length; i++) {
            var character = expression.charAt(i);

            if(character.match(/[atcgu]/)) {
                ambiguous.push(character);
            } else {
                ambiguous.push(switchObj[character]);
            }
        }

        return ambiguous.join("");
    },

    makeAmbiguousAAExpression: function(expression) {
        var ambiguous = [];

        var switchObj = {
            b: "[DN]",
            z: "[QE]",
            x: "[ARNDCQEGHILKMFPSTWYV.]"
        }

        for(var i = 0; i < expression.length; i++) {
            var character = expression.charAt(i);

            if(character.match(/[arndcqeghilkmfpstwyv.]/)) {
                ambiguous.push(character);
            } else {
                ambiguous.push(switchObj[character]);
            }
        }

        return ambiguous.join("");
    }
});
