/*global beforeEach, describe, expect, it, sandbox, setFixtures*/
describe("Hbox test", function () {
    var drawCmp1, drawCmp2, panel;
    beforeEach(function() {
        setFixtures(sandbox());
        drawCmp1 = Ext.widget("draw", {
            autoSize: true,
            viewBox: false,
            items: [{
                type: "circle",
                x: 100,
                y: 100,
                radius: 100,
                stroke: "black"
            }]
        });
        drawCmp2 = Ext.widget("draw", {
            autoSize: true,
            viewBox: false,
            items: [{
                type: "circle",
                x: 100,
                y: 100,
                radius: 100,
                stroke: "red"
            }]
        });
        panel = Ext.create("Ext.Panel", {
            width: 500,
            height: 300,
            title: "HBoxLayout Panel",
            layout: {
                type: "hbox"
//                align: "stretch"
            },
            renderTo: "sandbox",
            items: [{
                xtype: "component",
                html: "Inner Panel One",
                width: 100
//                flex: 2
            },{
                xtype: "component",
                html: "Inner Panel Two",
                width: 100
//                flex: 1
            },{
                xtype: "component",
                html: "Inner Panel Three",
                width: 100
//                flex: 1
            }]
        });
    });
    it("Sandbox exists", function () {
        expect(Ext.get("sandbox")).toBeTruthy();
    });
    it("Resize inner panel1", function() {
        panel.items.first().setSize(50, 200);
    });
});
