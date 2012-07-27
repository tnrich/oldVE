/**
 * Integrative Tests
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.onReady(function() {

    describe("GENBANK PARSER TESTING:", function() {

        describe("MarkDaris", function() {
            var text, tmp;
            it("opens",function(){

                runs(function() {
                    flag = false;
                    tmp = null;

                    setTimeout(function() {
                        flag = true;
                    }, 20);
                });

                waitsFor(function() {
                    Ext.Ajax.request({
                        //url:'../test/data/MarkDaris/pTT15d_anti-huCB1_10D10.1_TTR3.gb',
                        //url:'../test/data/MarkDaris/pTT15d_anti-huCB1_10D10.1_TTR3_ApE.gb',
                        url:'../test/data/MarkDaris/ape.gb',
                        success: function(response) {
                            text = response.responseText;
                            console.log(text);
                            var genArr  = text.split(/[\n]+|[\r]+/g);
                            for (var i=0 ; i < genArr.length; i++) {
                                console.log(genArr[i]);
                            }
                            //tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(text);
                            // As an example of output, uncomment these two lines
                            //console.log("RECONSTRUCTED GENBANK FILE\n" + tmp.toString());
                            //console.log(JSON.stringify(tmp, null, "  "));
                        }
                    });
                    return flag;
                }, "Completed Reading file", 50);


                runs(function() {
                    //expect(tmp.findKeyword("LOCUS").toString()).toBe("LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012");
                    //expect(tmp.getKeywords().length).toBe(7);
                    //expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(19);
                })

            });

        });


        describe("", function() {
        });
    });
});