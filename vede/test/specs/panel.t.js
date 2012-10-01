/*global beforeEach, describe, expect, it, sandbox, setFixtures*/
describe("Panel test", function () {
    var drawCmp, ctr, red;
    var vecPanel, vePanel, annotPanel, splitter, dePanel, editPanel, projPanel, viewport;
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
        red = Ext.widget("draw", {
            viewBox: false,
            items: [{
                type: "circle",
                x: 100,
                y: 100,
                radius: 50,
                stroke: "red"
            }]
        });
        ctr = Ext.widget("container", {
        });
        ctr.add(drawCmp);
        vecPanel = Ext.widget("panel", {
            width: 100,
            height: 100,
            autoScroll:true,
            items: [red]
        });
        splitter = Ext.widget("splitter");
        annotPanel = Ext.widget("panel", {
            width: 100,
            height: 100,
            autoScroll:true,
            items: [ctr]
        });
        vePanel = Ext.widget("panel", {
            layout: "hbox",
            items: [vecPanel, splitter, annotPanel]
        });
        dePanel = Ext.widget("panel", {
            items: [
                {
                    xtype:"container"
                }
            ]
        });
        editPanel = Ext.widget("tabpanel", {
            items: [vePanel, dePanel],
            flex: 6
        });
        projPanel = Ext.widget("treepanel", {
            flex:1
        });

    });
    it("Sandbox exists", function () {
        expect(Ext.get("sandbox")).toBeTruthy();
    });
    it("Put draw component in panel", function () {
        Ext.widget("panel", {
            width: 100,
            height: 100,
            autoScroll:true,
            renderTo: "sandbox",
            items: [drawCmp]
        });
    });
    it("Put draw component in container first", function () {
        Ext.widget("panel", {
            width: 100,
            height: 100,
            autoScroll:true,
            renderTo: "sandbox",
            items: [ctr]
        });
    });
    it("Put panel within a panel", function() {
        Ext.widget("panel", {
            renderTo: "sandbox",
            items: [vecPanel]
        });
    });
    it("Put panels within a panel using hbox", function() {
        Ext.widget("panel", {
            layout: "hbox",
            renderTo: "sandbox",
            items: [vecPanel, splitter, annotPanel]
        });
    });
    it("Put panels in a tab panel", function() {
        Ext.widget("tabpanel", {
            layout: "hbox",
            renderTo: "sandbox",
            items: [vePanel, dePanel]
        });
    });
    it("Full layout using hbox", function() {
        viewport = Ext.widget("panel", {
            height: 300,
            layout: "hbox",
            items: [projPanel, editPanel],
            renderTo: "sandbox"
        });
    });
    it("Full layout using border", function() {
        projPanel.region="west";
        editPanel.region="center";
        viewport = Ext.widget("panel", {
            height: 300,
            layout: "border",
            items: [projPanel, editPanel],
            renderTo: "sandbox"
        });
    });
});
