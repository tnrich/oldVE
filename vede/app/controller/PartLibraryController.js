/**
 * PartLibrary controller
 * @class Vede.controller.PartLibraryController
 */
Ext.define("Vede.controller.PartLibraryController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.DeviceEvent", 
               "Teselagen.manager.ProjectManager", 
               "Teselagen.store.PartStore", 
               "Teselagen.models.Part"],
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
            renderTo: Ext.getCmp('mainAppPanel').getActiveTab().getEl(),
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

                // Filter the parts store so only mapped parts will appear (per
                // Nathan's request in ticket #869).
                self.partLibraryStore.filterBy(function(part) {
                    return part.isMapped();
                });

                self.partLibraryWindow.show();
                self.partLibraryWindow.down('grid').reconfigure(self.partLibraryStore);

                loadingMsgBox.close();
            }
        });
    },

    onPartListSelected: function(grid,part,item) {
        console.log("Part selected");
        console.log(part.get('name'));
        console.log("Validating...");
        Vede.application.fireEvent(this.DeviceEvent.VALIDATE_DUPLICATED_PART_NAME, part, part.get('name'));
        this.callbackFn(grid,part,item,this.partLibraryWindow);
    },

//    onOpenPartLibrary: function(inCallbackFn) {
//        //console.log("Opening part Library");
//        if (this.partLibraryWindow === null)
//        {
//            this.partLibraryWindow = Ext.create('Vede.view.PartLibraryWindow');
//            this.partLibraryWindow.render(Ext.getCmp('mainAppPanel').getActiveTab().getEl());
//        }
//        this.fetchPartLibrary();
//        this.callbackFn = inCallbackFn;
//    },

    init: function() {
        this.DeviceEvent = Teselagen.event.DeviceEvent;

        this.control({
            '#partLibraryGridList': {
                itemclick: this.onPartListSelected
            }
        });

        this.partLibraryStore = Teselagen.manager.ProjectManager.parts;

        //this.application.on(this.DeviceEvent.OPEN_PART_LIBRARY, this.onOpenPartLibrary, this);

        this.callParent();
    }
});
