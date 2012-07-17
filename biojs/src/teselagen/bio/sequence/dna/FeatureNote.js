/**
* @class Teselagen.bio.sequence.dna.FeatureNote
* DNA feature holder.
* 
* @author Micah Lerner
* @requires Teselagen.bio.BioException
*/
Ext.define("Teselagen.bio.sequence.dna.FeatureNote", {
	
	/**
	 * Constructor
	 * @param  {String} Name is the string name
	 * @param  {String} Value is the type of feature
	 * @param  {Boolean} whether the featurenote is quoted or not
	 */
	constructor: function(inData){
		if (inData) {
			var name = inData.name || "";
			var value = inData.value || "";
			var quoted = inData.quoted || false;
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}

		/**
		 * Get Name
		 * @return {String} Name
		 */
		this.getName = function(){
			return name;
		}

		/**
		 * Sets Name
		 * @param {String} pName
		 */
		this.setName = function(pName){
			name = pName;
		}

		/**
		 * Get Value
		 * @return {String} Value
		 */
		this.getValue = function(){
			return value;
		}

		/**
		 * Sets Value
		 * @param {String} value
		 */
		this.setValue = function(pValue){
			value = pValue;
		}

		/**
		 * Get Quoted
		 * @return {Boolean} quoted
		 */
		this.getQuoted = function (){
			return quoted;
		}

		/**
		 * Sets Quoted
		 * @param {Boolean} quoted
		 */
		this.setQuoted = function (pQuoted){
			quoted = pQuoted;
		}

		/**
		 * Clones the feature note
		 * @return {Feature} cloned feature note
		 */
		this.clone =function(){
			return Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
				name: name,
				value: value
			});
		}
	}
});
