/**
 * @class Teselagen.manager.J5RunManager
 * Class describing a J5RunManager.
 * J5RunManager manages the parameters models (J5Parameters, DownstreamAutomationParameters)
 * as well as the J5Results.
 *
 * @author Diana Wong
 */
Ext.define("Teselagen.manager.J5RunManager", {

    singleton: true,

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants"
    ],

    statics: {
        //NAME: "SequenceFileProxy"
    },

    constructor: function() {
    },

    //================================================================
    // J5Parameters Management
    //================================================================

    /**
     * In order to create the J5Parameters model, create an object with default values.
     * Change the field values after this is created.
     */
    createDefaultJ5Parameters: function() {
        var param = Ext.create("Teselagen.modesl.J5Parameters");
        param.validate();
        return param;
    },

    /**
     */
    changeJ5ParameterValue: function (pJ5Param, pField, pValue) {
        pJ5Param.set(pField, pValue);
    },


    //================================================================
    // DownstreamAutomationParameters Management
    //================================================================

    /**
     * In order to create the DownstreamAutomationParameters model, create an object with default values.
     * Change the field values after this is created.
     */
    createDefaultDownstreamAutomationParameters: function() {
        var param = Ext.create("Teselagen.modesl.DownstreamAutomationParameters");
        param.validate();
        return param;
    },

    /**
     */
    changeDownstreamAutomationParameterValue: function (pDSP, pField, pValue) {
        pDSP.set(pField, pValue);
    },

    //================================================================
    // J5Results Management
    //================================================================

    /**
     */
    createJ5Results: function() {
        var results = Ext.create("Teselagen.modesl.J5Results");
        param.validate();
        return results;
    }



});