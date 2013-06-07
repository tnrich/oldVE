    /**
    * Exception when an invalid symbol is found.
    * @class Teselagen.bio.sequence.symbols.IllegalSymbolException
    * @author Micah Lerner
    */
Ext.define("Teselagen.bio.sequence.symbols.IllegalSymbolException", {
    message: null,
    statics: {
        raise: function(pInput) {

        },
    },
    constructor: function(inData){
        //var that = this;
        //that.message = inData.message || "Default Message";
        this.callParent([inData]);
    },



});
