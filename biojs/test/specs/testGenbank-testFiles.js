/**
 * Genbank: Testing real files
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.onReady(function() {

    describe("GENBANK REAL FILE PARSING TESTS: pTT15d_anti-huCB1_10D10.1_TTR3.gb", function() {

        describe("MarkDaris file: ", function() {
            var text, tmp;
            it("Opens and JSON.stringifies",function(){

                runs(function() {
                    flag = false;
                    tmp = null;

                    setTimeout(function() {
                        flag = true;
                    }, 20);
                });

                waitsFor(function() {
                    Ext.Ajax.request({
                        url:'../test/data/MarkDaris/pTT15d_anti-huCB1_10D10.1_TTR3.gb',
                        //url:'../test/data/MarkDaris/pTT15d_anti-huCB1_10D10.1_TTR3_ApE.gb',
                        //url:'../test/data/MarkDaris/ape.gb',
                        success: function(response) {
                            text = response.responseText;
                            //console.log(text);
                            //var genArr  = text.split(/[\r]+/g);
                            //for (var i=0 ; i < genArr.length; i++) {
                                //console.log(Teselagen.bio.parsers.GenbankManager.getLineKey(genArr[i]));
                            //}
                            tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(String(text));
                            
                        }
                    });
                    return flag;
                }, "Completed Reading file", 20);


                runs(function() {
                    // As an example of output, uncomment these two lines
                    console.log("RECONSTRUCTED GENBANK FILE\n" + tmp.toString());        
                    //console.log(JSON.stringify(tmp, null, "  "));
                    
                    expect(tmp.getKeywords().length).toBe(4);
                    // Can't verify this because of all the backslashes!!!!
                    //expect(tmp.findKeyword("LOCUS").getName()).toBe("pTT15d\\-\\VK1O2O12::[hu\\anti-<huCB1>\\10D10.1\\(huIgG2-TO\\desK)\\VH]::TTR3");
                    expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(7286);

                    expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(15);
                    expect(tmp.findKeyword("FEATURES").getFeaturesElements()[14].getFeatureQualifier().length).toBe(2);
                })

            });

        });


        xdescribe("", function() {
        });
    });
});