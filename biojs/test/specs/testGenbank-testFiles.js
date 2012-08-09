/**
 * Genbank: Testing real files
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.onReady(function() {

    describe("Opening Problematic Genbank Files: ", function() {

        describe("MarkDaris file: ", function() {
            var text, tmp;
            it("Opens and JSON.stringifies: pTT15d_anti-huCB1_10D10.1_TTR3.gb",function(){

                runs(function() {
                    flag = false;
                    tmp = null;

                    setTimeout(function() {
                        flag = true;
                    }, 30);
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
                }, "Completed Reading file", 30);


                runs(function() {
                    // As an example of output, uncomment these two lines
                    console.log("RECONSTRUCTED DARIS FILE: pTT15d_anti-huCB1_10D10.1_TTR3.gb\n" +
                        "==================================================\n" + 
                        tmp.toString());        
                    console.log("JSON DARIS FILE: pTT15d_anti-huCB1_10D10.1_TTR3.gb" +
                        "\n==================================================\n" + 
                        JSON.stringify(tmp, null, "  "));
                    
                    expect(tmp.getKeywords().length).toBe(4);
                    // Can't verify this because of all the backslashes!!!!
                    //expect(tmp.findKeyword("LOCUS").getName()).toBe("pTT15d\\-\\VK1O2O12::[hu\\anti-<huCB1>\\10D10.1\\(huIgG2-TO\\desK)\\VH]::TTR3");
                    expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(7286);

                    expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(15);
                    expect(tmp.findKeyword("FEATURES").getFeaturesElements()[14].getFeatureQualifier().length).toBe(2);
                })
            });

        });

        describe("Simon Bredl file: ", function() {
            var text, tmp;
            it("Opens and JSON.stringifies: GentR-Casette.gbk",function(){

                runs(function() {
                    flag = false;
                    tmp = null;

                    setTimeout(function() {
                        flag = true;
                    }, 30);
                });

                waitsFor(function() {
                    Ext.Ajax.request({
                        url:'../test/data/sbredl/GentR-Casette.gbk',
                        success: function(response) {
                            text = response.responseText;
                            tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(String(text));
                            
                        }
                    });
                    return flag;
                }, "Completed Reading file", 30);


                runs(function() {
                    console.log("ORIGINAL SBREDL FILE: GentR-Casette.gbk\n" + 
                        "==================================================\n" + 
                        text);     

                    // As an example of output, uncomment these two lines
                    console.log("RECONSTRUCTED SBREDL FILE: GentR-Casette.gbk\n" + 
                        "==================================================\n" + 
                        tmp.toString());       
                    console.log("JSON SBREDL FILE: GentR-Casette.gbk\n" + 
                        "==================================================\n" + 
                        JSON.stringify(tmp, null, "  "));
                    
                    expect(tmp.getKeywords().length).toBe(3);
                    // Can't verify this because of all the backslashes!!!!
                    expect(tmp.findKeyword("LOCUS").getLocusName()).toBe("GentR");
                    expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(761);

                    expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(1);
                    expect(tmp.findKeyword("FEATURES").getFeaturesElements()[0].getFeatureQualifier().length).toBe(1);
                })
            });

            it("Opens and JSON.stringifies: TN7R.gbk",function(){

                runs(function() {
                    flag = false;
                    tmp = null;

                    setTimeout(function() {
                        flag = true;
                    }, 30);
                });

                waitsFor(function() {
                    Ext.Ajax.request({
                        url:'../test/data/sbredl/TN7R.gbk',
                        success: function(response) {
                            text = response.responseText;
                            tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(String(text));
                            
                        }
                    });
                    return flag;
                }, "Completed Reading file", 30);


                runs(function() {
                    console.log("ORIGINAL SBREDL FILE: TN7R.gbk\n" + 
                        "==================================================\n" + 
                        text);
                    // As an example of output, uncomment these two lines
                    console.log("RECONSTRUCTED SBREDL FILE\n" + 
                        "==================================================\n" + 
                        tmp.toString());       
                    console.log("RECONSTRUCTED SBREDL FILE: TN7R.gbk\n" + 
                        "==================================================\n" + 
                        JSON.stringify(tmp, null, "  "));
                    
                    expect(tmp.getKeywords().length).toBe(3);
                    // Can't verify this because of all the backslashes!!!!
                    expect(tmp.getLocus().getLocusName()).toBe("TN7R");
                    expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(265);

                    expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(1);
                    expect(tmp.findKeyword("FEATURES").getFeaturesElements()[0].getFeatureQualifier().length).toBe(1);
                })

            });

        });

        xdescribe("", function() {
        });
    });
});