/*global beforeEach, describe, expect, it, sandbox, setFixtures*/
describe("Pie test.", function () {
    var pie, pieContainer, pieManager, box;
    beforeEach(function() {
        box = sandbox();
        setFixtures(box);
        pieManager = Ext.create("Teselagen.manager.PieManager", {
            center: {x: 100, y: 100},
            railRadius: 100,
            showCutSites: false,
            showFeatures: false,
            showOrfs: false
        });
        pie = pieManager.getPie();
        pieContainer = Ext.widget("container", {
            renderTo: "sandbox"
//            layout: {
//                type: 'fit'
//            }
        });
    });
    it("Sandbox exists.", function () {
        expect(Ext.get("sandbox")).toBeTruthy();
    });
    it("Surface does not exist before rendering.", function() {
        expect(pie.surface).toBeUndefined();
    });
    it("Add Pie to Container and Surface now exists.", function() {
        pieContainer.add(pie);
        expect(pie.surface).toBeDefined();
    });
});


