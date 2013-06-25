/**
 * Builds an alignment map for sequence annotations.
 * @class Teselagen.renderer.common.Alignment
 */
Ext.define("Teselagen.renderer.common.Alignment", {
    singleton: true,

    sequenceManager: null,

    SORT_BY_LENGTH: false, // Set to false to sort annotations by start index.

    /**
     * Loops through each row, determining if an annotation fits in the existing
     * rows or if a new row must be created for it.
     */
    buildAlignmentMap: function(annotations, sequenceManager) {
        this.sequenceManager = sequenceManager;
        if (!!annotations) {
            if(this.SORT_BY_LENGTH) {
                annotations.sort(this.sortByLength);
            } else{
                annotations.sort(this.sortByStart);
            }
        }

        var rows = [];
        var alignmentMap = new Ext.util.HashMap();
        Ext.each(annotations, function(annotation) {
            // Try to fit the annotation in existing rows.
            var doesFitInRows = false;
            var fitRow;

            Ext.each(rows, function(row, rowIndex) {
                if(this.doesFitInRow(row, annotation)) {
                    doesFitInRows = true;
                    fitRow = rowIndex;

                    row.push(annotation);

                    return false;
                }
            }, this);

            // If the annotation doesn't fit in existing rows, create a new row and
            // increase the highest row number.
            if(!doesFitInRows) {
                rows.push([annotation]);
                fitRow = rows.length - 1;
            } 

            // If the annotation is a feature, save it by its unique index.
            if(annotation.getIndex) {
                alignmentMap.add(annotation.getIndex(), fitRow);
            } else {
                alignmentMap.add(annotation, fitRow);
            }
        }, this);

        return alignmentMap;
    },

    sortByStart: function(a1, a2) {
        // if (a1 === undefined || a2 === undefined) {
        //     console.log("There was an undefined sorting value!!");
        //     return 0;
        // }
        var a1Start = a1.getStart();
        var a2Start = a2.getStart();

        if(a1Start > a2Start) {
            return 1;
        } else if(a1Start < a2Start) {
            return -1;
        } else {
            return 0;
        }
    },

    sortByLength: function(a1, a2) {
        if(a1.getStart() > a1.getEnd()) {
            return a1.getEnd() + this.sequenceManager.getSequence().length -
                    a1.getStart() + 1;
        } else {
            return a1.getEnd() - a1.getStart() + 1;
        }       

        if(a2.getStart() > a2.getEnd()) {
            return a2.getEnd() + this.sequenceManager.getSequence().length -
                    a2.getStart() + 1;
        } else {
            return a2.getEnd() - a2.getStart() + 1;
        }    

        if(a1Length < a2Length) {
            return 1;
        } else if(a1Length > a2Length) {
            return -1;
        } else  {
            return 0;
        }
    },

    doesFitInRow: function(row, annotation) {
        var fits = true;
        Ext.each(row, function(compareAnnotation) {
            if(this.annotationOverlaps(annotation, compareAnnotation)) {
                fits = false;
                return false;
            }
        }, this);

        return fits;
    },

    annotationOverlaps: function(annotation1, annotation2) {
        var overlaps = false;

        /* |---------------------------------------------------------------|
        *   AAAAAAAAAAAAAAAAAAA|                  |AAAAAAAAAAAAAAAAAAAAAAAA                                  
        *   BBBBBBBBBBBBBBBBBBBBBBBBBBBB|               |BBBBBBBBBBBBBBBBBB  */
        if(annotation1.getStart() > annotation1.getEnd() && 
           annotation2.getStart() > annotation2.getEnd()) {
            result = this.doOverlaps(annotation1.getStart(), 
                                this.sequenceManager.sequence.length - 1, 
                                annotation2.getStart(), 
                                this.sequenceManager.sequence.length - 1) || 
                     this.doOverlaps(0, annotation1.getStart(), 0, annotation2.getEnd());
        }
        /* |---------------------------------------------------------------|
        *   AAAAAAAAAAAAAAAAAAAAAA|                    |AAAAAAAAAAAAAAAAAAA
        *                     |BBBBBBBBBBBBBBBBB|                            */
        else if(annotation1.getStart() > annotation1.getEnd() && 
                annotation2.getStart() <= annotation2.getEnd()) {
            result = this.doOverlaps(annotation1.getStart(), 
                                this.sequenceManager.sequence.length - 1, 
                                annotation2.getStart(), annotation2.getEnd()) || 
                     this.doOverlaps(0, annotation1.getEnd(), annotation2.getStart(), 
                                annotation2.getEnd());
        }
        /* |---------------------------------------------------------------|
        *        |AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA|                                  
        *   BBBBBBBBBBBBBBBB|                           |BBBBBBBBBBBBBBBBBB  */
        else if(annotation1.getStart() <= annotation1.getEnd() && 
                annotation2.getStart() > annotation2.getEnd()) {
            result = this.doOverlaps(annotation1.getStart(), annotation1.getEnd(), 
                                annotation2.getStart(), 
                                this.sequenceManager.sequence.length - 1) || 
                     this.doOverlaps(annotation1.getStart(), annotation1.getEnd(), 0, 
                                annotation2.getEnd());
        }
        /* |---------------------------------------------------------------|
        *        |AAAAAAAAAAAAAAAAAAAAAAAAAAA|
        *                               |BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB|     */
        else {
            result = this.doOverlaps(annotation1.getStart(), annotation1.getEnd(), 
                                annotation2.getStart(), annotation2.getEnd());
        }
        
        return result;
    },

    doOverlaps: function(start1, end1, start2, end2) {
        return ((start1 >= start2) && (start1 < end2)) ||
               ((start2 >= start1) && (start2 < end1));
    }
});
