    /**
    * Exception when an invalid symbol is found.
    * @class Teselagen.bio.sequence.symbols.IllegalSymbolException
    * @author Micah Lerner
    */
Ext.define("Teselagen.bio.sequence.symbols.IllegalSymbolException", {
    extend: 'Ext.Error',
    message: null,
    statics: {
        raise: function(pInput) {
                   var passedMessage = "";
                   if (Ext.isObject(pInput)){
                        passedMessage = pInput.message || "You have an error."
                   } else{
                    passedMessage = pInput;
                   }
                   Ext.Error.raise({msg: passedMessage});
        },
    },
    constructor: function(inData){
        var that = this;
        that.message = inData.message || "Default Message";
        this.callParent([inData]);
    },



});
