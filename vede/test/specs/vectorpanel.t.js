/*global beforeEach, describe, expect, it, sandbox, setFixtures*/
describe("VectorPanel test", function () {
    var pieCmp, railCmp, annotCmp, vecPanel, vePanel, annotPanel, pieCtr, railCtr, annotCtr, splitter;
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
                    console.log("resize");
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
            items: [vecPanel, splitter, annotPanel]
        });
        pieCtr.add(pieCmp);
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
});

