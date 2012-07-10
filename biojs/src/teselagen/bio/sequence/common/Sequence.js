/**
 * @class Teselagen.bio.sequence.common.Sequence
 * 
 * The Annotation class contains functions that processes data about locations
 * @extends Teselagen.bio.sequence.common.SymbolList
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 * @author Timothy Ham (original author)
 */
Ext.define("Teselagen.bio.sequence.common.Sequence", {
	extend: "Teselagen.bio.sequence.common.SymbolList",

	constructor: function(inData){
		var name;

		if (inData) {
			name = inData.name;
			this.callParent([{
				symbols: inData.symbolList.getSymbols(),
				alphabet: inData.symbolList.getAlphabet()
			}]);
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Arguments needed"
			});
		}

		/**
		 * Get Name of the sequence
		 * @return {String} Name
		 */
		this.getName = function(){
			return name;
		}

		/**
		 * Set name
		 * @param {String} pName Sets sequence name
		 */
		this.setName = function(pName){
			name = pName;
		}

		return this;
	}
});