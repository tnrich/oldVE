
/**
 * @class Teselagen.utils.FormatUtils
 *
 * 
 * 
 * @author Diana Wong
 */

Ext.define("Teselagen.utils.FormatUtils", {


    requires: [
        "Teselagen.bio.sequence.DNATools",
        "Teselagen.bio.sequence.alphabets.DNAAlphabet",
        "Teselagen.bio.sequence.dna.DNASequence"
    ],

    singleton: true,

    DNAAlphabet: null,
    RNAAlphabet: null,

    constructor: function() {
        DNAAlphabet = Teselagen.bio.sequence.alphabets.DNAAlphabet;
        RNAAlphabet = Teselagen.bio.sequence.alphabets.RNAAlphabet;
    },


    // ===========================================================================
    //   SequenceManager  Conversions
    // ===========================================================================

    /**
     * Converts a FASTA file into a SequenceManager form of the data.
     * @param {String} pFasta FASTA formated string
     * @returns {Teselagen.bio.sequence.common.Sequence} sequence A Sequence model of your data
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence or this output
     */
    fastaToFeaturedDNASequence: function(pFasta) {
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
        //console.log(sequence);

        //result = Teselagen.bio.sequence.DNATools.createDNASequence(name, sequence);

        result = Ext.create("Teselagen.models.FeaturedDNASequence", {
            name: name,
            sequence: sequence,
            isCiruclar: false, //assume linear
            features: [] //none
        });

        /*result = Ext.create("Teselagen.manager.SequenceManager", {
            name: name,
            circular: false,
            sequence: eselagen.bio.sequence.DNATools.createDNASequence(name, sequence),
            features: []
        });*/

        return result;
    },

    /**
     * Converts a JbeiSeq XML file into a SequenceManager form of the data.
     * @param {JbeiSeq} jbeiSeq 
     * @returns {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence or this output?
     */
    jbeiseqXmlToSequenceManager: function(jbeiSeq) {
        var result; /// original wants this to be a FeaturedDNASequence NOT SeqMgr!

        var xmlData;

        //try {
            var gb      = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToGenbank(jbeiXml);
            //if (LOG) console.log(gb.toString());
            //if (LOG) console.log(JSON.stringify(gb, null, "    "));
        //} catch (bio) {
        //    console.warn("Caught: " + bio.message);
        //}

        result = this.fromGenbank(gb);


        return result;
    },

    sequenceManagerTojbeiseqJson: function(seqMan) {

    },
    /**
     * Converts a Genbank {@link Teselagen.bio.parsers.Genbank} into a FeaturedDNASequence
     * form of the data.
     *      OUTPUT IS FeaturedDNASequence but not sure if data should be set to "this"
     * @param {Teselagen.bio.parsers.Genbank} genbank A Genbank model of your data
     * @returns {Teselagen.manager.SequenceManager} sequenceManager A sequenceManager model of your data
     * @returns {Teselagen.models.FeaturedDNASequence} featuredDNASequence OR THIS OUTPUT
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

        /*result = Ext.create("Teselagen.models.FeaturedDNASequence", {
            name: name,
            sequence: sequence,
            isCircular: isCirc,
            features: features,
        });*/

        /*this.name = name;
        this.circular = isCirc;
        this.sequence = sequence;
        this.features = features;*/
        
        return result;
    },

    /**
     * Converts a Sequence Manager into a Genbank {@link Teselagen.bio.parsers.Genbank}
     * form of the data.
     * @returns {Teselagen.bio.parsers.Genbank} genbank A Genbank model of your data
     */ 

    sequenceManagertoGenbank: function(seqMan) {

        var result = Ext.create("Teselagen.bio.parsers.Genbank", {});

        // LOCUS
        var date    = (new Date()).toDateString().split(" ");
        var dateStr = date[2] + "-" + date[1].toUpperCase() + "-" + date[3];
        var locusKW = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
            locusName: seqMan.name,
            sequenceLength: seqMan.sequence.getSymbolsLength(),
            linear: !seqMan.circular,
            naType: "DNA",
            strandType: "ds",
            date: dateStr
        });
        result.setLocus(locusKW);

        // FEATURES
        var featKW = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword", {});
        result.setFeatures(featKW);

        for (var i=0; i < seqMan.features.length; i++) {
            var feat = seqMan.features[i];
            var featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
                keyword: feat.getType(),
                strand: seqMan.strand,
                complement: false,
                join: false,
                featureQualifier: [],
                featureLocation: []
            });

            if (seqMan.strand === 1) {
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
            sequence: seqMan.sequence.seqString()
        });
        result.setFeatures(origKW);

        return result;
    },


});