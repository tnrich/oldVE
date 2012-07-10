/**
 * @class Teselagen.bio.sequence.common.Annotation
 * 
 * The Annotation class contains functions that processes data about locations
 * 
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 * @author Timothy Ham (original author)
 */
Ext.define("Teselagen.bio.sequence.common.Annotation", {
	requires: ["Teselagen.bio.sequence.common.Location", "Teselagen.bio.BioException"],
	
	constructor: function(inData){

		var start = inData.start;
		var end = inData.end;
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
		 * @return {Number} the start of the annotation
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
		 * @param {Number} pStart is the new start.
		 */
		this.setStart = function(pStart){
			start = pStart;
		}

		/**
		 * Allows one to set the first start in an annotation, unless there is more than one start.
		 * @param {Number} pStart sets the new start of the annotation only if there is one location.
		 */
		this.setOneStart = function(pStart){
			if ( locations.length === 1 ) {
				locations[0].setStart(pStart);
			} else {	
				console.log("You've found an error!");		
				throw Ext.create("Teselagen.bio.BioException", {
					message : "Cannot set start when multiple locations exist"
				}); 
			}
		}

		/**
		 * Returns the end of the annotation.
		 * @return {Number} returns the end of the annotation.
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
		 * @param {Number} pEnd sets the end of the annotation.
		 */
		this.setEnd= function(pEnd){
			end = pEnd;
		}

		/**
		 * Allows one to set the end of the annotation.
		 * @param {Number} pEnd sets the end of the annotation only if there is one location.
		 */
		this.setOneEnd = function(pEnd){
			if  ( locations.length === 1 ) {
				locations[0].setEnd(pEnd);
			} else{
				console.log("You've found an error!");	
				throw Ext.create("Teselagen.bio.BioException", {
					message : "Cannot set end when multiple Locations exist"
				}); 
			}

		}
		/**
		 * Returns the locations within the annotation.
		 * @return {Locations} returns a list of the annotation's locations.
		 */
		this.getLocations = function(){
			return locations;
		}

		/**
		 * Allows one to set the locations of the annotation.
		 * @param {Array of Locations} pLocations sets the new list of locations.
		 */
		this.setLocations = function(pLocations){
			locations = pLocations;
		}

		/**
		 * Calculates whether one annotation is contained within another.
		 * @param  {Annotation} pAnnotation is an input annotation.
		 * @return {Boolean} returns a boolean representing whether one annotation is contained within another.
		 */
		this.contains = function(pAnnotation){
			var result = false; 

			//if (typeof pAnnotation ===) {};
			//First comparison tests whether this annotation is non-circular. 
			//Second comparison tests whether the input annotations is non-circular.
			//Non-circular pieces of DNA will have their starts before their ends.
			if (start <= end) {
				if (annotation.getStart() <= annotation.getEnd()) {
					result = ((start <= annotation.getStart()) && (end >= annotation.getEnd()));
				};
			} else {
				if (annotation.getStart() < annotation.getEnd()) {
					result = ((annotation.end <= end) || (annotation.start >= start));
				} else{
					result = ((start <= annotation.start) && (end >= annotation.end));
				}
			}
			

			return result;
		}
		
		/**
		 * Calculates whether an annotation has more than one location.
		 * @return {Boolean} returns a boolean representing whether the annotation contains more than one annotation.
		 */
		this.isMultiLocation = function(){
			if ( locations.length >= 2 ) {
				return true;
			} else {
				return false;
			}
		}
		
		this.shift = function (pShiftBy, pMaxLength, pCircular){
			if ( pShiftBy > (pMaxLength - 1)) {
				throw Ext.create("Teselagen.bio.BioException", {
					message : "Cannot shift by greater than maximum length"
				}); 
			}

			var offset = start;
			var tempLocations = getNormalizedLocations(pMaxLength);
			var tempLocation = Ext.create("Teselagen.bio.sequence.common.Location",{
				start: null,
				end: null
			});
			for (var i = 0; i < tempLocations.length; ++i ){ 
				tempLocations[i].setStart( tempLocations[i].getStart() + pShiftBy );
				tempLocations[i].setEnd( tempLocations[i].getEnd() + pShiftBy );
			}

			tempLocations = deNormalizeLocations(tempLocations, offset, pMaxLength, pCircular);
			locations = tempLocations;
		}
			 
		

		this.insertAt = function (pPosition, pInsertLength, pMaxLength, pCircular){
			var shifting = 0;
			var tempEnd;
			var offset = locations[0].getStart();

			var normalizedPosition = pPosition - offset;
			var circularAdjustment = 0;

			if (end < start && pPosition < end) {
				normalizedPosition += pMaxLength;
				circularAdjustment = -insertLength;
			}

			var tempLocations = getNormalizedLocations(pMaxLength);

			for (var i = 0; i < tempLocations.length; i++ ){
				var currentLocation = tempLocations[i];
				if ( shifting == 0 ) {
					if (normalizedPosition > currentLocation.getStart() && normalizedPosition < currentLocation.getEnd() ) {
						tempLocations[i].setEnd(currentLocation.getEnd() + pInsertLength);
						shifting = pInsertLength;
						continue;
					} else if ( normalizedPosition < currentLocation.getStart() ){
						tempLocations[i].setStart(currentLocation.getEnd() + pInsertLength);
						tempLocations[i].setEnd(currentLocation.getEnd() + pInsertLength);
						shifting = pInsertLength;
					}
				} else {
					tempLocations[i].setStart(currentLocation.getStart() + pInsertLength);
					tempLocations[i].setEnd(currentLocation.getEnd() + pInsertLength);
				}
			}

			locations = deNormalizeLocation(tempLocations, offset, maxLength + insertLength, circular, circularAdjustment);
		}


		this.deleteAt = function(pCutStart, pCutLength, pMaxLength, pCircular){
			if (pCutLength < 1) {
				exit;
			}

			var expectedNewLength = -1;

			var shifting = 0;
			var offset = locations[0].getStart();
			var normalizedCutStart = pCutStart - offset;
			var circularAdjustment = 0;

			if (end < start && pCutStart >= 0  && pCutStart < end) {
				normalizedCutStart += pMaxLength;
				circularAdjustment = pCutLength;
			}

			var newMinimum = 0;
			var normalizedCutEnd = normalizedCutStart + pCutLength;
			var tempLocations = getNormalizedLocations(pMaxLength);

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


			// if deletion happened before feature, shift only, no delete
			if (normalizedCutEnd <= tempLocations[0].getStart()) {
				for (var j = 0; j < tempLocations.length; j++) {
					tempLocations[j].setStart( tempLocations[j].getStart() - pCutLength);
					tempLocations[j].setEnd( tempLocations[j].getEnd() - pCutLength);
				}
			} else {
				// do deletions
				var currentLocation;
	
				shifting = 0;
				
				for (var i = 0; i < tempLocations.length; i++) {
					currentLocation = tempLocations[i];
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
								// cut starts before and ends within this location
								tempLocations[i].setStart( normalizedCutStart );
								// currentLocation.start = normalizedCutStart;
								tempLocations[i].setEnd( tempLocations[i].getEnd() - pCutLength);
								// currentLocation.end -= pCutLength;
								shifting = pCutLength;
							} else if (normalizedCutStart >= tempLocations[i].getStart()) { 
								// cut entirely within this location
								// currentLocation.end -= pCutLength;
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
					if (tempLocations[i].getLength() > 0) {
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
			locations = deNormalizeLocations(combinedLocations, offset, changedLength, pCircular, circularAdjustment);

		}


		this.reverseLocations = function (pNewStartIndex, pNewMaxLength, pCircular){
			var tempLocations = getNormalizedLocations(pNewMaxLength);
			tempLocations = reverseNormalizedLocations(tempLocations);
			tempLocations = deNormalizeLocations(tempLocations, pNewStartIndex, pNewMaxLength, pCircular);
			
			locations = tempLocations;
		}

		var getNormalizedLocations = function(maxLength){
			if (locations.length == 0) {
				return null;
			}
			
			var result = [];
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
				result.push(Ext.create("Teselagen.bio.sequence.common.Location", {
					start: newStart,
					end: newEnd
				}));
			}
			return result;
		}

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
				newStart = location.getStart() + pOffset;
				if (pCircular && newStart > pMaxLength) {
					newStart -= pMaxLength + pCircularAdjustment;
				} else if (pCircular) {
					newStart -= pCircularAdjustment;
				}
				
				newEnd = location.getEnd() + pOffset;
				if (pCircular && newEnd > pMaxLength) {
					newEnd -= pMaxLength + pCircularAdjustment;
				} else if (pCircular) {
					newEnd -= pCircularAdjustment;
				}
				
				// On rare occasions, the calculated value is two circular distances away. Handle this case.
				if ( ( pCircular && location.getStart() + pOffset == pMaxLength ) && ( location.getEnd() + pOffset == pMaxLength + pMaxLength ) ) {
					newStart = 0;
					newEnd = pMaxLength;
				}
				
				if (pCircular && newStart < 0) {
					newStart += pMaxLength;
				}
				
				if (pCircular && newEnd < 0) {
					newEnd += pMaxLength;
				}

				result.push(Ext.create("Teselagen.bio.sequence.common.Location", {
					start: newStart,
					end: newEnd	
				}));
			}
			return result;

		}

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

				result.push(Ext.create("Teselagen.bio.sequence.common.Location", {
					start: newStart,
					end: newEnd	
				}));
			}
			
			return result;

		}

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
	},

});