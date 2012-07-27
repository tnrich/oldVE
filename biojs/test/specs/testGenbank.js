/**
 * Unit Tests
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.parsers.GenbankManager"); //will be a singleton
Ext.onReady(function() {

    GenbankManager: Teselagen.bio.parsers.GenbankManager,

    describe("GENBANK PACKAGE UNIT TESTING:", function() {

        //var dt =  Ext.create("Data");
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

            it("Access GenbankManager statics?", function() {
                expect(Teselagen.bio.parsers.GenbankManager.self.LOCUS_TAG).toBe("LOCUS");
                expect(Teselagen.bio.parsers.GenbankManager.self.END_SEQUENCE_TAG).toBe("//");
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
        describe("Unit Testing: Creates dummy Genbank Package objects directly, tests properties/methods", function() {

            it("Creates GenbankManager: This needs to be changed to a singleton***",function(){
                var line = "\n";
                var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
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
                expect(tmp.getStart()).toBe(1);
                expect(tmp.getPreStart()).toBe(""); // does not read > as valid
                expect(tmp.getEnd()).toBe(100);
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

        describe("Unit Testing for GenbankManager.js functions", function() {
            var gb;
            beforeEach(function() {
                gb = Ext.create("Teselagen.bio.parsers.Genbank");
                var line, tmp;
            });

            it("getLineKey()",function(){
                line = "KEY VALUE";
                tmp  = Teselagen.bio.parsers.GenbankManager.getLineKey(line);
                expect(tmp).toBe("KEY");
                line = "  KEY        VALUE";
                tmp  = Teselagen.bio.parsers.GenbankManager.getLineKey(line);
                expect(tmp).toBe("KEY");
                line = "\tKEY\tVALUE";
                tmp  = Teselagen.bio.parsers.GenbankManager.getLineKey(line);
                expect(tmp).toBe("KEY");
            });

            it("getLineVal()",function(){
                line = "KEY VALUE";
                tmp  = Teselagen.bio.parsers.GenbankManager.getLineVal(line);
                expect(tmp).toBe("VALUE");
                line = "  KEY          VALUE";
                tmp  = Teselagen.bio.parsers.GenbankManager.getLineVal(line);
                expect(tmp).toBe("VALUE");
                line = "\tKEY\tVALUE";
                tmp  = Teselagen.bio.parsers.GenbankManager.getLineVal(line);
                expect(tmp).toBe("VALUE");
            });

            it("isKeyword()",function(){
                line = "KEYWORD BLAHBLAH"; //no white space makes this a Keyword
                tmp  = Teselagen.bio.parsers.GenbankManager.isKeyword(line);
                expect(tmp).toBeTruthy();
                line = " KEYWORD BLAHBLAH";
                tmp  = Teselagen.bio.parsers.GenbankManager.isKeyword(line);
                expect(tmp).toBeFalsy();
            });

            it("isSubKeyword()",function(){
                line = "KEYWORD BLAHBLAH";
                tmp  = Teselagen.bio.parsers.GenbankManager.isSubKeyword(line);
                expect(tmp).toBeFalsy();
                line = " KEYWORD BLAHBLAH"; // any white space makes this a subKeyword
                tmp  = Teselagen.bio.parsers.GenbankManager.isSubKeyword(line);
                expect(tmp).toBeTruthy();
            });

            it("isKeywordRunon()",function(){
                line = "          KEYWORD BLAHBLAH"; // Must be 10 white space before line begins.
                tmp  = Teselagen.bio.parsers.GenbankManager.isKeywordRunon(line);
                expect(tmp).toBeTruthy();
            });

            it("isQualifier",function(){
                line = "          /KEYWORDBLAHBLAH";
                tmp  = Teselagen.bio.parsers.GenbankManager.isQualifier(line);
                expect(tmp).toBeTruthy();
                line = "     /KEYWORD=BLAHBLAH";
                tmp  = Teselagen.bio.parsers.GenbankManager.isQualifier(line);
                expect(tmp).toBeTruthy();
            });

            it("isQualifierRunon()",function(){
                line = "    /KEYWORDBLAHBLAH";
                tmp  = Teselagen.bio.parsers.GenbankManager.isQualifierRunon(line);
                expect(tmp).toBeFalsy();
                line = "          BLAHBLAH"; // has at least 10 empty spaces before entry, should be 20
                tmp  = Teselagen.bio.parsers.GenbankManager.isQualifierRunon(line);
                expect(tmp).toBeTruthy();
                line = "     CDS     1-2X";
                tmp  = Teselagen.bio.parsers.GenbankManager.isQualifierRunon(line);
                expect(tmp).toBeFalsy();
                line = "             1-2X";
                tmp  = Teselagen.bio.parsers.GenbankManager.isQualifierRunon(line);
                expect(tmp).toBeFalsy();
            });

            it("isLocationRunon()",function(){
                line = "    CDS BLAH BLAH";
                tmp  = Teselagen.bio.parsers.GenbankManager.isLocationRunon(line);
                expect(tmp).toBeFalsy();
                line = "          123455";
                tmp  = Teselagen.bio.parsers.GenbankManager.isLocationRunon(line);
                expect(tmp).toBeTruthy();
                line = "   CDS  1-2";
                tmp  = Teselagen.bio.parsers.GenbankManager.isLocationRunon(line);
                expect(tmp).toBeFalsy();
                line = "     CDS   complement(join(300..400,500.600))";
                tmp  = Teselagen.bio.parsers.GenbankManager.isLocationRunon(line);
                expect(tmp).toBeFalsy();
            });

            it("setType()",function(){
                //console.log(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE);
                expect(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE).toBe(false);

                Teselagen.bio.parsers.GenbankManager.setType("FEATURES", true);
                expect(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE).toBe("FEATURES");
                //console.log(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE);

                Teselagen.bio.parsers.GenbankManager.setType("ORIGIN", true);
                expect(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE).toBe("ORIGIN");
                //console.log(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE);

                Teselagen.bio.parsers.GenbankManager.setType("REFERENCE", true);
                expect(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE).toBe("REFERENCE");
                //console.log(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE);

                Teselagen.bio.parsers.GenbankManager.setType("//", true);
                expect(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE).toBe("//");
                //console.log(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE);

                Teselagen.bio.parsers.GenbankManager.setType("VERSION", true);
                expect(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE).toBe("VERSION");
                //console.log(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE);

                Teselagen.bio.parsers.GenbankManager.setType("BLAHBLAH", false); //eg AUTHOR, or CDS
                expect(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE).toBe("VERSION"); //whatever was previously set
                //console.log(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE);

                //var tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile("REFERENCE blah\n   BLAH");
                //console.log(tmp);

            });


            it("parseLocus()",function(){
                line = "LOCUS blah 10 bp ds-DNA circular 1-APR-2012";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseLocus(line, gb);
                expect(tmp.getLocusName()).toBe("blah");
                expect(tmp.getStrandType()).toBe("ds");
                expect(tmp.getSequenceLength()).toBe(10);
                expect(tmp.getNaType()).toBe("DNA");
                expect(tmp.getLinear()).toBeFalsy();
                expect(tmp.getDivisionCode()).toBe("");
            });

            it("parseKeyword()",function(){
                line = "KEY VALUE";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseKeyword(line, gb);
                expect(tmp.getKeyword()).toBe("KEY");
                expect(tmp.getValue()).toBe("VALUE");
            });
            it("parseKeyword() with runon. This would not be used since it is line by line parsing.",function(){
                line = "KEY VALUE\n      BLAH";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseKeyword(line, gb);
                expect(tmp.getKeyword()).toBe("KEY");
                expect(tmp.getValue()).toBe("VALUE\n      BLAH");
            });
            it("parseSubKeyword()",function(){
                var key = Ext.create("Teselagen.bio.parsers.GenbankKeyword", {});
                line = "   KEY VALUE";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseSubKeyword(key, line, gb);
                expect(tmp.getKeyword()).toBe("KEY");
                expect(tmp.getValue()).toBe("VALUE");
            });
            it("parseOrigin()",function(){
                gb   = Teselagen.bio.parsers.GenbankManager.parseGenbankFile("ORIGIN\n");
                line = "GATTACA";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseOrigin(line, gb);
                expect(tmp.getKeyword()).toBe("ORIGIN");
                expect(tmp.getSequence()).toBe("GATTACA");
            });

            it("parseFeatureLocation()",function(){
                var featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {} );
                var locStr = "100..200";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatureLocation(featElm, locStr);
                expect(tmp.getStart()).toBe(100);
                expect(tmp.getEnd()).toBe(200);
                expect(tmp.getTo()).toBe("..");
                expect(featElm.getJoin()).toBe(false);
                expect(featElm.getComplement()).toBe(false);

            });
            it("parseFeatureLocation() 2",function(){
                var featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {} );
                var locStr = "<100.>200";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatureLocation(featElm, locStr);
                expect(tmp.getStart()).toBe(100);
                expect(tmp.getEnd()).toBe(200);
                expect(tmp.getPreStart()).toBe("<");
                expect(tmp.getPreEnd()).toBe(">");
                expect(tmp.getTo()).toBe(".");
            });

            it("parseFeatures()",function(){
                var fkw = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {} );
                gb.setFeatures(fkw);
                line = "     CDS  1..2";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatures(line, gb); //returns a GenbankFeaturesKeyword
                expect(tmp.getKeyword()).toBe("FEATURES");
                expect(tmp.getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(1);
            });

            it("parseFeatureLocation()/parseFeatures(): complex versions",function(){
                // Cannot access GenbankFeatureElement directly because this function creates it and puts it in a gbFeaturesKeyword
                var fkw = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {} );
                gb.setFeatures(fkw);
                line = "     CDS   complement(join(300..400,500.600))";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatures(line, gb); //returns a GenbankFeaturesKeyword
                expect(tmp.getFeaturesElements()[0].getKeyword()).toBe("CDS");
                expect(tmp.getFeaturesElements()[0].getComplement()).toBe(true);
                expect(tmp.getFeaturesElements()[0].getComplement()).toBe(true);
                expect(tmp.getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(300);
                expect(tmp.getFeaturesElements()[0].getFeatureLocation()[1].getStart()).toBe(500);
            });

            it("parseFeatureLocation()/parseFeatures(): with runon Features Location",function(){
                // Cannot access GenbankFeatureElement directly because this function creates it and puts it in a gbFeaturesKeyword
                var fkw = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {} );
                gb.setFeatures(fkw);
                line = "     CDS   complement(join(300..400,500.600,";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatures(line, gb); //returns a GenbankFeaturesKeyword
                line = "          700..800))"; //there are at least 10 spaces in front; should be 20
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatures(line, gb);
                expect(tmp.getFeaturesElements()[0].getFeatureLocation()[2].getStart()).toBe(700);
                expect(tmp.getFeaturesElements()[0].getFeatureLocation()[2].getEnd()).toBe(800);
            });

            it("parseFeatureQualifier()",function(){
                var fkw = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {} );
                gb.setFeatures(fkw);
                line = '          /BLAH="HAHA"';
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatureQualifier(line);
                expect(tmp.getName()).toBe("BLAH");
                expect(tmp.getValue()).toBe("HAHA");
                expect(tmp.getQuoted()).toBe(true);
                line = '          /BLAH=123';
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatureQualifier(line);
                expect(tmp.getName()).toBe("BLAH");
                expect(tmp.getValue()).toBe("123");
                expect(tmp.getQuoted()).toBe(false);
            });

            it("parseFeatureQualifier(): complex with runon Feature Qualifier",function(){
                // Cannot access GenbankFeatureElement directly because this function creates it and puts it in a gbFeaturesKeyword
                var featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {} );
                var fkw     = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {} );
                fkw.setFeaturesElements([featElm]);
                gb.setFeatures(fkw);
                line = '          /BLAH="HAHA';
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatures(line, gb); //returns a GenbankFeaturesKeyword
                expect(tmp.getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("BLAH");
                expect(tmp.getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("HAHA");
                line = '          MUWAWA"';
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatures(line, gb);
                expect(tmp.getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("HAHAMUWAWA");
            });



// LAST LEFT OFF HERE

        });

        describe("Integrative Testing for GenbankManager.js: LOCUS", function() {
            
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

        describe("Integrative Testing for GenbankManager.js: KEYWORDS", function() {

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
        
        // =====================================================
        //   INTEGRATIVE TESTING
        // =====================================================
        describe("Integrative Testing for GenbankManager.js: KEYWORDS & SUBKEYWORDS & RUNONS", function() {

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
                }
                expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("SOURCE"), null, "  "));
                expect(tmp.findKeyword("SOURCE").toString()).toBe(line);
            });
        });

        describe("Integrative Testing for GenbankManager.js: parseFeatures(), parseFeatureLocation(), parseFeatureQualifier()", function() {
            beforeEach(function() {
                line = 
                    'FEATURES             Location/Qualifiers\n' + 
                    '     CDS             complement(7..885)\n' + 
                    '                     /label="araC"';
                tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                //console.log(JSON.stringify(tmp, null, "  "));
            })
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
                var json = { "keyword": "FEATURES", "elements": [ { "keyword": "CDS", "strand": -1, "location": [ { "start": 7, "to": "..", "end": 885 } ], "qualifier": [ { "name": "label", "value": "araC" } ] } ] };
                expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("FEATURES"), null, "  "));
            });

            it("Parses toString? (Icing on the cake. This does not have to hold due to wrap issues.",function(){    
                expect(tmp.findKeyword("FEATURES").toString()).toBe(line);
            });

        });

        describe("Integrative: parseFeatures() etc, (COMPLEX CASE: Runon LOCATION, and QUALIFIER)", function() {
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
            it("Parses toJSON?",function(){    
                var json = { "keyword": "FEATURES", "elements": [ { "keyword": "CDS", "strand": -1, "location": [ { "start": 7, "to": "..", "end": 885 } ], "qualifier": [ { "name": "label", "value": "araC" } ] }, { "keyword": "fakemRNA", "strand": 1, "location": [ { "start": 265, "to": "..", "end": 402 }, { "start": 673, "to": "..", "end": 781 }, { "start": 911, "to": "..", "end": 1007 }, { "start": 1088, "to": "..", "end": 1215 }, { "start": 1377, "to": "..", "end": 1573 }, { "start": 1866, "to": "..", "end": 2146 }, { "start": 2306, "to": "..", "end": 2634 }, { "start": 2683, "to": "..", "end": 2855 } ], "qualifier": [ { "name": "translation", "value": "MNRWVEKWLRVYLKCYINLILFYRNVYPPQSFDYTTYQSFNLPQFVPINRHPALIDYIEELILDVLSKLTHVYRFSICIINKKNDLCIEKYVLDFSELQHVDLISGDDKILNGVYSQYEEGESIFGSLF" } ] } ] };
                expect(JSON.stringify(json, null, "  ")).toBe(JSON.stringify(tmp.findKeyword("FEATURES"), null, "  "));
            });

        });

        describe("Integrative: parseOrigin() from GenbankManager.js?", function() {
            beforeEach(function() {
                line = "ORIGIN      \n" +
                "        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa\n" +
                "       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc\n";// +
                //"//";
                tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
            });
        });

        describe("", function() {
        });
    });
});