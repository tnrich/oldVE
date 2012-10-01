/*global beforeEach, describe, expect, it, sandbox, setFixtures*/
describe("Panel test", function () {
    var drawCmp, panel;
    beforeEach(function() {
        setFixtures(sandbox());
        drawCmp = Ext.widget("draw", {
            viewBox: false,
            items: [{
                type: "circle",
                x: 100,
                y: 100,
                radius: 50,
                stroke: "black"
            }]
        });
        panel = Ext.widget("panel", {
            width: 100,
            height: 100,
            autoScroll:true,
            renderTo: "sandbox",
            items: [drawCmp]
        });
    });
    it("Sandbox exists", function () {
        expect(Ext.get("sandbox")).toBeTruthy();
    });
});
