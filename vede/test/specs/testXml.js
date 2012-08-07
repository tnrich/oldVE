describe("Test loading of xml", function() {
    var myStore;
    beforeEach(function() {
       Ext.define("Seq", {
           extend: "Ext.data.Model",
           fields: [
                    "seq|name" 
                    ]
       });
       myStore = Ext.create('Ext.data.Store', {
           model: 'Seq',
           proxy: {
               type: 'ajax',
               url: '/biojs/test/data/jbeiseq/test.xml',
               reader: {
                   type: 'xml',
                   //root: 'seq:seq',
//                   record: 'seq',
                   record: 'seq|seq',
               }
           },
           autoLoad: true
       });
    });
   it("Test store", function() {
       expect(myStore.data.length).toBeGreaterThan(0);
   })
});