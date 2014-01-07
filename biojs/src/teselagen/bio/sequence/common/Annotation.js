/**
 * @class Teselagen.bio.sequence.common.Annotation
 *
 * The Annotation class contains functions that processes data about locations
 * indices are [start, end)
 *
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 * @author Timothy Ham (original author)
 */
Ext.define("Teselagen.bio.sequence.common.Annotation", {
    requires: ["Teselagen.bio.sequence.common.Location", "Teselagen.bio.BioException"],
    circularAdjustment: 0,
    /**
     * Constructor
     * @param start Annotation start
     * @param  end Annotation end
     */
    constructor: function(inData){
        var start;
        var end;
        start = inData.start || 0;
        end = inData.end || 0;

        var initialLocation = Ext.create("Teselagen.bio.sequence.common.Location", {
            start: start,
            end: end
        });

        var locations = [];
        locations.push(initialLocation);

        var BioException = Ext.create("Teselagen.bio.BioException", {
                    message : "Cannot set start when multiple Locations exist"
                });
        /**
         * Returns the start of the annotation
         * @return {Integer} the start of the annotation
         */
        this.getStart = function(){
            if ( locations.length > 0 ) {
                return locations[0].getStart();
            } else {
                return -1;
            }
        }

        /**
         * Allows one to set the start of the annotation
         * @method setStart
         * @param {Integer} pStart is the new start.
         */
        this.setStart = function(pStart){
            start = pStart;
        }

        /**
         * Allows one to set the first start in an annotation, unless there is more than one start.
         * @method setOneStart
         * @param {Integer} pStart sets the new start of the annotation only if there is one location.
         */
        this.setOneStart = function(pStart){
            if ( locations.length === 1 ) {
                locations[0].setStart(pStart);
            } else {
                console.log("You've found an error!");

        throw Ext.create("Teselagen.bio.BioException", {
                    message : "Cannot set start when multiple Locations exist"
                });
            }
        }

        /**
         * Returns the end of the annotation.
         * @method getEnd
         * @return {Integer} returns the end of the annotation.
         */
        this.getEnd = function(){
            if (locations.length > 0){
                return locations[locations.length - 1].getEnd();
            }
            else {
                return 1;
            }
        }

        /**
         * Allows one to set the end of the annotation.
         * @method setEnd
         * @param {Integer} pEnd sets the end of the annotation.
         */
        this.setEnd= function(pEnd){
            end = pEnd;
        }

        /**
         * Allows one to set the end of the annotation.
         * @method setOneEnd
         * @param {Integer} pEnd sets the end of the annotation only if there is one location.
         */
        this.setOneEnd = function(pEnd){
            if  ( locations.length === 1 ) {
                locations[0].setEnd(pEnd);
            } else{
        throw Ext.create("Teselagen.bio.BioException", {
                    message : "Cannot set start when multiple Locations exist"
                });
            }

        }
        /**
         * Returns the locations within the annotation.
         * @method getLocations
         * @return {Locations} returns a list of the annotation's locations.
         */
        this.getLocations = function(){
            return locations;
        }

        /**
         * Allows one to set the locations of the annotation.
         * @method setLocations
         * @param {Location[]} pLocations sets the new list of locations.
         */
        this.setLocations = function(pLocations){
            locations = [];
            locations = pLocations;
        }

        /**
         * Calculates whether one annotation is contained within another.
         * @method contains
         * @param  {Annotation} pAnnotation is an input annotation.
         * @return {Boolean} returns a boolean representing whether one annotation is contained within another.
         */
        this.contains = function(pAnnotation){
            var result = false;
            //First comparison tests whether this annotation is non-circular.
            //Second comparison tests whether the input annotations is non-circular.
            //Non-circular pieces of DNA will have their starts before their ends.

            //case 1
            if (this.getStart() <= this.getEnd()) {
                //case 1a
                if (pAnnotation.getStart() <= pAnnotation.getEnd()) {
                    //case 1a result
                    result = ((this.getStart() <= pAnnotation.getStart()) && (this.getEnd() >= pAnnotation.getEnd()));
                    //console.log(this.getStart() + "  should be less than or equal to  " + pAnnotation.getEnd() + " . And " + this.getEnd() + " should be greather than or equal to " + pAnnotation.getEnd());
                };
            //case 2
            } else {
                //case 2a
                //if annotation start is less than annotation end,
                //determine whether the input end is inside the end or the input start is inside the start
                if (pAnnotation.getStart() <= pAnnotation.getEnd()) {
                    result = ((pAnnotation.getEnd() <= this.getEnd()) || (pAnnotation.getStart() >= this.getStart()));
                    //console.log(pAnnotation.getEnd() + "  should be less than or equal to  " + this.getEnd() + "  or  " + pAnnotation.getStart() + " should be greather than or equal to " + this.getStart());
                //case 2b
                } else{
                    //if the start is less than the input start and the end is larger than the input end, input is inside
                    result = ((start <= pAnnotation.getStart()) && (end >= pAnnotation.getEnd()));
                    //console.log(this.getStart() + "  should be less than or equal to  " + pAnnotation.getStart() + "  and  " + this.getEnd() + " should be greather than or equal to " + pAnnotation.getEnd());
                }
            }


            return result;
        }

        /**
         * Calculates whether an annotation has more than one location.
         * @method isMultiLocation
         * @return {Boolean} returns a boolean representing whether the annotation contains more than one annotation.
         */
        this.isMultiLocation = function(){
            if ( locations.length >= 2 ) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Shifts the locations.
         * @method shift
         * @param  {Integer} pShiftBy represents amount by which you want to shift the locations
         * @param  {Integer} pMaxLength is the maximum length of the sequence
         * @param  {Boolean} pCircular is whether the sequence is circular or not
         */
        this.shift = function (pShiftBy, pMaxLength, pCircular){
            if ( pShiftBy > (pMaxLength - 1)) {
                throw Ext.create("Teselagen.bio.BioException", {
                    message : "Cannot shift by greater than maximum length"
                });
            }

            var offset = locations[0].getStart();
            var tempLocations = getNormalizedLocations(pMaxLength);

             for (var i = 0; i < tempLocations.length; ++i ){
                var newStart = tempLocations[i].getStart() + pShiftBy;
                tempLocations[i].setStart(newStart);

                var newEnd = tempLocations[i].getEnd() + pShiftBy;
                tempLocations[i].setEnd(newEnd);
            }

            locations = deNormalizeLocations(tempLocations, locations[0].getStart(), pMaxLength, pCircular, 0);
        }


        /**
         * Inserts basepairs and updates locations. Alters only the affected locations.
         * @method insertAt
         * @param  {Integer} pPosition is the position of the insert
         * @param  {Integer} pInsertLength is the length of the insert
         * @param  {Integer} pMaxLength the max length of the locations
         * @param  {Integer} pCircular whether the annotation is circular or not
         */
        this.insertAt = function (pPosition, pInsertLength, pMaxLength, pCircular){
            var shifting = 0;
            var tempEnd;
            var offset = locations[0].getStart();

            var normalizedPosition = pPosition - offset;
            var circularAdjustment = 0;

            if (end < start && pPosition < end) {
                // insert is happening at wrapped around tail end of feature
                normalizedPosition += pMaxLength;
                circularAdjustment = -insertLength;
            }

            var tempLocations = getNormalizedLocations(pMaxLength);

            /* For each location, if insertion position is before the location, shift the current
            location and all the locations after that. If the position is within the
            location, resize that location and shift back the rest.
            */
            for (var i = 0; i < tempLocations.length; i++ ){
                var currentLocation = tempLocations[i];
                if ( shifting == 0 ) { //search phase

                    if (normalizedPosition > currentLocation.getStart() && normalizedPosition < currentLocation.getEnd() ) {
                        //the position is within the location. change this location and shift the rest.
                        //Note: if the location is at the start, it isn't "within" the location
                        tempLocations[i].setEnd(currentLocation.getEnd() + pInsertLength);
                        shifting = pInsertLength;
                        continue;
                    } else if ( normalizedPosition <= currentLocation.getStart() ){ //DW 7/25 added = sign
                        //shift this and the rest
                        tempLocations[i].setStart(currentLocation.getStart() + pInsertLength);
                        tempLocations[i].setEnd(currentLocation.getEnd() + pInsertLength);
                        shifting = pInsertLength;
                        continue;
                    }
                } else {//shifting locations
                    tempLocations[i].setStart(currentLocation.getStart() + pInsertLength);
                    tempLocations[i].setEnd(currentLocation.getEnd() + pInsertLength);
                }
            }

            locations = deNormalizeLocations(tempLocations, offset, pMaxLength + pInsertLength, pCircular, circularAdjustment);
        }

        /**
         * Delete basepairs and change locations. Alter only the affected location
         * @method deleteAt
         * @param  {Integer} pCutStart  the start of the cut
         * @param  {Integer} pCutLength the length of the cut
         * @param  {Integer} pMaxLength the max length of the locations
         * @param  {Boolean} pCircular  whether the annotation is circular
         */
        this.deleteAt = function(pCutStart, pCutLength, pMaxLength, pCircular){
            if (pCutLength < 1) {
                return;
            }

            var expectedNewLength = -1;

            var shifting = 0;
            var offset = locations[0].getStart();
            var normalizedCutStart = pCutStart - offset;
            var circularAdjustment = 0;

            var hasCircularLocation = [];
            hasCircularLocation = Ext.Array.filter(locations, function(location){
                //console.log("The location properties (start, end): " + location.getStart()+ ", " + location.getEnd());
                    return location.getStart() > location.getEnd();
            });
            /*
            console.log("pCircular is: " + pCircular);
            console.log(hasCircularLocation);
            console.log(pCutStart);
            */

            if (pCircular && pCutStart >= 0 && hasCircularLocation && hasCircularLocation.length > 0 && pCutStart < hasCircularLocation[0].getEnd()) {
                normalizedCutStart += pMaxLength;
                circularAdjustment = pCutLength;
                         }
            //console.log("Setting circularAdjustment to: " + circularAdjustment);

            this.circularAdjustment = circularAdjustment;

            var newMinimum = 0;
            var normalizedCutEnd = normalizedCutStart + pCutLength;
                        var tempLocations = getNormalizedLocations(pMaxLength);
            //console.log("normalized cut end: " + normalizedCutEnd);

            var normalizedStart = tempLocations[0].getStart();
            var normalizedEnd  = tempLocations[tempLocations.length - 1].getEnd();

            if (normalizedCutStart < normalizedStart && normalizedCutEnd <= normalizedStart) {
                expectedNewLength = normalizedEnd - normalizedStart;
            } else if (normalizedCutStart < normalizedStart && normalizedCutEnd <= normalizedEnd) {
                expectedNewLength = normalizedEnd - (normalizedCutEnd);
            } else if (normalizedCutStart >= normalizedStart && normalizedCutEnd <= normalizedEnd) {
                expectedNewLength = normalizedEnd -normalizedStart - pCutLength;
            } else if (normalizedCutStart <= normalizedEnd && normalizedCutEnd >= normalizedEnd) {
                expectedNewLength = normalizedCutStart - normalizedStart;
            }

            if (normalizedCutStart < tempLocations[0].getStart()) {
                if (normalizedCutStart + pCutLength >= tempLocations[0].getStart()) {
                    newMinimum = normalizedCutStart;
                } else if (normalizedCutStart + pCutLength <= tempLocations[0].getStart()) {
                    newMinimum = tempLocations[0].getStart() - pCutLength;
                }
            } else {
                newMinimum = tempLocations[0].getStart();
            }

            //console.log("Normalized cut end " + normalizedCutEnd + " and location start" + tempLocations[0].getStart());
            // if deletion happened before feature, shift only, no delete
            if (normalizedCutEnd <= tempLocations[0].getStart()) {
                for (var j = 0; j < tempLocations.length; j++) {
                    //console.log("Location ("+j + ", End before: " + tempLocations[j].getEnd()); //DW
                    tempLocations[j].setStart( tempLocations[j].getStart() - pCutLength);
                    tempLocations[j].setEnd( tempLocations[j].getEnd() - pCutLength);
                    //console.log("End after: " + tempLocations[j].getEnd()); //DW
                }
            } else {
                // do deletions
                var currentLocation;

                shifting = 0;

                for (var i = 0; i < tempLocations.length; i++) {
                    var currentLocation = tempLocations[i];
                    //console.log("Templocation end: " + tempLocations[i].getEnd());
                    if (shifting == 0) {
                        if (normalizedCutStart >= tempLocations[i].getEnd()) {
                            continue;
                        } else if (normalizedCutEnd <= tempLocations[i].getStart() && normalizedCutStart <= tempLocations[i].getStart() && pCutLength > 0) {
                            // cuts are left, but is all before this location. Switch to shifting
                            tempLocations[i].setStart( tempLocations[i].getStart() - pCutLength);
                            tempLocations[i].setEnd( tempLocations[i].getEnd() - pCutLength);
                            shifting = pCutLength;
                        } else if (normalizedCutEnd <=tempLocations[i].getEnd()) {
                            if (normalizedCutStart < tempLocations[i].getStart()) {
                                //console.log("Making last cut");
                                logFeatures();
                                //console.log("Cut start before and ends within this location");
                                // cut starts before and ends within this location
                                tempLocations[i].setStart( normalizedCutStart );
                                // currentLocation.start = normalizedCutStart;
                                tempLocations[i].setEnd( tempLocations[i].getEnd() - pCutLength);
                                // currentLocation.end -= pCutLength;
                                //console.log("Deletion made");
                                logFeatures();

                                shifting = pCutLength;
                            } else if (normalizedCutStart >= tempLocations[i].getStart()) {
                                // cut entirely within this location
                                // currentLocation.end -= pCutLength;
                                //console.log("Cut entirely within this location");
                                tempLocations[i].setEnd( tempLocations[i].getEnd() - pCutLength);
                                shifting = pCutLength;
                            }
                        } else if (normalizedCutEnd > currentLocation.getEnd()) {
                            if (normalizedCutStart < currentLocation.getStart()) {
                                // cut starts before this location, and ends after this location
                                tempLocations[i].setStart( normalizedCutStart );
                                tempLocations[i].setEnd( normalizedCutStart );
                            } else if (normalizedCutStart >= currentLocation.getStart()) {
                                // cut starts within this location and continues after this location
                                tempLocations[i].setEnd( normalizedCutStart );
                            }
                        }
                    } else { // shifting
                        tempLocations[i].setStart( tempLocations[i].getStart() - shifting);
                        tempLocations[i].setEnd( tempLocations[i].getEnd() - shifting);
                    }
                } // end for (var i = 0; i < tempLocations.length; i++) {
            }

            // remove zero length locations and combine locations that are next to each other
            var combinedLocations = [];
            for (i = 0; i < tempLocations.length; i++) {
                if (combinedLocations.length == 0) {
                    if (tempLocations[i].getLength() >= 0) {
                        combinedLocations.push(tempLocations[i]);
                    }
                    continue;
                }
                if (combinedLocations[combinedLocations.length - 1].getEnd() == tempLocations[i].getStart()) {
                    combinedLocations[combinedLocations.length - 1].setEnd( tempLocations[i].getEnd() );
                } else if (tempLocations[i].getLength() > 0) {
                    combinedLocations.push(tempLocations[i]);
                }
            }

            // first and last location must fill the length of the feature.
            if (combinedLocations[0].getStart() > newMinimum) {
                combinedLocations[0].setStart( newMinimum );
            }

            if (combinedLocations[combinedLocations.length - 1].getEnd() != (newMinimum + expectedNewLength) ){
                combinedLocations[combinedLocations.length - 1].setEnd( newMinimum + expectedNewLength );
            }
            var changedLength = pMaxLength - pCutLength;
            locations = deNormalizeLocations(combinedLocations, offset, changedLength, pCircular, this.circularAdjustment);
            //console.log("Locations denormalized");
            logFeatures(locations);
          function logFeatures(pLocations){ Ext.each(pLocations, function(location){
                //console.log("The location properties (start, end): " + location.getStart()+ ", " + location.getEnd());
            });}

        }

        /**
         * Reverses the locations
         * @method reverseLocations
         * @param  {Integer} pNewStartIndex the new start index of teh locationz
         * @param  {Integer} pNewMaxLength the max length of the locations
         * @param  {Boolean} pCircular whether the annotations are circular
         */
        this.reverseLocations = function (pNewStartIndex, pNewMaxLength, pCircular){
            var tempLocations = getNormalizedLocations(pNewMaxLength);
            tempLocations = reverseNormalizedLocations(tempLocations);
            tempLocations = deNormalizeLocations(tempLocations, pNewStartIndex, pNewMaxLength, pCircular, 0);

            locations = tempLocations;
        }

        var getNormalizedLocations = function(maxLength){
            if (locations.length == 0) {
                return null;
            }

            var normalizedLocations = [];
            var offset = locations[0].getStart();
            var newStart = 0;
            var newEnd = 0;
            var location;

            for (var i= 0; i < locations.length; i++) {
                location = locations[i];
                newStart = location.getStart() - offset;
                if (newStart < 0) {
                    newStart += maxLength;
                }
                newEnd = location.getEnd() - offset;
                if (newEnd < 0) {
                    newEnd += maxLength;
                }
                normalizedLocations.push(Ext.create("Teselagen.bio.sequence.common.Location", {
                    start: newStart,
                    end: newEnd
                }));

            }
            return normalizedLocations;
        }
        /**
         * Denormalize the location form zero-based to offset. Calculates circularity (if needed)
         * @method deNormalizeLocations
         * @param  {Location[]} pTempLocations is the array of locations you want to denormalize
         * @param  {Integer} pOffset the offset of the locations
         * @param  {Integer} pMaxLength is the max length of the locations
         * @param  {Boolean} pCircular if the annotation is circular
         * @param  {Integer} pCircularAdjustment is adjustment that needs to be made because of circularity
         * @return {Location[]} returns denormalized locations
         */
        function deNormalizeLocations(pTempLocations, pOffset, pMaxLength, pCircular, pCircularAdjustment){
            if (pTempLocations.length === 0) {
                return null;
            }

            var result = [];
            var newStart;
            var newEnd;
            var location;

            for (var i = 0; i < pTempLocations.length; i++) {
                location = pTempLocations[i];
                newStart = pTempLocations[i].getStart() + pOffset;
                /*
                console.log("Location start: " + location.getStart());
                console.log("Offset: " + pOffset);
                */
                //console.log("newStart: " + newStart);
                /*
                console.log("pMaxLength = " + pMaxLength);
                console.log("pCircularAdjustment = " + pCircularAdjustment);*/
                if (pCircular && newStart > pMaxLength) {
                    newStart = newStart - (pMaxLength + pCircularAdjustment);
                } else if (pCircular) {
                    newStart -= pCircularAdjustment;
                } else if (newStart == pMaxLength){
                    newStart -= pMaxLength;
                }

                newEnd = location.getEnd() + pOffset;
                if (pCircular && newEnd > pMaxLength) {
                    newEnd = newEnd - (pMaxLength + pCircularAdjustment);

                } else if (pCircular) {
                    newEnd -= pCircularAdjustment;
                }

                // On rare occasions, the calculated value is two circular distances away. Handle this case.
                if ( ( pCircular && (location.getStart() + pOffset == pMaxLength ) )&& ( (location.getEnd() + pOffset) == (pMaxLength + pMaxLength )  ) ) {
                    newStart = 0;
                    newEnd = pMaxLength;
                }

                if (pCircular && newStart < 0) {
                    newStart += pMaxLength;
                }

                if (pCircular && newEnd < 0) {
                    newEnd += pMaxLength;
                }

                //console.log("The newEnd is: " + newEnd);
                //console.log("The newStart is: " + newStart);
                result.push(Ext.create("Teselagen.bio.sequence.common.Location", {
                    start: newStart,
                    end: newEnd
                }));
            }
            return result;

        }

        /**
         * Reverses locations. This function assumes normalized locations, meaning it will not
         * handle locations that go over zero properly, although it will calculate non-zero
         * offset.
         * @private
         */
        function reverseNormalizedLocations(tempLocations){
            if (tempLocations.length === 0 ){
                return null;
            }

            var result = [];
            var offset = tempLocations[0].getStart();
            var location;
            var locationLength;
            var featureLength = tempLocations[tempLocations.length - 1].getEnd() - offset;
            var newStart;

            for (var i = tempLocations.length - 1; i > -1; i--) {
                location = tempLocations[i];
                locationLength = location.getEnd() - location.getStart();
                newStart = featureLength - location.getEnd();
                newEnd   = newStart + locationLength; //DW ADDED THIS LINE 7/25/2012

                result.push(Ext.create("Teselagen.bio.sequence.common.Location", {
                    start: newStart,
                    end: newEnd
                }));
            }

            return result;

        }

        /**
         * Gets the index of the location
         * @private
         * @param  {Integer} index the index
         * @return {Integer} The index of Location. -1 if not within a Location.
         */
        function getOverlappingIndex (index){
            var result = -1;
            for (var index; index < locations.length; index++) {
                var location = locations[index];
                if (index >= location.getStart() && index <= location.getEnd()) {
                    result = index;
                    break;
                }
            }

            return result;

        }

        return this;
    }

});
