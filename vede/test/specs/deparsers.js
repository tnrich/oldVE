/**
 * Testing DE Parsers
 * Tests XML and JSON Parsers
 * @author Rodrigo Pavez
 */

Ext.require("Ext.Ajax");

Ext.require("Teselagen.manager.DeviceDesignParsersManager");

Ext.require("Teselagen.constants.Constants");
Ext.require("Teselagen.constants.SBOLIcons");


Ext.onReady(function() {


    describe("Testing JSON Test Designs", function() {

        var JSONTests = [
            "data/dejson/Combinatorial_Golden_Gate_example_parsed.json",
            "data/dejson/Combinatorial_SLIC_Gibson_CPEC_example_parsed.json",
            "data/dejson/DeviceEditor_example.json",
            "data/dejson/dexml_parsed.json",
            //"data/dejson/dexml_raw.json",
            "data/dejson/Golden_Gate_example_idented_simplified.json",
            "data/dejson/Golden_Gate_example_parsed.json",
            "data/dejson/Golden_Gate_example.json",
            "data/dejson/SLIC_Gibson_CPEC_example_parsed.json",
            "../resources/examples/SLIC_Gibson_CPEC.json",
            "../resources/examples/Combinatorial_Golden_Gate.json",
            "../resources/examples/Golden_Gate.json",
            "../resources/examples/SLIC_Gibson_CPEC.json"
        ];


        var designs = [];
        var flag = false;

        it("Loading files and executing parser", function() {

            runs(function() {

                var tests = JSONTests.length;
                //console.log("tests:"+tests);

                for (var testIndex in JSONTests) {
                    var testFile = JSONTests[testIndex];
                    Ext.Ajax.request({
                        url: testFile,
                        method: "GET",
                        success: function(response) {
                            //console.log(JSON.parse(response.responseText));
                            Teselagen.manager.DeviceDesignParsersManager.parseJSON(response.responseText,

                            function(design) {
                                tests--;
                                designs.push({name:response.request.options.url,design:design});
                                if (tests === 0) flag = true;
                                //console.log(flag);
                            });
                        }
                    });

                }

            });

            waitsFor(function() {
                return flag;
            }, "The call is done", 100000);

            runs(function() {
                expect(true).toEqual(true);
            });

        });

        it("Checking designs integrity", function() {

            waitsFor(function() {
                return flag;
            }, "The call is done", 100000);

            runs(function() {
                dirtyRecordFlag = false;
                for (var designIndex in designs) {
                    design = designs[designIndex].design;
                    console.log("Testing: "+designs[designIndex].name);
                    if (!design.dirty) {
                        console.log("Test passed");
                    }
                    else {
                        console.log("Test NOT passed"); 
                        console.log(design);
                        dirtyRecordFlag = true; 
                    }
                }
                expect(dirtyRecordFlag).toBe(false);
            });
        });
    });
    

    describe("Testing XML Test Designs", function() {

        var XMLTests = [
            "data/dexml/cgg_demo.xml",
            "data/dexml/Combinatorial_Golden_Gate_example.xml",
            "data/dexml/Combinatorial_SLIC_Gibson_CPEC_example.xml",
            "data/dexml/DeviceEditor_example.xml",
            "data/dexml/DeviceEditor_forTest.xml",
            "data/dexml/Golden_Gate_example.xml",
            "data/dexml/SLIC_Gibson_CPEC_example.xml"
            ];


        var designs = [];
        var flag = false;

        it("Loading files and executing parser", function() {

            runs(function() {

                var tests = XMLTests.length;
                //console.log("tests:"+tests);

                for (var testIndex in XMLTests) {
                    var testFile = XMLTests[testIndex];
                    Ext.Ajax.request({
                        url: testFile,
                        method: "GET",
                        success: function(response) {
                            Teselagen.manager.DeviceDesignParsersManager.parseXML(response.responseText,

                            function(design) {
                                tests--;
                                //console.log(tests);
                                designs.push({name:response.request.options.url,design:design});
                                if (tests === 0) flag = true;
                                //console.log(flag);
                            });
                        }
                    });

                }

            });

            waitsFor(function() {
                return flag;
            }, "The call is done", 100000);

            runs(function() {
                expect(true).toEqual(true);
            });

        });

        it("Checking designs integrity", function() {

            waitsFor(function() {
                return flag;
            }, "The call is done", 100000);

            runs(function() {
                dirtyRecordFlag = false;
                for (var designIndex in designs) {
                    design = designs[designIndex].design;
                    console.log("Testing: "+designs[designIndex].name);
                    if (!design.dirty) {
                        console.log("Test passed");
                    }
                    else {
                        dirtyRecordFlag = true; 
                        console.log("Test NOT passed"); 
                    }
                }
                expect(dirtyRecordFlag).toBe(false);
            });
        });
    });

});