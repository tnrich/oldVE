/*global beforeEach, describe, expect, it*/
describe("Store tests.", function () {
    var store;
    beforeEach(function(){
        
    });
    it("Create store.", function() {
        store = Ext.create("Teselagen.store.DeviceEditorProjectStore");
    });
    it("Create panel with store", function() {
        Ext.widget("treepanel", {
               id: 'projectDesignPanel',
               title: 'Your Designs',
               rootVisible: false,
               store: Ext.create('Teselagen.store.DeviceEditorProjectStore'),
               viewConfig: {}
        });
    });
});

