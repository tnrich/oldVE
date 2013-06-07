/**
 * @class Teselagen.bio.BioException
 * General class used to handle errors.
 * @extends Ext.Error
 * @author Micah Lerner
 */
Ext.define("Teselagen.bio.BioException", {
    //tend: 'Ext.Error',
    message: null,
    statics: {
        /*
         * Raises an exception with specified input going to the console
         * @param pInput the message you want to write to console.
         */
        raise: function(pInput) {
                   //ar passedMessage = "";
                   //f (Ext.isObject(pInput)){
                   //    passedMessage = pInput.message || "You have an error."
                   // else{
                   //passedMessage = pInput;
                   //
                   //xt.Error.raise({msg: passedMessage});
        },
    },
    /* 
     * @param message A message you want to display.
     */
    constructor: function(inData){
        //var that = this;
        //that.message = inData.message || "Default Message";
        //this.callParent([inData]);
    },

        

});
