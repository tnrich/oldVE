Ext.define("Teselagen.bio.BioException", {
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

        
        errHandler:function(pErr) {
            console.warn(pErr);
            return true;
        }

});
