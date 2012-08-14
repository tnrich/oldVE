/**
 * Genbank: Testing real files
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.onReady(function() {
    var LOG = true;

    loadGenbankFile = function(url) {
        var gb, text;
        Ext.Ajax.request({
            url: url,
            async: false,
            disableCaching: true,
            success: function(response) {
                text = response.responseText;
                gb  = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(String(text));
            },
            failure: function(response, opts) {
                console.warn('Could not load: ' + url + '\nServer-side failure with status code ' + response.status);
            }
        });
        return gb;
    };

    logGenbank = function(name, url, gb) {
        console.log("RECONSTRUCTED " + name + " File: " + url + "\n" +
            "==================================================\n" + 
            gb.toString());
        console.log("JSON " + name + " FILE: " + url + "\n" +
            "\n==================================================\n" + 
            JSON.stringify(gb, null, "  "));
    };

    describe("Opening Problematic Genbank Files: ", function() {

        describe("MarkDaris file: ", function() {
            var text, tmp;
            it("Opens and JSON.stringifies: pTT15d_anti-huCB1_10D10.1_TTR3.gb",function(){
                var text, tmp;
                var name = "MarkDaris";
                var url  = "../test/data/MarkDaris/pTT15d_anti-huCB1_10D10.1_TTR3.gb";
                //var url = "../test/data/MarkDaris/pTT15d_anti-huCB1_10D10.1_TTR3_ApE.gb";
                //var url = "../test/data/MarkDaris/ape.gb";

                tmp = loadGenbankFile(url);

                if (LOG) {
                    logGenbank(name, url, tmp);
                }
                
                expect(tmp.getKeywords().length).toBe(4);
                // Can't verify this because of all the backslashes!!!!
                //expect(tmp.findKeyword("LOCUS").getName()).toBe("pTT15d\\-\\VK1O2O12::[hu\\anti-<huCB1>\\10D10.1\\(huIgG2-TO\\desK)\\VH]::TTR3");
                expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(7286);

                expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(15);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[14].getFeatureQualifier().length).toBe(2);
                    
            });

        });

        describe("Simon Bredl file: ", function() {
            var text, tmp;
            it("Opens and JSON.stringifies: GentR-Casette.gbk",function(){

                var text, tmp;
                var name = "SimonBredl";
                var url  = "../test/data/sbredl/GentR-Casette.gbk";

                tmp = loadGenbankFile(url);

                if (LOG) {
                    logGenbank(name, url, tmp);
                }

                expect(tmp.getKeywords().length).toBe(3);
                // Can't verify this because of all the backslashes!!!!
                expect(tmp.findKeyword("LOCUS").getLocusName()).toBe("GentR");
                expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(761);

                expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(1);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[0].getFeatureQualifier().length).toBe(1);

            });

            it("Opens and JSON.stringifies: TN7R.gbk",function(){

                var text, tmp;
                var name = "SimonBredl";
                var url  = "../test/data/sbredl/TN7R.gbk";

                tmp = loadGenbankFile(url);

                if (LOG) {
                    logGenbank(name, url, tmp);
                }
 
                expect(tmp.getKeywords().length).toBe(3);
                // Can't verify this because of all the backslashes!!!!
                expect(tmp.getLocus().getLocusName()).toBe("TN7R");
                expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(265);

                expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(1);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[0].getFeatureQualifier().length).toBe(1);

            });

        });
        

        describe("Lacz file: ", function() {
            var text, tmp;
            it("Opens and JSON.stringifies: lacz.gb",function(){
                var text, tmp;
                var name = "Lac Z";
                var url  = "../test/data/lacz.gb";

                tmp = loadGenbankFile(url);

                if (LOG) {
                    logGenbank(name, url, tmp);
                }
                
                expect(tmp.getKeywords().length).toBe(10);
                // Can't verify this because of all the backslashes!!!!
                //expect(tmp.findKeyword("LOCUS").getName()).toBe("pTT15d\\-\\VK1O2O12::[hu\\anti-<huCB1>\\10D10.1\\(huIgG2-TO\\desK)\\VH]::TTR3");
                expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(597);

                expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(3);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[2].getFeatureQualifier().length).toBe(9);
                    
            });

        });




//===================================================================================================

        xdescribe("DEPRECATED--DONT DO IT THIS WAY", function() {
            it("Opens and JSON.stringifies: TN7R.gbk",function(){
                var tmp, text;

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
    });
});