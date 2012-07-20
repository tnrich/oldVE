Ext.define("Teselagen.bio.BioException", {

    message: null,
    statics: {
        raiseException: function(pInput) {
                   var passedMessage = "";
                   if (typeof pInput == "object"){
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
        Ext.Error.handle = this.errHandler;  
    },


        throwException: function(pMessage) {
                   throw new Ext.Error({msg: this.message});
        },
        
        errHandler:function(pErr) {
            console.warn(pErr);
            return true;
        }

});
