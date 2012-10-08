/*global beforeEach, describe, expect, it, sandbox, setFixtures*/
describe("Draw component test", function () {
    beforeEach(function() {
        setFixtures(sandbox());
    });
    it("Sandbox exists", function () {
        expect(Ext.get("sandbox")).toBeTruthy();
    });
    it("Does not display in panel with viewbox=true", function() {
        var drawComponent = Ext.create("Ext.draw.Component", {
            items: [{
                type: "circle",
                fill: "#79BB3F",
                radius: 100,
                x: 100,
                y: 100
            }]
        });
        Ext.create("Ext.panel.Panel", {
            renderTo: "sandbox",
            items: [drawComponent]
        });
    });
    it("Displays in panel with viewbox=false", function() {
        var drawComponent = Ext.create("Ext.draw.Component", {
            viewBox: false,
            items: [{
                type: "circle",
                fill: "#79BB3F",
                radius: 100,
                x: 100,
                y: 100
            }]
        });
        Ext.create("Ext.panel.Panel", {
            renderTo: "sandbox",
            items: [drawComponent]
        });
    });
});
