/*global beforeEach, describe, expect, it, sandbox, setFixtures*/
describe("Menu test", function () {
    var btn;
    beforeEach(function() {
        setFixtures(sandbox());
        btn = Ext.widget("filefield", {
            buttonOnly: true,
//            name: 'importedFile',
            buttonConfig: {
//                border: false,
                text: 'Import'
            },
            listeners: {
                "change": function(pThis, pVal, pOpts) {
                    console.log("value:", pVal)
                }
            }
        });
    });
    it("Sandbox exists", function () {
        expect(Ext.get("sandbox")).toBeTruthy();
    });
    it("Show menu", function() {
        Ext.widget("menu", {
            renderTo: "sandbox",
            width: 100,
//            floating: false,
            hidden: false,
            showSeparator: true,
            items: [
                btn,
                {
                    text: "regular item 2",
                },{
                    text: "regular item 3",
                }]
        });
    });
    it("Show toolbar", function() {
        Ext.widget("toolbar", {
            renderTo: "sandbox",
            width: 300,
            items: [
                btn,
                {
                    text: "regular item 2",
                },{
                    text: "regular item 3",
            }]
        });
    });
});