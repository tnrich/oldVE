/*global beforeEach, describe, expect, it, sandbox, setFixtures*/
describe("New VectorPanel test.", function () {
    var pieCmp, pie, railCmp, annotCmp, rail, splitter;
    var vecPanel, annotPanel, vePanel;
    beforeEach(function() {
        setFixtures(sandbox());
        pie = Ext.create("Ext.draw.Sprite", {
            type: "circle",
            x: 100,
            y: 100,
            radius: 50,
            stroke: "black"
        });
        rail = Ext.create("Ext.draw.Sprite", {
            type: "circle",
            x: 100,
            y: 100,
            radius: 50,
            stroke: "red"
        });
        pieCmp = Ext.widget("draw", {
            width: 100,
            items: [pie]
        });
        railCmp = Ext.widget("draw", {
            width: 100,
            items: [rail]
        });
        annotCmp = Ext.widget("draw", {
            width: 100,
            items: [{
                type: "circle",
                x: 100,
                y: 100,
                radius: 50,
                stroke: "blue"
            }]
        });
        splitter = Ext.widget("splitter");
        vecPanel = Ext.widget("panel", {
            layout: "hbox",
            flex: 1,
            items: [pieCmp, railCmp],
            listeners: {
                resize: function() {
                    console.log("resize");
                }
            }
        });
        annotPanel = Ext.widget("panel", {
            flex: 1
        });
        vePanel = Ext.widget("panel", {
            height: 400,
            renderTo: "sandbox",
            layout: "hbox",
//            align: "stretchmax",
            items: [vecPanel, splitter, annotPanel]
        });
        annotPanel.add(annotCmp);
    });
    it("Sandbox exists", function () {
        expect(Ext.get("sandbox")).toBeTruthy();
    });
    it("Set pie size, hide rail", function() {
        vecPanel.setHeight(vePanel.getHeight());
        pieCmp.setSize(vecPanel.getWidth(),vecPanel.getHeight());
        railCmp.hide();
    });
});
