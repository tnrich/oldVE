/**
 * Unit Tests
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.parsers.GenbankManager"); //will be a singleton
Ext.onReady(function() {

    GenbankManager = Teselagen.bio.parsers.GenbankManager;

    describe("Teselagen.bio.parsers.Genbank Models && Manager:", function() {

        //var dt =  Ext.create("Data");
        var line, tmp;

        describe("Creating classes correctly?", function() {

            it("Access GenbankManager statics?", function() {
                expect(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE).toBe(false);
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

        describe("Unit Testing: creation of a null Genbank Models.", function() {
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
                expect(tmp.getKeyword()).toBe("blah");
                expect(tmp.getStrand()).toBe(1);
                //expect(tmp.getFeatureQualifier()).toBe(tmp2);
                //expect(tmp.getFeatureLocation()).toBe(tmp2);
            });
            it("GenbankFeatureLocation?",function(){
                var tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {} );
                expect(tmp.getStart()).toBe(0);
                expect(tmp.getEnd()).toBe(0);
            });
            it("GenbankFeatureQualifier?",function(){
                var tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {} );
                expect(tmp.getName()).toBe("");
            });

        });

        describe("Unit Testing of Genbank Models: ", function() {
            
            describe("Keyword", function() {

                beforeEach(function() {
                    tmp = Ext.create("Teselagen.bio.parsers.Keyword", {
                        keyword: "key",
                        value: "val"
                    });
                });

                it("get methods",function(){
                    expect(tmp.getKeyword()).toBe("key");
                    expect(tmp.getValue()).toBe("val");
                });

                it("toJSON()",function(){
                    var json = JSON.stringify(tmp, null, "  ");
                    //console.log(json);
                    var check = JSON.stringify({
                        "keyword": "key",
                        "value": "val"
                    } , null, "  ");
                    expect(json).toBe(check);
                });
            });
            
            describe("GenbankKeyword", function() {

                beforeEach(function() {
                    sub = Ext.create("Teselagen.bio.parsers.GenbankSubKeyword", {
                        keyword: "test",
                        value: "testValue"
                    });
                    sub2 = Ext.create("Teselagen.bio.parsers.GenbankSubKeyword", {
                        keyword: "test2",
                        value: "testValue2"
                    });

                    tmp = Ext.create("Teselagen.bio.parsers.GenbankKeyword", {
                        keyword: "REFERENCE",
                        value: "val"
                    } );
                });

                it("get methods",function(){
                    expect(tmp.getKeyword()).toBe("REFERENCE");
                    expect(tmp.getValue()).toBe("val");
                    expect(tmp.getSubKeywords().length).toBe(0);
                });

                it("appendValue",function(){
                    tmp.appendValue("ue");
                    expect(tmp.getKeyword()).toBe("REFERENCE");
                    expect(tmp.getValue()).toBe("value");
                });

                it("addSubKeyword",function(){
                    tmp.addSubKeyword(sub);

                    expect(tmp.getSubKeywords().length).toBe(1);
                    expect(tmp.getSubKeywords()[0]).toBe(sub);
                });

                it("getLastSubKeyword",function(){
                    tmp.addSubKeyword(sub);
                    tmp.addSubKeyword(sub2);

                    expect(tmp.getSubKeywords().length).toBe(2);
                    expect(tmp.getSubKeywords()[0]).toBe(sub);
                    expect(tmp.getSubKeywords()[1]).toBe(sub2);
                });

                it("toString()",function(){

                    tmp.addSubKeyword(sub);

                    var str = tmp.toString();
                    //console.log(str);
                    var check = 'REFERENCE   val\n' +
                                '  test      testValue';
                    expect(str).toBe(check);
                });

                it("toJSON()",function(){

                    tmp.addSubKeyword(sub);
                    //console.log(JSON.stringify(tmp, null, "  "));

                    var json = JSON.stringify(tmp, null, "  ");
                    //console.log(json);
                    var check = JSON.stringify({
                        "keyword": "REFERENCE",
                        "value": "val",
                        "subKeywords": [
                        {
                            "keyword": "test",
                            "value": "testValue"
                        }
                        ]
                    } , null, "  ");
                    expect(json).toBe(check);
                });

                it("fromJSON()",function(){

                    tmp.addSubKeyword(sub);

                    var convert = Ext.create("Teselagen.bio.parsers.GenbankKeyword");
                    var json = tmp.toJSON();
                    //console.log(json);
                    convert.fromJSON(json);
                    //console.log(convert.toString());

                    expect(tmp.getKeyword()).toBe("REFERENCE");
                    expect(tmp.getValue()).toBe("val");
                    expect(tmp.getSubKeywords().length).toBe(1);
                });
            });

            describe("GenbankSubKeyword", function() {

                beforeEach(function() {
                    tmp = Ext.create("Teselagen.bio.parsers.GenbankSubKeyword", {
                        keyword: "ORGANISM",
                        value: "val"
                    });
                });

                it("get methods",function(){
                    expect(tmp.getKeyword()).toBe("ORGANISM");
                    expect(tmp.getValue()).toBe("val");
                });

                it("appendValue",function(){
                    tmp.appendValue("ue");
                    expect(tmp.getKeyword()).toBe("ORGANISM");
                    expect(tmp.getValue()).toBe("value");
                });

                it("toString()",function(){
                    var str = tmp.toString();
                    //console.log(str);
                    var check = '  ORGANISM  val';
                    expect(str).toBe(check);
                });

                it("toJSON()",function(){
                    var json = JSON.stringify(tmp, null, "  ");
                    //console.log(json);
                    var check = JSON.stringify({
                        "keyword": "ORGANISM",
                        "value": "val"
                    }, null, "  ");
                    expect(json).toBe(check);
                });

                it("fromJSON()",function(){
                    var convert = Ext.create("Teselagen.bio.parsers.GenbankSubKeyword");
                    var json = tmp.toJSON();
                    //console.log(json);
                    convert.fromJSON(json);
                    //console.log(convert.toString());

                    expect(tmp.getKeyword()).toBe("ORGANISM");
                    expect(tmp.getValue()).toBe("val");
                });
            });

            describe("GenbankLocusKeyword", function() {

                beforeEach(function() {
                    tmp = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
                    locusName       : "name",
                    sequenceLength  : 100,
                    strandType      : "ss",
                    naType          : "DNA",
                    linear          : false,
                    circular        : true,
                    divisionCode    : "AAA",
                    date            : "01-MAR-12"
                });
                });

                it("get methods",function(){
                    expect(tmp.getKeyword()).toBe("LOCUS");
                    expect(tmp.getLocusName()).toBe("name");
                    expect(tmp.getSequenceLength()).toBe(100);
                    expect(tmp.getStrandType()).toBe("ss");
                    expect(tmp.getNaType()).toBe("DNA");
                    expect(tmp.getLinear()).toBe(false);
                    expect(tmp.getCircular()).toBe(true);
                    expect(tmp.getDivisionCode()).toBe("AAA");
                    expect(tmp.getDate()).toBe("01-MAR-12");
                });

                it("toString()",function(){
                    var str = tmp.toString();
                    //console.log(str);
                    var check = 'LOCUS       name                     100 bp ss-DNA     circular AAA 01-MAR-12';
                    expect(str).toBe(check);
                });

                it("toJSON()",function(){
                    var json = JSON.stringify(tmp, null, "  ");
                    //console.log(json);
                    var check = JSON.stringify({
                        "keyword": "LOCUS",
                        "locusName": "name",
                        "sequenceLength": 100,
                        "strandType": "ss",
                        "naType": "DNA",
                        "linear": false,
                        "divisionCode": "AAA",
                        "date": "01-MAR-12"
                    }, null, "  ");
                    expect(json).toBe(check);
                });

                it("fromJSON()",function(){
                    var convert = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword");
                    var json = tmp.toJSON();
                    //console.log(json);
                    convert.fromJSON(json);
                    //console.log(convert.toString());

                    expect(tmp.getKeyword()).toBe("LOCUS");
                    expect(tmp.getLocusName()).toBe("name");
                    expect(tmp.getSequenceLength()).toBe(100);
                    expect(tmp.getStrandType()).toBe("ss");
                    expect(tmp.getNaType()).toBe("DNA");
                    expect(tmp.getLinear()).toBe(false);
                    expect(tmp.getCircular()).toBe(true);
                    expect(tmp.getDivisionCode()).toBe("AAA");
                    expect(tmp.getDate()).toBe("01-MAR-12");
                });

            });
            
            describe("GenbankOriginKeyword", function() {

                beforeEach(function() {
                    tmp = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
                        //keyword: "ORIGIN",
                        sequence: "AGCT"
                    });
                });

                it("get methods",function(){
                    expect(tmp.getKeyword()).toBe("ORIGIN");
                    expect(tmp.getValue()).toBe(null);
                    expect(tmp.getSequence()).toBe("AGCT");
                });

                it("appendSequence",function(){
                    tmp.appendSequence("AGCT");
                    expect(tmp.getKeyword()).toBe("ORIGIN");
                    expect(tmp.getValue()).toBe(null);
                    expect(tmp.getSequence()).toBe("AGCTAGCT");
                });

                it("toString()",function(){
                    var str = tmp.toString();
                    //console.log(str);
                    var check = 'ORIGIN      \n' +
                                '        1 AGCT     \n';
                    expect(str).toBe(check);
                });

                it("toJSON()",function(){
                    var json = JSON.stringify(tmp, null, "  ");
                    //console.log(json);
                    var check = JSON.stringify({
                        "keyword": "ORIGIN",
                        "sequence": "AGCT"
                    }, null, "  ");
                    expect(json).toBe(check);
                });

                it("fromJSON()",function(){
                    var convert = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation");
                    var json = tmp.toJSON();
                    //console.log(json);
                    convert.fromJSON(json);
                    //console.log(convert.toString());

                    expect(tmp.getKeyword()).toBe("ORIGIN");
                    expect(tmp.getValue()).toBe(null);
                    expect(tmp.getSequence()).toBe("AGCT");
                });
            });

            describe("GenbankFeatureLocation", function() {

                beforeEach(function() {
                    tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
                        start: "<1",
                        to: "..",
                        end: ">100"
                    });
                });

                it("get methods",function(){
                    expect(tmp.getStart()).toBe(1);
                    expect(tmp.getPreStart()).toBe("<"); // does not read > as valid
                    expect(tmp.getEnd()).toBe(100);
                    expect(tmp.getPreEnd()).toBe(">");
                });

                it("toString()",function(){
                    var str = tmp.toString();
                    var check = "<1..>100";
                    expect(str).toBe(check);
                });

                it("toJSON()",function(){
                    var json = JSON.stringify(tmp, null, "  ");
                    //console.log(json);
                    var check = JSON.stringify({
                        start: 1,
                        to: "..",
                        end: 100,
                        preStart: "<",
                        preEnd: ">"
                    }, null, "  ");
                    expect(json).toBe(check);
                });

                it("fromJSON()",function(){
                    var convert = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation");
                    var json = tmp.toJSON();
                    //console.log(json);
                    convert.fromJSON(json);
                    //console.log(convert.toString());

                    expect(convert.getStart()).toBe(1);
                    expect(convert.getTo()).toBe("..");
                    expect(convert.getEnd()).toBe(100);
                });
            });
            
            describe("GenbankFeatureQualifier", function() {

                beforeEach(function() {
                    tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                        name: "label",
                        value: "val"//,
                        //quoted: true
                    } );
                });

                it("get methods,",function(){
                    expect(tmp.getName()).toBe("label");
                    expect(tmp.getValue()).toBe("val");
                    expect(tmp.getQuoted()).toBe(true);
                });

                it("appendValue(),",function(){
                    tmp.appendValue("ue");
                    expect(tmp.getName()).toBe("label");
                    expect(tmp.getValue()).toBe("value");
                    expect(tmp.getQuoted()).toBe(true);
                });


                it("toString()",function(){
                    var str = tmp.toString();
                    //console.log(str);
                    var check = '                     /label="val"';
                    expect(str).toBe(check);
                });

                it("toJSON()",function(){
                    var json = JSON.stringify(tmp, null, "  ");
                    //console.log(json);
                    var check = JSON.stringify({
                        "name": "label",
                        "value": "val"
                    } , null, "  ");
                    expect(json).toBe(check);
                });

                it("fromJSON()",function(){
                    var convert = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier");
                    var json = tmp.toJSON();
                    //console.log(json);
                    convert.fromJSON(json);
                    //console.log(convert.toString());

                    expect(convert.getName()).toBe("label");
                    expect(convert.getValue()).toBe("val");
                    expect(convert.getQuoted()).toBe(true);
                });

            });

            describe("GenbankFeatureElement: comprised of GFLocations and GFQualifiers", function() {

                beforeEach(function() {
                    l1 = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {start: 1, end: 2});
                    l2 = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {start: 3, end: 4});
                    q1 = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {});
                    q2 = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                        name: "label",
                        value: "blah"
                    });

                    tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
                        keyword: "CDS",
                        strand: -1,
                        complement: true,
                        join: false,
                        featureQualifier: [q1],
                        featureLocation: [l1]
                    });
                });

                it("get methods,",function(){
                    expect(tmp.getKeyword()).toBe("CDS");
                    expect(tmp.getStrand()).toBe(-1);
                    expect(tmp.getComplement()).toBe(true);
                    expect(tmp.getJoin()).toBe(false);
                    expect(tmp.getFeatureLocation().length).toBe(1);
                    expect(tmp.getFeatureQualifier().length).toBe(1);
                });

                it("getLastFeatureQualifier(),",function(){
                    expect(tmp.getFeatureQualifier()[0]).toBe(q1);
                    expect(tmp.getLastFeatureQualifier()).toBe(q1);
                    expect(tmp.getFeatureQualifier()[1]).toBe(undefined);
                });

                it("addFeatureQualifier(),",function(){
                    tmp.addFeatureQualifier(q2);

                    expect(tmp.getFeatureQualifier()[1]).toBe(q2);
                    expect(tmp.getLastFeatureQualifier()).toBe(q2);
                });

                it("addFeatureLocation(): should adjust getJoin():",function(){
                    expect(tmp.getFeatureLocation()[0]).toBe(l1);
                    expect(tmp.getFeatureLocation()[1]).toBe(undefined);
                    
                    tmp.addFeatureLocation(l2);
                    expect(tmp.getFeatureLocation()[1]).toBe(l2);
                    // now join is true
                    expect(tmp.getJoin()).toBe(true);
                });

                it("findLabel(),",function(){
                    tmp.addFeatureQualifier(q2);

                    var str = tmp.findLabel();
                    //console.log(q2.getName());
                    expect(str).toBe("blah");

                });

                it("toString()",function(){
                    tmp.addFeatureLocation(l2);

                    var str = tmp.toString();
                    //console.log(str);
                    var check = '     CDS             complement(join(1..2,3..4))\n' +
                                '                     /=""';
                    expect(str).toBe(check);
                });

                it("toJSON()",function(){
                    tmp.addFeatureLocation(l2);
                    tmp.addFeatureQualifier(q2);

                    var json = JSON.stringify(tmp, null, "  ");
                    //console.log(json);
                    var check = JSON.stringify({
                        "keyword": "CDS",
                        "strand": -1,
                        "complement": true,
                        "join": true, //has two locations now
                        "location": [
                            {
                              "start": 1,
                              "to": "..",
                              "end": 2
                            },
                            {
                              "start": 3,
                              "to": "..",
                              "end": 4
                            }
                        ],
                        "qualifier": [
                            {
                              "name": "",
                              "value": ""
                            },
                            {
                              "name": "label",
                              "value": "blah"
                            }
                        ]
                    } , null, "  ");
                    expect(json).toBe(check);
                });

                it("fromJSON()",function(){
                    tmp.addFeatureLocation(l2);
                    tmp.addFeatureQualifier(q2);

                    var convert = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement");
                    var json = tmp.toJSON();
                    //console.log(tmp);
                    //console.log(json);
                    convert.fromJSON(json);
                    //console.log(convert.toString());

                    expect(convert.getKeyword()).toBe("CDS");
                    expect(convert.getStrand()).toBe(-1);
                    expect(convert.getComplement()).toBe(true);
                    expect(convert.getJoin()).toBe(true);
                    expect(convert.getFeatureLocation().length).toBe(2);
                    expect(convert.getFeatureQualifier().length).toBe(2);
                });

            });

            describe("GenbankFeatureKeyword", function() {

                beforeEach(function() {
                    loc = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
                        start: "1",
                        to: "..",
                        end: "100"
                    });

                    qual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                        name: "label",
                        value: "blah"
                    });

                    elm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
                        keyword: "CDS",
                        strand: -1,
                        complement: true,
                        join: false,
                        featureQualifier: [qual],
                        featureLocation: [loc]
                    });

                    tmp = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {} );
                });

                it("get methods",function(){
                    expect(tmp.getKeyword()).toBe("FEATURES");
                    expect(tmp.getFeaturesElements().length).toBe(0);
                });

                it("addElement",function(){
                    tmp.addElement(elm);
                    expect(tmp.getKeyword()).toBe("FEATURES");
                    expect(tmp.getFeaturesElements().length).toBe(1);
                    expect(tmp.getFeaturesElements()[0].getKeyword()).toBe("CDS");
                    expect(tmp.getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(1);
                    expect(tmp.getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("label");
                });

                it("getLastElement",function(){
                    var last = tmp.getLastElement(elm);
                    expect(last).toBe(null);

                    tmp.addElement(elm);
                    last = tmp.getLastElement(elm);
                    expect(last).toBe(elm);
                });

                it("toString()",function(){
                    tmp.addElement(elm);

                    var str = tmp.toString();
                    var check = 'FEATURES             Location/Qualifiers\n' +
                                '     CDS             complement(1..100)\n' +
                                '                     /label="blah"';
                    //console.log(str);
                    expect(str).toBe(check);
                });

                it("toJSON()",function(){
                    tmp.addElement(elm);

                    var json = JSON.stringify(tmp, null, "  ");
                    //console.log(json);
                    var check = JSON.stringify({
                        "keyword": "FEATURES",
                        "featuresElements": [
                        {
                            "keyword": "CDS",
                            "strand": -1,
                            "complement": true,
                            "join": false,
                            "location": [
                            {
                                "start": 1,
                                "to": "..",
                                "end": 100
                            }
                            ],
                            "qualifier": [
                            {
                                "name": "label",
                                "value": "blah"
                            }
                            ]
                        }
                        ]
                    }, null, "  ");
                    expect(json).toBe(check);
                });

                it("fromJSON()",function(){
                    tmp.addElement(elm);

                    var convert = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement");
                    var json = tmp.toJSON();
                    //console.log(tmp);
                    //console.log(json);
                    convert.fromJSON(json);
                    //console.log(convert.toString());

                    expect(tmp.getKeyword()).toBe("FEATURES");
                    expect(tmp.getFeaturesElements().length).toBe(1);
                    expect(tmp.getFeaturesElements()[0].getKeyword()).toBe("CDS");
                    expect(tmp.getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(1);
                    expect(tmp.getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("label");
                });
            });
            
            describe("Genbank (from GenbankManager",function(){

                beforeEach(function() {
                    line =  'LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\n' +
                            'ACCESSION   pj5_00028 Accession\n' +
                            'SOURCE      Saccharomyces cerevisiae (baker\'s yeast)\n' +
                            '  ORGANISM  Saccharomyces cerevisiae\n' +
                            '            Eukaryota; Fungi; Ascomycota; Saccharomycotina; Saccharomycetes;\n' +
                            '            Saccharomycetales; Saccharomycetaceae; Saccharomyces.\n' +
                            'FEATURES             Location/Qualifiers\n' +
                            '     CDS             complement(7..885)\n' +
                            '                     /label="araC"\n' +
                            'ORIGIN      \n' +
                            '        1 gacgtcttat gacaacttga cggctacatc attcactttt tcttcacaac cggcacggaa\n' +
                            '       61 ctcgctcggg ctggccccgg tgcatttttt aaatacccgc gagaaataga gttgatcgtc\n';// +
                            //'\n'+
                            //'\n' +
                            //';
                    tmp = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(line);
                });

                it("get methods",function(){
                    expect(tmp.getKeywords().length).toBe(5);
                });

                it("findKeyword",function(){
                    var acc = tmp.findKeyword("ACCESSION");

                    expect(acc.getValue()).toBe("pj5_00028 Accession");
                });

                xit("toString()",function(){
                    var str = tmp.toString();
                    //console.log(str);
                    var check = line;
                    expect(check.search(str)).toBe(true);
                    expect(str.search(check)).toBe(true);
                });

                it("fromJSON()",function(){

                    var convert = Ext.create("Teselagen.bio.parsers.Genbank");
                    var json = tmp.toJSON();
                    //console.log(json);
                    convert.fromJSON(json);
                    //console.log(convert.toString());

                    expect(tmp.getKeywords().length).toBe(5);
                });
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
                //expect(Teselagen.bio.parsers.GenbankManager.self.LASTTYPE).toBe(false);

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
            it("parseFeatureLocation() 2: with partials",function(){
                var featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {} );
                var locStr = "<100.>200";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatureLocation(featElm, locStr);
                expect(tmp.getStart()).toBe(100);
                expect(tmp.getEnd()).toBe(200);
                expect(tmp.getPreStart()).toBe("<");
                expect(tmp.getPreEnd()).toBe(">");
                expect(tmp.getTo()).toBe(".");
            });
            it("parseFeatureLocation() 3: no End",function(){
                var featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {} );
                var locStr = "100";
                tmp  = Teselagen.bio.parsers.GenbankManager.parseFeatureLocation(featElm, locStr);
                expect(tmp.getStart()).toBe(100);
                expect(tmp.getEnd()).toBe(100);
                expect(tmp.getTo()).toBe("..");
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
                expect(tmp.getValue()).toBe(123);
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
        
    });
});