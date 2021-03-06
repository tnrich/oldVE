/**
 * Integrative Tests
 * @author Diana Womg
 */

 // =====================================================
 //   INTEGRATIVE TESTING
 // =====================================================

Ext.require("Ext.Ajax");
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.parsers.GenbankManager"); //will be a singleton
Ext.onReady(function() {

    describe("Teselagen.bio.parsers.GenbankManager.parseGenbankFile(): INTEGRATIVE TESTING:", function() {
        
        describe("LOCUS", function() {
            
            var line, tmp;

            it("Parses LOCUS 1: circular?",function(){
                var line = "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012";
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.getLocus().toString()).toBe(line);
                expect(tmp.getLocus().getStrandType()).toBe("ds");
                expect(tmp.getLocus().getSequenceLength()).toBe(5371); //currently a string
                expect(tmp.getLocus().getNaType()).toBe("DNA");
                expect(tmp.getLocus().getLinear()).toBe(false);
                expect(tmp.getLocus().getDivisionCode()).toBe("");
                // CURRENTLY DOES NOT SUPPORT DATE TYPE
                expect(tmp.getLocus().getDate()).toBe("1-APR-2012");
            });
            it("Parses LOCUS 2: linear, divisionCode?",function(){
                var line = "LOCUS       SCU49845     5028 bp    DNA             PLN       21-JUN-1999";
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.getLocus().getLocusName()).toBe("SCU49845");
                expect(tmp.getLocus().getStrandType()).toBe("");
                expect(tmp.getLocus().getSequenceLength()).toBe(5028);
                expect(tmp.getLocus().getNaType()).toBe("DNA");
                expect(tmp.getLocus().getLinear()).toBe(true);
                expect(tmp.getLocus().getDivisionCode()).toBe("PLN");
            });
            it("Parses LOCUS 3: Model formated line. no ds/ss, linear, division code?",function(){
                var line = "LOCUS       LISOD                    756 bp    DNA     linear   BCT 30-JUN-1993";
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.getLocus().getLocusName()).toBe("LISOD");
                expect(tmp.getLocus().getStrandType()).toBe("");
                expect(tmp.getLocus().getSequenceLength()).toBe(756);
                expect(tmp.getLocus().getNaType()).toBe("DNA");
                expect(tmp.getLocus().getLinear()).toBeTruthy();
                expect(tmp.getLocus().getDivisionCode()).toBe("BCT");
            });
            it("Parses LOCUS: toJSON format?",function(){
                var line = "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012";
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                var json = {
                        "keyword": "LOCUS",
                        "locusName": "pj5_00028",
                        "sequenceLength": 5371,
                        "strandType": "ds",
                        "naType": "DNA",
                        "linear": false,
                        "divisionCode": "",
                        "date": "1-APR-2012"
                };
                expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("LOCUS"), null, "  "));
            });
            it("Parses LOCUS: toString format?",function(){
                var line = "LOCUS       LISOD                    756 bp    DNA     linear   BCT 30-JUN-1993";
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.getLocus().toString()).toBe(line);
            });

        });

        describe("KEYWORDS", function() {

            it("Parses ACCESSION?",function(){
                var line = "ACCESSION   pj5_00028 Accession";
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.findKeyword("ACCESSION").toString()).toBe(line);
                expect(tmp.findKeyword("ACCESSION").getSubKeywords()).toBeTruthy(); // {} is truthy
                expect(tmp.findKeyword("VERSION")).toBeFalsy();
            });

            it("Parses ACCESSION?, adds dummy SubKeywords correctly?",function(){
                var line = "ACCESSION   pj5_00028 Accession";
                var tmp  = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.findKeyword("ACCESSION").toString()).toBe(line);
                expect(tmp.findKeyword("ACCESSION").getSubKeywords()).toBeTruthy(); // {} is truthy
                expect(tmp.findKeyword("VERSION")).toBeFalsy();
                
                tmp.findKeyword("ACCESSION").addSubKeyword(Ext.create('Teselagen.bio.parsers.GenbankSubKeyword', {keyword: "test", value : "test2"}));
                expect(tmp.findKeyword("ACCESSION").getSubKeywords().length).toBe(1);
                expect(tmp.findKeyword("ACCESSION").getSubKeywords()[0].getKeyword()).toBe("test");
                expect(tmp.findKeyword("ACCESSION").getSubKeywords()[0].getValue()).toBe("test2");
            });

            it("Parses VERSION?",function(){
                var line = "VERSION     pj5_00028 version.12";
                var tmp  = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.findKeyword("VERSION")).toBeTruthy();
                expect(tmp.findKeyword("ACCESSION")).toBeFalsy();
                expect(tmp.findKeyword("VERSION").toString()).toBe(line);
            });

            it("Parses DEFINITION?",function(){
                var line = "DEFINITION  pj5_00028 Definition";
                var tmp  = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.findKeyword("DEFINITION").toString()).toBe(line);
            });

            it("Parses KEYWORDS? '.' case",function(){
                var line = "KEYWORDS    .";
                var tmp  = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.findKeyword("KEYWORDS").toString()).toBe(line);
            });

            it("Parses KEYWORDS? ';;;;;' case",function(){
                var line =  "KEYWORDS    ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; \n" +
                            "; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ";
                //console.log("blah");
                var tmp  = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                //console.log(tmp.toString());
                expect(tmp.getKeywords().length).toBe(1); // does not turn second line into a keyword
            });

            it("Parses KEYWORDS: toJSON format?",function(){
                var line = "ACCESSION   pj5_00028 Accession";
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                var json = {
                        "keyword": "ACCESSION",
                        "value": "pj5_00028 Accession"
                };
                expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("ACCESSION"), null, "  "));
            });

            it("Parses KEYWORDS: toString format",function(){
                var line = "ACCESSION   pj5_00028 Accession";
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.findKeyword("ACCESSION").toString()).toBe(line);
            });

        });

        describe("KEYWORDS & SUBKEYWORDS & RUNONS", function() {

            it("Parses DEFINITION with 2 lines?",function(){
                var line =
                    'DEFINITION  Saccharomyces cerevisiae TCP1-beta gene, partial cds, and Axl2p\n ' +
                    '            (AXL2) and Rev7p (REV7) genes, complete cds.';
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.findKeyword("DEFINITION").getValue()).toBe('Saccharomyces cerevisiae TCP1-beta gene, partial cds, and Axl2p\n            (AXL2) and Rev7p (REV7) genes, complete cds.');
            });

            it("Parses SOURCE? Correctly parses SubKeywords and runons?",function(){
                var line =
                    'SOURCE      Saccharomyces cerevisiae (baker\'s yeast)\n' +
                    '  ORGANISM  Saccharomyces cerevisiae\n' +
                    '            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n' +
                    '            Saccharomycetales; Saccharomycetaceae; Saccharomyces.';
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                expect(tmp.findKeyword("SOURCE").getSubKeywords()[0].getKeyword()).toBe("ORGANISM");
                expect(tmp.findKeyword("SOURCE").getSubKeywords()[0].getValue()).toBe("Saccharomyces cerevisiae\n            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n            Saccharomycetales; Saccharomycetaceae; Saccharomyces.");

            });

            it("Parses SOURCE with SubKeywords and runon toJSON and toString format?",function(){
                var line =
                    'SOURCE      Saccharomyces cerevisiae (baker\'s yeast)\n' +
                    '  ORGANISM  Saccharomyces cerevisiae\n' +
                    '            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n' +
                    '            Saccharomycetales; Saccharomycetaceae; Saccharomyces.';
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                var json = {
                        "keyword": "SOURCE",
                        "value": "Saccharomyces cerevisiae (baker's yeast)",
                        "subKeywords": [
                                        {
                                            "keyword": "ORGANISM",
                                            "value": "Saccharomyces cerevisiae\n            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n            Saccharomycetales; Saccharomycetaceae; Saccharomyces."
                                        }
                                        ]
                };
                expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("SOURCE"), null, "  "));
                expect(tmp.findKeyword("SOURCE").toString()).toBe(line);
            });
        });

        describe("FEATURES", function() {
            beforeEach(function() {
                line =
                    'FEATURES             Location/Qualifiers\n' +
                    '     CDS             complement(7..885)\n' +
                    '                     /label="araC"';
                tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                //console.log(JSON.stringify(tmp, null, "  "));
            });
            it("Parses a Feature & Feature Element?",function(){
                //console.log(tmp.getLastKeyword());
                expect(Ext.getClassName(tmp.getLastKeyword())).toBe("Teselagen.bio.parsers.GenbankFeaturesKeyword");
                expect(tmp.findKeyword("FEATURES").getLastElement().getKeyword()).toBe("CDS");
            });

            it("Parses Feature Location?",function(){
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getStart()).toBe(7);
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getEnd()).toBe(885);
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getTo()).toBe("..");
            });

            it("Parses QUALIFIER?",function(){
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getName()).toBe("label");
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getValue()).toBe("araC");
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getQuoted()).toBe(true);
            });

            it("Parses toJSON?",function(){
                var json = { "keyword": "FEATURES", "featuresElements": [ { "keyword": "CDS", "strand": -1, "complement": true, "join": false, "location": [ { "start": 7, "to": "..", "end": 885 } ], "qualifier": [ { "name": "label", "value": "araC" } ] } ] };
                expect(JSON.stringify(tmp.findKeyword("FEATURES"), null, "  ")).toBe(JSON.stringify(json, null, "  "));
            });

            it("Parses toString? (Icing on the cake. This does not have to hold due to wrap issues.",function(){
                expect(tmp.findKeyword("FEATURES").toString()).toBe(line);
            });

        });

        describe("FEATURES: (COMPLEX CASE: Runon LOCATION, and QUALIFIER)", function() {
            beforeEach(function() {
                line =
                    'FEATURES             Location/Qualifiers\n' +
                    '     CDS             complement(7..885)\n' +
                    '                     /label="araC"\n' +
                    '     fakemRNA        join(<265..402,673..781,911..1007,1088..1215,\n' +
                    '                     1377..1573,1866..2146,2306..2634,2683..>2855)\n' +
                    '                     /translation="MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQ\n' +
                    '                     FVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVD\n' +
                    '                     LISGDDKILNGVYSQYEEGESIFGSLF\n';
                tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                //console.log("RECONSTRUCTED GENBANK FILE\n" + tmp.toString());
                //console.log(JSON.stringify(tmp, null, "  "));
            });

            it("Parses FeaturesKeyword name, FeatureElement name, and join/complement correctly?",function(){
                expect(Ext.getClassName(tmp.getLastKeyword())).toBe("Teselagen.bio.parsers.GenbankFeaturesKeyword");
                expect(tmp.findKeyword("FEATURES").getLastElement().getKeyword()).toBe("fakemRNA");

                expect(tmp.findKeyword("FEATURES").getLastElement().getJoin()).toBeTruthy();
                expect(tmp.findKeyword("FEATURES").getLastElement().getComplement()).toBeFalsy();
            });

            it("Parses Last Element Feature Location #1 correctly?",function(){
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getStart()).toBe(265); //<265
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getPreStart()).toBe("<");
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getEnd()).toBe(402);
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getPreEnd()).toBe("");
            });

            it("Parses Last Element Feature Location #8 correctly?",function(){
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[7].getStart()).toBe(2683);
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[7].getEnd()).toBe(2855); //>2855
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[7].getPreEnd()).toBe(">");
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation().length).toBe(8);
            });

            it("Parses Last Element Feature Qualifier correctly?",function(){
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getName()).toBe("translation");
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getValue()).toBe("MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQFVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVDLISGDDKILNGVYSQYEEGESIFGSLF");
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getQuoted()).toBeTruthy();
            });

        });

        describe("ORIGIN", function() {
            beforeEach(function() {
                line = "ORIGIN      \n" +
                "        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa\n" +
                "       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc\n";// +
                //"//";
                tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
            });

            it("Parses ORIGIN?",function(){
                expect(line).toMatch( tmp.findKeyword("ORIGIN").toString());
                expect(tmp.findKeyword("ORIGIN").getSequence()).toBe("gacgtcttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtc");
            });

            it("Parses toJSON?",function(){
                var json = { "keyword": "ORIGIN", "sequence": "gacgtcttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtc" };
                expect(JSON.stringify(json)).toBe(JSON.stringify(tmp.findKeyword("ORIGIN")));
            });
        });

        describe("FULL FILE STRING", function() {
            beforeEach(function() {
                line = '' +
                    'LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\n' +
                    'ACCESSION   pj5_00028 Accession\n' +
                    'VERSION     pj5_00028 version.1\n' +
                    'DEFINITION  pj5_00028 Definition\n'+
                    'KEYWORDS    .\n' +
                    'SOURCE      Saccharomyces cerevisiae (baker\'s yeast)\n' +
                    '  ORGANISM  Saccharomyces cerevisiae\n' +
                    '            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n' +
                    '            Saccharomycetales; Saccharomycetaceae; Saccharomyces.\n' +
                    'REFERENCE   1  (bases 1 to 5028)\n' +
                    '  AUTHORS   Torpey,L.E., Gibbs,P.E., Nelson,J. and Lawrence,C.W.\n' +
                    '  TITLE     Cloning and sequence of REV7, a gene whose function is required for\n' +
                    '            DNA damage-induced mutagenesis in Saccharomyces cerevisiae\n' +
                    '  JOURNAL   Yeast 10 (11), 1503-1509 (1994)\n' +
                    '  PUBMED    7871890\n' +
                    'FEATURES             Location/Qualifiers\n' +
                    '     CDS             complement(7..885)\n' +
                    '                     /label="araC"\n' +
                    '     promoter        complement(1036..1064)\n' +
                    '                     /label="araC promoter"\n' +
                    '     CDS             >1236..<2090\n' +
                    '                     /vntifkey="4"\n' +
                    '                     /vntifkey2=4\n' +
                    '     fakemRNA        join(<265..402,673..781,911..1007,1088..1215,\n' +
                    '                     1377..1573,1866..2146,2306..2634,2683..>2855)\n' +
                    '     fakeCDS         complement(3300..4037)\n' +
                    '                     /translation="MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQ\n' +
                    '                     FVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVD\n' +
                    '                     LISGDDKILNGVYSQYEEGESIFGSLF"\n' +
                    'ORIGIN      \n' +
                    '        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa\n' +
                    '       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc\n' +
                    '\n'+
                    '\n'+
                    '//';
                    tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
            });

            it("Parses the # of Keywords (in the array) Correctly?",function(){
                expect(tmp.getKeywords().length).toBe(9);
            });

            it("Parses Feature Elements (5 element names) Correctly?",function(){
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[0].getKeyword()).toBe("CDS");
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[1].getKeyword()).toBe("promoter");
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[2].getKeyword()).toBe("CDS");
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[3].getKeyword()).toBe("fakemRNA");
                expect(tmp.findKeyword("FEATURES").getFeaturesElements()[4].getKeyword()).toBe("fakeCDS");
            });

            it("Parses Last Element Feature Location join vs complement correctly?",function(){
                expect(tmp.findKeyword("FEATURES").getLastElement().getJoin()).toBeFalsy();
                expect(tmp.findKeyword("FEATURES").getLastElement().getComplement()).toBeTruthy();
            });

            it("Parses Last Element Feature Location correctly?",function(){
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getStart()).toBe(3300);
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getEnd()).toBe(4037); //>2855
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation().length).toBe(1);
            });

            it("Parses Last Element Feature Qualifier correctly?",function(){
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getName()).toBe("translation");
                expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getValue()).toBe("MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQFVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVDLISGDDKILNGVYSQYEEGESIFGSLF");
            });

            it("JSON CONVERSION: Converts Genbank String -> Genbank Model -> JSON -> Genbank Model",function(){

                var tmpJson = tmp.toJSON(); //JSON.stringify(tmp, null, "  ");
                //console.log(tmp);
                //console.log(tmpJson);

                var convert = Ext.create("Teselagen.bio.parsers.Genbank");
                convert.fromJSON(tmp.toJSON());

                var conJsonStr = convert.toJSON(); //JSON.stringify(convert, null, "  ");
                //console.log(conJsonStr);

                for (var i=0; i < tmp.keywordsTag.length; i++) {
                    var origKW = tmp.keywords[i].toString();
                    var jsonKW = tmp.keywords[i].toJSON();
                    var convKW = convert.keywords[i].toString();

                    //console.log(origKW);
                    //console.log(jsonKW);
                    //console.log(convKW);
                    expect(convKW).toBe(origKW);
                }
                //console.log(tmp.getKeywordsTag());
                expect(convert.getKeywordsTag().length).toBe(tmp.getKeywordsTag().length);
            });
        });

        describe("Opening data files from biojs/data/DATAFILE.gb correctly? Uses AJAX and is asynchronos.", function() {
            var text, tmp;
            it("../data/genbank/pj5_00028.gb: correct Locus, # of Keywords, # of Features",function(){

                runs(function() {
                    flag = false;
                    tmp = null;

                    setTimeout(function() {
                        flag = true;
                    }, 30);
                });

                waitsFor(function() {
                    Ext.Ajax.request({
                        url:'../test/data/genbank/pj5_00028.gb',
                        success: function(response) {
                            text = response.responseText;
                            //console.log(text);
                            tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(text);
                            // As an example of output, uncomment these two lines
                            //console.log("RECONSTRUCTED GENBANK FILE\n" + tmp.toString());
                            //console.log(JSON.stringify(tmp, null, "  "));
                        }
                    });
                    return flag;
                }, "Completed Reading file", 35);


                runs(function() {expect(tmp.findKeyword("LOCUS").toString()).toBe("LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012");
                    expect(tmp.getKeywords().length).toBe(7);
                    expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(19);
                });

            });

        });


        describe("", function() {
        });
    });
});