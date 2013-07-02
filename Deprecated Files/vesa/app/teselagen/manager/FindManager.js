Ext.define("Teselagen.manager.FindManager", {
    config: {
        sequenceManager: null,
    },

    /**
     * Search for the given expression in the sequence.
     * @param {String} expression The expression to search for.
     * @param {String} dataType Either "DNA" or "Amino Acids"- what to search in.
     * @param {String} searchType Either "literal" or "ambiguous"- how to search.
     * @param {Int} start Where to start the search.
     */
    find: function(expression, dataType, searchType, start) {
        if(!this.sequenceManager || 
           this.sequenceManager.getSequence().toString().length == 0 || 
           expression.length == 0) { 

            return null; 
        }
        
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

            if(this.sequenceManager.getCircular()) {
                sequence += sequence;
                revComSequence += revComSequence;
            }

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
                distanceFromCaret = findStart;

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
            var char = expression.charAt(i);

            if(char == "a" || char == "t" || char == "c" || char == "g" || char == "u") {
                ambiguous.push(char);
            } else {
                ambiguous.push(switchObj[char]);
            }
        }

        return ambiguous.join("");
    }
});
