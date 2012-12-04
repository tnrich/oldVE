/**
 * @class Teselagen.manager.J5CommunicationManager
 * Class describing a J5CommunicationManager.
 * J5CommunicationManager manages communication with the server.
 *
 * @author Rodrigo Pavez, Diana Wong
 */
Ext.define("Teselagen.manager.J5CommunicationManager", {

    singleton: true,

    currentResults: null,

    requires: ["Teselagen.bio.util.Sha256", "Teselagen.constants.Constants", "Ext.data.Store"],

    statics: {},

    j5Parameters: null,

    masterFiles: null,

    constructor: function () {},

    //================================================================
    // Generate j5 Ajax Request
    //================================================================
    /**
     *
     */
    generateAjaxRequest: function () {
        console.log("Starting Ajax Request");

        var deproject = Ext.getCmp('mainAppPanel').getActiveTab().model;

        var self = this;
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("executej5", ''),
            params: {
                deProjectId: deproject.data.id,
                parameters: JSON.stringify(this.j5Parameters),
                masterFiles: JSON.stringify(this.masterFiles)
            },
            success: function (response) {
                var response = JSON.parse(response.responseText);
                
                self.currentResults = response;

                var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
                var resultsGrid = currentTab.j5Window.query('gridpanel[title=Plasmids]')[0];
                var downloadBtn = currentTab.j5Window.query('button[cls=downloadj5Btn]')[0];
                var runj5Btn = currentTab.j5Window.query('button[cls=runj5Btn]')[0];

                var store = new Ext.data.JsonStore({
                    proxy: {
                        type: 'memory',
                        data: response,
                        reader: {
                            type: 'json',
                            root: 'files',
                        }
                    },

                    fields: ['name','data','size']
                });
                store.load();
                resultsGrid.reconfigure(store);
                downloadBtn.show();
                runj5Btn.toggle();

                deproject.j5runs().load({
                    callback : function(runs){
                        console.log(runs);
                    }
                });

            }
        });
        
    },
    downloadResults: function (btn) {
        if(this.currentResults) location.href="data:application/zip;base64,"+this.currentResults.data;
        btn.toggle();
    },
    setParameters: function(j5Parameters,masterFiles){
        this.j5Parameters = j5Parameters.getParametersAsArray(true);
        this.masterFiles = masterFiles;
    }

});