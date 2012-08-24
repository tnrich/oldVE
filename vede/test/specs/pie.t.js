/*globals beforeEach, describe, expect, Ext, it, sandbox, setFixtures*/
describe('Pie test', function () {
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
        pieContainer = Ext.widget('container', {
            renderTo: 'sandbox',
            layout: {
                //type: 'fit'
                //type: 'column'
            }
        });
    });
    it("Sandbox exists", function () {
        expect(Ext.get("sandbox")).toBeTruthy();
    });
    it("Show Pie", function() {
        expect(pie.hidden).toBe(false);
        pie.show();
        pieContainer.add(pie);
        expect(pie.hidden).toBe(false);
        console.log(pie.width);
        //pie.width=100;
        pieContainer.doLayout();
        console.log(pie);
    });
});


