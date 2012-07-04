Ext.define("Teselagen.bio.sequence.common.Annotation", {
	constructor: function(data){

		var inputStart = data.start;
		var inputEnd = data.end;
		var initialLocation = Ext.create("Teselagen.bio.sequence.common.Location", {
			start: inputStart,
			end: inputEnd
		});

		var locations = [];
		locations.push(initialLocation);

		var BioException = Ext.create("Teselagen.bio.BioException", {
					message : "Cannot set start when multiple Locations exist"
				}); 
		
		this.getStart = function(){
			if ( locations.length > 0 ) {
				return locations[0].getStart();
			} else {
				return -1;
			}
		}
		

		this.setStart = function(pStart){
			start = pStart;
		}


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

		this.getEnd = function(){
			if (locations.length > 0){
				return locations[locations.length - 1].getEnd();
			}
			else {
				return 1;
			}
		}

		this.setEnd= function(pEnd){
			end = pEnd;
		}


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

		this.getLocations = function(){
			return locations;
		}

		this.setLocations = function(pLocations){
			locations = pLocations;
		}

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
		 
		this.isMultiLocation = function(){
			if ( this.locations.length >= 2 ) {
				return true;
			} else {
				return false;
			}
		}
		/*
		this.shift = function (shiftBy, maxLength, circular){
			if ( shiftBy > (maxLength - 1)) {
				throw Ext.create("Teselagen.bio.BioException", {
					message : "Cannot shift by greater than maximum length"
				}); 
			}

			var offset = this.start;
			var tempLocations = getNormalizedLocations();

			for (var i = 0; i < tempLocations.getLocations().length; ++i ){ 
				location.setStart( location.getStart() + shiftBy );
				location.setEnd( location.getEnd() + shiftBy );
			}

			tempLocations = deNormalizeLocation(tempLocations, offset, maxLength, circular);
			locations = tempLocations;
		}
			 


		this.insertAt = function (position, insertLength, maxLength, circular){
			var shifting = 0;
			var tempEnd;
			var offset = locations[0].start;

			var normalizedPosition = position - offset;
			var circularAdjustment = 0;

			if (end < start && position < end) {
				normalizedPosition += maxLength;
				circularAdjustment = -insertLength;
			}

			var tempLocations = getNormalizedLocations(maxLength);

			for (var i = 0; i < tempLocations.length; i++ {
				currentLocation = tempLocations[i];
				if ( shifting == 0 ) {
					if (normalizedPosition > currentLocation.start && normalizedPosition < currentLocation.end ) {
						currentLocation.end += insertLength;
						shifting = insertLength;
						continue;
					} else if ( normalizedPosition < currentLocation.start ){
						currentLocation.start += insertLength;
						currentLocation.end += insertLength;
						shifting = insertLength;
					}
				} else {
					currentLocation.start += insertLength;
					currentLocation.end += insertLength;
				}
			}

			this.locations = deNormalizeLocation(tempLocations, offset, maxLength + insertLength, circular, circularAdjustment);

			return this;
		}


		this.deleteAt = function(cutStart, cutLength, maxLength, circular){
			if (cutLength < 1) {
				exit;
			}

			var expectedNewLength = -1;

			var shifting = 0;
			var offset = locations[0].start;
			var normalizedCutStart = cutStart - offset;
			var circularAdjustment = 0;

			if (end < start && cutStart >= 0  && cutStart < end) {
				normalizedCutStart += maxLength;
				circularAdjustment = cutLength;
			}

			var newMinimum = 0;
			var normalizedCutEnd = normalizedCutStart + cutLength;
			var tempLocations = getNormalizedLocations(maxLength);

			var normalizedStart = tempLocations[0].start;
			var normalizedEnd  = tempLocations[tempLocations.length - 1].end;

			if (normalizedCutStart < normalizedStart && normalizedCutEnd <= normalizedStart) {
				expectedNewLength = normalizedEnd - normalizedStart;
			} else if (normalizedCutStart < normalizedStart && normalizedCutEnd <= normalizedEnd) {
				expectedNewLength = normalizedEnd - (normalizedCutEnd);
			} else if (normalizedCutStart >= normalizedStart && normalizedCutEnd <= normalizedEnd) {
				expectedNewLength = normalizedEnd -normalizedStart - cutLength;
			} else if (normalizedCutStart <= normalizedEnd && normalizedCutEnd >= normalizedEnd) {
				expectedNewLength = normalizedCutStart - normalizedStart;
			}

			if (normalizedCutStart < tempLocations[0].start) {
				if (normalizedCutStart + cutLength >= tempLocations[0].start) {
					newMinimum = normalizedCutStart;
				} else if (normalizedCutStart + cutLength <= tempLocations[0].start) {
					newMinimum = tempLocations[0].start - cutLength;
				}
			} else {
				newMinimum = tempLocations[0].start;
			}


			// if deletion happened before feature, shift only, no delete
			if (normalizedCutEnd <= tempLocations[0].start) {
				for (var j:int = 0; j < tempLocations.length; j++) {
					tempLocations[j].start -= cutLength;
					tempLocations[j].end -= cutLength;
				}
			} else {
				// do deletions
				var currentLocation;
	
				shifting = 0;
				
				for (var i = 0; i < tempLocations.length; i++) {
					currentLocation = tempLocations[i];
					if (shifting == 0) {
						if (normalizedCutStart >= currentLocation.end) {
							continue;
						} else if (normalizedCutEnd <= currentLocation.start && normalizedCutStart <= currentLocation.start && cutLength > 0) { 
							// cuts are left, but is all before this location. Switch to shifting
							currentLocation.start -= cutLength;
							currentLocation.end -= cutLength;
							shifting = cutLength;
						} else if (normalizedCutEnd <= currentLocation.end) {
							if (normalizedCutStart < currentLocation.start) {
								// cut starts before and ends within this location
								currentLocation.start = normalizedCutStart;
								currentLocation.end -= cutLength;
								shifting = cutLength;
							} else if (normalizedCutStart >= currentLocation.start) { 
								// cut entirely within this location
								currentLocation.end -= cutLength;
								shifting = cutLength;
							}
						} else if (normalizedCutEnd > currentLocation.end) { 
							if (normalizedCutStart < currentLocation.start) { 
								// cut starts before this location, and ends after this location
								currentLocation.start = normalizedCutStart;
								currentLocation.end = normalizedCutStart;
							} else if (normalizedCutStart >= currentLocation.start) { 
								// cut starts within this location and continues after this location
								currentLocation.end = normalizedCutStart;
							}
						}
					} else { // shifting
						currentLocation.start -= shifting;
						currentLocation.end -= shifting;
					}
				} // end for (var i:int = 0; i < tempLocations.length; i++) {
			}

			// remove zero length locations and combine locations that are next to each other
			var combinedLocations = [];
			for (i = 0; i < tempLocations.length; i++) {
				if (combinedLocations.length == 0) {
					if (tempLocations[i].length > 0) {
						combinedLocations.push(tempLocations[i]);	
					}
					continue;
				}
				if (combinedLocations[combinedLocations.length - 1].end == tempLocations[i].start) {
					combinedLocations[combinedLocations.length - 1].end = tempLocations[i].end;
				} else if (tempLocations[i].length > 0) {
					combinedLocations.push(tempLocations[i]);
				}
			}
			
			// first and last location must fill the length of the feature.
			if (combinedLocations[0].start > newMinimum) {
				combinedLocations[0].start = newMinimum;
			}
			
			if (combinedLocations[combinedLocations.length - 1].end != newMinimum + expectedNewLength) {
				combinedLocations[combinedLocations.length - 1].end = newMinimum + expectedNewLength;
			}
			
			locations = deNormalizeLocations(combinedLocations, offset, maxLength - cutLength, circular, circularAdjustment);

			return this;

		}

		this.reverseLocations = function (newStartIndex, newMaxLength, circular){
			var tempLocations = getNormalizedLocations(newMaxLength);
			tempLocations = reverseNormalizedLocations(tempLocations);
			tempLocations = deNormalizeLocations(tempLocations, newStartIndex, newMaxLength, circular);
			
			locations = tempLocations;

			return this;
		}

		var getNormalizedLocations = function(maxLength){
			if (locations.length == 0) {
				return null;
			}
			
			var result = [];
			var offset = locations[0].start;
			var newStart = 0;
			var newEnd = 0;
			var location;
			
			for (var i= 0; i < locations.length; i++) {
				location = locations[i];	
				newStart = location.start - offset;
				if (newStart < 0) {
					newStart += maxLength;
				}
				newEnd = location.end - offset;
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

		var deNormalizeLocations = function(tempLocations, offset, maxLength, circularAdjustment){
			if (tempLocations.length === 0) {
				return null;
			}

			var result = [];
			var newStart;
			var newEnd;
			var location;

			for (var i = 0; i < tempLocations.length; i++) {
				location = tempLocations[i];
				newStart = location.start + offset;
				if (circular && newStart > maxLength) {
					newStart -= maxLength + circularAdjustment;
				} else if (circular) {
					newStart -= circularAdjustment;
				}
				
				newEnd = location.end + offset;
				if (circular && newEnd > maxLength) {
					newEnd -= maxLength + circularAdjustment;
				} else if (circular) {
					newEnd -= circularAdjustment;
				}
				
				// On rare occasions, the calculated value is two circular distances away. Handle this case.
				if (circular && location.start + offset == maxLength && location.end + offset == maxLength + maxLength) {
					newStart = 0;
					newEnd = maxLength;
				}
				
				if (circular && newStart < 0) {
					newStart += maxLength;
				}
				
				if (circular && newEnd < 0) {
					newEnd += maxLength;
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
			var offset = tempLocations[0].start;
			var location;
			var locationLength;
			var featureLength = tempLocations[tempLocations.length - 1].end - offset;
			var newStart;

			for (var i = tempLocations.length - 1; i > -1; i--) {
				location = tempLocations[i];
				locationLength = location.end - location.start;
				newStart = featureLength - location.end;

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
				var location:Location = locations[index];
				if (index >= location.start && index <= location.end) {
					result = index;
					break;
				} 
			}
			
			return result;

		} */

		return this;
	},

});