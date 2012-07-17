/* 
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");
Ext.require("Teselagen.StringUtil");
describe("Testing Genbank related classes:", function() {
    var dt =  Ext.create("Data");
    var gbMan = Ext.create("Teselagen.bio.parsers.GenbankManager");
    var line, tmp;

    describe("Teselagen.bio.util.StringUtil", function() {

        it("trims and pads?",function(){
            var str = "  black  ";
            expect("a" + Teselagen.StringUtil.trim(str) + "b").toBe("ablackb");
            expect(Ext.String.trim(str)).toBe("black");
            expect("a" + Teselagen.StringUtil.ltrim(str) + "b").toBe("ablack  b");  //result "ablack b"
            expect("a" + Teselagen.StringUtil.rtrim(str) + "b").toBe("a  blackb");  //result "a blackb"
            var str = "5";
            expect("" + Teselagen.StringUtil.lpad(str, "0", 5)).toBe("00005"); //result "00005"
            expect("" + Teselagen.StringUtil.rpad(str, "0", 5)).toBe("50000"); //result "50000"
            expect(false).toBe(false);
        });

    });

    describe("Creating classes correctly?", function() {
        it("creates GenbankManager statics?", function() {

            expect(gbMan).toBeDefined();
            expect(gbMan.self.LOCUS_TAG).toBe("LOCUS");
            expect(gbMan.self.END_SEQUENCE_TAG).toBe("//");
        });

        it("Genbank Initializes ", function() {
            var gb = Ext.create("Teselagen.bio.parsers.Genbank");
            expect(gb).toBeDefined();
        });

        it("GenbankManager Initializes?", function() {
            var gbMan = Ext.create("Teselagen.bio.parsers.GenbankManager");
            expect(gbMan).toBeDefined();
        });
        it("All Genbank classes defined?", function() {

            expect( Ext.create("Teselagen.bio.parsers.Genbank")).toBeDefined();
            expect( Ext.create("Teselagen.bio.parsers.GenbankKeyword")).toBeDefined();
            expect( Ext.create("Teselagen.bio.parsers.GenbankSubKeyword")).toBeDefined();
            expect( Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword")).toBeDefined();
            expect( Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword")).toBeDefined();
            expect( Ext.create("Teselagen.bio.parsers.GenbankFeatureElement")).toBeDefined();
            expect( Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier")).toBeDefined();
            expect( Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation")).toBeDefined();
            expect( Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword")).toBeDefined();
        });	
    });

    describe("Unit Testing: creation of a null Genbank Object.", function() {
        var tmp2 = [];
        it("Keyword?",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.Keyword", {} );
            expect(tmp.getKeyword()).toBe(null);
        });
        it("GenbankKeyword?",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankKeyword", {} );
            expect(tmp.getKeyword()).toBe(null);
            expect(tmp.getValue()).toBe(null);
            //expect(tmp.getSubKeywords()).toBe(tmp2);
        });
        it("GenbankSubKeyword?",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankSubKeyword", {} );
            expect(tmp.getKeyword()).toBe(null);
        });
        it("GenbankLocusKeyword?",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {} );
            expect(tmp.getKeyword()).toBe("LOCUS");
            expect(tmp.getValue()).toBe(null);
        });
        it("GenbankOriginKeyword?",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {} );
            expect(tmp.getKeyword()).toBe("ORIGIN");
            expect(tmp.getSequence()).toBe("");
        });
        it("GenbankFeatureKeyword?",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {} );
            expect(tmp.getKeyword()).toBe("FEATURES");
        });
        it("GenbankFeatureElement?",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
                keyword: "blah",
                join: true
            } );
            expect(tmp.getStrand()).toBe(null);
            //expect(tmp.getFeatureQualifier()).toBe(tmp2);
            //expect(tmp.getFeatureLocation()).toBe(tmp2);
        });
        it("GenbankFeatureLocation?",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {} );
            expect(tmp.getStart()).toBe("");
        });
        it("GenbankFeatureQualifier?",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {} );
            expect(tmp.getName()).toBe(null);
        });

    });
    describe("Unit Testing: Creates dummy Genbank Objects directly, tests properties/methods", function() {
        it("Parses LOCUS 1: circular?",function(){
            var line = "\n";
            var tmp = gbMan.parseGenbankFile(line);
            expect(tmp.getKeywords().length).toBe(0);
        });

        it("Keyword: get, toJSON",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.Keyword", {
                keyword: "key",
                value: "val"
            } );
            expect(tmp.getKeyword()).toBe("key");
            expect(tmp.getValue()).toBe("val");
            expect(JSON.stringify(tmp)).toBe(JSON.stringify({keyword:"key", value:"val"}));
        });
        it("GenbankKeyword: get, toString, toJSON, getLastKeyword, appendValue",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankKeyword", {
                keyword: "key",
                value: "val",
                subKeywords: [1, 2, 3]
            } );
            expect(tmp.getKeyword()).toBe("key");
            expect(tmp.getValue()).toBe("val");
            expect(tmp.getSubKeywords()[0]).toBe(1);
            tmp.addSubKeyword(4);
            expect(tmp.getSubKeywords()[3]).toBe(4);
            expect(tmp.getLastSubKeyword()).toBe(4);
            tmp.appendValue("ue");
            expect(tmp.getValue()).toBe("value");
            expect(tmp.toString()).toBe("key         value\n1\n2\n3\n4");
            expect(JSON.stringify(tmp)).toBe(JSON.stringify({keyword:"key", value:"value", 
                subKeywords: [ 1, 2, 3, 4]}));
        });
        it("GenbankSubKeyword: get, toString, toJSON, appendValue",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankSubKeyword", {
                keyword: "key",
                value: "val"
            } );
            expect(tmp.getKeyword()).toBe("key");
            expect(tmp.getValue()).toBe("val");
            tmp.appendValue("ue");
            expect(tmp.toString()).toBe("  key       value");
            expect(JSON.stringify(tmp)).toBe(JSON.stringify({keyword:"key", value:"value"}));

        });
        it("GenbankLocusKeyword: get, toString",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
                locusName       : "name",
                sequenceLength  : "len",
                strandType      : "ss",
                naType          : "DNA",
                linear          : false,
                circular        : true,
                divisionCode    : "AAA",
                date            : "01-MAR-12"
            } );
            expect(tmp.getKeyword()).toBe("LOCUS");
            tmp2 = "LOCUS       name                     len bp ss-DNA     circular AAA 01-MAR-12";
            expect(tmp.toString()).toBe(tmp2);
            // check stringify later
            //tmp2 = {keyword:"LOCUS", locusName:"name", sequenceLength:"len", strandType:"ss", naType:"DNA", linear:false, divisionCode:"AAA", date:"01-MAR-12"};
            //expect(JSON.stringify(tmp)).toBe(JSON.stringify(JSON.stringify(tmp2)));

        });
        it("GenbankOriginKeyword: get, toString, appendSequence",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
                keyword: "key",
                sequence: "AGCT"
            } );
            expect(tmp.getKeyword()).toBe("ORIGIN");
            expect(tmp.getValue()).toBe(null);
            expect(tmp.getSequence()).toBe("AGCT");
            tmp.appendSequence("GATTACA");
            expect(tmp.getSequence()).toBe("AGCTGATTACA");
            // DONT MATCH BACK TO ORIGINAL STRING. SPACING DOES NOT HAVE TO BE EXACT.
            //expect(tmp.toString()).toMatch("ORIGIN      \n        1 AGCTGATTAC A\n");
            //console.log(tmp.toString());
            //console.log("ORIGIN      \n        1 AGCTGATTAC A\n");
        });
        it("GenbankFeatureKeyword: getKeyword",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {} );
            expect(tmp.getKeyword()).toBe("FEATURES");
        });
        it("GenbankFeatureElement: get, toString, addFeatureQualifer, toString",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
                keyword: "key",
                strand: -1,
                complement: true,
                join: false,
                featureQualifier: [1 ,2],
                featureLocation: [3, 4]
            } );
            expect(tmp.getKeyword()).toBe("key");
            expect(tmp.getFeatureQualifier()[0]).toBe(1);
            expect(tmp.getLastFeatureQualifier()).toBe(2);
            tmp.addFeatureQualifier(10);
            expect(tmp.getLastFeatureQualifier()).toBe(10);

            expect(tmp.getFeatureLocation()[0]).toBe(3);
            //This function not created since never needed
            //expect(tmp.getLastFeatureLocation()).toBe(4);

            tmp2 = "     key             complement(3,4)\n1\n2\n10";
            expect(tmp.toString()).toBe(tmp2);

        });
        it("GenbankFeatureLocation: get",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
                start: ">1",
                to: "..",
                end: ">100"
            } );
            expect(tmp.getStart()).toBe("1");
            expect(tmp.getPreStart()).toBe(""); // does not read > as valid
            expect(tmp.getEnd()).toBe("100");
            expect(tmp.getPreEnd()).toBe(">");

        });
        it("GenbankFeatureQualifier: get, toString, appendValue",function(){
            var tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                name: "key",
                value: "val",
                quoted: true
            } );
            expect(tmp.getName()).toBe("key");
            tmp.appendValue("ue");
            expect(tmp.getValue()).toBe("value");
            expect(tmp.toString() + "\n" + "                     /key=\"value\"");
        });

    });

    describe("Unit Testing for private GenbankManager.js ???", function() {
        it("Test it here",function(){
            expect(false).toBeFalsy();
        });
    });

    describe("Integrative: parseLocus() from GenbankManager.js", function() {
        var line, tmp;

        it("Parses LOCUS 1: circular?",function(){
            var line = "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012";
            var tmp = gbMan.parseGenbankFile(line);
            expect(tmp.getLocus().toString()).toBe(line);
            expect(tmp.getLocus().getStrandType()).toBe("ds");
            expect(tmp.getLocus().getSequenceLength()).toBe("5371");
            expect(tmp.getLocus().getNaType()).toBe("DNA");
            expect(tmp.getLocus().getLinear()).toBe(false);
            expect(tmp.getLocus().getDivisionCode()).toBe("");
            // CURRENTLY DOES NOT SUPPORT DATE TYPE
            expect(tmp.getLocus().getDate()).toBe("1-APR-2012");
        });
        it("Parses LOCUS 2: linear, divisionCode?",function(){
            var line = "LOCUS       SCU49845     5028 bp    DNA             PLN       21-JUN-1999";
            var tmp = gbMan.parseGenbankFile(line);
            expect(tmp.getLocus().getLocusName()).toBe("SCU49845");
            expect(tmp.getLocus().getStrandType()).toBe("");
            expect(tmp.getLocus().getSequenceLength()).toBe("5028");
            expect(tmp.getLocus().getNaType()).toBe("DNA");
            expect(tmp.getLocus().getLinear()).toBe(true);
            expect(tmp.getLocus().getDivisionCode()).toBe("PLN");
        });
        it("Parses LOCUS 3: Model formated line. no ds/ss, linear, division code?",function(){
            var line = "LOCUS       LISOD                    756 bp    DNA     linear   BCT 30-JUN-1993";
            var tmp = gbMan.parseGenbankFile(line);
            expect(tmp.getLocus().getLocusName()).toBe("LISOD");
            expect(tmp.getLocus().getStrandType()).toBe("");
            expect(tmp.getLocus().getSequenceLength()).toBe("756");
            expect(tmp.getLocus().getNaType()).toBe("DNA");
            expect(tmp.getLocus().getLinear()).toBeTruthy();
            expect(tmp.getLocus().getDivisionCode()).toBe("BCT");
        });

        it("Parses LOCUS: toJSON format?",function(){
            var line = "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012";
            var tmp = gbMan.parseGenbankFile(line);
            var json = {
                    "keyword": "LOCUS", 
                    "locusName": "pj5_00028", 
                    "sequenceLength": "5371", 
                    "strandType": "ds", 
                    "naType": "DNA", 
                    "linear": false, 
                    "divisionCode": "", 
                    "date": "1-APR-2012"
            };
            expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("LOCUS"), null, "  "));

        });

        it("Parses LOCUS: toString format",function(){
            var line = "LOCUS       LISOD                    756 bp    DNA     linear   BCT 30-JUN-1993";
            var tmp = gbMan.parseGenbankFile(line);
            expect(tmp.getLocus().toString()).toBe(line);
        });
    });

    describe("Integrative: parseKeyword() from GenbankManager.js (SIMPLE CASE)", function() {
        it("Parses ACCESSION? Correctly parses/adds Dummy SubKeywords?",function(){
            var line = "ACCESSION   pj5_00028 Accession";
            var tmp = gbMan.parseGenbankFile(line);
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
            var tmp = gbMan.parseGenbankFile(line);
            expect(tmp.findKeyword("VERSION")).toBeTruthy();
            expect(tmp.findKeyword("ACCESSION")).toBeFalsy();
            expect(tmp.findKeyword("VERSION").toString()).toBe(line);
        });
        it("Parses DEFINITION?",function(){
            var line = "DEFINITION  pj5_00028 Definition";
            var tmp = gbMan.parseGenbankFile(line);
            expect(tmp.findKeyword("DEFINITION").toString()).toBe(line);
        });
        it("Parses KEYWORDS?",function(){
            var line = "KEYWORDS    .";
            var tmp = gbMan.parseGenbankFile(line);
            expect(tmp.findKeyword("KEYWORDS").toString()).toBe(line);
        });
        it("Parses KEYWORDS: toJSON format?",function(){
            var line = "ACCESSION   pj5_00028 Accession";
            var tmp = gbMan.parseGenbankFile(line);
            var json = {
                    "keyword": "ACCESSION", 
                    "value": "pj5_00028 Accession"
            };
            expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("ACCESSION"), null, "  "));

        });

        it("Parses KEYWORDS: toString format",function(){
            var line = "ACCESSION   pj5_00028 Accession";
            var tmp = gbMan.parseGenbankFile(line);
            expect(tmp.findKeyword("ACCESSION").toString()).toBe(line);
        });
    });


    describe("Integrative: parseKeyword() & parseSubKeyword() from GenbankManager.js (COMPLEX CASE: lines with runons)", function() {
        it("Parses DEFINITION with 2 lines?",function(){
            line = 
                'DEFINITION  Saccharomyces cerevisiae TCP1-beta gene, partial cds, and Axl2p\n ' +
                '            (AXL2) and Rev7p (REV7) genes, complete cds.';
            tmp = gbMan.parseGenbankFile(line);
            expect(tmp.findKeyword("DEFINITION").getValue()).toBe('Saccharomyces cerevisiae TCP1-beta gene, partial cds, and Axl2p\n            (AXL2) and Rev7p (REV7) genes, complete cds.');
            //expect(tmp.findKeyword("DEFINITION").toString()).toBe(line);
        });

        it("Parses SOURCE? Correctly parses SubKeywords and runons?",function(){
            var line = 
                'SOURCE      Saccharomyces cerevisiae (baker\'s yeast)\n' +
                '  ORGANISM  Saccharomyces cerevisiae\n' +
                '            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n' +
                '            Saccharomycetales; Saccharomycetaceae; Saccharomyces.';
            var tmp = gbMan.parseGenbankFile(line);
            //console.log("ORIGINAL\n" + line);
            //console.log("RECONSTRUCTED\n" + tmp.toString());
            //console.log(JSON.stringify(tmp, null, "  "));
            expect(tmp.findKeyword("SOURCE").getSubKeywords()[0].getKeyword()).toBe("ORGANISM");
            expect(tmp.findKeyword("SOURCE").getSubKeywords()[0].getValue()).toBe("Saccharomyces cerevisiae\n            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n            Saccharomycetales; Saccharomycetaceae; Saccharomyces.");

        });

        it("Parses SOURCE with SubKeywords and runon toJSON and toString format?",function(){
            var line = 
                'SOURCE      Saccharomyces cerevisiae (baker\'s yeast)\n' +
                '  ORGANISM  Saccharomyces cerevisiae\n' +
                '            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n' +
                '            Saccharomycetales; Saccharomycetaceae; Saccharomyces.';
            var tmp = gbMan.parseGenbankFile(line);
            var json = {
                    "keyword": "SOURCE", 
                    "value": "Saccharomyces cerevisiae (baker's yeast)", 
                    "subKeywords": [ 
                                    { 
                                        "keyword": "ORGANISM", 
                                        "value": "Saccharomyces cerevisiae\n            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n            Saccharomycetales; Saccharomycetaceae; Saccharomyces." 
                                    } 
                                    ]
            }
            expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("SOURCE"), null, "  "));
            expect(tmp.findKeyword("SOURCE").toString()).toBe(line);
        });

    });


    describe("Integrative: parseFeatures(), parseFeatureLocation(), parseFeatureQualifier() from GenbankManager.js from GenbankManager.js (SIMPLE CASE)", function() {
        var line = 
            'FEATURES             Location/Qualifiers\n' + 
            '     CDS             complement(7..885)\n' + 
            '                     /label="araC"';
        var tmp = gbMan.parseGenbankFile(line);
        it("Parses FEATURE & FEATURE ELEMENT?",function(){
            expect(Ext.getClassName(tmp.getLastKeyword())).toBe("Teselagen.bio.parsers.GenbankFeaturesKeyword");
            expect(tmp.findKeyword("FEATURES").getLastElement().getKeyword()).toBe("CDS");
        });
        it("Parses LOCATION?",function(){
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getStart()).toBe("7");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getEnd()).toBe("885");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getTo()).toBe("..");
        });
        it("Parses QUALIFIER?",function(){    
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getName()).toBe("label");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getValue()).toBe("araC");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getQuoted()).toBe(true);
        });
        it("Parses toJSON?",function(){    
            var json = { "keyword": "FEATURES", "elements": [ { "keyword": "CDS", "strand": -1, "location": [ { "start": "7", "to": "..", "end": "885" } ], "qualifier": [ { "name": "label", "value": "araC" } ] } ] };
            expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("FEATURES"), null, "  "));
        });
        it("Parses toString?",function(){    
            expect(tmp.findKeyword("FEATURES").toString()).toBe(line);
        });

    });


    describe("Integrative: parseFeatures() etc from GenbankManager.js (COMPLEX CASE: Runon LOCATION, and QUALIFIER)", function() {
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
            tmp = gbMan.parseGenbankFile(line);
            //console.log("RECONSTRUCTED GENBANK FILE\n" + tmp.toString());
            //console.log(JSON.stringify(tmp, null, "  "));
        })


        it("Parses FeaturesKeyword name, FeatureElement name, and join/complement correctly?",function(){

            expect(Ext.getClassName(tmp.getLastKeyword())).toBe("Teselagen.bio.parsers.GenbankFeaturesKeyword");
            expect(tmp.findKeyword("FEATURES").getLastElement().getKeyword()).toBe("fakemRNA");

            expect(tmp.findKeyword("FEATURES").getLastElement().getJoin()).toBeTruthy();
            expect(tmp.findKeyword("FEATURES").getLastElement().getComplement()).toBeFalsy();
        });
        it("Parses Last Element Feature Location #1 correctly?",function(){	
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getStart()).toBe("265"); //<265
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getPreStart()).toBe("<");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getEnd()).toBe("402");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getPreEnd()).toBe("");
        });
        it("Parses Last Element Feature Location #8 correctly?",function(){    
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[7].getStart()).toBe("2683");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[7].getEnd()).toBe("2855"); //>2855
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[7].getPreEnd()).toBe(">");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation().length).toBe(8);
        });
        it("Parses Last Element Feature Qualifier correctly?",function(){
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getName()).toBe("translation");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getValue()).toBe("MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQFVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVDLISGDDKILNGVYSQYEEGESIFGSLF");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getQuoted()).toBeTruthy();
        });
        it("Parses toJSON?",function(){    
            var json = { "keyword": "FEATURES", "elements": [ { "keyword": "CDS", "strand": -1, "location": [ { "start": "7", "to": "..", "end": "885" } ], "qualifier": [ { "name": "label", "value": "araC" } ] }, { "keyword": "fakemRNA", "strand": 1, "location": [ { "start": "265", "to": "..", "end": "402" }, { "start": "673", "to": "..", "end": "781" }, { "start": "911", "to": "..", "end": "1007" }, { "start": "1088", "to": "..", "end": "1215" }, { "start": "1377", "to": "..", "end": "1573" }, { "start": "1866", "to": "..", "end": "2146" }, { "start": "2306", "to": "..", "end": "2634" }, { "start": "2683", "to": "..", "end": "2855" } ], "qualifier": [ { "name": "translation", "value": "MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQFVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVDLISGDDKILNGVYSQYEEGESIFGSLF" } ] } ] };
            expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("FEATURES"), null, "  "));
        });

        // This is not designed to work because the formatting is screwed up once you put it into the Genbank class (ie for the word wrapping of the translation qualifier)
        /*it("Parses toString?",function(){    
            expect(tmp.findKeyword("FEATURES").toString()).toBe(line);
        });*/
    });


    describe("Integrative: parseOrigin() from GenbankManager.js?", function() {
        beforeEach(function() {
            line = "ORIGIN      \n" +
            "        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa\n" +
            "       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc\n";// +
            //"//";
            tmp = gbMan.parseGenbankFile(line);
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


    describe("Integrative: Partial file (top part of pj5_00028.gb) parsing from GenbankManager.js:?", function() {
        beforeEach(function() {
            line = dt.getTopStr();
            tmp = gbMan.parseGenbankFile(line);

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
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getStart()).toBe("3300");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation()[0].getEnd()).toBe("4037"); //>2855
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureLocation().length).toBe(1);
        });
        it("Parses Last Element Feature Qualifier correctly?",function(){
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getName()).toBe("translation");
            expect(tmp.findKeyword("FEATURES").getLastElement().getFeatureQualifier()[0].getValue()).toBe("MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQFVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVDLISGDDKILNGVYSQYEEGESIFGSLF");
        });;

    });


    describe("Opening data files from biojs/data/DATAFILE.gb correctly? Uses AJAX and is asynchronos.", function() {
        it("../data/pj5_00028.gb: correct Locus, # of Keywords, # of Features",function(){

            var text, tmp;

            runs(function() {
                flag = false;
                tmp = null;

                setTimeout(function() {
                    flag = true;
                }, 30);
            });

            waitsFor(function() {
                Ext.Ajax.request({
                    url:'../test/data/pj5_00028.gb',
                    success: function(response) {
                        text = response.responseText;
                        //console.log(text);
                        tmp = gbMan.parseGenbankFile(text);
                        //console.log("RECONSTRUCTED GENBANK FILE\n" + tmp.toString());

                        //console.log(JSON.stringify(tmp, null, "  "));
                        //expect(text).toMatch(tmp.toString());
                        //console.log(Ext.getClassName(tmp));
                    }
                });
                //console.log(JSON.stringify(tmp, null, "  "));
                //console.log("RECONSTRUCTED GENBANK FILE\n" + tmp.toString());
                return flag;
            }, "Completed Reading file", 35);


            runs(function() {
                console.log("RECONSTRUCTED GENBANK FILE\n" + tmp.toString());
                console.log(JSON.stringify(tmp, null, "  "));
                //console.log(tmp.findKeyword("LOCUS").toString());
                //console.log("LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012");
                expect(tmp.findKeyword("LOCUS").toString()).toBe("LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012");
                expect(tmp.getKeywords().length).toBe(7);
                expect(tmp.findKeyword("FEATURES").getFeaturesElements().length).toBe(19);
            })

        });

    });

    /*describe("Testing this DUMMY", function() {

        it("Works?",function(){
            beforeEach(function() {

            });
            expect(false).toBe(false);
        });

    });*/



});