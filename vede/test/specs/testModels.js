/**
 * Unit Tests
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");

Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");

Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.util.XmlToJson");
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.require("Teselagen.bio.parsers.ParsersManager");

Ext.require("Teselagen.utils.SequenceUtils");
Ext.require("Teselagen.utils.FormatUtils");
Ext.require("Teselagen.utils.DeXmlUtils");

Ext.onReady(function() {

    describe("Testing Teselagen.models", function() {

        describe("Teselagen.models.SequenceFile.js", function() {

            it("Creates Empty SequenceFile", function(){
                var part = Ext.create("Teselagen.models.PartVO");

                expect(part.isEqual(part)).toBe(true);
                expect(part.isEmpty()).toBe(true);

            });

            it("Creates SequenceFile", function(){
                var part = Ext.create("Teselagen.models.PartVO", {
                    name: "name1"
                });

                expect(part.isEqual(part)).toBe(true);
                expect(part.isEmpty()).toBe(false);

                //console.log(part);
            });

            it("Creates SequenceFile: setId()", function(){
                var part = Ext.create("Teselagen.models.PartVO", {
                    name: "name1"
                });
                expect(part.get("id").length).toBe(0);
                part.setId();
                expect(part.get("id").length).toBe(16); // Date.now() + 3 random digits
            });
        });        

        describe("Teselagen.models.PartVO.js", function() {

            it("Creates Empty PartVO", function(){
                var part = Ext.create("Teselagen.models.PartVO");

                expect(part.isEqual(part)).toBe(true);
                expect(part.isEmpty()).toBe(true);

            });

            it("Creates PartVO", function(){
                var part = Ext.create("Teselagen.models.PartVO", {
                    name: "name1"
                });

                expect(part.isEqual(part)).toBe(true);
                expect(part.isEmpty()).toBe(false);

                //console.log(part);
            });

            it("Creates PartVO: setId()", function(){
                var part = Ext.create("Teselagen.models.PartVO", {
                    name: "name1"
                });
                expect(part.get("id").length).toBe(0);
                part.setId();
                expect(part.get("id").length).toBe(16); // Date.now() + 3 random digits
            });
        });

        describe("Teselagen.models.Part.js", function() {

            it("Creates Empty Part", function(){
                var part = Ext.create("Teselagen.models.Part");

                expect(part.isEmpty()).toBe(true);

                console.log(part);
            });

            it("Creates Part", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    fas: "fas1"
                });

                expect(part.isEmpty()).toBe(false);
                expect(part.get("fas")).toBe("fas1");
            });

            it("Creates Part: setId()", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    fas: "fas1"
                });
                expect(part.get("id").length).toBe(0); //toBe(13); // Date.now()
                part.setId();
                expect(part.get("id").length).toBe(16); // Date.now() + 3 random digits
                console.log(part.get("id"));
            });
        });


        describe("Teselagen.models.EugeneRule.js", function() {

            it("Creates EugeneRule", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    name: "name1",
                    operand2: 123
                });
                expect(eugene).not.toBe(null);

                var flag = false;
                try {
                    eugene.setOperand2("bad string");
                } catch (e) {
                    flag = true;
                    console.log("Correctly caught: " + e.message);
                }
                expect(eugene.get("name")).toBe("name1");
                expect(eugene).not.toBe(null);
                expect(flag).toBe(true);

                //console.log(eugene);

            });
        });
        

        describe("Teselagen.models.SequenceFile.js", function() {

            it("Creates SequenceFile", function(){
                var tmp = Ext.create("Teselagen.models.SequenceFile");

                console.log(encodeURIComponent("GATTACA@#$%^&*()"));
                console.log(decodeURIComponent(encodeURIComponent("GATTACA@#$%^&*()")));
            });
        });


    });


});