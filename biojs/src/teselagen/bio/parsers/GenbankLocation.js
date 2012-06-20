
    /**
    * GenbankLocation class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankLocation', {
	/* */

	/* 
	 * @constructor
	 * @param {int, int} Genbank Feature Start and End indices
	 */
	constructor: function (pGenbankStart, pGenbankEnd) {
		var genbankStart = pGenbankStart;
		var end = pGenbankEnd;
		
		this.getGenbankStart = function() {
			return genbankStart;
		}
		this.setGenbankStart = function(pGenbankStart) {
			genbankStart = pGenbankStart;
		}

		this.getEnd = function() {
			return end;
		}
		this.setEnd = function(pEnd) {
			end = pEnd;
		}

		return this;
    }

});