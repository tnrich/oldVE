/**
 * Unit Tests
 * @author Rodrigo Pavez
 */

Ext.require("Ext.Ajax");

Ext.require("Teselagen.constants.Constants");

Ext.onReady(function () {

    describe("Testing Teselagen.models", function () {


        describe("Teselagen.models.Project.js", function () {

            var proj;
            var newDeviceDesign;
            var newPart;

            it("Create Project", function () {
                proj = Ext.create("Teselagen.models.Project");
                expect(proj).not.toBe(null);
            });

            it("Set and get a ProjectName", function () {
                proj.set("ProjectName", "My example project");
                expect(proj.get("ProjectName")).toBe("My example project");
            });

            it("Set and get a DateCreated/DateModified", function () {
                var now = new Date();
                proj.set("DateCreated", now);
                expect(proj.get("DateCreated")).toBe(now);

                var d1 = new Date("October 13, 1975 11:13:00")
                proj.set("DateModified", d1);
                expect(proj.get("DateModified")).toBe(d1);
            });


            /*
             * @param {Teselagen.models.PartVO} partVO PartVO.
             * @param {Boolean} directionForward Direction forward.
             * @param {String} fas
             * @param {String} id ID is composed of the Date.toString + 4 random digits
             */


            it("Create a Part and add to Project", function () {
                var parts = proj.parts();
                newPart = Ext.create("Teselagen.models.Part", {
                    partVO: 'My New Part',
                    directionForward: true,
                    fas: ''
                });

                parts.add(newPart);
                parts.sync();
            });

            it("Check if DeviceEditorProject is in the array", function () {
                var parts = proj.parts();
                expect(parts.getAt(0)).toBe(newPart);
                console.log(Ext.ClassManager.getName((proj.parts())));
            });

            /*

        describe("Teselagen.models.DeviceEditorProject.js", function() {

            var design;

            it("Create DeviceDesign", function(){
                proj = Ext.create("Teselagen.models.DeviceDesign");
                expect(proj).not.toBe(null);
            });
        
            it("Set and get a ProjectName", function(){
                proj.set("ProjectName","My example project");
                expect(proj.get("ProjectName")).toBe("My example project");
            });

            it("Set and get a DateCreated/DateModified", function(){
                var now = new Date();
                proj.set("DateCreated",now);
                expect(proj.get("DateCreated")).toBe(now);

                var d1 = new Date("October 13, 1975 11:13:00")
                proj.set("DateModified",d1);
                expect(proj.get("DateModified")).toBe(d1);
            });
        });
*/


        });

    });
});