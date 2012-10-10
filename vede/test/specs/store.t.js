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
            var value,flag;

            it("Create Project Store", function(){
                store = Ext.create("Teselagen.store.ProjectStore");
                expect(store).not.toBe(null);
            });
        
            it("Load the data", function(){
            
              runs(function() {
                    flag = false;
                    store.load({
                        scope: this,
                        callback: function(records, operation, success) {
                            flag = true;
                        }
                    });
                    setTimeout(function() {
                      flag = true;
                    }, 500);
              });

              waitsFor(function() {return flag;}, "The json should be loaded", 750);


              runs(function() {
                    expect(store.getTotalCount()).toBe(2);
              });

            });

            
            it("Load Nested Data", function(){
                var firstRecord = store.data.items[0];
                console.log(firstRecord);
                var parts = firstRecord.parts();

                if(parts.isLoading()) {
                    console.log('Parts are loading');
                }
                parts.on('load', function() {
                    console.log('Parts Loaded');
                    parts.clearFilter();
                    var firstPart = parts.data.items[0];
                    console.log(firstPart);
                });
                
            });
            
            
        });

    });
});