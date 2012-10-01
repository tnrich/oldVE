/**
 * @class Teselagen.manager.PartManager
 * Class describing a PartManager.
 * PartManager holds an array of Parts, for a given design project.
 *
 * Originally PartFileProxy.as, FunctionMediator.as, SaveDesignXMLCommand.as
 * @author Diana Wong
 * @author Douglas Densmore (original author) ?
 */
Ext.define("Teselagen.manager.PartManager", {

    //singleton: true,

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants",
        "Teselagen.models.SequenceFile"
    ],

    statics: {
        NAME: "PartProxy"
    },

    Sha256: null,
    Constants: null,

    config: {
        parts: []
    },

    constructor: function(inData) {
        this.Sha256         = Teselagen.bio.util.Sha256;
        this.Constants      = Teselagen.constants.Constants;
        this.parts          = inData.parts || [];
        //console.log(inData.sequenceFiles);
    },


    getPartVOs: function() {
        
    }


});