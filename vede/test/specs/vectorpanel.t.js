/*global beforeEach, describe, expect, it, sandbox, setFixtures*/
describe("VectorPanel test", function () {
    var pieCmp, pieCmpAuto, railCmp, annotCmp, vecPanel, vePanel, annotPanel, pieCtr, railCtr, annotCtr, splitter;
    var editPanel, dePanel, projPanel, viewport;
//    var onResize;
    beforeEach(function() {
        setFixtures(sandbox());
        pieCmp = Ext.widget("draw", {
            width: 100,
            items: [{
                type: "circle",
                x: 100,
                y: 100,
                radius: 50,
                stroke: "black"
            }]
        });
        pieCmpAuto = Ext.widget("draw", {
            width: 100,
            autoSize: true,
            viewBox: false,
            items: [{
                type: "circle",
                x: 100,
                y: 100,
                radius: 50,
                stroke: "black"
            }]
        });
        railCmp = Ext.widget("draw", {
            width: 100,
            items: [{
                type: "circle",
                x: 100,
                y: 100,
                radius: 50,
                stroke: "red"
            }]
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
        pieCtr = Ext.widget("container", {
//            width: 100,
            layout: {
                type: "fit"
            }
        });
        railCtr = Ext.widget("container", {
//           width: 100,
           layout: {
                type: "fit"
            }
          });
        annotCtr = Ext.widget("container", {
          });
        vecPanel = Ext.widget("panel", {
            flex: 1,
            layout: "hbox",
            items: [pieCtr, railCtr],
            listeners: {
                resize: function() {
//                    console.log("resize");
                }
            }

        });
        splitter = Ext.widget("splitter");
        annotPanel = Ext.widget("panel", {
            flex: 1,
            layout: {
                type: "fit"
            },
            items: [annotCtr]
        });
        vePanel = Ext.widget("panel", {
            height: 400,
            layout: "hbox",
            align: "stretch",
            items: [vecPanel, splitter, annotPanel]
        });
        pieCtr.add(pieCmp);
//        pieCtr.add(pieCmpAuto);
        railCtr.add(railCmp);
        annotCtr.add(annotCmp);
        dePanel = Ext.widget("panel", {
           items: [
               {
                   xtype:"container"
               }
           ]
        });
        editPanel = Ext.widget("tabpanel", {
            items: [vePanel, dePanel],
            region: "center",
            height: 400,
            flex: 6
        });
        projPanel = Ext.widget("treepanel", {
            region: "west",
            height: 400,
            flex:1
        });
        viewport = Ext.widget("panel", {
            height: 500,
            layout: "border",
            items: [projPanel, editPanel],
            renderTo: "sandbox"
        });
    });
    it("Sandbox exists", function () {
        expect(Ext.get("sandbox")).toBeTruthy();
    });
    it("Resize containers", function() {
        pieCtr.setSize(400,400);
        railCtr.setSize(400,400);
    });
    it("Resize and hide", function() {
        pieCtr.setSize(400,400);
        railCtr.hide();
    });
    it("Add sprite", function() {
        Ext.create("Ext.draw.Sprite", {
            type: "circle",
            x: 150,
            y: 100,
            radius: 25,
            stroke: "green",
            surface: pieCmp.surface
        }).show(true);
        pieCtr.doLayout();
        //        console.log(pieCmp.surface.items.getCount());
    });
    it("Add composite sprite and set draw component size", function() {
        pieCmp.surface.removeAll(true);
        var yellow = Ext.create("Ext.draw.Sprite", {
            id: "yellow",
            type: "circle",
            x: 100,
            y: 100,
            radius:50,
            stroke: "yellow",
            surface: pieCmp.surface
        });
        var green = Ext.create("Ext.draw.Sprite", {
            id: "green",
            type: "circle",
            x: 150,
            y: 100,
            radius: 25,
            stroke: "green",
            surface: pieCmp.surface
        });
        var red = Ext.create("Ext.draw.Sprite", {
            id: "red",
            type: "circle",
            x: 50,
            y: 100,
            radius: 25,
            stroke: "red",
            surface: pieCmp.surface
        });
        var gid = Ext.create("Ext.draw.CompositeSprite", {
            surface: pieCmp.surface
        });
        gid.add(yellow);
        gid.add(green);
        gid.add(red);
        gid.show(true);
        var bbox = gid.getBBox(); console.log(bbox);
        pieCmp.setSize(bbox.width, bbox.height);
    });
    it("Add composite sprite and set viewbox size", function() {
        pieCmp.surface.removeAll(true);
        var yellow = Ext.create("Ext.draw.Sprite", {
            id: "yellow",
            type: "circle",
            x: 100,
            y: 100,
            radius:50,
            stroke: "yellow",
            surface: pieCmp.surface
        });
        var green = Ext.create("Ext.draw.Sprite", {
            id: "green",
            type: "circle",
            x: 150,
            y: 100,
            radius: 25,
            stroke: "green",
            surface: pieCmp.surface
        });
        var red = Ext.create("Ext.draw.Sprite", {
            id: "red",
            type: "circle",
            x: 50,
            y: 100,
            radius: 25,
            stroke: "red",
            surface: pieCmp.surface
        });
        var gid = Ext.create("Ext.draw.CompositeSprite", {
            surface: pieCmp.surface
        });
        gid.add(yellow);
        gid.add(green);
        gid.add(red);
        gid.show(true);
        var bbox = gid.getBBox();
        pieCmp.surface.setViewBox(bbox.x, bbox.y, bbox.width, bbox.height);
    });
});

