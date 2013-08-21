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
	 * @param  {Boolean} Quoted whether the featurenote is quoted or not
	 */
	constructor: function(inData){
		if (inData) {
			var name = inData.name || "";
			var value = inData.value || "";
			var quoted = inData.quoted || false;
		} else {
			Teselagen.bio.BioException.raise("Arguments needed");
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
		 * @method setName
		 * @param {String} pName
		 */
		this.setName = function(pName){
			name = pName;
		}

		/**
		 * Get Value
		 * @method getValue
		 * @return {String} Value
		 */
		this.getValue = function(){
			return value;
		}

		/**
		 * Sets Value
		 * @method setValue
		 * @param {String} value
		 */
		this.setValue = function(pValue){
			value = pValue;
		}

		/**
		 * Get Quoted
		 * @method getQuoted
		 * @return {Boolean} quoted
		 */
		this.getQuoted = function (){
			return quoted;
		}

		/**
		 * Sets Quoted
		 * @method setQuoted
		 * @param {Boolean} quoted
		 */
		this.setQuoted = function (pQuoted){
			quoted = pQuoted;
		}

		/**
		 * Clones the feature note
		 * @method clone
		 * @return {Feature} cloned feature note
		 */
		this.clone = function(){
			return Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
				name: name,
				value: value,
				quoted: quoted
			});
		}
	},

	/**
     * Serialize FeatureNote
     * @return {Object}
     */
	serialize: function(){
		var data = {};
		data.inData = {
			name : this.getName(),
			value : this.getValue(),
			quoted : this.getQuoted()
		}
		return data;
	}
});
