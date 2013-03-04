/**
 * PartLibrary controller
 * @class Vede.controller.PartLibraryController
 */
Ext.define("Vede.controller.PartLibraryController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.manager.ProjectManager", 'Teselagen.store.PartStore', 'Teselagen.models.Part'],
    partLibraryStore: null,
    partLibraryWindow: null,
    callbackFn: null,

    fetchPartLibrary: function() {

        var self = this;
        var loadingMsgBox = Ext.MessageBox.show({
            title: 'Loading Part',
            progressText: 'Loading Part Library',
            progress: true,
            width: 300,
            //renderTo: currentTabEl,
            closable: false
        });

        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("partLibrary", ''),
            method: 'GET',
            success: function(response) {

                loadingMsgBox.updateProgress(50 / 100, 50 + '% completed');

                response = JSON.parse(response.responseText);

                self.partLibraryStore = Ext.create('Teselagen.store.PartStore', {
                    model: 'Teselagen.models.Part',
                    data: response,
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json',
                            root: 'parts'
                        }
                    },
                    autoLoad: true
                });

                self.partLibraryWindow.down('grid').reconfigure(self.partLibraryStore);

                self.partLibraryWindow.show();
                loadingMsgBox.close();
            }
        });
    },

    onPartListSelected: function(grid,part,item) {
        console.log("Part selected");
        this.callbackFn(grid,part,item,this.partLibraryWindow);
    },

    onOpenPartLibrary: function(inCallbackFn) {
        console.log("Opening part Library");
        if (this.partLibraryWindow === null)
        {
            this.partLibraryWindow = Ext.create('Vede.view.PartLibraryWindow');
            this.partLibraryWindow.render(Ext.getCmp('mainAppPanel').getActiveTab().getEl());
        }
        this.fetchPartLibrary();
        this.callbackFn = inCallbackFn;
    },

    init: function() {

        this.control({
            '#partLibraryGridList': {
                itemclick: this.onPartListSelected
            }
        });

        this.partLibraryStore = Teselagen.manager.ProjectManager.partLibrary;

        this.callParent();
        //this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT, this.openProject, this);
        this.application.on("openPartLibrary", this.onOpenPartLibrary, this);

        //this.control({});
    }
});