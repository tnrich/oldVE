 /**
 * @class Teselagen.models.digest.Ladder
 * Class describing a DNA Ladder
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 */

Ext.define("Teselagen.models.digest.Ladder", {

    config: {
        bandSizes: null,
    },
    statics: {
        BP_LADDER_BANDS: ['20000', '10000', '7000', '5000', '4000', '2000', '1500', '1000', '700', '500', '400', '300', '200', '75'],
        KB_LADDER_BANDS: ['3000', '2000', '1500', '1200', '1000', '900', '800', '700', '600', '500', '400', '300', '200', '100'],
    },

	/**
	 * Input parameters.
	 * @param {String} name The name of the ladder..
	 * @param {Number[]} bandSizes A list of integers that specify ladder
     * band sizes
	 */
	fields: [
		{name: "bandSizes", type: "auto", defaultValue: null},
		//{name: "name", type: "string", defaultValue: ""},
	],

    constructor: function(inData){
        this.initConfig(inData);
        this.statics();

        this.setLadder(inData.ladderName);
                return this;

    },

    setLadder: function(pLadder){
        if (inData.ladderName.indexOf('1kb') > -1 ){
            this.bandSizes = this.self.BP_LADDER_BANDS; 
        }else {
            this.bandSizes = this.self.KB_LADDER_BANDS;
        }

    },
});
