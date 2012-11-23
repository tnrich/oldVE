/**
 * Genbank: Testing real files from customers
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.onReady(function() {
    //===================================================================================================
    var LOG = true;

    var loadGenbankFile = function(url) {
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

    var logGenbank = function(name, url, gb) {
        console.log("RECONSTRUCTED " + name + " File: " + url + "\n" +
            "==================================================\n" +
            gb.toString());
        console.log("JSON " + name + " FILE: " + url + "\n" +
            "\n==================================================\n" +
            JSON.stringify(gb, null, "  "));
    };

    var saveFile = function(name, gb) {
        var flag;
        var text        = gb.toString();
        var filename    = name; // + "_parsed.gb"; //name.replace(/.gb$/,"_parsed.gb");
        var bb          = new BlobBuilder();
        bb.append(text);

        /*runs(function() {
            flag = false;
            gb = null;

            setTimeout(function() {
                flag = true;
            }, 10);
        });*/

        //waitsFor(function() {
            saveAs(bb.getBlob("text/plain;charset=utf-8"), filename);
            //return flag;
        //}, "Completed Reading file", 100);
    };

    //===================================================================================================

    describe("Opening Problematic Genbank Files: ", function() {

        describe("MarkDaris file: ", function() {

            it("Opens and JSON.stringifies: pTT15d_anti-huCB1_10D10.1_TTR3.gb",function(){
                var text, tmp;
                var name = "MarkDaris_pTT15d";
                var url  = "../test/data/customers/MarkDaris/pTT15d_anti-huCB1_10D10.1_TTR3.gb";
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

                //saveFile(name, tmp);
            });

        });

        describe("Simon Bredl file: ", function() {

            it("Opens and JSON.stringifies: GentR-Casette.gbk",function(){

                var text, tmp;
                var name = "SimonBredl_GentR";
                var url  = "../test/data/customers/sbredl/GentR-Casette.gbk";

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

                //saveFile(name, tmp);
            });

            it("Opens and JSON.stringifies: TN7R.gbk",function(){

                var text, tmp;
                var name = "SimonBredl_TN7R";
                var url  = "../test/data/customers/sbredl/TN7R.gbk";

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

                //saveFile(name, tmp);
            });

        });
        

        xdescribe("Lacz file: ", function() {

            it("Opens and JSON.stringifies: lacz.gb",function(){
                var text, tmp;
                var name = "Lac Z";
                var url  = "../test/data/genbank/lacz.gb";

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

                //saveFile(name, tmp);
            });

        });

        describe("200k Lines of GenbankFile: ", function() {

            it("Opens and JSON.stringifies: largeFile/NC_000913.gb",function(){
                var text, tmp;
                var name = "LargeFile_NC_000913";
                var url  = "../test/data/customers/largeFile/NC_000913.gb";

                tmp = loadGenbankFile(url);

                if (LOG) {
                    //logGenbank(name, url, tmp);
                }
                expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(4639675);

                expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(8993);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[0].getFeatureQualifier().length).toBe(5);
                //console.log(tmp.findKeyword("REFERENCE").toString());
                //console.log(tmp.getKeywords().length);
                //console.log(tmp.getKeywords());
                //console.log(tmp.findKeyword("FEATURES").getFeaturesElements());

                saveFile(name, tmp);

            });

        });

        describe("BRASKEM: ", function() {

            it("Opens and JSON.stringifies: BRASKEM/ADH3.gb",function(){
                var text, tmp;
                var name = "BRASKEM_ADH3";
                var url  = "../test/data/customers/BRASKEM/ADH3.gb";

                tmp = loadGenbankFile(url);

                if (LOG) {
                    logGenbank(name, url, tmp);
                }
                expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(3128);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(11);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[0].getFeatureQualifier().length).toBe(15);
                //saveFile(name, tmp);
            });

            it("Opens and JSON.stringifies: BRASKEM/ADH3.gene.export.gb",function(){
                var text, tmp;
                var name = "BRASKEM_ADH3.gene.export";
                var url  = "../test/data/customers/BRASKEM/ADH3.gene.export.gb";

                tmp = loadGenbankFile(url);

                if (LOG) {
                    logGenbank(name, url, tmp);
                }
                expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(3128);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(10);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[0].getFeatureQualifier().length).toBe(15);
                //saveFile(name, tmp);
            });

            it("Opens and JSON.stringifies: BRASKEM/pYES-DEST52.gb",function(){
                var text, tmp;
                var name = "BRASKEM_pYES-DEST52";
                var url  = "../test/data/customers/BRASKEM/pYES-DEST52.gb";

                tmp = loadGenbankFile(url);

                if (LOG) {
                    logGenbank(name, url, tmp);
                }
                expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(7621);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(14);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[0].getFeatureQualifier().length).toBe(3);
                //saveFile(name, tmp);
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
                        url:'../test/data/customers/sbredl/TN7R.gbk',
                        success: function(response) {
                            text = response.responseText;
                            tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(String(text));
                            
                        }
                    });
                    return flag;
                }, "Completed Reading file", 30);


                runs(function() {
                    
                    expect(tmp.getKeywords().length).toBe(3);
                    // Can't verify this because of all the backslashes!!!!
                    expect(tmp.getLocus().getLocusName()).toBe("TN7R");
                    expect(tmp.findKeyword("LOCUS").getSequenceLength()).toBe(265);

                    expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(1);
                    expect(tmp.findKeyword("FEATURES").getFeaturesElements()[0].getFeatureQualifier().length).toBe(1);
                });
            });
        });

//===================================================================================================
    });
});