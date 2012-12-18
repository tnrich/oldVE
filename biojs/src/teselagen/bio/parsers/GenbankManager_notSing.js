/** THIS IS THE OLD DEPRECATED VERSION. DONT USE!!!!
 * GenbankManager. 
 * Takes in Genbank file (as a string) and creates the Genbank class. 
 * Static functions. (Replaces GenbankFormat.js) \n
 * 
 * Currently, this does not log errors in the Genbank file. 
 * Need to include enhancement in the future.
 * 
 * @author Diana Wong
 * @author Timothy Ham (original author of GenbankFormat.js)
 */

Ext.define("Teselagen.bio.parsers.GenbankManager_noSing", {
    
    requires: ["Teselagen.bio.util.StringUtil"],
    
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
        END_SEQUENCE_TAG: "//"
    },

    /**
     * Creates a static GenbankManager class with public functions.
     * @returns {GenbankManager} Handle to execute methods.
     * @memberOf GenbankManager
     */
    constructor: function() {
        var that = this;

        var gb;             // Genbank object/handle
        var lastObj;        // To keep track of last object/key when parsing next line
        var flag, myField;  // Flags and Fields to keep track of stuff
        var genArr;

        /**
         * Loads a Genbank File.
         * @param {FileInputHTMLElement} fileInput
         * @returns {String} genbankFileString
         */
        this.loadFile = function(fileInput) {
            var genbankFileString;
            var file = fileInput.files[0];
            fr = new FileReader();
            fr.onload = processText;
            fr.readAsText(file);

            function processText() {
                genbankFileString = fr.result;
            }

            return genbankFileString;
        }

        /**
         * This is the main method in the GenbankFormat static class that performs the parsing. 
         * Converts a Genbank File (in string format) into a GenbankFileFormat object. 
         * @param {String} genbankFileString String form of Genbank File.
         * @return {Genbank} 
         */
        this.parseGenbankFile = function(genbankFileString) {
            gb = Ext.create("Teselagen.bio.parsers.Genbank");

            flag = new Flags();
            //myField = new Field();

            genArr	= genbankFileString.split(/[\n]+|[\r]+/g);
            for (var i=0 ; i < genArr.length; i++) {
                lineParser(genArr[i]);
            }
            return gb;
        }

        /** 
         * Line by line parser
         * @param {String} line A single line from a Genbank File
         * @private
         */
        function lineParser(line) {
            var key = getLineKey(line);
            var val = getLineVal(line);
            var isKeyRunon = isKeywordRunon(line);
            var isSubKey = isSubKeyword(line);
            var isKey = isKeyword(line);
            var tmp = null;

            flag.setType(key, isKey);

            // For Keyword Lines

            switch (key) {
            case that.self.LOCUS_TAG:
                lastObj = parseLocus(line);
                break;
            case that.self.FEATURES_TAG:
                lastObj = parseFeatures(line);
                break;
            case that.self.ORIGIN_TAG:
                lastObj = parseOrigin(line);
                break;
            case "BASE":
                console.log("BASE"); // FOR "BASE COUNT" KEYWORD; CURRENTLY DOES NOT DEAL WITH THIS CASE
                break;
            case that.self.END_SEQUENCE_TAG:
                //console.log("END"); // DO NOTHING
                break;
            default: // FOLLOWING FOR KEYWORDS NOT PREVIOUSLY DEFINED IN CASES
                if ( line === "") {
                    // do nothing;              // BLANK LINES
                    break;
                }else if ( flag.features ) {    // FEATURE ELEMENTS & FEATURE QUALIFIERS
                    parseFeatures(line); //lastObj set in this function
                } else if ( flag.origin) {      // ORIGIN SEQUENCE LINES
                    lastObj = parseOrigin(line);
                } else if ( isKey && !flag.origin && !flag.features && !flag.locus ) {          
                	// REGULAR KEYWORDS (NOT LOCUS/FEATURES/ORIGIN)
                    lastObj = parseKeyword(line);
                }  else if ( isSubKey ) {       // REGULAR SUBKEYWORD, NOT FEATURE
                    tmp = gb.getLastKeyword();
                    lastObj = parseSubKeyword(tmp, line);
                } else if ( isKeyRunon ) {      // RUNON LINES FOR NON-FEATURES
                    //lastObj.setValue(lastObj.getValue() + Teselagen.StringUtil.rpad("\n"," ",13) + Ext.String.trim(line));
                    lastObj.appendValue(Teselagen.StringUtil.rpad("\n"," ",13) + Ext.String.trim(line));
                }
            }

        }

        /* -----------------------------------------------------
         *  KEYWORD/SUBKEYWORD PARSING FUNCTIONS
         * -----------------------------------------------------*/
        /**
         * Parses Locus Line in Genbank file.
         * @param {String} line
         * @returns {GenbankLocusKeyword} result
         * @private
         */
        function parseLocus(line) {
            var result, locusName, seqLen, strand, naType, linear, div, date;
            var lineArr = line.split(/[\s]+/g);

            locusName = lineArr[1];
            seqLen = lineArr[2];

            // StrandType: T.H. Code defaults only to ds-DNA
            if (lineArr[4].match(/ss/gi)) {
                strand = "ss";
            } else if (lineArr[4].match(/ds/gi)) {
                strand = "ds";
            } else {
                strand = ""; //"unknown";
            }

            // naType: T.H. defaults to DNA.
            if (lineArr[4].match(/DNA/gi)) {
                naType = "DNA";
            } else if (lineArr[4].match(/RNA/gi)) {
                naType = "RNA";
            } else {
                naType = ""; //"unknown";
            }

            // Linear vs Circular?; CANNOT HANDLE TANDEM
            for (var i=1; i < lineArr.length; i++) {
                if (lineArr[i].match(/circular/gi)) {
                    linear = false;
                    break;
                } else {
                    linear = true;
                }
            }

            // Date
            if (lineArr[lineArr.length-2].match(/[A-Z]{3}/g)  ) {
                div = lineArr[lineArr.length-2];
                date = lineArr[lineArr.length-1];
            } else {
                div = "";
                date = lineArr[lineArr.length-1];
            }
            // Date is in this format:1-APR-2012
            /*var dateArr = date.split(/\-/g);
            console.log(dateArr[2]);
            console.log(Ext.create("Date", { year: dateArr[2], day: dateArr[0], month: dateArr[1] }));
            */

            // Just rewrite the existing Locus object. It's easier than setting everything.
            var result = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword", {
                locusName: locusName,
                sequenceLength: seqLen,
                strandType: strand,
                naType: naType,
                linear: linear,
                divisionCode: div,
                date: date
            });

            result.setKeyword(that.self.LOCUS_TAG);	
            gb.addKeyword(result);
            gb.addKeywordTag(that.self.LOCUS_TAG);
            return result;
        }
        
        /**
         * Parses Keyword line in Genbank file.
         * @param {String} line
         * @returns {GenbankKeyword} result
         * @private
         */
        function parseKeyword(line) {
            var key = getLineKey(line);
            var val = getLineVal(line);
            var result = Ext.create("Teselagen.bio.parsers.GenbankKeyword", {
                keyword: key,
                value: val
            });
            gb.addKeyword(result);
            gb.addKeywordTag(key);

            return result;
        }
        
        /**
         * Parses SubKeywords line in Genbank file.
         * @param {GenbankKeyword} mainKey
         * @param {String} line
         * @returns {GenbankSubKeyword} result
         * @private
         */
        function parseSubKeyword(mainKey, line) {
            var key = getLineKey(line);
            var val = getLineVal(line);

            var result = Ext.create("Teselagen.bio.parsers.GenbankSubKeyword", {
                keyword: key,
                value: val
            });
            mainKey.addSubKeyword(result);
            return result;
        }

        /**
         * Parses Origin lines in Genbank file.
         * @param {String} line
         * @returns {GenbankOriginKeyword} result
         * @private
         */
        function parseOrigin(line) {  
            var result;
            var key = getLineKey(line);
            if (key === that.self.ORIGIN_TAG) {
                result = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword");
                result.setKeyword(that.self.ORIGIN_TAG);
                gb.setOrigin(result);
                gb.addKeywordTag(that.self.ORIGIN_TAG);
            } else { 
                result = gb.getOrigin();
                line = line.replace(/[\s]*[0-9]*/g,"");
                result.appendSequence(line);
            }
            return result;
        }		

        /**
         * Parses Features Block of lines in Genbank file.
         * @param {String} line
         * @returns {GenbankFeaturesKeyword} result
         * @private
         */
        function parseFeatures(line) {
            var result, featElm, featQual, lastElm, strand;
            var key = getLineKey(line);
            var val = getLineVal(line);

            // FOR THE MAIN FEATURES LOCATION/QUALIFIER LINE
            if (getLineKey(line) === that.self.FEATURES_TAG) {
                result = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword");
                result.setKeyword(that.self.FEATURES_TAG);
                gb.setFeatures(result);
                gb.addKeywordTag(that.self.FEATURES_TAG);
                return result;
            }
            // FOR LOCATION && QUALIFIER LINES

            var isQual		= isQualifier(line);
            var isQualRunon	= isQualifierRunon(line);
            var isLocRunon	= isLocationRunon(line);
            result = gb.getFeatures();

            if ( !isLocRunon && !isQualRunon ) {    // New Element/Qualifier lines. Not runon lines.

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
                        join: false
                    }); // set complement and join correctly when parsing FeatureLocation
                    // Could be multiple locations per Element; Parses true/false complement||join
                    parseFeatureLocation(featElm, val);
                    result.addElement(featElm);
                    lastObj = featElm;

                } else {    // is a FeatureQualifier in the /KEY="BLAH" format; could be multiple per Element
                    featQual = parseFeatureQualifier(line);
                    lastElm  = result.getLastElement();
                    lastElm.addFeatureQualifier(featQual);
                    lastObj  = featQual;
                }

            } else {
                if ( isLocRunon) {
                    //console.log(Ext.getClassName(lastObj));
                    //parseFeatureLocation(lastObj, Ext.String.trim(line));

                    parseFeatureLocation( result.getLastElement() , Ext.String.trim(line));
                }
                if ( isQualRunon) {
                    //console.log(Ext.getClassName(lastObj));
                    //lastObj.appendValue(Ext.String.trim(line).replace(/\"/g, ""));

                    result.getLastElement().getLastFeatureQualifier().appendValue(Ext.String.trim(line).replace(/\"/g, ""));
                }
            }
            return result;
        }
        
        /**
         * Parses Feature Locations.
         * @param {GenbankFeaturesElement} featElm
         * @param {String} locStr string with unparse locations
         * @returns {GenbankFeatureLocation} location
         * @private
         */
        function parseFeatureLocation(featElm, locStr) {
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

            return location;
        }
        
        /**
         * Parses Feature Qualifier.
         * @param {String} line
         * @returns {GenbankFeatureQualifier} featQual
         * @private
         */
        function parseFeatureQualifier(line) {
            var featQual, newLine, lineArr, quoted;

            newLine = Ext.String.trim(line);
            newLine = newLine.replace(/^\/|"$/g, "");
            lineArr = newLine.split(/=\"|=/);

            if (line.match(/=\"/g)) {
                quoted = true;
            } else { 
                quoted = false;
            }

            featQual = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier", {
                name: lineArr[0],
                value: lineArr[1],
                quoted: quoted
            });
            return featQual;
        }


        /* -----------------------------------------------------
         *  HELPER PARSING FUNCTIONS
         * -----------------------------------------------------*/
        /**
         * Gets the Key in a line of format " Key Value"
         * @param {String} line
         * @returns {String} key
         * @private
         */
        function getLineKey(line) {
            line    = line.replace(/^[\s]*/, "");
            var arr = line.split(/[\s]+/);
            return arr[0];
        }
        /**
         * Gets the value in a line of format " Key Value"
         * @param {String} line
         * @returns {String} val
         * @private
         */
        function getLineVal(line) {
            line = line.replace(/^[\s]*[\S]+[\s]+|[\s]+$/, "");	
            line = Ext.String.trim(line);
            return line;
        }
        /**
         * Checks if line is a Keyword line. If there is NO whitespace greater than before keyword, then it's a subkeyword. 
         * Works for FeatureElements too but not used there.
         * @param {String} line
         * @return {Boolean} isKey
         * @private
         */
        function isKeyword(line) {
            var key   = getLineKey(line);
            var isKey = false;
            if ( line.substr(0,10).match(/^[\S]+/) ) {
                isKey = true;
            }
            return isKey;
        }
        /**
         * Checks if line is a SubKeyword line. If there is some whitespace before keyword, then it's a subkeyword. 
         * Works for FeatureElements too but not used there.
         * @param {String} line
         * @return {Boolean} isSubKey
         * @private
         */
        function isSubKeyword(line) {
            var key      = getLineKey(line);
            var isSubKey = false;

            if ( line.substr(0,10).match(/^[\s]+[\S]+/) ) {
                var isSubKey = true;
            } 
            return isSubKey;
        }

        /**
         *  Checks if this line is a continuation of previous Keyword or SubKeyword line. 
         *  (Do not create new object, just append to previous object.)
         *  @param {String} line
         *  @returns {Boolean} runon
         *  @private
         */
        function isKeywordRunon(line) {
            var runon;
            if ( line.substr(0,10).match(/[\s]{10}/)) {
                runon = true;
            } else {
                runon = false;
            }
            return runon;
        }

        /**
         * Determines if the line is a Feature Qualifier, ie with syntax like /blah="information"
         * @param {String} line
         * @return {Boolean} qual
         * @private
         */
        function isQualifier(line) {
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
        }
        /**
         *  Checks if this line is a continuation of previous Feature Qualfier line. 
         *  (Do not create new object, just append to previous object.)
         *  @param {String} line
         *  @returns {Boolean} runon
         *  @private
         */
        function isQualifierRunon(line) {
            var runon = false;
            if ( Ext.String.trim(line.substr(0,20)) === ""  && !Ext.String.trim(line).charAt(0).match(/\// ) && !isLocationRunon(line) ) {
                //console.log("qual runon: " + line);
                runon = true;
            }
            return runon;
        }
        /**
         *  Checks if this line is a continuation of previous Feature Location line. 
         *  (Do not create new object, just append to previous object.)
         *  @param {String} line
         *  @returns {Boolean} runon
         *  @private
         */
        function isLocationRunon(line) {
            var runon = false;
            if ( Ext.String.trim(line.substr(0,20)) === ""  && Ext.String.trim(line).charAt(0).match(/[\d]/) && line.match(/[.]{2}/g) ) {
                runon = true;
            }
            return runon;
        }
        
        /*

        //=================================
        // INITIALIZING FIELDS
        //=================================

        function Field() {
            this.field = keywords();
            this.ref   = references();
            //this.allFields  = genbankFields();

            function keywords() {
                var field = new Array();
                field[0] = "LOCUS";
                field[1] = "DEFINITION";
                field[2] = "ACCESSION";
                field[3] = "VERSION";
                field[4] = "KEYWORDS";
                field[5] = "SOURCE";
                field[6] = "ORGANISM";
                field[7] = "REFERENCE";
                field[8] = "AUTHORS";
                field[9] = "CONSRTM";
                field[10] = "TITLE";
                field[11] = "JOURNAL";
                field[12] = "PUBMED";
                field[13] = "REMARK";
                field[14] = "COMMENT";
                field[15] = "FEATURES";
                field[16] = "BASE COUNT";     
                field[17] = "ORIGIN";
                //field[18] = "//";
                field[19] = "SEGMENT";
                field[20] = "CONTIG";
                return field;
            }

            function subKeyword() {
                var field = new Array();
                field[0] = "AUTHORS";
                field[1] = "TITLE";
                field[2] = "JOURNAL";
                field[3] = "PUBMED";
                field[4] = "CONSRTM";
                field[5] = "ORGANISM";
                return field;
            }

            function references() {
                var field = new Array();
                field[0] = "AUTHORS";
                field[1] = "TITLE";
                field[2] = "JOURNAL";
                field[3] = "PUBMED";
                field[4] = "CONSRTM";
                return field;
            }

            function features() {
                var field = new Array();
                field[0] = "source";
                field[1] = "CDS";
                field[2] = "gene";
                field[3] = "<";
                //field[4] = "protein_id";
                return field;
            }
        } // END OF Field()
        */

        //=================================
        // INITIALIZING FLAGS 
        //=================================
        function Flags() {
            this.origin     = false;
            this.features   = false;
            this.reference  = false;

            this.setOrigin = function() {
                this.origin   = true;
                this.features = false;
                this.reference= false;
            }
            this.setFeatures = function() {
                this.origin   = false;
                this.features = true;
                this.reference= false;
            }
            this.setReference = function() {
                this.origin   = false;
                this.features = false;
                this.reference= true;
            }
            this.setNone = function() {
                this.origin   	= false;
                this.features 	= false;
                this.reference	= false;
            }

            this.setType = function(key, isKey) {

                if (key === "REFERENCE") {
                    this.setReference();
                } else if (key === "FEATURES") {
                    this.setFeatures();
                } else if (key === "ORIGIN") {
                    this.setOrigin();
                } else if (key === that.self.END_SEQUENCE_TAG) {
                    this.setNone();
                } else if (isKey === true) {
                    this.setNone();
                }
            }
        } // END OF Flags()

        return this;
    }


});