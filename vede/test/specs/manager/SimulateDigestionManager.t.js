/*
 * @author Yuri Bendana, Doug Hershberger
 */
/*global describe, it, expect*/

Ext.require(["Teselagen.manager.SimulateDigestionManager"]);

Ext.onReady(function() {
    var SimulateDigestionManager = Ext.create("Teselagen.manager.SimulateDigestionManager");
    describe("Simulate Digestion Manager", function() {
        it("Filters enzymes correctly", function() {
            var names = ["EcoRI", "EcoRV","EcoVIII", "M.EcoKDam", "BciVI", "BbvI", "BamHI"];
            var enzymes = [];
            for (var i=0; i < names.length; i++) {
                enzymes.push({name: names[i]});
            }
            var model = Ext.define("Teselagen.test.Enzyme", {
                extend:"Ext.data.Model",
                fields: ["name"]
            });
            var store = Ext.create("Ext.data.Store", {model:"Teselagen.test.Enzyme"});
            store.loadData(enzymes);
            SimulateDigestionManager.filterEnzymes("eco", store);
            expect(store.count()).to.equal(4);
            expect(store.getAt(0).get("name")).to.equal("EcoRI");
        });
    });
});