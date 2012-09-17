/*global beforeEach, describe, expect, it, sandbox, setFixtures*/
describe("Event test.", function () {
    var vecPanel;
//    var onResize;
    beforeEach(function() {
        setFixtures(sandbox());
        vecPanel = Ext.widget("panel", {
            id: "event-vecPanel",
            title: "vecPanel",
            height: 400,
            renderTo: "sandbox",
            layout: "hbox",
            listeners: {
                click: function() {
                    console.log("click");
                }
            },
            items: [
                {
                    xtype: "panel",
                    width: 200,
                    height: 200,
//                    flex: 1,
//                    resizable: true,
//                    resizeHandles: "e",
                    listeners: {
//                        afterlayout: function() {
//                            console.log("afterlayout");
//                        },
//                        afterrender: function() {
//                            console.log("afterrender");
//                        },
//                        beforerender: function() {
//                            console.log("beforerender");
//                        },
//                        click: function() {
//                            console.log("click");
//                        },
//                        render: function() {
//                            console.log("render");
//                        },
                        resize: function() {
                            console.log("resize");
                        }
                    }
                },
                {
                    xtype: "splitter"
                },
                {
                    xtype: "panel",
//                    flex: 1,
//                    resizable: true,
//                    resizeHandles: "w",
                    width: 200,
                    height: 200
                }
            ]
        });
//        onResize = function(pTarget, pWidth, pHeight, pOldWidth, pOldHeight, pOpts) {
//            console.log("resize:", pTarget, pWidth, pHeight, pOldWidth, pOldHeight, pOpts);
//        };
//        vecPanel.on("resize", onResize);
    });
    it("Sandbox exists", function () {
        expect(Ext.get("sandbox")).toBeTruthy();
    });
});

