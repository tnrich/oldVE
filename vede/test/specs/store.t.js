/*
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
               store: store,
               viewConfig: {}
        });
    });
});
*/

/**
 * Unit Tests
 */

Ext.require("Ext.Ajax");

Ext.require("Teselagen.constants.Constants");
Ext.require("Teselagen.store.ProjectStore");

Ext.onReady(function() {

    describe("Store tests - ", function() {

        describe("Create Project Store", function() {

            var store;

            it("Create Project Store", function(){
                store = Ext.create("Teselagen.store.ProjectStore");
                expect(store).not.toBe(null);
            });
        
            it("Load the data", function(){
                store.load();
                expect(store.getTotalCount()).toBe(2);
            });

            it("Load Nested Data", function(){
                var firstRecord = store.data.items[0];
                //console.log(firstRecord);
                var parts = firstRecord.parts();
                console.log(parts);
                
                store.load({
                  params: {
                    group: 3,
                    type: 'user'
                  },
                  callback: function(records, operation, success){
                    //console.log("Nested data loaded");
                    //console.log(success);
                    //console.log(records);
                  },
                  scope: this
                });
                
            });

            
        });

    });
});