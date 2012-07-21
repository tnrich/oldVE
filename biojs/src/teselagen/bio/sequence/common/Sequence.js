/**
 * @class Teselagen.bio.sequence.common.Sequence
 * 
 * Sequence with name
 * @extends Teselagen.bio.sequence.common.SymbolList
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.sequence.common.Sequence", {
	extend: "Teselagen.bio.sequence.common.SymbolList",

	/**
	 * Constructor
	 * @param  {String} name name of sequence
	 * @param {SymbolList} [symbolList] a list of symbols that contains symbols and an alphabet
	 */
	constructor: function(inData){
		var name;

		if (inData) {
			name = inData.name || "";
			this.callParent([{
				symbols: inData.symbolList.getSymbols(),
				alphabet: inData.symbolList.getAlphabet()
			}]);
		} else {
			Teselagen.bio.BioException.raise("Arguments needed");
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