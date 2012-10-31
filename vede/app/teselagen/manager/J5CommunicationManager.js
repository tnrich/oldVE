/**
 * @class Teselagen.manager.J5CommunicationManager
 * Class describing a J5CommunicationManager.
 * J5CommunicationManager manages communication with the server.
 *
 * @author Diana Wong
 */
Ext.define("Teselagen.manager.J5CommunicationManager", {

    singleton: true,

    requires: [
        "Teselagen.bio.util.Sha256",
        "Teselagen.constants.Constants"
    ],

    statics: {
    },

    constructor: function() {
    },

    //================================================================
    // Generate j5 Ajax Request
    //================================================================

    /**
     * 
     */
    generateAjaxRequest: function() {
        console.log("Starting Ajax Request");

        var currentTab = Ext.getCmp('tabpanel').getActiveTab();
        var currentModel = currentTab.model;

        Ext.Ajax.request({
            url: sessionData.baseURL + 'executej5',
            params: {
                deProjectId: currentModel.data.id
            },
            success: function(response){
                var response = JSON.parse(response.responseText);
                var resultsGrid = Ext.getCmp('.plasmidsGrid');
                console.log(resultsGrid);
                //resultsGrid.update(response.files);
                //console.log(response);
                //location.href="data:application/zip;base64,"+response.data;
            }
        });

    }

});