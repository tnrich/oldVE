/**
 * @class Teselagen.bio.sequence.common.Location
 * 
 * The Location class contains functions that holds data about feature locations
 * 
 * @author Micah Lerner
 * @author Timothy Ham (original author)
 */
Ext.define("Teselagen.bio.sequence.common.Location", {
	/**
	 * Constructor
	 * @param {Integer} start location start
	 * @param {Integer} end location end
	 */
	constructor: function(inData){
		var start; 
		var end;

		if (inData) {
			start = inData.start || 0;
			end = inData.end || 0;
		} else {
			Teselagen.bio.BioException.raise("Arguments needed");
		};

		/**
		* Returns the location start
		* @return {Integer} Location start
		*/
		this.getStart = function (){
			return start;
		}

		/**
		 * Sets the location start
		 * @method setStart
		 * @param {Integer} pStart is the new location start
		 */
		this.setStart = function(pStart){
			start = pStart;
		}

		/**
		 * Returns the location end
		 * @method getEnd
		 * @return {Integer} Location end
		 */
		this.getEnd = function(){
			return end;
		}


		/**
		 * Sets the location end.
		 * @method setEnd
		 * @param {Integer} pEnd is the new location end
		 */
		this.setEnd = function(pEnd){
			end = pEnd;
		}

		/**
		 * Returns a copy of the location
		 * @method clone
		 * @return {Location} copied location
		 */
		this.clone = function(){
			return Ext.create("Teselagen.bio.sequence.common.Location",{
				start: start,
				end: end
			});
		}

		/**
		 * Returns the length of the location
		 * @method getLength
		 * @return {Integer} length of the location
		 */
		this.getLength = function (){
			return Math.abs(end -start);
		}
	},

    serialize: function() {
        return {
            start: this.getStart(),
            end: this.getEnd()
        };
    },

    deSerialize: function(data) {
        this.setStart(data.start);
        this.setEnd(data.end);
    }
});
