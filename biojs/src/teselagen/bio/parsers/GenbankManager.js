/**
 * @class Teselagen.bio.parsers.GenbankManager
 *
 * Takes in Genbank file (as a string) and creates the Genbank class.
 * Static class changed to singleton. (Replaces GenbankFormat.js) \n
 *
 * Currently, this does not log errors in the Genbank file.
 * Need to include enhancement in the future.
 *
 * @author Diana Wong
 * @author Timothy Ham (original author of GenbankFormat.js)
 */

Ext.define("Teselagen.bio.parsers.GenbankManager", {

    //alternateClassName: "Teselagen.GenbankManager",
    requires: ["Teselagen.bio.util.StringUtil",
               "Teselagen.bio.parsers.Genbank",
               "Teselagen.bio.parsers.GenbankFeatureElement",
               "Teselagen.bio.parsers.GenbankFeatureLocation",
               "Teselagen.bio.parsers.GenbankFeatureQualifier",
               "Teselagen.bio.parsers.GenbankFeaturesKeyword",
               "Teselagen.bio.parsers.GenbankLocusKeyword",
               "Teselagen.bio.parsers.GenbankKeyword",
               "Teselagen.bio.parsers.GenbankOriginKeyword"],
    singleton: true,
    /**
     * Static variables. Common Genbank Keyword names.
     */
    statics: {
        LOCUS_TAG: "LOCUS",
        DEFINITION_TAG: "DEFINITION",
        ACCESSION_TAG: "ACCESSION",
        VERSION_TAG: "VERSION",
        KEYWORDS_TAG: "KEYWORDS",
        //SEGMENT_TAG:"SEGMENT"
        SOURCE_TAG: "SOURCE",
        ORGANISM_TAG: "ORGANISM",
        REFERENCE_TAG: "REFERENCE",
        AUTHORS_TAG: "AUTHORS",
        CONSORTIUM_TAG: "CONSRTM",
        TITLE_TAG: "TITLE",
        JOURNAL_TAG: "JOURNAL",
        PUBMED_TAG: "PUBMED",
        REMARK_TAG: "REMARK",
        COMMENT_TAG: "COMMENT",
        FEATURES_TAG: "FEATURES",
        BASE_COUNT_TAG: "BASE COUNT",
        //CONTIG_TAG: "CONTIG"
        ORIGIN_TAG: "ORIGIN",
        END_SEQUENCE_TAG: "//",

        LASTTYPE: false
    },

    lastLineWasLocation: false,

    /**
     * Loads a Genbank File.
     * @param {FileInputHTMLElement} fileInput
     * @returns {String} genbankFileString
     */
    loadFileInput : function(fileInput) {
        var genbankFileString;
        var file = fileInput.files[0];
        fr = new FileReader();
        fr.onload = processText;
        fr.readAsText(file);

        function processText() {
            genbankFileString = String(fr.result);
        }

        return genbankFileString;
    },

    /**
     * @param {String} url The url to retrieve data from.
     * Uses a synchronus Ajax request.
     * @returns {String} xml XML string
     */
    loadFileFromUrl: function(url) {
        // Doing XMLHttpRequest leads to loading from cash

        var str;

        Ext.Ajax.request({
            url: url,
            async: false,
            disableCaching: true,
            success: function(response) {
                str = response.responseText;
                //console.dir(xmlStr);
            },
            failure: function(response, opts) {
                console.warn('Could not load: ' + url + '\nServer-side failure with status code ' + response.status);
                throw Ext.create("Teselagen.bio.BioException", {
                    message: 'Could not load: ' + url + '\nServer-side failure with status code ' + response.status
                });
            }
        });
        return str;
     },

    /**
     * This is the main method in the GenbankFormat static class that performs the parsing.
     * Converts a Genbank File (in string format) into a GenbankFileFormat object.
     * All tabs will be converted to 4 spaces.
     *
     * @param {String} genbankFileString String form of Genbank File.
     * @returns {Genbank}
     */
    parseGenbankFile : function(genbankFileString) {
        var gb;             // Genbank object/handle
        var lastObj;        // To keep track of last object/key when parsing next line
        var lastType;       // Keeps track if current line is Reference, Feature, Origin, or none block.
        var flag;           // Flags and Fields to keep track of cases
        var genArr;

        gb = Ext.create("Teselagen.bio.parsers.Genbank");
        if (genbankFileString.match(/[\t]/) !== null) {
            console.warn("Parsing GenBank File: '\t' detected in file. Replacing with 4 spaces.");
        }
        genbankFileString.replace(/[\t]/g, "    ");
        genArr	= genbankFileString.split(/[\n]+|[\r]+/g);
        for (var i=0 ; i < genArr.length; i++) {
            this.lineParser(genArr[i], gb);
        }

        return gb;
    },

    /**
     * Line by line parser
     * @param {String} line A single line from a Genbank File
     * @private
     */
    lineParser: function(line, gb) {

        var that = this;
        var key = this.getLineKey(line);
        var val = this.getLineVal(line);
        var isKeyRunon = this.isKeywordRunon(line);
        var isSubKey = this.isSubKeyword(line);
        var isKey = this.isKeyword(line);
        var tmp = null;

        // IGNORE LINES: DO NOT EVEN PROCESS
        if (Ext.String.trim(line) === "" || key==="COMMENT" || key===";") {
            console.warn("Parsing GenBank File: Empty line, 'COMMENT', or ';' detected. Ignoring line: " + line);
            return null;
        }

        this.setType(key, isKey);

        switch (this.self.LASTTYPE) {
        case this.self.LOCUS_TAG:
            lastObj = this.parseLocus(line, gb);
            break;
        case this.self.FEATURES_TAG:
            lastObj = this.parseFeatures(line, gb);
            break;
        case this.self.ORIGIN_TAG:
            lastObj = this.parseOrigin(line, gb);
            break;
        case this.self.END_SEQUENCE_TAG:
            //console.warn("Parsing GenBank File: End of GenBank file detected.");
            break;
        case "COMMENT":
            // do nothing
            console.warn("GenbankManager.lineParser(: This line contains a 'COMMENT' and has been ignored: " + line);
            break;
        default: // FOLLOWING FOR KEYWORDS NOT PREVIOUSLY DEFINED IN CASES
            if ( key === "BASE") {
                // do nothing;              // BLANK LINES || line with ;;;;;;;;;  || "BASE COUNT"
                console.warn("Parsing GenBank File: This line with BaseCount has been ignored: " + line);
                break;
            } else if ( isKey ) {
                // REGULAR KEYWORDS (NOT LOCUS/FEATURES/ORIGIN) eg VERSION, ACCESSION, SOURCE, REFERENCE
                lastObj = this.parseKeyword(line, gb);
            }  else if ( isSubKey ) {       // REGULAR SUBKEYWORD, NOT FEATURE eg AUTHOR, ORGANISM
                //console.log(line);
                tmp = gb.getLastKeyword();
                lastObj = this.parseSubKeyword(tmp, line, gb);
            } else if ( isKeyRunon ) {      // RUNON LINES FOR NON-FEATURES
                //console.log(line);
                //lastObj.setValue(lastObj.getValue() + Teselagen.StringUtil.rpad("\n"," ",13) + Ext.String.trim(line));
                lastObj.appendValue(Teselagen.StringUtil.rpad("\n"," ",13) + Ext.String.trim(line), gb);
            } else {
                console.warn("Parsing GenBank File: This line has been ignored: " + line);
            }
        }

    },

    /* -----------------------------------------------------
     *  KEYWORD/SUBKEYWORD PARSING FUNCTIONS
     * -----------------------------------------------------*/
     // NOTE: It looks inefficient, but we for loop the lineArr because it's easier to
     // to correct the parser for different cases in the future.
    /**
     * Parses Locus Line in Genbank file.
     * @param {String} line
     * @param {Genbank} gb Genbank object to add to
     * @returns {GenbankLocusKeyword} result
     * @private
     */
    parseLocus: function(line, gb) {
        var result, locusName, seqLen, strand, naType, linear, div, date;
        var lineArr = line.split(/[\s]+/g);


        if (lineArr.length <= 1) {
            console.warn("Parsing GenBank File: WARNING! Locus line contains no values!");
        }

        locusName = lineArr[1];

        // Sequence Length and bp
        //seqLen = lineArr[2];
        seqLen = "";
        for (var i=1; i < lineArr.length; i++) {
            if (lineArr[i].match(/^bp$/gi)) {
                seqLen = parseInt(lineArr[i-1]);
            }
        }


        // StrandType: T.H. Code defaults only to ds-DNA
        /*if (lineArr[4] && lineArr[4].match(/ss/gi)) {
            strand = "ss";
        } else if (lineArr[4] && lineArr[4].match(/ds/gi)) {
            strand = "ds";
        } else {
            strand = ""; //"unknown";
        }*/
        strand = "";
        for (i=1; i < lineArr.length; i++) {
            if (lineArr[i].match(/^ss/gi)) {
                strand = "ss";
            } else if (lineArr[i].match(/^ds/gi)) {
                strand = "ds";
            }
            //console.log(strand);
        }


        // naType: T.H. defaults to DNA.
        /*if (lineArr[4] && lineArr[4].match(/DNA/gi)) {
            naType = "DNA";
        } else if (lineArr[4] && lineArr[4].match(/RNA/gi)) {
            naType = "RNA";
        } else {
            naType = ""; //"unknown";
        }*/
        naType = "";
        for (i=1; i < lineArr.length; i++) {
            if (lineArr[i].match(/DNA$/gi)) {
                naType = "DNA";
            } else if (lineArr[i].match(/RNA$/gi)) {
                naType = "RNA";
            }
        }


        // Linear vs Circular?; CANNOT HANDLE TANDEM
        linear = true;
        for (i=1; i < lineArr.length; i++) {
            if (lineArr[i].match(/circular/gi)) {
                //console.warn("Parsing GenBank File: Circular sequence detected.");
                linear = false;
            } else {
                //console.warn("Parsing GenBank File: Linear sequence detected.");
            }
        }

        // Date and Div
        // Date is in this format:1-APR-2012
        for (i=1; i < lineArr.length; i++) {
            if (lineArr[i].match(/-[A-Z]{3}-/g)) {
                date = lineArr[i];
            }
            if (lineArr[i].match(/^[A-Z]{3}/g) && lineArr[i].length === 3 && !lineArr[i].match(/DNA|RNA/g)) {
                div = lineArr[i];
            }

        }

        /*if (lineArr[lineArr.length-2].match(/[A-Z]{3}/g)  ) {
            div = lineArr[lineArr.length-2];
            date = lineArr[lineArr.length-1];
        } else {
            div = "";
            date = lineArr[lineArr.length-1];
        }*/

        // Date is in this format:1-APR-2012
        /*var dateArr = date.split(/\-/g);
            console.log(dateArr[2]);
            console.log(Ext.create("Date", { year: dateArr[2], day: dateArr[0], month: dateArr[1] }));
         */

        // Just rewrite the existing Locus object. It's easier than setting everything.
        result = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
            locusName: locusName,
            sequenceLength: seqLen,
            strandType: strand,
            naType: naType,
            linear: linear,
            divisionCode: div,
            date: date
        });

        if (result === null || result === undefined) {
            console.warn("Parsing GenBank File: Could not create a GenbankLocusKeyword");
        }

        result.setKeyword(this.self.LOCUS_TAG);
        gb.addKeyword(result);
        gb.addKeywordTag(this.self.LOCUS_TAG);
        return result;
    },

    /**
     * Parses Keyword line in Genbank file.
     * @param {String} line
     * @param {Genbank} gb Genbank object to add to
     * @returns {GenbankKeyword} result
     * @private
     */
    parseKeyword: function(line, gb) {
        var key = this.getLineKey(line);
        var val = this.getLineVal(line);
        var result = Ext.create("Teselagen.bio.parsers.GenbankKeyword", {
            keyword: key,
            value: val
        });

        if (result === null || result === undefined) {
            console.warn("Parsing GenBank File: Could not create a GenbankKeyword");
        }

        gb.addKeyword(result);
        gb.addKeywordTag(key);

        return result;
    },

    /**
     * Parses SubKeywords line in Genbank file.
     * @param {GenbankKeyword} mainKey
     * @param {String} line
     * @param {Genbank} gb Genbank object to add to
     * @returns {GenbankSubKeyword} result
     * @private
     */
    parseSubKeyword: function(mainKey, line, gb) {
        var key = this.getLineKey(line);
        var val = this.getLineVal(line);

        var result = Ext.create("Teselagen.bio.parsers.GenbankSubKeyword", {
            keyword: key,
            value: val
        });

        if (result === null || result === undefined) {
            console.warn("Parsing GenBank File: Could not create a GenbankSubKeyword");
        }

        mainKey.addSubKeyword(result);
        //console.log(result);
        return result;
    },

    /**
     * Parses Origin lines in Genbank file.
     * @param {String} line
     * @param {Genbank} gb Genbank object to add to
     * @returns {GenbankOriginKeyword} result
     * @private
     */
    parseOrigin: function(line, gb) {
        var result;
        var key = this.getLineKey(line);
        if (key === this.self.ORIGIN_TAG) {
            result = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword");
            result.setKeyword(this.self.ORIGIN_TAG);
            gb.setOrigin(result);
            gb.addKeywordTag(this.self.ORIGIN_TAG);
        } else {
            result = gb.getOrigin();
            line = line.replace(/[\s]*[0-9]*/g,"");
            result.appendSequence(line);
        }

        if (result === null || result === undefined) {
            console.warn("Parsing GenBank File: Could not create a GenbankOriginKeyword");
        }

        return result;
    },

    /**
     * Parses Features Block of lines in Genbank file.
     * @param {String} line
     * @param {Genbank} gb Genbank object to add to
     * @returns {GenbankFeaturesKeyword} result
     * @private
     */
    parseFeatures: function(line, gb) {
        var result, featElm, featQual, lastElm, strand;
        var key = this.getLineKey(line);
        var val = this.getLineVal(line);

        // FOR THE MAIN FEATURES LOCATION/QUALIFIER LINE
        if (this.getLineKey(line) === this.self.FEATURES_TAG) {
            result = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword");
            result.setKeyword(this.self.FEATURES_TAG);
            gb.setFeatures(result);
            gb.addKeywordTag(this.self.FEATURES_TAG);
            return result;
        }
        // FOR LOCATION && QUALIFIER LINES

        var isQual		= this.isQualifier(line);
        var isLineRunon	= this.isLineRunon(line);
        result = gb.getFeatures();

        if (!isLineRunon) {    // New Element/Qualifier lines. Not runon lines.

            if ( !isQual ) {    // is a new Feature Element (e.g. source, CDS) in the form of  "[\s] KEY  SEQLOCATION"
                //strand = val.replace(/\(|\)|[\d]+|[.]+|,|>|</g, "");
                if (val.match(/complement/g)) {
                    strand = -1;
                } else {
                    strand = 1;
                }

                featElm = Ext.create("Teselagen.bio.parsers.GenbankFeatureElement", {
                    keyword: key,
                    strand: strand,
                    complement: false,
                    join: false,
                    index: result.getFeaturesElements().length
                }); // set complement and join correctly when parsing FeatureLocation
                // Could be multiple locations per Element; Parses true/false complement||join
                this.parseFeatureLocation(featElm, val);

                result.addElement(featElm);
                lastObj = featElm;

                this.lastLineWasLocation = true;

            } else {    // is a FeatureQualifier in the /KEY="BLAH" format; could be multiple per Element
                featQual = this.parseFeatureQualifier(line);
                lastElm  = result.getLastElement();
                lastElm.addFeatureQualifier(featQual);
                lastObj  = featQual;

                this.lastLineWasLocation = false;
            }

        } else {
            if(this.lastLineWasLocation) {
                this.parseFeatureLocation( result.getLastElement() , Ext.String.trim(line));

                this.lastLineWasLocation = true;
            } else {
                result.getLastElement().getLastFeatureQualifier().appendValue(Ext.String.trim(line).replace(/\"/g, ""));

                this.lastLineWasLocation = false;
            }
        }

        if (result === null || result === undefined) {
            console.warn("Parsing GenBank File: Could not create a GenbankFeaturesKeyword");
        }

        return result;
    },

    /**
     * Parses Feature Locations.
     * @param {GenbankFeaturesElement} featElm
     * @param {String} locStr string with unparse locations
     * @param {Genbank} gb Genbank object to add to
     * @returns {GenbankFeatureLocation} location
     * @private
     */
    parseFeatureLocation: function(featElm, locStr) {
        var location;
        var complement = false;
        var join       = false;

        locStr = Ext.String.trim(locStr);

        if (locStr.match(/complement/i) ) {
            complement = true;
            featElm.setComplement(true); //defult is false
        }
        if (locStr.match(/join/i) ) {
            join = true;
            featElm.setJoin(true);
        }

        //locStr = locStr.replace(/complement|join|\(|\)|\>|\</g,"");
        locStr = locStr.replace(/^,|,$|complement|join|\(|\)/g,"");
        locArr = locStr.split(/,/g);

        for (var i=0; i<locArr.length; i++) {
            var ind   = locArr[i].split(/[.]+/);
            var toArr = locArr[i].match(/[.]+|\^/) || [];
            var to    = toArr[0] || "";
            // GenbankFeatureLocation will deal with the partial <||> cases.
            location = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation", {
                start: ind[0],
                end: ind[1],
                to: to
            });
            featElm.addFeatureLocation(location);
        }
        if (complement && join) {
            // Do ReverseLocations Case
            // This may not be neccesary with the inclusion of join and complement booleans.
        }

        if (location === null || location === undefined) {
            console.warn("Parsing GenBank File: Could not create a GenbankFeatureLocation");
        }

        return location;
    },

    /**
     * Parses Feature Qualifier.
     * @param {String} line
     * @param {Genbank} gb Genbank object to add to
     * @returns {GenbankFeatureQualifier} featQual
     * @private
     */
    parseFeatureQualifier: function(line) {
        var featQual, newLine, lineArr;

        newLine = Ext.String.trim(line);
        newLine = newLine.replace(/^\/|"$/g, "");
        lineArr = newLine.split(/=\"|=/);

        var quoted = false;
        var val = lineArr[1];

        val = val.replace(/\\/g, " ");

        if (line.match(/=\"/g)) {
            quoted = true;
            val = val.replace(/\".*/g, "");
        } else if (val.match(/^\d+$/g)) {
            val = parseInt(val);
        } else {
            quoted = false;
        }

        featQual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
            name: lineArr[0],
            value: val,
            quoted: quoted
        });

        if (featQual === null || featQual === undefined) {
            console.warn("Parsing GenBank File: Could not create a GenbankFeatureQualifier");
        }
        return featQual;
    },


    /* -----------------------------------------------------
     *  HELPER PARSING FUNCTIONS
     * -----------------------------------------------------*/
    /**
     * Gets the Key in a line of format " Key Value"
     * @param {String} line
     * @returns {String} key
     * @private
     */
    getLineKey: function(line) {
        line    = line.replace(/^[\s]*/, "");
        var arr = line.split(/[\s]+/);
        return arr[0];
    },
    /**
     * Gets the value in a line of format " Key Value"
     * @param {String} line
     * @returns {String} val
     * @private
     */
    getLineVal: function(line) {
        line = line.replace(/^[\s]*[\S]+[\s]+|[\s]+$/, "");
        line = Ext.String.trim(line);
        return line;
    },
    /**
     * Checks if line is a Keyword line. If there is NO whitespace greater than before keyword, then it's a subkeyword.
     * Works for FeatureElements too but not used there.
     * @param {String} line
     * @return {Boolean} isKey
     * @private
     */
    isKeyword: function(line) {
        var key   = this.getLineKey(line);
        var isKey = false;
        if ( line.substr(0,10).match(/^[\S]+/) ) {
            isKey = true;
        }
        return isKey;
    },
    /**
     * Checks if line is a SubKeyword line. If there is some whitespace before keyword, then it's a subkeyword.
     * Works for FeatureElements too but not used there.
     * @param {String} line
     * @return {Boolean} isSubKey
     * @private
     */
    isSubKeyword: function(line) {
        var key      = this.getLineKey(line);
        var isSubKey = false;

        if ( line.substr(0,10).match(/^[\s]+[\S]+/) ) {
            isSubKey = true;
        }
        return isSubKey;
    },

    /**
     *  Checks if this line is a continuation of previous Keyword or SubKeyword line.
     *  There must be 10 empty spaces before the beginning of any characters. Tabs do not work.
     *  (Do not create new object, just append to previous object.)
     *  @param {String} line
     *  @returns {Boolean} runon
     *  @private
     */
    isKeywordRunon: function(line) {
        var runon;
        if ( line.substr(0,10).match(/[\s]{10}/)) {
            runon = true;
        } else {
            runon = false;
        }
        return runon;
    },

    /**
     * Determines if the line is a Feature Qualifier, ie with syntax like /blah="information".
     * Number of empty spaces before the line begins does not matter.
     * @param {String} line
     * @return {Boolean} qual
     * @private
     */
    isQualifier: function(line) {
        var qual = false;
        /*if (line.charAt(21) === "/") {//T.H. Hard coded method
				qual = true;
			}*/

        if ( Ext.String.trim(line).charAt(0).match(/\// )) { // searches based on looking for / in beginning of line
            qual = true;
        } else if ( line.match(/^[\s]*\/[\w]+=[\S]+/) ) { // searches based on "   /key=BLAH" regex
            qual = true;
        }
        return qual;
    },
    /**
     *  Checks if this line is a continuation of previous Feature Qualfier line.
     *  There must be at least 10 empty spaces before this entry for it to be a runon line,
     *  however a standard file should have 20 spaces before a Location or Qualifier entry.
     *  (Do not create new object, just append to previous object.)
     *  @param {String} line
     *  @returns {Boolean} runon
     *  @private
     *  @deprecated
     */
    isQualifierRunon: function(line) {
        var runon = false;
        //if ( Ext.String.trim(line.substr(0,20)) === ""  && !Ext.String.trim(line).charAt(0).match(/\// ) && !isLocationRunon(line) ) {
        if ( Ext.String.trim(line.substr(0,10)) === "" && !Ext.String.trim(line).charAt(0).match(/\// ) && !this.isLocationRunon(line) ) {
            //console.log("qual runon: " + line);
            runon = true;
        }
        return runon;
    },
    /**
     *  Checks if this line is a continuation of previous Feature Location line.
     *  There must be at least 10 empty spaces before this entry for it to be a runon line,
     *  however a standard file should have 20 spaces before a Location or Qualifier entry.
     *  (Do not create new object, just append to previous object.)
     *  @param {String} line
     *  @returns {Boolean} runon
     *  @private
     */
    isLineRunon: function(line) {
        var runon = false;
        //if ( Ext.String.trim(line.substr(0,20)) === ""  && Ext.String.trim(line).charAt(0).match(/[\d]/) && line.match(/[.]{2}/g) ) {
        if ( Ext.String.trim(line.substr(0,10)) === "" && ( !Ext.String.trim(line).charAt(0).match(/\//) ||  Ext.String.trim(line).match(/complement/g) || Ext.String.trim(line).match(/join/g) ) ) {
            runon = true;
        }
        return runon;
    },

    setType: function(key, isKey) {

        if (key === "LOCUS") {
            this.self.LASTTYPE = key;
        } else if (key === "REFERENCE") {
            this.self.LASTTYPE = key;
        } else if (key === "FEATURES") {
            this.self.LASTTYPE = key;
        } else if (key === "ORIGIN") {
            this.self.LASTTYPE = key;
        } else if (key === "//") {
            this.self.LASTTYPE = key;
        } else if (isKey === true) {
            this.self.LASTTYPE = key;
        }
        //console.log(this.self.LASTTYPE);
    }


});
