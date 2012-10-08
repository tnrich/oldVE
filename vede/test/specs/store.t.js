/*global beforeEach, describe, expect, it*/
describe("Store tests.", function () {
    var store;
    beforeEach(function(){
        
    });
    it("Create store.", function() {
//        store = Ext.create("Teselagen.store.DeviceEditorProjectStore");
        store = Ext.create("Teselagen.store.ProjectStore");
    });
    it("Create panel with store", function() {
        Ext.widget("treepanel", {
               id: 'projectDesignPanel',
               title: 'Your Designs',
               rootVisible: false,
//               store: Ext.create('Vede.store.ProjectDesignStore'),
               store: Ext.create('Teselagen.store.ProjectStore'),
               viewConfig: {}
        });
    });
});

