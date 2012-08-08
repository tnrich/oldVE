/**
 * @class Teselagen.bio.parsers.ParsersManager
 *
 * Converts input files into Genbank data models.
 * Converts back to other formats as needed.
 * 
 * @author Diana Wong
 */

Ext.define("Teselagen.bio.parsers.ParsersManager", {
    requires:  ["Teselagen.bio.util.StringUtil",
                "Teselagen.bio.parsers.GenbankManager",
                "Ext.Ajax", 
                "Ext.data.Store",
                "Ext.data.XmlStore",
                "Ext.data.reader.Xml"
                ],
    singleton: true,


    /**
     * Converts a Sequence Manager into a Genbank {@link Teselagen.bio.parsers.Genbank}
     * form of the data.
     * @param {Teselagen.manager.SequenceManager} sequenceManager
     * @returns {Teselagen.bio.parsers.Genbank} genbank A Genbank model of your data
     */ 

    sequenceManagerToGenbank: function(pSequenceManager) {

        var result = Ext.create("Teselagen.bio.parsers.Genbank", {});

        // LOCUS
        var date    = (new Date()).toDateString().split(" ");
        var dateStr = date[2] + "-" + date[1].toUpperCase() + "-" + date[3];
        var locusKW = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
            locusName: pSequenceManager.getName(),
            sequenceLength: pSequenceManager.getSequence().getSymbolsLength(),
            linear: !pSequenceManager.getCircular(),
            naType: "DNA",
            strandType: "ds",
            date: dateStr
        });
        result.setLocus(locusKW);

        // FEATURES
        var featKW = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {});
        result.setFeatures(featKW);

        for (var i=0; i < pSequenceManager.getFeatures().length; i++) {
            var feat = pSequenceManager.getFeatures()[i];

            var featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
                keyword: feat.getType(),
                strand: pSequenceManager.getStrand(),
                complement: false,
                join: false,
                featureQualifier: [],
                featureLocation: []
            });

            if (pSequenceManager.getStrand() === 1) {
                featElm.setCompelment(true);
            }

            if (feat.getLocations().length > 1) {
                featElm.setJoin(true);
            }

            featKW.addElement(featElm);

            //console.log(feat.getLocations().length);

            for (var j=0; j < feat.getLocations().length; j++) {
                var featLoc = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
                    start:  feat.getLocations()[j].getStart(),
                    end:    feat.getLocations()[j].getEnd(),
                    to:     ".."
                });
                featElm.addFeatureLocation(featLoc);
            }
            //console.log(featElm.getFeatureLocation().length);

            if (feat.getNotes() !== null) {
                for (var j=0; j < feat.getNotes().length; j++) {
                    var featQual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                        name: feat.getNotes()[j].getName(),
                        value: feat.getNotes()[j].getValue(),
                        quoted: feat.getNotes()[j].getQuoted()
                    });
                    featElm.addFeatureQualifier(featQual);
                }
            }
        }

        // ORIGIN

        var origKW = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
            sequence: pSequenceManager.getSequence.seqString()
        });
        result.setFeatures(origKW);

        return result;
    },

    /**
     * Converts a Genbank {@link Teselagen.bio.parsers.Genbank} into a FeaturedDNASequence
     * form of the data.
     *      OUTPUT IS FeaturedDNASequence but not sure if data should be set to "this"
     * @param {Teselagen.bio.parsers.Genbank} genbank A Genbank model of your data
     * @returns {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     */
    genbankToSequenceManager: function(genbank) {
        var result; // original wants this to be a FeaturedDNASequence NOT SeqMgr!

        var name        = genbank.getLocus().getLocusName();
        var isCirc      = !genbank.getLocus().getLinear(); //genbank.getLocus().getCircular();
        var sequence    = Teselagen.bio.sequence.DNATools.createDNA(genbank.getOrigin().getSequence());
        var features    = [];
        
        var gbFeats     = genbank.getFeatures().getFeaturesElements();

        for (var i=0; i < gbFeats.length; i++) {
            var locations   = [];
            var notes       = [];
            var featName    = gbFeats[i].getKeyword();   
            //var tmpFeat = null;

            for (var j=0; j < gbFeats[i].getFeatureLocation().length; j++) {
                var tmpLoc = Ext.create("Teselagen.bio.sequence.common.Location", { 
                    start:  gbFeats[i].getFeatureLocation()[j].getStart(), 
                    end:    gbFeats[i].getFeatureLocation()[j].getEnd() 
                });
                locations.push(tmpLoc);
            }

            for (var k=0; k < gbFeats[i].getFeatureQualifier().length; k++) {
                var tmpName = gbFeats[i].getFeatureQualifier()[k].getName();
                if (tmpName === "label" | tmpName === "ApEinfo_label" ||
                    tmpName === "note" || tmpName === "gene" || 
                    tmpName === "organism" || tmpName === "name" ) {
                    featName = gbFeats[i].getFeatureQualifier()[k].getValue();
                } //else {
                    //featName = gbFeats[i].getKeyword();
                //}

                var tmpNote = Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
                    name:   gbFeats[i].getFeatureQualifier()[k].getName(),
                    value:  gbFeats[i].getFeatureQualifier()[k].getValue(),
                    quoted: gbFeats[i].getFeatureQualifier()[k].getQuoted(),
                });
                notes.push(tmpNote);
            }

            features[i] = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name:   featName,
                type:   gbFeats[i].getKeyword(),
                strand: gbFeats[i].getStrand(),
                //start:  gbFeats[i].getFeatureLocation()[0].getStart(),
                //end:    gbFeats[i].getFeatureLocation()[0].getEnd(),
                notes:  notes
            });
            features[i].setNotes(notes);
            features[i].setLocations(locations);
        }

        result = Ext.create("Teselagen.manager.SequenceManager", {
            name: name,
            circular: isCirc,
            sequence: sequence,
            features: features
        });
        
        return result;
    },

    /**
     * Converts a FASTA file into a Genbank form of the data.
     * @param {String} pFasta FASTA formated string
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     */
    fastaToGenbank: function(pFasta) {
        var result; // original wants this to be a FeaturedDNASequence NOT SeqMgr!

        var lineArr = String(pFasta).split(/[\n]+|[\r]+/);
        var seqArr  = [];
        var name    = "";
        var sequence = "";

        if (Ext.String.trim(lineArr[0]).charAt(0) === ">") {
            var nameArr = lineArr[0].match(/^>[\s]*[\S]*/);
            if (nameArr !== null && nameArr.length >= 1) {
                name = nameArr[0].replace(/^>/, "");
            }
        }

        for (var i=0; i < lineArr.length; i++) {
            if ( !lineArr[i].match(/^\>/) ) {
                sequence += Ext.String.trim(lineArr[i]);
            }
        }
        sequence = sequence.replace(/[\d]|[\s]/g, "").toLowerCase(); //remove whitespace and digits
        if (sequence.match(/[^ACGTRYMKSWHBVDNacgtrymkswhbvdn]/)) {
            //illegalcharacters
            return null;
        }

        var locus = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
            locusName: name,
            sequenceLength: sequence.length,
            date: Teselagen.bio.parsers.ParsersManager.todayDate()
        });

        var origin =  Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
            sequence: sequence
        });

        result = Ext.create("Teselagen.bio.parsers.Genbank", {});

        result.addKeyword(locus);
        result.addKeyword(origin);

        return result;
    },

    /**
     * Converts a Genbank model into a FASTA string.
     * @returns {Teselagen.bio.parsers.Genbank} genbank
     * @param {String} pFasta FASTA formated string
     */
     genbankToFasta: function(pGenbank) {

        var name = pGenbank.getLocus().getLocusName();
        var sequence = pGenbank.getOrigin().getSequence();

        var result = ">" + name + "\n" + sequence;
        return result;
    },



    /**
     * Converts a JbeiSeq XML file into a SequenceManager form of the data.
     * @param {JbeiSeq} jbeiSeq 
     * @returns {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence or this output?
     */
    jbeiseqxmlToGenbank: function(jbeiSeq) {
        var result; /// original wants this to be a FeaturedDNASequence NOT SeqMgr!

        var xmlData;

        /*if (window.DOMParser) {
            parser=new DOMParser();
            xmlDoc=parser.parseFromString(txt,"text/xml");
        } else { // Internet Explorer
            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async=false;
            xmlDoc.loadXML(txt); 
        }*/


        return result;
    },

    /**
     * @param {String} url The url to retrieve data from.
     * @returns {String} xml XML string
     */
     loadXml: function(url) {
        var xhReq = new XMLHttpRequest();
        xhReq.open("GET", url, false); 
        xhReq.send(null);
        var xml = xhReq.responseText;
        
        // Handle errors.
        if(xhReq.status != 200) {
            bioException = Ext.create("Teselagen.bio.BioException", {
                message: "Incorrect enzyme file URL: " + url,
            });
            throw bioException;
        }
        return xml;
     },


    /**
     * Converts an XML string format of JbeiSeqXML.
     * Currently eliminates the "seq:" namespace by replaceing it with "seq".
     * @param {String} xml XML file in String format
     * 
     */
    parseJbeiseqxml: function (xml, url) {
        var list = [];

        Ext.define("JbeiSeq", {
            extend: "Ext.data.Model",
            fields: [
                "seqname", "seqcircular", "seqfeatures", "seqsequence"
                //{name: "name",     mapping: "seqname"    ,  type: "string"},
                //{name: "circular", mapping: "seqcircular",  type: "boolean"},
                //{name: "features", mapping: "seqfeatures",  type: "auto"},
                //{name: "sequence", mapping: "seqsequence",  type: "string"}
            ],
            proxy: {
                type: "memory",
                reader: {
                    type: "xml",
                    record: "seqseq"
                }
            },
            associations: [
                { type: 'belongsTo', model: 'Feature', name: "features" }
            ]
            /*hasMany: {
                name: "features",
                model: "Feature"
            }*/
        });

        Ext.define("Feature", {
            extend: "Ext.data.Model",
            fields: [
                "seqlabel",
                "seqcomplement",
                "seqtype",
                "seqlocation",
                "seqattribute",
                "seqseqHash"
                /*{name: "label",      mapping: "seqlabel",      type: "string"},
                {name: "complement", mapping: "seqcomplement", type: "boolean"},
                {name: "type",       mapping: "seqtype",       type: "string"},
                //{name: "location",   mapping: "seqlocation",   type: "auto"},
                {name: "attribute",  mapping: "seqattribute",  type: "auto"},
                {name: "seqHash",    mapping: "seqseqHash",    type: "auto"}*/
            ],
            proxy: {
                type: "memory",
                reader: {
                    type: "xml",
                    record: "seqfeature"
                }
            },
            /*hasMany: {
                name: "location",
                model: "Location"
            },*/
            belongsTo: "JbeiSeq"
        });

        Ext.define("Location", {
            extend: "Ext.data.Model",
            fields: [
                "seqgenbankStart", "seqend"
                //{name: "start",     mapping: "seq:location > seq:genbankStart"},
                //{name: "end",       mapping: "seq: location > seq:end"}
            ],
            proxy: {
                type: "memory",
                reader: {
                    type: "xml",
                    record: "location"
                }
            },
            belongsTo: "JbeiSeq"
        });

        console.log("here");

        xml = xml.replace(/seq\:/g, "seq");
        var doc = new DOMParser().parseFromString(xml, "text/xml");

        console.log(doc);

        var store = Ext.create("Ext.data.XmlStore", {
            //autoDestroy: true,
            autoLoad: true,
            model: "JbeiSeq",
            //model: "Feature",
            /*fields: [
                "seqname", "seqcircular", "seqsequence", "seqfeatures"
            ],*/
            /*fields: [
                "seqlabel", "seqcomplement", "seqtype", "seqlocation", "seqattribute", "seqseqHash"
            ],*/
            data: doc,
            proxy: {
                type: "memory",
                url: url,
                reader: {
                    type: "xml",
                    record: "seqseq",
                    //record: "seqfeature",
                    root: "seqseq",
                    totalProperty: "total",
                    successProperty: "success"
                }
            }
        });

        //store.loadRawData(doc);
        console.log(store.getCount());
        console.log(store);

        // For each item in the store, which is one record, create a genbank data model and add to list
        store.each(function(jbei) {
            console.log(jbei.get("seqtype"));
            var name    = jbei.get("seqname");
            var linear  = !jbei.get("seqcircular");
            var seq     = jbei.get("seqsequence");
            var date    = Teselagen.bio.parsers.ParsersManager.todayDate();

            var locus   = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
                locusName: name,
                linear: linear,
                sequenceLength: seq.length,
                date: date
            });
            var origin =  Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword", {
                sequence: jbei.get("seqsequence")
            });


            var gb = Ext.create("Teselagen.bio.parsers.Genbank", {});
            gb.addKeyword(locus);
            gb.addKeyword(origin);
            list.push(gb);
            console.log(gb.toString());
        });

        return list;


    },


    /**
     * @private
     * Helper function to get XML from a file on the server.
     * @return Either an XMLHttpRequest object or an ActiveXObject (for IE users).
     *
     * From (@link Teselagen.bio.enzymes.RestrictionEnzymeManager)
     */
    createXMLHttpRequest: function() {
        try { return new XMLHttpRequest(); } catch(e) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
        alert("XMLHttpRequest not supported");
        return null;
    },


    /**
     * Today's date
     * @returns {String} date Today's date in string format
     */
     todayDate: function() {
        var date    = (new Date()).toDateString().split(" ");
        var dateStr = date[2] + "-" + date[1].toUpperCase() + "-" + date[3];
        return dateStr;
     }

});