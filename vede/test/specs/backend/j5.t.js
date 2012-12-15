/**
 * Testing J5 submission.
 * Creates models and converts to JSON for J5 server submission.
 * @author Rodrigo Pavez, Yuri Bendana
 */

/*global describe, it, expect */

Ext.require(["Teselagen.models.J5Parameters"]);

Ext.onReady(function () {
    describe("Test j5 Parameters", function () {
        var j5Parameters;

        it("Create J5Parameters", function () {

            j5Parameters = Ext.create("Teselagen.models.J5Parameters");
            j5Parameters.setDefaultValues();

        });

        it("Test getParametersAsArray", function () {
            var j5ParamsArray = j5Parameters.getParametersAsArray(true);
            for (var prop in j5ParamsArray) {
                expect(j5ParamsArray[prop]).toBeDefined();
            }
        });
    });
});